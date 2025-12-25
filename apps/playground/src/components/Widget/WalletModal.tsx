import { motion, AnimatePresence } from 'framer-motion'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import PrivacyWalletWidget from './PrivacyWalletWidget'
import { X } from 'lucide-react'
import { accentColors, themeColors, radiusSizes } from '../../config/themes'
import { useEffect, useRef } from 'react'

function ThemeProvider({ children }: { children: React.ReactNode }) {
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

export default function WalletModal() {
  const { isWidgetOpen, closeWidget } = usePlaygroundConfig()

  return (
    <AnimatePresence>
      {isWidgetOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWidget}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.25 }}
              className="pointer-events-auto w-full max-w-md mx-4"
            >
              <ThemeProvider>
                {/* Glassmorphism Container */}
                <div
                  className="relative backdrop-blur-xl shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'calc(var(--radius-lg) * 3)',
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                  {/* Close Button */}
                  <button
                    onClick={closeWidget}
                    className="absolute top-1 right-1 z-10 p-2 hover:bg-secondary transition-colors"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-secondary) 80%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-border) 50%, transparent)',
                      borderRadius: '9999px',
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Widget Content */}
                  <div className="relative max-h-[85vh]">
                    <PrivacyWalletWidget />
                  </div>
                </div>
              </ThemeProvider>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
