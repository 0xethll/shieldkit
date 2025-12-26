'use client'

import { motion } from 'framer-motion'
import { Shield, Code, Layers, Zap, Database, GitBranch } from 'lucide-react'

export function TechnologyStack() {
  const technologies = [
    {
      category: 'FHE Engine',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      items: [
        {
          name: 'Zama fhEVM',
          description: 'Fully Homomorphic Encryption for Ethereum',
          features: ['Encrypted computations', 'On-chain privacy', 'EVM compatible'],
        },
      ],
    },
    {
      category: 'Smart Contracts',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          name: 'ERC7984',
          description: 'Confidential token standard',
          features: ['Private balances', 'Encrypted transfers', 'Wrap/unwrap support'],
        },
        {
          name: 'OpenZeppelin',
          description: 'Battle-tested contracts',
          features: ['Security audited', 'Modular design', 'Gas optimized'],
        },
      ],
    },
    {
      category: 'Frontend',
      icon: Layers,
      color: 'from-green-500 to-emerald-500',
      items: [
        {
          name: 'Next.js 15',
          description: 'React framework with App Router',
          features: ['Server components', 'Optimized builds', 'TypeScript support'],
        },
        {
          name: 'Relayer SDK',
          description: 'FHE client library',
          features: ['Key generation', 'Encryption', 'Proof creation'],
        },
      ],
    },
    {
      category: 'Blockchain',
      icon: GitBranch,
      color: 'from-orange-500 to-red-500',
      items: [
        {
          name: 'Ethereum',
          description: 'Sepolia testnet deployment',
          features: ['EVM compatible', 'Decentralized', 'Smart contracts'],
        },
        {
          name: 'Hardhat',
          description: 'Development environment',
          features: ['Testing', 'Deployment', 'Debugging'],
        },
      ],
    },
    {
      category: 'Indexing',
      icon: Database,
      color: 'from-yellow-500 to-orange-500',
      items: [
        {
          name: 'Envio',
          description: 'Real-time blockchain indexer',
          features: ['Event monitoring', 'Fast queries', 'GraphQL API'],
        },
      ],
    },
    {
      category: 'Web3 Integration',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      items: [
        {
          name: 'Wagmi + Viem',
          description: 'React hooks for Ethereum',
          features: ['Wallet connection', 'Contract interaction', 'Type-safe'],
        },
        {
          name: 'ConnectKit',
          description: 'Beautiful wallet UI',
          features: ['Multiple wallets', 'Responsive design', 'Dark mode'],
        },
      ],
    },
  ]

  return (
    <section className="py-20 px-6 sm:px-8 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/10 dark:via-purple-950/5 dark:to-pink-950/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technology Stack
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Built with cutting-edge tools and frameworks for privacy-preserving
            blockchain applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 h-full hover:shadow-2xl transition-shadow">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 bg-gradient-to-r ${tech.color} rounded-xl`}
                  >
                    <tech.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold">{tech.category}</h3>
                </div>

                {/* Technology Items */}
                <div className="space-y-6">
                  {tech.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="border-l-2 border-gray-200 dark:border-gray-800 pl-4 group-hover:border-blue-500 transition-colors"
                    >
                      <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {item.description}
                      </p>
                      <ul className="space-y-1">
                        {item.features.map((feature, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300"
                          >
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-8 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            System Architecture
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              '🌐 Frontend (Next.js)',
              '🔐 Relayer SDK',
              '💼 Wallet',
              '⛓️ Smart Contracts',
              '🔒 Zama fhEVM',
              '📊 Envio Indexer',
            ].map((component, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg"
              >
                {component}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            All components work together to provide seamless privacy-preserving
            token operations
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
