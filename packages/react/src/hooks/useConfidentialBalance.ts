/**
 * useConfidentialBalance Hook
 *
 * React hook for querying and decrypting confidential token balances
 */

import { useState, useCallback, useEffect } from 'react'
import { useReadContract, useAccount, useConfig } from 'wagmi'
import { type Address } from 'viem'
import { useFHEContext } from '../context/FHEContext'
import { decryptForUser } from '@shieldkit/core'
import { ConfidentialERC20WrapperABI } from '../abis'
import { getEthersSigner } from '../utils/client-to-signer'
import { useWrappedTokenAddress } from './useFactory'

/**
 * Parameters for useConfidentialBalance
 */
export interface UseConfidentialBalanceParams {
  /** Address of the wrapped confidential token */
  wrappedAddress?: Address
  /** Address of the user to query balance for */
  userAddress?: Address
  /** Whether to enable the query (default: true) */
  enabled?: boolean
}

/**
 * Return type for useConfidentialBalance
 */
export interface UseConfidentialBalanceReturn {
  /** Encrypted balance handle from contract */
  encryptedBalance: string | null
  /** Decrypted balance in cleartext */
  decryptedBalance: bigint | null
  /** Whether encrypted balance is being loaded */
  isLoadingEncrypted: boolean
  /** Whether decryption is in progress */
  isDecrypting: boolean
  /** Error message if any operation failed */
  error: string | null
  /** Function to decrypt the encrypted balance */
  decrypt: () => Promise<void>
  /** Function to refetch the encrypted balance */
  refetch: () => void
}

/**
 * Hook for querying and decrypting confidential token balances
 *
 * This hook provides access to:
 * 1. Encrypted balance from the contract (confidentialBalanceOf)
 * 2. Decryption functionality to get cleartext balance
 * 3. Loading and error states
 *
 * @param params - Configuration parameters
 * @returns Balance query state and decryption function
 *
 * @example
 * ```tsx
 * const {
 *   encryptedBalance,
 *   decryptedBalance,
 *   decrypt,
 *   isDecrypting
 * } = useConfidentialBalance({
 *   wrappedAddress: '0x...',
 *   userAddress: address,
 *   enabled: true
 * })
 *
 * // Manually trigger decryption when needed
 * const handleDecrypt = async () => {
 *   await decrypt()
 * }
 * ```
 */
export function useConfidentialBalance({
  wrappedAddress,
  userAddress,
  enabled = true,
}: UseConfidentialBalanceParams): UseConfidentialBalanceReturn {
  const config = useConfig()

  // Query encrypted balance from contract
  const {
    data: encryptedBalance,
    refetch,
    isLoading,
  } = useReadContract({
    address: wrappedAddress,
    abi: ConfidentialERC20WrapperABI,
    functionName: 'confidentialBalanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: enabled && !!wrappedAddress && !!userAddress,
    },
  })

  // Decryption state management
  const [decryptedBalance, setDecryptedBalance] = useState<bigint | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { fheInstance, isFHEReady } = useFHEContext()

  /**
   * Decrypt the encrypted balance
   * Requires FHE instance and user signature
   */
  const decrypt = useCallback(async () => {
    if (!encryptedBalance || !wrappedAddress || !userAddress) {
      setError('Missing required parameters for decryption')
      return
    }

    if (!isFHEReady || !fheInstance) {
      setError('FHE instance not ready')
      return
    }

    setIsDecrypting(true)
    setError(null)

    try {
      console.log('🔓 Decrypting balance...')

      // Get ethers signer for signature
      const signer = await getEthersSigner(config)

      // Decrypt using FHE
      const decrypted = await decryptForUser(
        fheInstance,
        encryptedBalance as string,
        wrappedAddress,
        signer,
      )

      console.log('✅ Balance decrypted:', decrypted)
      setDecryptedBalance(decrypted)
    } catch (err) {
      console.error('❌ Decryption failed:', err)
      const errorMessage = err instanceof Error ? err.message : 'Decryption failed'
      setError(errorMessage)
    } finally {
      setIsDecrypting(false)
    }
  }, [encryptedBalance, wrappedAddress, userAddress, isFHEReady, fheInstance, config])

  // Clear decrypted balance when encrypted balance changes
  useEffect(() => {
    setDecryptedBalance(null)
  }, [encryptedBalance])

  return {
    encryptedBalance: encryptedBalance as string | null,
    decryptedBalance,
    isLoadingEncrypted: isLoading,
    isDecrypting,
    error,
    decrypt,
    refetch,
  }
}

