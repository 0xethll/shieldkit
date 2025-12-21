import { motion, AnimatePresence } from 'framer-motion'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import PrivacyWalletWidget from './PrivacyWalletWidget'
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
              {/* Glassmorphism Container */}
              <div className="relative bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={closeWidget}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Widget Content */}
                <div className="relative">
                  <PrivacyWalletWidget />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
