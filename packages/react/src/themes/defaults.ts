import type { ThemeConfig } from './types'

/**
 * Default theme configuration
 * - Dark mode for better privacy-focused aesthetic
 * - Purple accent for brand consistency
 * - Medium radius for modern look
 */
export const DEFAULT_THEME: ThemeConfig = {
  type: 'dark',
  accent: 'purple',
  radius: 'medium',
}

/**
 * Preset theme configurations for common use cases
 */
export const PRESET_THEMES = {
  /** Default dark theme with purple accent */
  darkPurple: DEFAULT_THEME,

  /** Dark theme with blue accent */
  darkBlue: {
    type: 'dark' as const,
    accent: 'blue' as const,
    radius: 'medium' as const,
  },

  /** Light theme with purple accent */
  lightPurple: {
    type: 'light' as const,
    accent: 'purple' as const,
    radius: 'medium' as const,
  },

  /** Light theme with blue accent */
  lightBlue: {
    type: 'light' as const,
    accent: 'blue' as const,
    radius: 'medium' as const,
  },
} as const
