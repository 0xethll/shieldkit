/**
 * Theme system for ShieldKit React components
 *
 * Provides a flexible theming system with support for:
 * - Light and dark modes
 * - Multiple accent colors
 * - Customizable border radius
 * - CSS custom properties for easy styling
 *
 * @example
 * ```tsx
 * import { ThemeProvider, PRESET_THEMES } from '@shieldkit/react'
 *
 * function App() {
 *   return (
 *     <ThemeProvider theme={PRESET_THEMES.darkPurple}>
 *       <YourApp />
 *     </ThemeProvider>
 *   )
 * }
 * ```
 */

// Component
export { ThemeProvider } from './ThemeProvider'
export type { ThemeProviderProps } from './ThemeProvider'

// Types
export type { ThemeType, AccentColor, RadiusSize, ThemeConfig } from './types'

// Colors
export { accentColors, themeColors, radiusSizes } from './colors'

// Defaults and presets
export { DEFAULT_THEME, PRESET_THEMES } from './defaults'
