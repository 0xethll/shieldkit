'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { isMainstreamToken } from '@/lib/tokens'

const STORAGE_KEY = 'zama-custom-tokens'

interface CustomTokensStorage {
  tokens: string[] // Array of token addresses (lowercase)
  addedAt: number[] // Timestamps when each token was added
}

interface CustomTokensContextType {
  customTokens: string[]
  isLoading: boolean
  addToken: (tokenAddress: string) => void
  removeToken: (tokenAddress: string) => void
  clearAll: () => void
}

const CustomTokensContext = createContext<CustomTokensContextType | null>(null)

interface CustomTokensProviderProps {
  children: ReactNode
}

export function CustomTokensProvider({ children }: CustomTokensProviderProps) {
  const [customTokens, setCustomTokens] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load custom tokens from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: CustomTokensStorage = JSON.parse(stored)
        setCustomTokens(data.tokens || [])
      }
    } catch (error) {
      console.error('Failed to load custom tokens:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Add a custom token to the list
   * @throws Error if token is already in mainstream list or already added
   */
  const addToken = useCallback(
    (tokenAddress: string) => {
      const normalized = tokenAddress.toLowerCase()

      // Check if already exists in custom list
      if (customTokens.includes(normalized)) {
        throw new Error('This token is already in your custom list')
      }

      // Check if it's a mainstream token (no need to add)
      if (isMainstreamToken(normalized)) {
        throw new Error('This token is already in the mainstream list')
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const data: CustomTokensStorage = stored
          ? JSON.parse(stored)
          : { tokens: [], addedAt: [] }

        // Add new token (create new arrays to ensure React detects the change)
        const newTokens = [...data.tokens, normalized]
        const newAddedAt = [...data.addedAt, Date.now()]

        const updatedData = {
          tokens: newTokens,
          addedAt: newAddedAt,
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
        setCustomTokens(newTokens) // Set new array reference - all consumers will see this
      } catch (error) {
        console.error('Failed to add custom token:', error)
        throw new Error('Failed to save custom token')
      }
    },
    [customTokens]
  )

  /**
   * Remove a custom token from the list
   */
  const removeToken = useCallback((tokenAddress: string) => {
    const normalized = tokenAddress.toLowerCase()

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const data: CustomTokensStorage = JSON.parse(stored)
      const index = data.tokens.indexOf(normalized)

      if (index > -1) {
        // Create new arrays without the removed item (ensures React detects the change)
        const newTokens = data.tokens.filter((_, i) => i !== index)
        const newAddedAt = data.addedAt.filter((_, i) => i !== index)

        const updatedData = {
          tokens: newTokens,
          addedAt: newAddedAt,
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
        setCustomTokens(newTokens) // Set new array reference - all consumers will see this
      }
    } catch (error) {
      console.error('Failed to remove custom token:', error)
    }
  }, [])

  /**
   * Clear all custom tokens
   */
  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setCustomTokens([])
    } catch (error) {
      console.error('Failed to clear custom tokens:', error)
    }
  }, [])

  const contextValue: CustomTokensContextType = {
    customTokens,
    isLoading,
    addToken,
    removeToken,
    clearAll,
  }

  return (
    <CustomTokensContext.Provider value={contextValue}>
      {children}
    </CustomTokensContext.Provider>
  )
}

export function useCustomTokens() {
  const context = useContext(CustomTokensContext)
  if (!context) {
    throw new Error('useCustomTokens must be used within a CustomTokensProvider')
  }
  return context
}
