'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Package,
  Coins,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { useState } from 'react'

const navigation = [
  { name: 'Overview', href: '/', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { name: 'Token Manager', href: '/tokens', icon: Package, color: 'from-purple-500 to-pink-500' },
  { name: 'Faucet', href: '/faucet', icon: Coins, color: 'from-yellow-500 to-orange-500' },
]

export function EdgeNavigator() {
  const { isOpen, open } = useSidebar()
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // 仅在侧边栏关闭时显示
  if (isOpen) return null

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 group"
    >
      {/* Main Edge Bar */}
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 rounded-r-2xl shadow-2xl" />

        {/* Content */}
        <div className="relative py-4 px-2 space-y-2">
          {/* Sparkle Icon - Brand */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mx-1" />

          {/* Navigation Icons */}
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  href={item.href}
                  onClick={open}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-lg transition-all relative ${
                      isActive
                        ? 'bg-gradient-to-br ' + item.color
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeEdge"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                      />
                    )}
                  </motion.div>
                </Link>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                        {item.name}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-100" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mx-1 my-2" />

          {/* Open Sidebar Button */}
          <motion.button
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={open}
            className="w-full p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all group/btn"
            title="Open Sidebar"
          >
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.div>
          </motion.button>
        </div>

        {/* Glow Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Pulsing Hint Dot - 提示用户注意 */}
      <motion.div
        className="absolute -right-1 top-4 w-2 h-2 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}
