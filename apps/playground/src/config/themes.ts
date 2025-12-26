/**
 * Re-export theme types and utilities from @shieldkit/react
 * This allows the playground to use the same theme system as the package
 */
export type {
  ThemeType,
  AccentColor,
  RadiusSize,
  ThemeConfig,
} from '@shieldkit/react'

export {
  accentColors,
  themeColors,
  radiusSizes,
  DEFAULT_THEME as defaultTheme,
} from '@shieldkit/react'
