/**
 * Theme type for light or dark mode
 */
export type ThemeType = 'dark' | 'light'

/**
 * Available accent colors for the theme
 */
export type AccentColor = 'purple' | 'blue' | 'green' | 'orange'

/**
 * Border radius sizes
 */
export type RadiusSize = 'none' | 'small' | 'medium' | 'large'

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
  /** Light or dark mode */
  type: ThemeType
  /** Accent color for primary elements */
  accent: AccentColor
  /** Border radius size */
  radius: RadiusSize
}
