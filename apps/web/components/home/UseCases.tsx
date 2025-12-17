'use client'

import { motion } from 'framer-motion'
import {
  Briefcase,
  DollarSign,
  Gift,
  Building2,
  Users,
  TrendingUp,
} from 'lucide-react'
import Lottie from 'lottie-react'

// Simple pulse animation for icons
const pulseAnimation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'Pulse',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Circle',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [80], e: [100] },
            { t: 30, s: [100], e: [80] },
            { t: 60, s: [80] },
          ],
        },
        p: { a: 0, k: [50, 50, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
            { t: 30, s: [120, 120, 100], e: [100, 100, 100] },
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
              s: { a: 0, k: [40, 40] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 30 },
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

export function UseCases() {
  const useCases = [
    {
      icon: Briefcase,
      title: 'Private Payroll',
      description: 'Pay employees without revealing individual salaries',
      details: [
        'Keep compensation confidential',
        'Prevent salary comparison issues',
        'Maintain organizational privacy',
      ],
      gradient: 'from-blue-500 to-cyan-500',
      emoji: '💼',
    },
    {
      icon: DollarSign,
      title: 'Confidential Trading',
      description: 'Execute trades without exposing positions or amounts',
      details: [
        'Hide trading strategies',
        'Prevent front-running',
        'Protect large transactions',
      ],
      gradient: 'from-purple-500 to-pink-500',
      emoji: '💸',
    },
    {
      icon: Gift,
      title: 'Anonymous Donations',
      description: 'Donate to causes while maintaining privacy',
      details: [
        'Anonymous contribution amounts',
        'Protect donor identity',
        'Tax-compliant reporting',
      ],
      gradient: 'from-green-500 to-emerald-500',
      emoji: '🎁',
    },
    {
      icon: Building2,
      title: 'Corporate Treasury',
      description: 'Manage company funds with confidential balance sheets',
      details: [
        'Hide cash reserves from competitors',
        'Private vendor payments',
        'Confidential budget allocation',
      ],
      gradient: 'from-orange-500 to-red-500',
      emoji: '🏦',
    },
    {
      icon: Users,
      title: 'Private DAOs',
      description: 'Governance with confidential voting and treasury',
      details: [
        'Secret ballot voting',
        'Private treasury management',
        'Confidential proposals',
      ],
      gradient: 'from-indigo-500 to-purple-500',
      emoji: '🤝',
    },
    {
      icon: TrendingUp,
      title: 'Investment Funds',
      description: 'Manage portfolios with encrypted positions',
      details: [
        'Hide investment strategies',
        'Confidential rebalancing',
        'Private performance tracking',
      ],
      gradient: 'from-yellow-500 to-orange-500',
      emoji: '📈',
    },
  ]

  return (
    <section className="py-20 px-6 sm:px-8 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-900/30 dark:via-transparent dark:to-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-World Use Cases
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Privacy is essential for many financial operations. Here&apos;s how
            confidential tokens solve real problems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${useCase.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur`}
              />

              {/* Card Content */}
              <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 h-full">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`relative p-3 bg-gradient-to-r ${useCase.gradient} rounded-xl overflow-hidden`}
                  >
                    {/* Lottie pulse effect behind icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <Lottie
                        animationData={pulseAnimation}
                        loop={true}
                        style={{ width: 60, height: 60 }}
                      />
                    </div>
                    <useCase.icon className="h-8 w-8 text-white relative z-10" />
                  </motion.div>
                  <motion.span
                    className="text-4xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {useCase.emoji}
                  </motion.span>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {useCase.description}
                </p>

                {/* Details List */}
                <ul className="space-y-2">
                  {useCase.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {detail}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  whileHover={{ scale: 1.02 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Ready to add privacy to your tokens?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Get Started Now →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
