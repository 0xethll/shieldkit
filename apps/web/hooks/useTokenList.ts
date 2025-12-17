// Hook for fetching and managing token pairs list
// Integrates Alchemy API for token balances and Factory contract for wrapped tokens

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { MAINSTREAM_TOKENS, getMainstreamTokenInfo } from '@/lib/tokens'
import { useCustomTokens } from '@/contexts/CustomTokensContext'
import { CONTRACTS } from '@/lib/contracts'
import type { Address } from 'viem'
import { readContract } from '@wagmi/core'
import { config } from '@/lib/wagmi'
import { alchemyClient } from '@/lib/alchemy'

export interface TokenPair {
  // ERC20 token info
  erc20Address: Address
  erc20Name: string
  erc20Symbol: string
  erc20Decimals: number
  erc20Balance: bigint

  // Wrapped confidential token info
  wrappedAddress: Address | null // null = not created yet
  wrappedBalance: string | null // encrypted balance handle (bytes32)

  // UI state
  isMainstream: boolean
  isCustom: boolean
}

/**
 * Main hook for fetching token pairs list
 * Optimized: loads token list immediately, then fetches balances asynchronously
 */
export function useTokenList() {
  const { address, isConnected } = useAccount()
  const { customTokens } = useCustomTokens()
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false) // Track if initial load completed
  const [error, setError] = useState<string | null>(null)

  const fetchTokenPairs = useCallback(async () => {
    console.log('🚩 Starting Fetching Token Pairs')

    setIsLoading(true)
    setError(null)

    try {
      // 1. Get all token addresses (mainstream + custom)
      const allTokenAddresses = [
        ...MAINSTREAM_TOKENS.map((t) => t.address),
        ...customTokens,
      ]

      // 2. Immediately create skeleton token pairs with known info
      // This happens even without wallet connection
      const initialPairs: TokenPair[] = allTokenAddresses.map((tokenAddress) => {
        const tokenInfo = getMainstreamTokenInfo(tokenAddress)

        if (tokenInfo) {
          // Mainstream token - we have all info
          return {
            erc20Address: tokenAddress as Address,
            erc20Name: tokenInfo.name,
            erc20Symbol: tokenInfo.symbol,
            erc20Decimals: tokenInfo.decimals,
            erc20Balance: BigInt(0), // Will be updated if wallet connected
            wrappedAddress: null, // Will be updated async
            wrappedBalance: null,
            isMainstream: true,
            isCustom: false,
          }
        } else {
          // Custom token - use placeholders
          return {
            erc20Address: tokenAddress as Address,
            erc20Name: 'Loading...',
            erc20Symbol: 'LOADING',
            erc20Decimals: 18,
            erc20Balance: BigInt(0), // Will be updated if wallet connected
            wrappedAddress: null, // Will be updated async
            wrappedBalance: null,
            isMainstream: false,
            isCustom: true,
          }
        }
      })

      setTokenPairs(initialPairs)
      setIsLoading(false) // UI can render now
      setIsInitialized(true) // Mark as initialized
      console.log('✅ Initial pairs displayed:', initialPairs.length)

      // If no wallet connected, stop here - user can see token list but no balances
      if (!address) {
        console.log('⚠️ No wallet connected - showing tokens without balances')
        return
      }

      console.log('🔄 Wallet connected - fetching balances...')

      // 4. Fetch ERC20 balances asynchronously (single batch call - fast)
      const balancesPromise = alchemyClient.core.getTokenBalances(address, allTokenAddresses)

      // 5. Fetch metadata for custom tokens asynchronously (parallel)
      const metadataPromises = allTokenAddresses.map(async (tokenAddress) => {
        const tokenInfo = getMainstreamTokenInfo(tokenAddress)
        if (tokenInfo) return { address: tokenAddress, info: tokenInfo }

        try {
          const metadata = await alchemyClient.core.getTokenMetadata(tokenAddress)
          return {
            address: tokenAddress,
            info: {
              address: tokenAddress,
              name: metadata.name || 'Unknown Token',
              symbol: metadata.symbol || 'UNKNOWN',
              decimals: metadata.decimals || 18,
              isMainstream: false,
            },
          }
        } catch (err) {
          console.error(`Failed to fetch metadata for ${tokenAddress}:`, err)
          return {
            address: tokenAddress,
            info: {
              address: tokenAddress,
              name: 'Unknown Token',
              symbol: 'UNKNOWN',
              decimals: 18,
              isMainstream: false,
            },
          }
        }
      })

      // 6. Fetch wrapped addresses asynchronously (parallel)
      const wrappedAddressPromises = allTokenAddresses.map((tokenAddress) =>
        getWrappedAddress(tokenAddress as Address).then((wrapped) => ({
          erc20Address: tokenAddress,
          wrappedAddress: wrapped,
        }))
      )

      // 7. Wait for all async operations and update progressively
      const [balances, metadataResults, wrappedResults] = await Promise.all([
        balancesPromise,
        Promise.all(metadataPromises),
        Promise.all(wrappedAddressPromises),
      ])

      // 8. Create metadata map for quick lookup
      const metadataMap = new Map(
        metadataResults.map((r) => [r.address.toLowerCase(), r.info])
      )

      // 9. Create wrapped address map for quick lookup
      const wrappedMap = new Map(
        wrappedResults.map((r) => [r.erc20Address.toLowerCase(), r.wrappedAddress])
      )

      // 10. Fetch wrapped balances for tokens that have wrappers (parallel)
      const wrappedBalancePromises = wrappedResults
        .filter((r) => r.wrappedAddress)
        .map((r) =>
          getWrappedBalance(r.wrappedAddress!, address).then((balance) => ({
            wrappedAddress: r.wrappedAddress!,
            balance,
          }))
        )

      const wrappedBalances = await Promise.all(wrappedBalancePromises)
      const wrappedBalanceMap = new Map(
        wrappedBalances.map((r) => [r.wrappedAddress.toLowerCase(), r.balance])
      )

      // 11. Build final pairs with all data
      const finalPairs: TokenPair[] = balances.tokenBalances.map((balance) => {
        const tokenAddress = balance.contractAddress.toLowerCase()
        const tokenInfo = metadataMap.get(tokenAddress)!
        const wrappedAddress = wrappedMap.get(tokenAddress)
        const wrappedBalance = wrappedAddress
          ? wrappedBalanceMap.get(wrappedAddress.toLowerCase())
          : null

        return {
          erc20Address: balance.contractAddress as Address,
          erc20Name: tokenInfo.name,
          erc20Symbol: tokenInfo.symbol,
          erc20Decimals: tokenInfo.decimals,
          erc20Balance: BigInt(balance.tokenBalance || '0'),
          wrappedAddress: wrappedAddress || null,
          wrappedBalance: wrappedBalance || null,
          isMainstream: tokenInfo.isMainstream || false,
          isCustom: customTokens.includes(tokenAddress),
        }
      })

      // 12. Sort: mainstream first, then by balance
      finalPairs.sort((a, b) => {
        if (a.isMainstream !== b.isMainstream) {
          return a.isMainstream ? -1 : 1
        }
        if (a.erc20Balance !== b.erc20Balance) {
          return a.erc20Balance > b.erc20Balance ? -1 : 1
        }
        return -1
      })

      // 13. Update with complete data
      setTokenPairs(finalPairs)
    } catch (err) {
      console.error('Failed to fetch token pairs:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch token list'
      setError(errorMessage)
      setIsLoading(false)
      setIsInitialized(true) // Mark as initialized even on error
    }
  }, [address, customTokens])

  /**
   * Update balance for a single ERC20 token (optimized for single token updates)
   */
  const updateSingleTokenBalance = useCallback(
    async (erc20Address: Address) => {
      if (!address) return

      try {
        // Fetch balance for single token
        const balanceResult = await alchemyClient.core.getTokenBalances(address, [erc20Address])
        const balance = balanceResult.tokenBalances[0]

        if (balance) {
          // Update the specific token pair in state
          setTokenPairs((prev) =>
            prev.map((pair) =>
              pair.erc20Address.toLowerCase() === erc20Address.toLowerCase()
                ? { ...pair, erc20Balance: BigInt(balance.tokenBalance || '0') }
                : pair
            )
          )
          console.log(`✅ Updated balance for ${erc20Address}`)
        }
      } catch (error) {
        console.error(`Failed to update balance for ${erc20Address}:`, error)
      }
    },
    [address]
  )

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchTokenPairs()
  }, [fetchTokenPairs])

  return {
    tokenPairs,
    isLoading,
    isInitialized,
    error,
    refetch: fetchTokenPairs,
    updateSingleTokenBalance,
  }
}

