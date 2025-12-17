// Main Token Manager page - integrates token pair selection and operations

'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { TokenPairSelector } from '@/components/TokenPairSelector'
import { AddTokenModal } from '@/components/AddTokenModal'
import { TokenOperationsTabs } from '@/components/TokenOperations'
import { useTokenList } from '@/hooks/useTokenList'
import type { TokenPair } from '@/hooks/useTokenList'
import { Coins } from 'lucide-react'
import { TokenBalanceCards } from '@/components/TokenBalanceCards'

export default function TokensPage() {
  const { tokenPairs, isLoading, isInitialized, error, refetch, updateSingleTokenBalance } = useTokenList()
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Auto-select first token pair when list loads
  useEffect(() => {
    if (tokenPairs.length > 0) {
      setSelectedPair(tokenPairs[0])
    }
  }, [tokenPairs, tokenPairs.length])

  // Sync selectedPair with tokenPairs updates (e.g., when balances load)
  useEffect(() => {
    if (selectedPair && tokenPairs.length > 0) {
      const updatedPair = tokenPairs.find(
        (p) => p.erc20Address.toLowerCase() === selectedPair.erc20Address.toLowerCase()
      )
      if (updatedPair) {
        setSelectedPair(updatedPair)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenPairs])

  const handleOperationComplete = useCallback(() => {
    // Refetch token list after an operation completes
    refetch()
  }, [refetch])


  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Coins className="h-8 w-8 text-blue-600" />
              Token Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your token pairs, create confidential wrappers, and perform
              private transfers
            </p>
          </div>


          {/* Token pair selector */}
          <TokenPairSelector
            tokenPairs={tokenPairs}
            selectedPair={selectedPair}
            onSelect={setSelectedPair}
            isLoading={isLoading}
            isInitialized={isInitialized}
            error={error}
            onAddToken={() => setIsAddModalOpen(true)}
          />

          {/* Main content area */}
          {selectedPair && (
            <div className="mt-8 space-y-6">
              {/* Balance cards */}
              <TokenBalanceCards tokenPair={selectedPair} />

              {/* Operations tabs */}
              <TokenOperationsTabs
                tokenPair={selectedPair}
                onOperationComplete={handleOperationComplete}
                onTokenBalanceUpdate={updateSingleTokenBalance}
              />
            </div>
          )}

          {/* Add token modal */}
          <AddTokenModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        </div>
      </div>
    </AppLayout>
  )
}
