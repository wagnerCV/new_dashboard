/**
 * Dashboard API Utilities
 * Handles all Supabase queries for dashboard features
 */

import { supabase } from './supabaseClient';
import {
  Guest,
  GuestStats,
  GuestDistribution,
  EventSettings,
  TimelineStory,
  GuestFilters,
} from '@/types/dashboard';

// ============================================================================
// GUEST / RSVP QUERIES
// ============================================================================

/**
 * Fetch all guests with optional filtering
 */
export async function fetchGuests(filters?: GuestFilters): Promise<Guest[]> {
  try {
    let query = supabase.from('rsvps').select('*');

    // Apply search filter
    if (filters?.searchTerm) {
      query = query.or(
        `name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`
      );
    }

    // Apply status filter
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }

    return (data || []) as Guest[];
  } catch (error) {
    console.error('Failed to fetch guests:', error);
    throw error;
  }
}

/**
 * Fetch guest by ID
 */
export async function fetchGuestById(id: string): Promise<Guest | null> {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching guest:', error);
      return null;
    }

    return (data || null) as Guest | null;
  } catch (error) {
    console.error('Failed to fetch guest:', error);
    return null;
  }
}

/**
 * Fetch RSVP statistics
 */
export async function fetchGuestStats(): Promise<GuestStats | null> {
  try {
    const { data, error } = await supabase.rpc('get_rsvp_stats');

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return {
      total_guests: data[0].total_guests || 0,
      confirmed_guests: data[0].confirmed_guests || 0,
      pending_guests: data[0].pending_guests || 0,
      declined_guests: data[0].declined_guests || 0,
      total_expected_attendees: data[0].total_expected_attendees || 0,
    };
  } catch (error) {
    console.error('Failed to fetch guest stats:', error);
    return null;
  }
}

/**
 * Fetch RSVP status distribution for charts
 */
export async function fetchGuestDistribution(): Promise<GuestDistribution[]> {
  try {
    const { data, error } = await supabase.rpc('get_rsvp_distribution');

    if (error) {
      console.error('Error fetching distribution:', error);
      return [];
    }

    return (data || []) as GuestDistribution[];
  } catch (error) {
    console.error('Failed to fetch guest distribution:', error);
    return [];
  }
}

/**
 * Update guest information
 */
export async function updateGuest(
  id: string,
  updates: Partial<Guest>
): Promise<Guest | null> {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating guest:', error);
      throw error;
    }

    return (data || null) as Guest | null;
  } catch (error) {
    console.error('Failed to update guest:', error);
    throw error;
  }
}

/**
 * Delete guest
 */
export async function deleteGuest(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('rsvps').delete().eq('id', id);

    if (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete guest:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time guest updates
 */
export function subscribeToGuestUpdates(
  callback: (payload: any) => void
): (() => void) {
  const subscription = supabase
    .from('rsvps')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ============================================================================
// EVENT SETTINGS QUERIES
// ============================================================================

/**
 * Fetch event settings
 */
export async function fetchEventSettings(): Promise<EventSettings | null> {
  try {
    const { data, error } = await supabase
      .from('event_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching event settings:', error);
      return null;
    }

    return (data || null) as EventSettings | null;
  } catch (error) {
    console.error('Failed to fetch event settings:', error);
    return null;
  }
}

/**
 * Update event settings
 */
export async function updateEventSettings(
  updates: Partial<EventSettings>
): Promise<EventSettings | null> {
  try {
    // Get current admin user ID
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('event_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      })
      .eq('id', updates.id || (await getSettingsId()))
      .select()
      .single();

    if (error) {
      console.error('Error updating event settings:', error);
      throw error;
    }

    return (data || null) as EventSettings | null;
  } catch (error) {
    console.error('Failed to update event settings:', error);
    throw error;
  }
}

/**
 * Helper to get settings ID (assuming single row)
 */
async function getSettingsId(): Promise<string> {
  const { data } = await supabase.from('event_settings').select('id').limit(1);
  return data?.[0]?.id || '';
}

/**
 * Subscribe to real-time event settings updates
 */
export function subscribeToEventSettingsUpdates(
  callback: (payload: any) => void
): (() => void) {
  const subscription = supabase
    .from('event_settings')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ============================================================================
// TIMELINE STORY QUERIES
// ============================================================================

/**
 * Fetch all timeline stories
 */
export async function fetchTimelineStories(): Promise<TimelineStory[]> {
  try {
    const { data, error } = await supabase
      .from('timeline_stories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching timeline stories:', error);
      return [];
    }

    return (data || []) as TimelineStory[];
  } catch (error) {
    console.error('Failed to fetch timeline stories:', error);
    return [];
  }
}

/**
 * Fetch timeline story by ID
 */
export async function fetchTimelineStoryById(id: string): Promise<TimelineStory | null> {
  try {
    const { data, error } = await supabase
      .from('timeline_stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching timeline story:', error);
      return null;
    }

    return (data || null) as TimelineStory | null;
  } catch (error) {
    console.error('Failed to fetch timeline story:', error);
    return null;
  }
}

/**
 * Create new timeline story
 */
export async function createTimelineStory(
  story: Omit<TimelineStory, 'id' | 'created_at' | 'updated_at'>
): Promise<TimelineStory | null> {
  try {
    const { data, error } = await supabase
      .from('timeline_stories')
      .insert([story])
      .select()
      .single();

    if (error) {
      console.error('Error creating timeline story:', error);
      throw error;
    }

    return (data || null) as TimelineStory | null;
  } catch (error) {
    console.error('Failed to create timeline story:', error);
    throw error;
  }
}

/**
 * Update timeline story
 */
export async function updateTimelineStory(
  id: string,
  updates: Partial<TimelineStory>
): Promise<TimelineStory | null> {
  try {
    const { data, error } = await supabase
      .from('timeline_stories')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating timeline story:', error);
      throw error;
    }

    return (data || null) as TimelineStory | null;
  } catch (error) {
    console.error('Failed to update timeline story:', error);
    throw error;
  }
}

/**
 * Delete timeline story
 */
export async function deleteTimelineStory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('timeline_stories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting timeline story:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete timeline story:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time timeline updates
 */
export function subscribeToTimelineUpdates(
  callback: (payload: any) => void
): (() => void) {
  const subscription = supabase
    .from('timeline_stories')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Export guests as CSV
 */
export async function exportGuestsAsCSV(guests: Guest[]): Promise<string> {
  // CSV headers
  const headers = [
    'guest_id',
    'name',
    'email',
    'phone',
    'status',
    'party_size',
    'created_at',
  ];

  // CSV rows
  const rows = guests.map((guest) => [
    guest.id,
    `"${guest.name.replace(/"/g, '""')}"`, // Escape quotes in names
    guest.email || '',
    guest.phone || '',
    guest.status,
    guest.party_size,
    guest.created_at,
  ]);

  // Combine headers and rows
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string = 'guests.csv'): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class DashboardApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DashboardApiError';
  }
}