/**
 * Helper: Get wrapped token address from factory
 */
async function getWrappedAddress(erc20Address: Address): Promise<Address | null> {
  try {
    const result = await readContract(config, {
      address: CONTRACTS.ConfidentialTokenFactory.address,
      abi: CONTRACTS.ConfidentialTokenFactory.abi,
      functionName: 'getConfidentialToken',
      args: [erc20Address],
    })

    // Check if wrapped token exists (not 0x0)
    if (result && result !== '0x0000000000000000000000000000000000000000') {
      return result as Address
    }

    return null
  } catch (error) {
    console.error(`Failed to get wrapped address for ${erc20Address}:`, error)
    return null
  }
}

/**
 * Helper: Get wrapped token balance
 */
async function getWrappedBalance(
  wrappedAddress: Address,
  userAddress: Address
): Promise<string | null> {
  try {
    const result = await readContract(config, {
      address: wrappedAddress,
      abi: CONTRACTS.cUSD_ERC7984.abi, // Use the ERC7984 ABI
      functionName: 'confidentialBalanceOf',
      args: [userAddress],
    })

    return result as string
  } catch (error) {
    console.error(`Failed to get wrapped balance for ${wrappedAddress}:`, error)
    return null
  }
}

/**
 * Hook for validating and adding custom tokens
 */
export function useTokenValidator() {
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateToken = useCallback(async (tokenAddress: string) => {
    setIsValidating(true)
    setValidationError(null)

    try {
      // Basic address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
        throw new Error('Invalid Ethereum address format')
      }

      // Try to fetch token metadata
      const metadata = await alchemyClient.core.getTokenMetadata(tokenAddress)

      if (!metadata.symbol) {
        throw new Error('Not a valid ERC20 token')
      }

      return {
        address: tokenAddress as Address,
        name: metadata.name || 'Unknown',
        symbol: metadata.symbol,
        decimals: metadata.decimals || 18,
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to validate token'
      setValidationError(errorMessage)
      throw err
    } finally {
      setIsValidating(false)
    }
  }, [])

  return {
    validateToken,
    isValidating,
    validationError,
  }
}
