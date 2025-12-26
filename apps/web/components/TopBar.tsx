'use client'

import { motion } from 'framer-motion'
import { Menu, X, Shield } from 'lucide-react'
import { ConnectKitButton } from 'connectkit'
import { useSidebar } from '@/contexts/SidebarContext'
import Link from 'next/link'

export function TopBar() {
  const { isOpen, toggle } = useSidebar()

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Menu Button */}
          <div className="flex items-center gap-4">
            {/* Menu Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggle}
              className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"
              >
                <Shield className="h-5 w-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Z-Payment
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  FHE Explorer
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Connect Button */}
          <div className="flex items-center gap-3">
            <ConnectKitButton showBalance={false} showAvatar={true} />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
