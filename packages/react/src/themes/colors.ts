import type { AccentColor, RadiusSize, ThemeType } from './types'

/**
 * OKLCH color values for different accent colors
 * Each color has primary and hover variants
 */
export const accentColors: Record<AccentColor, { primary: string; primaryHover: string }> = {
  purple: {
    primary: 'oklch(0.64 0.18 286)', // Purple primary
    primaryHover: 'oklch(0.60 0.20 286)', // Darker purple on hover
  },
  blue: {
    primary: 'oklch(0.55 0.22 250)', // Blue primary
    primaryHover: 'oklch(0.50 0.24 250)', // Darker blue on hover
  },
  green: {
    primary: 'oklch(0.55 0.20 160)', // Green primary
    primaryHover: 'oklch(0.50 0.22 160)', // Darker green on hover
  },
  orange: {
    primary: 'oklch(0.65 0.22 40)', // Orange primary
    primaryHover: 'oklch(0.60 0.24 40)', // Darker orange on hover
  },
}

/**
 * Theme color palettes for light and dark modes
 * Uses OKLCH color space for better perceptual uniformity
 */
export const themeColors: Record<
  ThemeType,
  {
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
  }
> = {
  dark: {
    background: 'oklch(0.18 0.02 265)',
    foreground: 'oklch(0.89 0.01 265)',
    muted: 'oklch(0.18 0.02 265)',
    mutedForeground: 'oklch(0.62 0.01 265)',
    border: 'oklch(0.27 0.02 265)',
    secondary: 'oklch(0.18 0.02 265)',
    secondaryForeground: 'oklch(0.98 0.01 265)',
    accent: 'oklch(0.27 0.02 265)',
    accentForeground: 'oklch(0.98 0.01 265)',
  },
  light: {
    background: 'oklch(0.98 0.005 265)',
    foreground: 'oklch(0.15 0.02 265)',
    muted: 'oklch(0.95 0.01 265)',
    mutedForeground: 'oklch(0.45 0.02 265)',
    border: 'oklch(0.88 0.01 265)',
    secondary: 'oklch(0.95 0.01 265)',
    secondaryForeground: 'oklch(0.15 0.02 265)',
    accent: 'oklch(0.92 0.01 265)',
    accentForeground: 'oklch(0.15 0.02 265)',
  },
}

/**
 * Border radius sizes in rem units
 */
export const radiusSizes: Record<RadiusSize, string> = {
  none: '0px',
  small: '0.375rem',
  medium: '0.5rem',
  large: '1rem',
}
