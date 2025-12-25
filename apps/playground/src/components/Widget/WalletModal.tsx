import { motion, AnimatePresence } from 'framer-motion'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import PrivacyWalletWidget from './PrivacyWalletWidget'
import ThemeProvider from './ThemeProvider'
import { X } from 'lucide-react'

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
