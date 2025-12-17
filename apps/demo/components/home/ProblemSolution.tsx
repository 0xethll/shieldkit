'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, TrendingUp, Shield, AlertCircle, Check } from 'lucide-react'
import Lottie from 'lottie-react'

// Warning animation for the problem side
const warningAnimation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'Warning',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Warning Wave',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [60], e: [0] },
            { t: 30, s: [0], e: [60] },
            { t: 60, s: [60] },
          ],
        },
        p: { a: 0, k: [50, 50, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 80, 100], e: [150, 150, 100] },
            { t: 30, s: [150, 150, 100], e: [80, 80, 100] },
            { t: 60, s: [80, 80, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [50, 50] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.937, 0.267, 0.267, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
}

// Shield animation for the solution side
const shieldAnimation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'Shield',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Shield Glow',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [40], e: [60] },
            { t: 30, s: [60], e: [40] },
            { t: 60, s: [40] },
          ],
        },
        p: { a: 0, k: [50, 50, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [110, 110, 100] },
            { t: 30, s: [110, 110, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [60, 60] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.133, 0.698, 0.298, 0.3] },
              o: { a: 0, k: 100 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
}

export function ProblemSolution() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <section className="py-20 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Privacy Problem
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Traditional blockchain transactions expose sensitive financial data
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Traditional Way - Problem */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-25" />
            <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-red-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  {/* Lottie warning animation behind Eye icon */}
                  <div className="absolute inset-0 flex items-center justify-center -m-4">
                    <Lottie
                      animationData={warningAnimation}
                      loop={true}
                      style={{ width: 80, height: 80 }}
                    />
                  </div>
                  <Eye className="h-8 w-8 text-red-500 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold">Traditional Transfers</h3>
              </div>

              <motion.ul
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    icon: AlertCircle,
                    text: 'Transaction amounts are publicly visible',
                    color: 'text-red-500',
                  },
                  {
                    icon: AlertCircle,
                    text: 'Account balances can be tracked by anyone',
                    color: 'text-red-500',
                  },
                  {
                    icon: AlertCircle,
                    text: 'Financial activities are permanently exposed',
                    color: 'text-red-500',
                  },
                  {
                    icon: AlertCircle,
                    text: 'No privacy for salary payments or sensitive transactions',
                    color: 'text-red-500',
                  },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Example Card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900"
              >
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      From:
                    </span>
                    <span className="font-mono">0x1234...5678</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">To:</span>
                    <span className="font-mono">0xabcd...ef90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount:
                    </span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      👁️ 5,000 USDC (VISIBLE)
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Private Way - Solution */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-25" />
            <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-green-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  {/* Lottie shield animation behind Shield icon */}
                  <div className="absolute inset-0 flex items-center justify-center -m-4">
                    <Lottie
                      animationData={shieldAnimation}
                      loop={true}
                      style={{ width: 80, height: 80 }}
                    />
                  </div>
                  <Shield className="h-8 w-8 text-green-500 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold">Confidential Transfers</h3>
              </div>

              <motion.ul
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    icon: Check,
                    text: 'Amounts encrypted using Fully Homomorphic Encryption',
                    color: 'text-green-500',
                  },
                  {
                    icon: Check,
                    text: 'Balances remain private, only visible to owner',
                    color: 'text-green-500',
                  },
                  {
                    icon: Check,
                    text: 'Zero-knowledge proofs verify transactions',
                    color: 'text-green-500',
                  },
                  {
                    icon: Check,
                    text: 'Perfect for payroll, trading, and confidential payments',
                    color: 'text-green-500',
                  },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Example Card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900"
              >
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      From:
                    </span>
                    <span className="font-mono">0x1234...5678</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">To:</span>
                    <span className="font-mono">0xabcd...ef90</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      🔒 ••••• (ENCRYPTED)
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Transformation Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg">
            <TrendingUp className="inline h-6 w-6 mr-2" />
            Powered by Zama FHE Technology
          </div>
        </motion.div>
      </div>
    </section>
  )
}
