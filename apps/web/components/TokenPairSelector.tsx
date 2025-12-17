// Component for selecting a token pair from the dropdown list

'use client'

import { useState } from 'react'
import { ChevronDown, Plus, Coins, AlertCircle, Loader2, X } from 'lucide-react'
import { formatUnits } from 'viem'
import type { TokenPair } from '@/hooks/useTokenList'
import { useCustomTokens } from '@/contexts/CustomTokensContext'
import { TokenPairIcon } from './TokenIcon'

interface TokenPairSelectorProps {
  tokenPairs: TokenPair[]
  selectedPair: TokenPair | null
  onSelect: (pair: TokenPair) => void
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  onAddToken: () => void
}

export function TokenPairSelector({
  tokenPairs,
  selectedPair,
  onSelect,
  isLoading,
  isInitialized,
  error,
  onAddToken,
}: TokenPairSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { removeToken } = useCustomTokens()

  const handleRemoveCustomToken = (e: React.MouseEvent, tokenAddress: string) => {
    e.stopPropagation()
    removeToken(tokenAddress)
    // Don't call refetch - let React's dependency chain handle the update
    // when customTokens state changes, useTokenList will automatically refetch
  }

  // Group tokens by type
  const mainstreamTokens = tokenPairs.filter((p) => p.isMainstream)
  const customTokens = tokenPairs.filter((p) => p.isCustom)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Select Token Pair</h2>
        <button
          onClick={onAddToken}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Token
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!isInitialized ? (
        // Show skeleton loading when initially loading (before first load completes)
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isInitialized && tokenPairs.length === 0 ? (
        // Show empty state only when initialized and no tokens found
        <div className="p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-center">
          <Coins className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tokens found. Add a custom token to get started.
          </p>
          <button
            onClick={onAddToken}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Add Your First Token
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Selected token display */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex items-center justify-between"
          >
            {selectedPair ? (
              <div className="flex items-center gap-3 flex-1">
                {/* Token icons */}
                <TokenPairIcon
                  symbol={selectedPair.erc20Symbol}
                  hasConfidential={!!selectedPair.wrappedAddress}
                  size="md"
                />

                {/* Token info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {selectedPair.erc20Symbol} ↔ c{selectedPair.erc20Symbol}
                    </span>
                    {selectedPair.isMainstream && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        Mainstream
                      </span>
                    )}
                    {selectedPair.isCustom && (
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatUnits(selectedPair.erc20Balance, selectedPair.erc20Decimals)}{' '}
                    {selectedPair.erc20Symbol}
                    {selectedPair.wrappedAddress && (
                      <span className="ml-2">| {selectedPair.wrappedBalance ? '✓' : '0'} c{selectedPair.erc20Symbol}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Select a token pair...</span>
            )}
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown list */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {/* Mainstream tokens section */}
              {mainstreamTokens.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    Mainstream Tokens
                  </div>
                  {mainstreamTokens.map((pair) => (
                    <button
                      key={pair.erc20Address}
                      onClick={() => {
                        onSelect(pair)
                        setIsOpen(false)
                      }}
                      className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {/* Token icons */}
                        <TokenPairIcon
                          symbol={pair.erc20Symbol}
                          hasConfidential={!!pair.wrappedAddress}
                          size="sm"
                        />

                        {/* Token info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">
                              {pair.erc20Symbol} ↔ c{pair.erc20Symbol}
                            </span>
                            {pair.wrappedAddress && (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                ✓ Ready
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatUnits(pair.erc20Balance, pair.erc20Decimals)}{' '}
                            {pair.erc20Symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {pair.erc20Name}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Custom tokens section */}
              {customTokens.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    Custom Tokens
                  </div>
                  {customTokens.map((pair) => (
                    <button
                      key={pair.erc20Address}
                      onClick={() => {
                        onSelect(pair)
                        setIsOpen(false)
                      }}
                      className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0 group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Token icons */}
                        <TokenPairIcon
                          symbol={pair.erc20Symbol}
                          hasConfidential={!!pair.wrappedAddress}
                          size="sm"
                        />

                        {/* Token info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">
                              {pair.erc20Symbol} ↔ c{pair.erc20Symbol}
                            </span>
                            <div className="flex items-center gap-2">
                              {pair.wrappedAddress && (
                                <span className="text-xs text-green-600 dark:text-green-400">
                                  ✓ Ready
                                </span>
                              )}
                              <button
                                onClick={(e) => handleRemoveCustomToken(e, pair.erc20Address)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-opacity"
                                title="Remove token"
                              >
                                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatUnits(pair.erc20Balance, pair.erc20Decimals)}{' '}
                            {pair.erc20Symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {pair.erc20Name}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
