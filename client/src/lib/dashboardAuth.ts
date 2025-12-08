/**
 * Dashboard Authentication Utilities
 * Handles Supabase Auth integration for admin dashboard
 */

import { supabase } from './supabaseClient';
import { AdminUser, AuthSession } from '@/types/dashboard';

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Get current authenticated admin user
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    // Get current Supabase session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return null;
    }

    // Fetch admin user data from admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();

    if (error || !data) {
      console.error('Failed to fetch admin user:', error);
      return null;
    }

    return data as AdminUser;
  } catch (error) {
    console.error('Error getting current admin user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated admin
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const user = await getCurrentAdminUser();
  return user !== null && user.is_active;
}

/**
 * Login with email and password
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'No user returned from authentication',
      };
    }

    // Fetch admin user details
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .single();

    if (adminError || !adminUser) {
      // User authenticated but not in admin_users table
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'User is not authorized as admin',
      };
    }

    const admin = adminUser as AdminUser;

    // Check if admin is active
    if (!admin.is_active) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Admin account is inactive',
      };
    }

    // Update last_login timestamp
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    return {
      success: true,
      user: admin,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during login',
    };
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during logout',
    };
  }
}

/**
 * Get current session
 */
export async function getAdminSession(): Promise<AuthSession> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    }

    const user = await getCurrentAdminUser();

    return {
      user: user || null,
      isAuthenticated: user !== null && user.is_active,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: error instanceof Error ? error : new Error('Session check failed'),
    };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (session: AuthSession) => void
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      const authSession = await getAdminSession();
      callback(authSession);
    }
  });

  return () => {
    subscription?.unsubscribe();
  };
}

/**
 * Refresh admin session
 */
export async function refreshAdminSession(): Promise<AuthSession> {
  try {
    const { error } = await supabase.auth.refreshSession();

    if (error) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error,
      };
    }

    return await getAdminSession();
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: error instanceof Error ? error : new Error('Session refresh failed'),
    };
  }
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: 'bride' | 'groom' | 'admin'): Promise<boolean> {
  const user = await getCurrentAdminUser();
  return user?.role === role;
}

/**
 * Check if user is bride or groom
 */
export async function isCouple(): Promise<boolean> {
  const user = await getCurrentAdminUser();
  return user?.role === 'bride' || user?.role === 'groom';
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

const ADMIN_SESSION_KEY = 'dashboard_admin_session';
const ADMIN_USER_KEY = 'dashboard_admin_user';

/**
 * Save admin session to local storage
 */
export function saveAdminSessionToStorage(user: AdminUser): void {
  try {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ADMIN_SESSION_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save session to storage:', error);
  }
}

/**
 * Get admin session from local storage
 */
export function getAdminSessionFromStorage(): AdminUser | null {
  try {
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get session from storage:', error);
    return null;
  }
}

/**
 * Clear admin session from local storage
 */
export function clearAdminSessionFromStorage(): void {
  try {
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session from storage:', error);
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
  USER_NOT_ADMIN: {
    code: 'USER_NOT_ADMIN',
    message: 'User is not authorized as admin',
  },
  ADMIN_INACTIVE: {
    code: 'ADMIN_INACTIVE',
    message: 'Admin account is inactive',
  },
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    message: 'Your session has expired. Please log in again.',
  },
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network error. Please check your connection.',
  },
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  },
} as const;
