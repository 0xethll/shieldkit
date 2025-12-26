import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import type { Address } from 'viem'

interface TokenBalanceState {
  // Decryption state (cached)
  decryptedBalance: bigint | null     // Decrypted balance
  lastFetched: number                 // Timestamp of last fetch
}

interface ConfidentialBalanceContextType {
  // Get cached decrypted balance for a specific ERC20 token
  getDecryptedBalance: (erc20Address: Address) => bigint | null

  // Cache a decrypted balance (for demo or after real decryption)
  cacheDecryptedBalance: (erc20Address: Address, balance: bigint) => void

  // Clear cached balance for a specific token (after operations)
  clearBalance: (erc20Address: Address) => void

  // Clear all cached balances
  clearAllBalances: () => void
}

const ConfidentialBalanceContext = createContext<ConfidentialBalanceContextType | null>(null)

interface ConfidentialBalanceProviderProps {
  children: ReactNode
}

export function ConfidentialBalanceProvider({ children }: ConfidentialBalanceProviderProps) {
  // Store cached decrypted balances by ERC20 token address (lowercase)
  const [balances, setBalances] = useState<Record<string, TokenBalanceState>>({})

  /**
   * Get cached decrypted balance for a specific ERC20 token
   */
  const getDecryptedBalance = useCallback(
    (erc20Address: Address): bigint | null => {
      const key = erc20Address.toLowerCase()
      return balances[key]?.decryptedBalance || null
    },
    [balances]
  )

  /**
   * Cache a decrypted balance for a specific ERC20 token
   * Can be used for demo mode or after real FHE decryption
   */
  const cacheDecryptedBalance = useCallback((erc20Address: Address, balance: bigint) => {
    const key = erc20Address.toLowerCase()

    console.log(`💾 Caching decrypted balance for ${erc20Address}: ${balance}`)

    setBalances((prev) => ({
      ...prev,
      [key]: {
        decryptedBalance: balance,
        lastFetched: Date.now(),
      },
    }))
  }, [])

  /**
   * Clear balance for a specific token (after operations like wrap/unwrap/transfer)
   */
  const clearBalance = useCallback((erc20Address: Address) => {
    const key = erc20Address.toLowerCase()
    console.log(`🗑️ Clearing balance for ${erc20Address}`)

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
    getDecryptedBalance,
    cacheDecryptedBalance,
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
