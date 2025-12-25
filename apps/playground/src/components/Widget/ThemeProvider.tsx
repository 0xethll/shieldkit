import { useEffect, useRef } from 'react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { accentColors, themeColors, radiusSizes } from '../../config/themes'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = usePlaygroundConfig()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const colors = themeColors[theme.type]
    const accent = accentColors[theme.accent]
    const radius = radiusSizes[theme.radius]

    // Apply CSS custom properties
    container.style.setProperty('--color-background', colors.background)
    container.style.setProperty('--color-foreground', colors.foreground)
    container.style.setProperty('--color-muted', colors.muted)
    container.style.setProperty('--color-muted-foreground', colors.mutedForeground)
    container.style.setProperty('--color-border', colors.border)
    container.style.setProperty('--color-secondary', colors.secondary)
    container.style.setProperty('--color-secondary-foreground', colors.secondaryForeground)
    container.style.setProperty('--color-accent', colors.accent)
    container.style.setProperty('--color-accent-foreground', colors.accentForeground)
    container.style.setProperty('--color-primary', accent.primary)
    container.style.setProperty('--color-primary-hover', accent.primaryHover)
    container.style.setProperty('--color-primary-foreground', 'oklch(0.98 0.01 265)')
    container.style.setProperty('--radius-lg', radius)
    container.style.setProperty('--radius-md', `calc(${radius} - 2px)`)
    container.style.setProperty('--radius-sm', `calc(${radius} - 4px)`)
  }, [theme])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {children}
    </div>
  )
}
