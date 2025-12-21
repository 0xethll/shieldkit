/**
 * Test utilities for @shieldkit/react
 */

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { FHEContext } from './context/FHEContext'
import type { FHEContextType } from './context/FHEContext'
import type { FhevmInstance } from '@shieldkit/core'

/**
 * Create a mock FHE instance for testing
 */
export function createMockFHEInstance(): FhevmInstance {
  return {
    createEncryptedInput: (contractAddress: string, userAddress: string) => ({
      add64: (value: bigint) => {},
      encrypt: async () => ({
        handles: [new Uint8Array([1, 2, 3, 4])],
        inputProof: new Uint8Array([5, 6, 7, 8]),
      }),
    }),
    publicDecrypt: async (ciphertexts: string[]) => ({
      clearValues: {
        [ciphertexts[0] as `0x${string}`]: 100n,
      },
      decryptionProof: '0xproof' as `0x${string}`,
    }),
    generateKeypair: () => ({
      publicKey: 'mock-public-key',
      privateKey: 'mock-private-key',
    }),
    createEIP712: () => ({
      domain: { name: 'Test', version: '1', chainId: 1 },
      types: { UserDecryptRequestVerification: [] },
      message: {},
    }),
    userDecrypt: async () => ({
      '0xhandle': 200n,
    }),
  } as any
}

/**
 * Create a mock Wagmi config for testing
 */
export function createMockWagmiConfig() {
  return createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  })
}

/**
 * Create a QueryClient for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}

/**
 * Mock FHE Provider for testing
 */
export function MockFHEProvider({
  children,
  isFHEReady = true,
  fheInstance = createMockFHEInstance(),
  fheError = null,
  signer = null,
}: {
  children: ReactNode
  isFHEReady?: boolean
  fheInstance?: FhevmInstance | null
  fheError?: string | null
  signer?: any
}) {
  const contextValue: FHEContextType = {
    isFHEReady,
    fheInstance,
    fheError,
    retryFHE: () => {},
    signer,
  }

  return <FHEContext.Provider value={contextValue}>{children}</FHEContext.Provider>
}

/**
 * All-in-one test wrapper with Wagmi, QueryClient, and mock FHE
 */
export function TestWrapper({
  children,
  fheReady = true,
  fheError = null,
}: {
  children: ReactNode
  fheReady?: boolean
  fheError?: string | null
}) {
  const config = createMockWagmiConfig()
  const queryClient = createTestQueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MockFHEProvider isFHEReady={fheReady} fheError={fheError}>
          {children}
        </MockFHEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
