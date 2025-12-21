import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useFHEContext } from '@shieldkit/react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import WrapPanel from './WrapPanel'
import TransferPanel from './TransferPanel'
import UnwrapPanel from './UnwrapPanel'
import { Wallet, Network, Lock, Send, Download } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyWalletWidget() {
  const { address } = useAccount()
  const { isFHEReady } = useFHEContext()
  const { defaultTab, features } = usePlaygroundConfig()

  const [activeTab, setActiveTab] = useState<'wrap' | 'transfer' | 'unwrap'>(defaultTab)

  // Get enabled tabs based on features
  const tabs = [
    { id: 'wrap' as const, label: 'Wrap', icon: Lock, enabled: features.wrap },
    { id: 'transfer' as const, label: 'Transfer', icon: Send, enabled: features.transfer },
    { id: 'unwrap' as const, label: 'Unwrap', icon: Download, enabled: features.unwrap },
  ].filter(tab => tab.enabled)

  // Set active tab to first enabled tab if current one is disabled
  if (!tabs.find(tab => tab.id === activeTab) && tabs.length > 0) {
    setActiveTab(tabs[0].id)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Privacy Wallet</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/50 rounded-full text-xs font-medium">
            <Network className="w-3 h-3 text-green-500" />
            <span>Sepolia</span>
          </div>
        </div>

        {/* Address */}
        {address && (
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        )}

        {/* FHE Status */}
        {!isFHEReady && (
          <div className="mt-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              ⏳ Initializing FHE encryption...
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="px-6 pt-4">
          <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background rounded-md border border-border/50"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {activeTab === 'wrap' && <WrapPanel />}
        {activeTab === 'transfer' && <TransferPanel />}
        {activeTab === 'unwrap' && <UnwrapPanel />}
      </div>
    </div>
  )
}
