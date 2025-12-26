import { useMemo } from 'react'
import { useAccount, useReadContracts } from 'wagmi'
import { formatUnits, erc20Abi, type Address } from 'viem'
import type { TokenConfig } from '../components/types'

export interface TokenBalance {
  symbol: string
  value: bigint
  decimals: number
  formatted: string
}

/**
 * Hook to fetch balances for multiple ERC20 tokens in a single batch request
 *
 * @param tokens - Array of token configurations to fetch balances for
 * @returns Record of token symbol to balance info, plus loading/error states
 *
 * @example
 * ```tsx
 * const { balances, isLoading } = useMultiTokenBalances(tokens)
 *
 * // Access balance by symbol
 * const usdcBalance = balances['USDC']
 * console.log(usdcBalance?.formatted) // "100.5"
 * ```
 */
export function useMultiTokenBalances(tokens: TokenConfig[]) {
  const { address: userAddress } = useAccount()

  // Create contracts array for batch reading
  const contracts = useMemo(() => {
    if (!userAddress || !tokens.length) return []

    return tokens.map((token) => ({
      address: token.address as Address,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: [userAddress] as const,
    }))
  }, [tokens, userAddress])

  // Batch fetch all balances
  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: !!userAddress && tokens.length > 0,
      refetchInterval: 10_000, // Refetch every 10 seconds
    },
  })

  // Transform results into a Record<symbol, balance>
  const balances = useMemo(() => {
    if (!data || !tokens.length) return {}

    const balanceMap: Record<string, TokenBalance> = {}

    tokens.forEach((token, index) => {
      const result = data[index]

      if (result?.status === 'success' && result.result !== undefined) {
        const value = result.result as bigint
        const formatted = formatUnits(value, token.decimals)

        balanceMap[token.symbol] = {
          symbol: token.symbol,
          value,
          decimals: token.decimals,
          formatted,
        }
      }
    })

    return balanceMap
  }, [data, tokens])

  return {
    balances,
    isLoading,
    isError,
    refetch,
  }
}
