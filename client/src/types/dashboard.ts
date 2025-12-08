/**
 * Dashboard Type Definitions
 * Comprehensive types for authentication, guests, settings, and analytics
 */

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  role: 'bride' | 'groom' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface AuthSession {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============================================================================
// GUEST / RSVP TYPES
// ============================================================================

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'yes' | 'no' | 'maybe';
  party_size: number;
  going_to_reception: boolean;
  dietary_restrictions?: string;
  message?: string;
  confirmed_at?: string;
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
  response_source: 'web' | 'phone' | 'manual';
}

export interface GuestFilters {
  searchTerm: string;
  status: 'all' | 'yes' | 'no' | 'maybe';
  sortBy: 'name' | 'created_at' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface GuestStats {
  total_guests: number;
  confirmed_guests: number;
  pending_guests: number;
  declined_guests: number;
  total_expected_attendees: number;
}

export interface GuestDistribution {
  status: string;
  count: number;
}

// ============================================================================
// EVENT SETTINGS TYPES
// ============================================================================

export interface EventSettings {
  id: string;
  
  // Couple Information
  groom_name: string;
  bride_name: string;
  groom_email?: string;
  bride_email?: string;
  
  // Wedding Details
  wedding_date: string; // ISO date format
  wedding_time: string; // HH:MM format
  ceremony_location: string;
  ceremony_address: string;
  reception_location: string;
  reception_address: string;
  
  // Invitation Content
  invitation_message?: string;
  love_manifesto?: string;
  dress_code?: string;
  rsvp_deadline?: string; // ISO date format
  
  // Media & Theme
  hero_image_url?: string;
  background_theme: string;
  
  // Social Links
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  website_url?: string;
  
  // Metadata
  countdown_target: string; // ISO timestamp
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export interface EventSettingsFormData {
  groom_name: string;
  bride_name: string;
  groom_email?: string;
  bride_email?: string;
  wedding_date: string;
  wedding_time: string;
  ceremony_location: string;
  ceremony_address: string;
  reception_location: string;
  reception_address: string;
  invitation_message?: string;
  love_manifesto?: string;
  dress_code?: string;
  rsvp_deadline?: string;
  hero_image_url?: string;
  background_theme: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  website_url?: string;
}

// ============================================================================
// TIMELINE STORY TYPES
// ============================================================================

export interface TimelineStory {
  id: string;
  year: string;
  title: string;
  description: string;
  icon_name: 'heart' | 'map-pin' | 'calendar' | 'gem' | 'star' | 'ring';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineStoryFormData {
  year: string;
  title: string;
  description: string;
  icon_name: 'heart' | 'map-pin' | 'calendar' | 'gem' | 'star' | 'ring';
  display_order: number;
}

// ============================================================================
// DASHBOARD UI STATE TYPES
// ============================================================================

export interface DashboardState {
  guests: Guest[];
  guestStats: GuestStats | null;
  guestDistribution: GuestDistribution[];
  eventSettings: EventSettings | null;
  timelineStories: TimelineStory[];
  isLoading: boolean;
  error: string | null;
}

export interface DashboardContextType {
  state: DashboardState;
  actions: {
    fetchGuests: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    fetchTimeline: () => Promise<void>;
    updateGuest: (id: string, updates: Partial<Guest>) => Promise<void>;
    deleteGuest: (id: string) => Promise<void>;
    updateSettings: (updates: Partial<EventSettings>) => Promise<void>;
    updateTimelineStory: (id: string, updates: Partial<TimelineStory>) => Promise<void>;
    addTimelineStory: (story: TimelineStoryFormData) => Promise<void>;
    deleteTimelineStory: (id: string) => Promise<void>;
    exportGuestsAsCSV: () => void;
    setError: (error: string | null) => void;
  };
}

// ============================================================================
// CSV EXPORT TYPES
// ============================================================================

export interface GuestCSVRow {
  guest_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  party_size: number;
  created_at: string;
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// NOTIFICATION TYPES (for future use)
// ============================================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
