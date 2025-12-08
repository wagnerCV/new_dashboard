/**
 * Zod Validation Schemas for Dashboard Forms
 * Ensures type-safe validation across the application
 */

import { z } from 'zod';

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// ============================================================================
// GUEST / RSVP SCHEMAS
// ============================================================================

export const GuestFiltersSchema = z.object({
  searchTerm: z.string().default(''),
  status: z.enum(['all', 'yes', 'no', 'maybe']).default('all'),
  sortBy: z.enum(['name', 'created_at', 'status']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GuestFiltersFormData = z.infer<typeof GuestFiltersSchema>;

export const GuestNotesSchema = z.object({
  admin_notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  status: z.enum(['yes', 'no', 'maybe']).optional(),
});

export type GuestNotesFormData = z.infer<typeof GuestNotesSchema>;

// ============================================================================
// EVENT SETTINGS SCHEMAS
// ============================================================================

export const GeneralSettingsSchema = z.object({
  groom_name: z
    .string()
    .min(1, 'Groom name is required')
    .max(100, 'Name must be less than 100 characters'),
  bride_name: z
    .string()
    .min(1, 'Bride name is required')
    .max(100, 'Name must be less than 100 characters'),
  groom_email: z.string().email('Invalid email').optional().or(z.literal('')),
  bride_email: z.string().email('Invalid email').optional().or(z.literal('')),
  wedding_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  wedding_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  ceremony_location: z
    .string()
    .min(1, 'Ceremony location is required')
    .max(200, 'Location must be less than 200 characters'),
  ceremony_address: z
    .string()
    .min(1, 'Ceremony address is required')
    .max(300, 'Address must be less than 300 characters'),
  reception_location: z
    .string()
    .min(1, 'Reception location is required')
    .max(200, 'Location must be less than 200 characters'),
  reception_address: z
    .string()
    .min(1, 'Reception address is required')
    .max(300, 'Address must be less than 300 characters'),
  rsvp_deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
});

export type GeneralSettingsFormData = z.infer<typeof GeneralSettingsSchema>;

export const ContentSettingsSchema = z.object({
  invitation_message: z
    .string()
    .max(1000, 'Invitation message must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  love_manifesto: z
    .string()
    .max(2000, 'Love manifesto must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  dress_code: z
    .string()
    .max(200, 'Dress code must be less than 200 characters')
    .optional()
    .or(z.literal('')),
});

export type ContentSettingsFormData = z.infer<typeof ContentSettingsSchema>;

export const MediaSettingsSchema = z.object({
  hero_image_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  background_theme: z
    .enum(['terracotta', 'emerald', 'burgundy', 'neutral'])
    .default('terracotta'),
});

export type MediaSettingsFormData = z.infer<typeof MediaSettingsSchema>;

export const SocialSettingsSchema = z.object({
  instagram_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  facebook_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  tiktok_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  website_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
});

export type SocialSettingsFormData = z.infer<typeof SocialSettingsSchema>;

// Combined settings schema for full update
export const EventSettingsSchema = GeneralSettingsSchema
  .merge(ContentSettingsSchema)
  .merge(MediaSettingsSchema)
  .merge(SocialSettingsSchema);

export type EventSettingsFormData = z.infer<typeof EventSettingsSchema>;

// ============================================================================
// TIMELINE STORY SCHEMAS
// ============================================================================

export const TimelineStorySchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, 'Year must be in YYYY format')
    .min(1, 'Year is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  icon_name: z.enum(['heart', 'map-pin', 'calendar', 'gem', 'star', 'ring']),
  display_order: z
    .number()
    .int('Order must be a whole number')
    .positive('Order must be positive'),
});

export type TimelineStoryFormData = z.infer<typeof TimelineStorySchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(50),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

// ============================================================================
// HELPER VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate and parse login form data
 */
export function validateLoginForm(data: unknown): LoginFormData {
  return LoginSchema.parse(data);
}

/**
 * Validate and parse general settings
 */
export function validateGeneralSettings(data: unknown): GeneralSettingsFormData {
  return GeneralSettingsSchema.parse(data);
}

/**
 * Validate and parse content settings
 */
export function validateContentSettings(data: unknown): ContentSettingsFormData {
  return ContentSettingsSchema.parse(data);
}

/**
 * Validate and parse media settings
 */
export function validateMediaSettings(data: unknown): MediaSettingsFormData {
  return MediaSettingsSchema.parse(data);
}

/**
 * Validate and parse social settings
 */
export function validateSocialSettings(data: unknown): SocialSettingsFormData {
  return SocialSettingsSchema.parse(data);
}

/**
 * Validate and parse timeline story
 */
export function validateTimelineStory(data: unknown): TimelineStoryFormData {
  return TimelineStorySchema.parse(data);
}

/**
 * Safe validation that returns errors instead of throwing
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}
