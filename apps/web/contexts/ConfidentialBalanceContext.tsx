'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useAccount } from 'wagmi'
import { useFHEContext } from './FHEContext'
import { decryptForUser } from '@/lib/fhe'
import { readContract } from '@wagmi/core'
import { config } from '@/lib/wagmi'
import { CONTRACTS } from '@/lib/contracts'
import type { Address } from 'viem'

interface TokenBalanceState {
  encryptedBalance: string | null    // Latest encrypted balance handle from contract
  decryptedBalance: bigint | null    // Decrypted balance
  isDecrypting: boolean               // Decryption in progress
  lastFetched: number                 // Timestamp of last fetch
  error: string | null                // Decryption error
}

interface DecryptionRequirement {
  key: string
  label: string
  isMet: boolean
}

interface DecryptionRequirements {
  canDecrypt: boolean
  requirements: DecryptionRequirement[]
  missingMessage: string | null
}

interface ConfidentialBalanceContextType {
  // Get balance state for a specific token
  getBalanceState: (tokenAddress: Address) => TokenBalanceState

  // Check if decryption requirements are met
  getDecryptionRequirements: () => DecryptionRequirements

  // Fetch encrypted balance from contract and decrypt it
  fetchAndDecrypt: (tokenAddress: Address) => Promise<void>

  // Clear balance for a specific token (after operations)
  clearBalance: (tokenAddress: Address) => void

  // Clear all balances
  clearAllBalances: () => void
}

const ConfidentialBalanceContext = createContext<ConfidentialBalanceContextType | null>(null)

interface ConfidentialBalanceProviderProps {
  children: ReactNode
}

const DEFAULT_BALANCE_STATE: TokenBalanceState = {
  encryptedBalance: null,
  decryptedBalance: null,
  isDecrypting: false,
  lastFetched: 0,
  error: null,
}

export function ConfidentialBalanceProvider({ children }: ConfidentialBalanceProviderProps) {
  const { address } = useAccount()
  const { fheInstance, signer, isFHEReady } = useFHEContext()

  // Store balances by token address (lowercase)
  const [balances, setBalances] = useState<Record<string, TokenBalanceState>>({})

  // Clear all balances when wallet address changes (disconnect/switch wallet)
  React.useEffect(() => {
    setBalances({})
  }, [address])

  /**
   * Get balance state for a specific token
   */
  const getBalanceState = useCallback(
    (tokenAddress: Address): TokenBalanceState => {
      const key = tokenAddress.toLowerCase()
      return balances[key] || DEFAULT_BALANCE_STATE
    },
    [balances]
  )

  /**
   * Check if all requirements for decryption are met
   */
  const getDecryptionRequirements = useCallback((): DecryptionRequirements => {
    const requirements: DecryptionRequirement[] = [
      {
        key: 'wallet',
        label: 'Wallet connected',
        isMet: !!address,
      },
      {
        key: 'fhe',
        label: 'FHE system ready',
        isMet: isFHEReady && !!fheInstance,
      },
      {
        key: 'signer',
        label: 'Signer initialized',
        isMet: !!signer,
      },
    ]

    const missingRequirements = requirements.filter((r) => !r.isMet)
    const canDecrypt = missingRequirements.length === 0

    const missingMessage = missingRequirements.length > 0
      ? `Missing: ${missingRequirements.map((r) => r.label).join(', ')}`
      : null

    return {
      canDecrypt,
      requirements,
      missingMessage,
    }
  }, [address, isFHEReady, fheInstance, signer])

  /**
   * Fetch encrypted balance from contract and decrypt it
   */
  const fetchAndDecrypt = useCallback(
    async (tokenAddress: Address) => {
      const key = tokenAddress.toLowerCase()

      // Check requirements first
      const { canDecrypt, missingMessage } = getDecryptionRequirements()

      if (!canDecrypt) {
        console.error('Cannot decrypt: missing requirements', {
          address,
          isFHEReady,
          fheInstance: !!fheInstance,
          signer: !!signer,
        })

        // Set user-friendly error message to state
        setBalances((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            isDecrypting: false,
            error: missingMessage || 'Cannot decrypt: missing required conditions',
          },
        }))
        return
      }

      // Set decrypting state
      setBalances((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isDecrypting: true,
          error: null,
        },
      }))

      try {
        // Step 1: Fetch latest encrypted balance from contract
        console.log(`📡 Fetching encrypted balance for ${tokenAddress}...`)
        const encryptedBalance = await readContract(config, {
          address: tokenAddress,
          abi: CONTRACTS.cUSD_ERC7984.abi,
          functionName: 'confidentialBalanceOf',
          args: [address!],
        })

        console.log(`✅ Got encrypted balance: ${encryptedBalance}`)

        // Step 2: Decrypt the balance
        let decryptedBalance: bigint

        // Check if balance is zero (special case)
        if (
          encryptedBalance === '0x0000000000000000000000000000000000000000000000000000000000000000' ||
          !encryptedBalance
        ) {
          decryptedBalance = BigInt(0)
          console.log('Balance is zero (no decryption needed)')
        } else {
          console.log('🔓 Decrypting balance...')
          decryptedBalance = await decryptForUser(
            fheInstance!, // Add non-null assertion here
            encryptedBalance as string,
            tokenAddress,
            signer! // Also ensure signer is not null, as it's checked by canDecrypt
          )
          console.log(`✅ Decrypted balance: ${decryptedBalance}`)
        }

        // Step 3: Store the result
        setBalances((prev) => ({
          ...prev,
          [key]: {
            encryptedBalance: encryptedBalance as string,
            decryptedBalance,
            isDecrypting: false,
            lastFetched: Date.now(),
            error: null,
          },
        }))
      } catch (error) {
        console.error(`Failed to fetch and decrypt balance for ${tokenAddress}:`, error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to decrypt balance'

        setBalances((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            isDecrypting: false,
            error: errorMessage,
          },
        }))
      }
    },
    [address, isFHEReady, fheInstance, signer, getDecryptionRequirements]
  )

  /**
   * Clear balance for a specific token (after operations like wrap/unwrap/transfer)
   */
  const clearBalance = useCallback((tokenAddress: Address) => {
    const key = tokenAddress.toLowerCase()
    console.log(`🗑️ Clearing balance for ${tokenAddress}`)

    setBalances((prev) => {
      const newBalances = { ...prev }
      delete newBalances[key]
      return newBalances
    })
  }, [])

  /**
   * Clear all balances (e.g., when wallet disconnects)
   */
  const clearAllBalances = useCallback(() => {
    console.log('🗑️ Clearing all balances')
    setBalances({})
  }, [])

  const contextValue: ConfidentialBalanceContextType = {
    getBalanceState,
    getDecryptionRequirements,
    fetchAndDecrypt,
    clearBalance,
    clearAllBalances,
  }

  return (
    <ConfidentialBalanceContext.Provider value={contextValue}>
      {children}
    </ConfidentialBalanceContext.Provider>
  )
}

export function useConfidentialBalance() {
  const context = useContext(ConfidentialBalanceContext)
  if (!context) {
    throw new Error('useConfidentialBalance must be used within a ConfidentialBalanceProvider')
  }
  return context
}
