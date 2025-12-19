/**
 * FHE Context Provider
 *
 * Manages FHE instance initialization and ethers.js signer
 * Uses singleton pattern to prevent multiple initializations
 */

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react'

// Extend Window interface for ethereum provider
declare global {
  interface Window {
    ethereum?: any
  }
}
import { useAccount, useConfig } from 'wagmi'
import { Signer } from 'ethers'
import { initializeFHE, createFHEInstance } from '@z-payment/core'
import type { FhevmInstance } from '@z-payment/core'
import { getEthersSigner } from '../utils/client-to-signer'

// Global singleton state to prevent multiple FHE initializations
let globalFheInstance: FhevmInstance | null = null
let globalIsInitialized = false
let globalInitPromise: Promise<FhevmInstance> | null = null
let globalError: string | null = null

// Subscribers for state changes
type StateChangeListener = () => void
const stateChangeListeners = new Set<StateChangeListener>()

const notifyStateChange = () => {
  stateChangeListeners.forEach((listener) => listener())
}

/**
 * Initialize FHE singleton instance
 * @private
 */
const initializeFHESingleton = async (): Promise<FhevmInstance> => {
  // Return existing instance if already initialized
  if (globalFheInstance && globalIsInitialized) {
    return globalFheInstance
  }

  // Return existing promise if initialization is in progress
  if (globalInitPromise) {
    return globalInitPromise
  }

  // Start new initialization
  globalInitPromise = (async () => {
    try {
      globalError = null

      // Check if ethereum provider is available
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error(
          'Ethereum provider not available. Please install MetaMask.',
        )
      }

      // Initialize SDK
      await initializeFHE()

      // Create instance
      const instance = await createFHEInstance()

      globalFheInstance = instance
      globalIsInitialized = true
      notifyStateChange()

      return instance
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to initialize FHE'
      globalError = errorMessage
      globalInitPromise = null
      console.error('FHE initialization error:', err)
      notifyStateChange()
      throw err
    }
  })()

  return globalInitPromise
}

/**
 * FHE Context value type
 */
export interface FHEContextType {
  /** Whether FHE is ready to use */
  isFHEReady: boolean
  /** FHE instance (null if not initialized) */
  fheInstance: FhevmInstance | null
  /** FHE initialization error (if any) */
  fheError: string | null
  /** Retry FHE initialization */
  retryFHE: () => void
  /** Ethers.js signer (null if wallet not connected) */
  signer: Signer | null
}

/**
 * FHE Context
 * @internal Exported for testing purposes
 */
export const FHEContext = createContext<FHEContextType | null>(null)

/**
 * FHE Provider props
 */
export interface FHEProviderProps {
  children: ReactNode
}

/**
 * FHE Provider
 *
 * Provides FHE instance and ethers.js signer to child components
 *
 * @example
 * ```tsx
 * <FHEProvider>
 *   <App />
 * </FHEProvider>
 * ```
 */
export function FHEProvider({ children }: FHEProviderProps) {
  const { address } = useAccount()
  const config = useConfig()

  const [signer, setSigner] = useState<Signer | null>(null)
  const [fheError, setFheError] = useState<string | null>(globalError)
  const [isInitialized, setIsInitialized] = useState<boolean>(
    globalIsInitialized,
  )
  const isMountedRef = useRef(true)

  // Update FHE state when global state changes
  const updateFHEState = useCallback(() => {
    if (!isMountedRef.current) return
    setFheError(globalError)
    setIsInitialized(globalIsInitialized)
  }, [])

  // Initialize FHE with singleton pattern (delayed to allow other effects to run first)
  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to global FHE state changes
    stateChangeListeners.add(updateFHEState)

    // Delay FHE initialization to allow other useEffects (like token fetching) to run first
    // This prevents FHE's heavy WASM loading from blocking other operations
    const startInit = () => {
      if (!isMountedRef.current) return

      // Initialize if not already done
      if (!globalIsInitialized && !globalInitPromise && !globalError) {
        initializeFHESingleton().catch(() => {
          // Error already handled in initializeFHESingleton
        })
      } else {
        updateFHEState()
      }
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    // This ensures FHE init happens when browser is idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(startInit, { timeout: 2000 })
      return () => {
        window.cancelIdleCallback(handle)
        isMountedRef.current = false
        stateChangeListeners.delete(updateFHEState)
      }
    } else {
      const timer = setTimeout(startInit, 300)
      return () => {
        clearTimeout(timer)
        isMountedRef.current = false
        stateChangeListeners.delete(updateFHEState)
      }
    }
  }, [updateFHEState])

  /**
   * Retry FHE initialization
   */
  const retryFHE = useCallback(() => {
    if (!isMountedRef.current) return

    // Reset global state
    globalFheInstance = null
    globalIsInitialized = false
    globalInitPromise = null
    globalError = null

    setFheError(null)
    setIsInitialized(false)

    initializeFHESingleton().catch(() => {
      // Error already handled in initializeFHESingleton
    })
  }, [])

  // Initialize signer when wallet is connected
  useEffect(() => {
    const initSigner = async () => {
      if (!address) {
        setSigner(null)
        return
      }

      try {
        const s = await getEthersSigner(config)
        if (!s) {
          console.warn('Failed to initialize signer')
          setSigner(null)
          return
        }
        setSigner(s)
      } catch (error) {
        console.error('Error initializing signer:', error)
        setSigner(null)
      }
    }

    initSigner()
  }, [config, address])

  const contextValue: FHEContextType = {
    isFHEReady: isInitialized && !!globalFheInstance && !fheError,
    fheInstance: globalFheInstance,
    fheError,
    retryFHE,
    signer,
  }

  return (
    <FHEContext.Provider value={contextValue}>
      {children}
    </FHEContext.Provider>
  )
}

/**
 * Use FHE Context hook
 *
 * @returns FHE context value
 * @throws Error if used outside FHEProvider
 *
 * @example
 * ```tsx
 * const { isFHEReady, fheInstance, signer } = useFHEContext()
 * ```
 */
export function useFHEContext() {
  const context = useContext(FHEContext)
  if (!context) {
    throw new Error('useFHEContext must be used within a FHEProvider')
  }
  return context
}
