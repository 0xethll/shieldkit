import { useEffect, useRef } from 'react'
import type { ThemeConfig } from './types'
import { accentColors, themeColors, radiusSizes } from './colors'
import { DEFAULT_THEME } from './defaults'

export interface ThemeProviderProps {
  /**
   * Controlled theme configuration (overrides defaultTheme)
   * Useful when you want to control theme from external state
   */
  theme?: ThemeConfig

  /**
   * Default theme configuration
   * Used when `theme` prop is not provided
   */
  defaultTheme?: ThemeConfig

  /**
   * Children to render with theme applied
   */
  children: React.ReactNode

  /**
   * Additional className for the theme container
   */
  className?: string

  /**
   * Additional inline styles for the theme container
   */
  style?: React.CSSProperties
}

/**
 * ThemeProvider applies theme configuration to its children using CSS custom properties
 *
 * @example
 * ```tsx
 * // Controlled mode (external state controls theme)
 * const [theme, setTheme] = useState({ type: 'dark', accent: 'purple', radius: 'medium' })
 * <ThemeProvider theme={theme}>
 *   <YourApp />
 * </ThemeProvider>
 *
 * // Uncontrolled mode (uses default theme)
 * <ThemeProvider defaultTheme={{ type: 'light', accent: 'blue', radius: 'large' }}>
 *   <YourApp />
 * </ThemeProvider>
 *
 * // Minimal (uses built-in default)
 * <ThemeProvider>
 *   <YourApp />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  theme,
  defaultTheme,
  children,
  className,
  style,
}: ThemeProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Use controlled theme if provided, otherwise use defaultTheme, fallback to DEFAULT_THEME
  const activeTheme = theme ?? defaultTheme ?? DEFAULT_THEME

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const colors = themeColors[activeTheme.type]
    const accent = accentColors[activeTheme.accent]
    const radius = radiusSizes[activeTheme.radius]

    // Apply theme colors as CSS custom properties
    container.style.setProperty('--color-background', colors.background)
    container.style.setProperty('--color-foreground', colors.foreground)
    container.style.setProperty('--color-muted', colors.muted)
    container.style.setProperty('--color-muted-foreground', colors.mutedForeground)
    container.style.setProperty('--color-border', colors.border)
    container.style.setProperty('--color-secondary', colors.secondary)
    container.style.setProperty('--color-secondary-foreground', colors.secondaryForeground)
    container.style.setProperty('--color-accent', colors.accent)
    container.style.setProperty('--color-accent-foreground', colors.accentForeground)

    // Apply accent colors
    container.style.setProperty('--color-primary', accent.primary)
    container.style.setProperty('--color-primary-hover', accent.primaryHover)
    container.style.setProperty('--color-primary-foreground', 'oklch(0.98 0.01 265)')

    // Apply border radius
    container.style.setProperty('--radius-lg', radius)
    container.style.setProperty('--radius-md', `calc(${radius} - 2px)`)
    container.style.setProperty('--radius-sm', `calc(${radius} - 4px)`)
  }, [activeTheme])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
