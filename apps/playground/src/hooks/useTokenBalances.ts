import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { alchemyClient, isAlchemyAvailable } from '../lib/alchemy'
import type { TokenConfig } from '../config/scenarios'

/**
 * Hook for managing ERC20 token balances
 *
 * Features:
 * - Batch query using Alchemy API
 * - Single token updates after operations
 */
export function useTokenBalances(tokens: TokenConfig[]) {
  const { address } = useAccount()
  const [balances, setBalances] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fetch balances for all tokens using Alchemy API
   */
  const fetchBalances = useCallback(async () => {
    if (!address || tokens.length === 0) {
      // Clear balances if no wallet connected
      setBalances({})
      return
    }

    setIsLoading(true)

    try {
      if (isAlchemyAvailable && alchemyClient) {
        // Real Alchemy API query
        console.log('📡 Fetching token balances from Alchemy...')

        const tokenAddresses = tokens.map(t => t.address)
        const result = await alchemyClient.core.getTokenBalances(address, tokenAddresses)

        const newBalances: Record<string, string> = {}

        result.tokenBalances.forEach((balance, index) => {
          const token = tokens[index]
          if (token) {
            const balanceValue = BigInt(balance.tokenBalance || '0')
            const formatted = formatUnits(balanceValue, token.decimals)

            // Format to 2 decimal places
            newBalances[token.symbol] = parseFloat(formatted).toFixed(4)
          }
        })

        console.log('✅ Balances fetched:', newBalances)
        setBalances(newBalances)
      }
    } catch (error) {
      console.error('Failed to fetch token balances:', error)
    } finally {
      setIsLoading(false)
    }
  }, [address, tokens])

  // Fetch balances on mount and when address/tokens change
  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  /**
   * Update a single token balance (fetch from Alchemy)
   * Used after operations like wrap to update specific token
   */
  const updateBalance = useCallback(async (tokenSymbol: string) => {
    if (!address) return

    const token = tokens.find(t => t.symbol === tokenSymbol)
    if (!token) return

    try {
      if (isAlchemyAvailable && alchemyClient) {
        console.log(`💰 Updating balance for ${tokenSymbol}...`)

        const result = await alchemyClient.core.getTokenBalances(address, [token.address])
        const balanceValue = BigInt(result.tokenBalances[0]?.tokenBalance || '0')
        const formatted = formatUnits(balanceValue, token.decimals)
        const newBalance = parseFloat(formatted).toFixed(4)

        setBalances((prev) => ({
          ...prev,
          [tokenSymbol]: newBalance,
        }))

        console.log(`✅ Updated ${tokenSymbol} balance: ${newBalance}`)
      }
    } catch (error) {
      console.error(`Failed to update balance for ${tokenSymbol}:`, error)
    }
  }, [address, tokens])

  /**
   * Get balance for a specific token symbol
   */
  const getBalance = useCallback((tokenSymbol: string): string | null => {
    return balances[tokenSymbol] || null
  }, [balances])

  return {
    balances,
    isLoading,
    getBalance,
    updateBalance,
    refetch: fetchBalances,
  }
}
