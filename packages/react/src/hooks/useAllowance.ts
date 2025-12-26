/**
 * useAllowance Hook
 *
 * React hook for checking ERC20 token allowance
 */

import { useReadContract } from 'wagmi'
import { type Address } from 'viem'
import { ERC20ABI } from '../abis'

/**
 * Allowance check parameters
 */
export interface UseAllowanceParams {
  /** Address of the ERC20 token */
  tokenAddress?: Address
  /** Address of the spender (usually the wrapper contract) */
  spenderAddress?: Address
  /** Owner address (defaults to connected wallet) */
  ownerAddress?: Address
}

/**
 * Allowance check return type
 */
export interface UseAllowanceReturn {
  /** Current allowance amount in wei */
  allowance: bigint | undefined
  /** Whether the allowance query is loading */
  isLoading: boolean
  /** Refetch the allowance */
  refetch: () => void
}

/**
 * Hook for checking ERC20 token allowance
 *
 * This hook queries the current allowance that a spender has
 * to spend tokens on behalf of the owner.
 *
 * @param params - Allowance parameters
 * @returns Allowance state
 *
 * @example
 * ```tsx
 * const { allowance, isLoading, refetch } = useAllowance({
 *   tokenAddress: '0xToken...',
 *   spenderAddress: '0xWrapper...',
 *   ownerAddress: '0xUser...'
 * })
 *
 * if (allowance && allowance < parseUnits('100', 6)) {
 *   console.log('Need to approve more tokens')
 * }
 * ```
 */
export function useAllowance(
  params: UseAllowanceParams = {},
): UseAllowanceReturn {
  const { tokenAddress, spenderAddress, ownerAddress } = params

  const {
    data: allowance,
    refetch,
    isLoading,
  } = useReadContract({
    address: tokenAddress,
    abi: ERC20ABI,
    functionName: 'allowance',
    args:
      ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!spenderAddress && !!ownerAddress,
    },
  })

  return {
    allowance,
    isLoading,
    refetch,
  }
}
