import { useState, useCallback } from 'react'
import { createPublicClient, http, type Address } from 'viem'
import { sepolia } from 'viem/chains'
import {ERC20ABI} from '@shieldkit/react'

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export interface TokenInfo {
  address: Address
  name: string
  symbol: string
  decimals: number
}

export function useTokenValidator() {
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateToken = useCallback(async (tokenAddress: string): Promise<TokenInfo> => {
    setIsValidating(true)
    setValidationError(null)

    try {
      // Basic address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
        throw new Error('Invalid Ethereum address format')
      }

      const address = tokenAddress as Address

      // Try to fetch token metadata from contract
      const [name, symbol, decimals] = await Promise.all([
        publicClient.readContract({
          address,
          abi: ERC20ABI,
          functionName: 'name',
        }),
        publicClient.readContract({
          address,
          abi: ERC20ABI,
          functionName: 'symbol',
        }),
        publicClient.readContract({
          address,
          abi: ERC20ABI,
          functionName: 'decimals',
        }),
      ])

      if (!symbol) {
        throw new Error('Not a valid ERC20 token')
      }

      return {
        address,
        name: name || 'Unknown',
        symbol,
        decimals: Number(decimals),
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to validate token'
      setValidationError(errorMessage)
      throw new Error(errorMessage)
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
