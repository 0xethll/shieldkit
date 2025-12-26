import { motion, AnimatePresence } from 'framer-motion'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { ConfidentialWidget } from '@shieldkit/react'
import { X } from 'lucide-react'

export default function WalletModal() {
  const { isWidgetOpen, closeWidget, theme, selectedTokens, defaultTab, features } = usePlaygroundConfig()

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
              {/* Glassmorphism Container with ConfidentialWidget */}
              <div className="relative backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl">
                {/* Close Button */}
                <button
                  onClick={closeWidget}
                  className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/30 backdrop-blur-sm transition-colors rounded-full border border-white/10"
                  aria-label="Close widget"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Widget Content */}
                <div className="relative max-h-[85vh] h-[600px]">
                  <ConfidentialWidget
                    tokens={selectedTokens}
                    defaultTab={defaultTab}
                    features={features}
                    theme={theme}
                    graphqlUrl={import.meta.env.VITE_ENVIO_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
