'use client'

import { motion } from 'framer-motion'
import { Lock, Unlock, ArrowRight, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Privacy-First Tokens
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform any ERC20 token into a confidential asset using{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Fully Homomorphic Encryption
            </span>
          </p>
        </motion.div>

        {/* Encryption Flow Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-8 mb-12 flex-wrap"
        >
          {/* ERC20 Token */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-2xl shadow-2xl">
              <Unlock className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <p className="text-sm font-semibold">ERC20 Token</p>
              <p className="text-xs text-gray-500">👁️ Public</p>
            </div>
          </motion.div>

          {/* Arrow with encryption animation */}
          <motion.div className="flex items-center gap-4">
            <motion.div
              animate={{
                x: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowRight className="h-8 w-8 text-blue-500" />
            </motion.div>

            {/* FHE Encryption Box */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 rounded-2xl shadow-2xl">
                {/* Rotating Lock Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Lock className="h-12 w-12 text-white/30" />
                </motion.div>

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Shield className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">FHE</p>
                    <p className="text-white/80 text-xs">Encrypting</p>
                  </div>
                </div>

                {/* Pulse Effect */}
                <motion.div
                  className="absolute inset-0 bg-white rounded-2xl"
                  animate={{
                    opacity: [0, 0.2, 0],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              animate={{
                x: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            >
              <ArrowRight className="h-8 w-8 text-purple-500" />
            </motion.div>
          </motion.div>

          {/* Confidential Token */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <Lock className="h-16 w-16 text-white relative z-10" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <p className="text-sm font-semibold">Confidential Token</p>
              <p className="text-xs text-gray-500">🔒 Private</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20"
        >
          {[
            {
              icon: Shield,
              title: 'Encrypted Balances',
              desc: 'All amounts are encrypted on-chain',
            },
            {
              icon: Lock,
              title: 'Private Transfers',
              desc: 'Transaction amounts remain confidential',
            },
            {
              icon: Shield,
              title: 'FHE Powered',
              desc: 'Compute on encrypted data without decryption',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <item.icon className="h-10 w-10 text-blue-500 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