/**
 * Parameters for useConfidentialBalanceFor
 */
export interface UseConfidentialBalanceForParams {
  /** Address of the ERC20 token */
  erc20Address?: Address
  /** Chain ID to query (defaults to current wallet chain) */
  chainId?: number
  /** Whether to automatically decrypt when encrypted balance is available */
  autoDecrypt?: boolean
}

/**
 * Return type for useConfidentialBalanceFor
 */
export interface UseConfidentialBalanceForReturn {
  /** Address of the wrapped confidential token */
  wrappedAddress: Address | null
  /** Whether wrapped address is being loaded */
  isLoadingWrapped: boolean
  /** Encrypted balance handle from contract */
  encryptedBalance: string | null
  /** Decrypted balance in cleartext */
  decryptedBalance: bigint | null
  /** Whether encrypted balance is being loaded */
  isLoadingEncrypted: boolean
  /** Whether decryption is in progress */
  isDecrypting: boolean
  /** Error message if any operation failed */
  error: string | null
  /** Function to decrypt the encrypted balance */
  decrypt: () => Promise<void>
  /** Function to refetch both wrapped address and balance */
  refetch: () => void
}

/**
 * Convenience hook that combines wrapped address lookup and balance query
 *
 * This hook automatically:
 * 1. Looks up the wrapped token address for an ERC20 token
 * 2. Queries the confidential balance for that wrapped token
 * 3. Optionally auto-decrypts the balance
 *
 * @param params - Configuration parameters
 * @returns Combined wrapped address and balance state
 *
 * @example
 * ```tsx
 * const {
 *   wrappedAddress,
 *   encryptedBalance,
 *   decryptedBalance,
 *   decrypt,
 *   isDecrypting
 * } = useConfidentialBalanceFor({
 *   erc20Address: '0xERC20TokenAddress...',
 *   chainId: CHAIN_IDS.SEPOLIA,
 *   autoDecrypt: false
 * })
 *
 * // Manually decrypt when user clicks
 * <button onClick={decrypt} disabled={isDecrypting}>
 *   Decrypt Balance
 * </button>
 * ```
 *
 * @example With auto-decrypt
 * ```tsx
 * // Automatically decrypt when balance is available
 * const balance = useConfidentialBalanceFor({
 *   erc20Address: tokenAddress,
 *   autoDecrypt: true
 * })
 *
 * // decryptedBalance will be populated automatically
 * {balance.decryptedBalance && (
 *   <div>Balance: {formatTokenAmount(balance.decryptedBalance)}</div>
 * )}
 * ```
 */
export function useConfidentialBalanceFor({
  erc20Address,
  chainId,
  autoDecrypt = false,
}: UseConfidentialBalanceForParams): UseConfidentialBalanceForReturn {
  const { address, chainId: walletChainId } = useAccount()
  const effectiveChainId = chainId || walletChainId

  // 1. Look up wrapped token address
  const {
    wrappedAddress,
    refetch: refetchWrapped,
    isLoading: isLoadingWrapped,
  } = useWrappedTokenAddress(erc20Address, effectiveChainId)

  // 2. Query balance
  const balanceQuery = useConfidentialBalance({
    wrappedAddress: wrappedAddress || undefined,
    userAddress: address,
    enabled: !!wrappedAddress,
  })

  // 3. Auto-decrypt if enabled and balance is available
  useEffect(() => {
    if (
      autoDecrypt &&
      balanceQuery.encryptedBalance &&
      !balanceQuery.decryptedBalance &&
      !balanceQuery.isDecrypting
    ) {
      balanceQuery.decrypt()
    }
  }, [autoDecrypt, balanceQuery.encryptedBalance, balanceQuery.decryptedBalance])

  // Combined refetch function
  const refetch = useCallback(() => {
    refetchWrapped()
    balanceQuery.refetch()
  }, [refetchWrapped, balanceQuery])

  return {
    wrappedAddress,
    isLoadingWrapped,
    encryptedBalance: balanceQuery.encryptedBalance,
    decryptedBalance: balanceQuery.decryptedBalance,
    isLoadingEncrypted: balanceQuery.isLoadingEncrypted,
    isDecrypting: balanceQuery.isDecrypting,
    error: balanceQuery.error,
    decrypt: balanceQuery.decrypt,
    refetch,
  }
}
