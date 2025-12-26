'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ConnectKitButton } from 'connectkit'
import {
  Shield,
  Package,
  Coins,
  FileText,
  X,
  Sparkles,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TokenBalance } from './TokenBalance'
import { DecryptionStatusPanel } from './DecryptionStatusPanel'
import { useSidebar } from '@/contexts/SidebarContext'

const navigation = [
  { name: 'Overview', href: '/', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Token Manager', href: '/tokens', icon: Package, gradient: 'from-purple-500 to-pink-500' },
  { name: 'Faucet', href: '/faucet', icon: Coins, gradient: 'from-yellow-500 to-orange-500' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-screen w-80 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50 dark:border-gray-800/50">
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                >
                  <Shield className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    Z-Payment
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    FHE Explorer
                  </p>
                </div>
              </Link>

              {/* Close Button - Always Visible */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={close}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close sidebar"
                title="Close sidebar (or click menu button)"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
              <ul className="space-y-2">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          // Close sidebar on mobile after navigation
                          if (window.innerWidth < 1024) {
                            close()
                          }
                        }}
                        className={cn(
                          'group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden',
                          isActive
                            ? 'text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-md'
                        )}
                      >
                        {/* Active Background Gradient */}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className={cn(
                              'absolute inset-0 rounded-xl bg-gradient-to-r',
                              item.gradient
                            )}
                            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                          />
                        )}

                        {/* Icon */}
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="relative z-10"
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>

                        {/* Label */}
                        <span className="relative z-10">{item.name}</span>

                        {/* Hover Shine Effect */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer: Wallet Connection */}
            <div className="px-4 pb-6 border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Token Balance */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-800/30">
                  <TokenBalance />
                </div>

                {/* System Status Panel */}
                <DecryptionStatusPanel />

                {/* Network Badge */}
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-800">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                    Sepolia Testnet
                  </span>
                </div>

                {/* Connect Button */}
                <ConnectKitButton showBalance={true} showAvatar={false} />
              </motion.div>
            </div>

            {/* Floating Collapse Button - Right Edge */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={close}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow z-10"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
