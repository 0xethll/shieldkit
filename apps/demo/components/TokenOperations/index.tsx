// Tabbed interface for Wrap, Unwrap, and Transfer operations

'use client'

import { useState } from 'react'
import { WrapTab } from './WrapTab'
import { UnwrapTab } from './UnwrapTab'
import { TransferTab } from './TransferTab'
import type { TabType, TokenOperationsTabsProps } from './types'

export function TokenOperationsTabs({
  tokenPair,
  onOperationComplete,
  onTokenBalanceUpdate,
}: TokenOperationsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('wrap')

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('wrap')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'wrap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Wrap
          </button>
          <button
            onClick={() => setActiveTab('unwrap')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'unwrap'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Unwrap
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'transfer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Transfer
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'wrap' && (
        <WrapTab tokenPair={tokenPair} onComplete={onOperationComplete} />
      )}
      {activeTab === 'unwrap' && (
        <UnwrapTab
          tokenPair={tokenPair}
          onComplete={onOperationComplete}
          onTokenBalanceUpdate={onTokenBalanceUpdate}
        />
      )}
      {activeTab === 'transfer' && (
        <TransferTab tokenPair={tokenPair} onComplete={onOperationComplete} />
      )}
    </div>
  )
}
