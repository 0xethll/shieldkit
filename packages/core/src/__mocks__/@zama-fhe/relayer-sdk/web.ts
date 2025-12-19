/**
 * Mock implementation of @zama-fhe/relayer-sdk/web for testing
 */

import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'

// Mock FHE instance
class MockFhevmInstance implements Partial<FhevmInstance> {
  createEncryptedInput(contractAddress: string, userAddress: string) {
    const values: bigint[] = []

    return {
      add64(value: bigint) {
        values.push(value)
        return this
      },
      async encrypt() {
        return {
          handles: values.map(() => new Uint8Array([1, 2, 3, 4])),
          inputProof: new Uint8Array([5, 6, 7, 8]),
        }
      },
    }
  }

  async publicDecrypt(ciphertexts: string[]): Promise<{
    clearValues: Record<`0x${string}`, bigint>
    decryptionProof: `0x${string}`
  }> {
    const clearValues: Record<`0x${string}`, bigint> = {}

    for (const ct of ciphertexts) {
      clearValues[ct as `0x${string}`] = 100n // Mock decrypted value
    }

    return {
      clearValues,
      decryptionProof: '0xproof123',
    }
  }

  generateKeypair() {
    return {
      publicKey: 'mock-public-key',
      privateKey: 'mock-private-key',
    }
  }

  createEIP712(
    publicKey: string,
    contractAddresses: string[],
    startTimeStamp: string,
    durationDays: string
  ) {
    return {
      domain: {
        name: 'MockDomain',
        version: '1',
        chainId: 1,
      },
      types: {
        UserDecryptRequestVerification: [
          { name: 'publicKey', type: 'string' },
          { name: 'contractAddresses', type: 'address[]' },
        ],
      },
      message: {
        publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays,
      },
    }
  }

  async userDecrypt(
    handleContractPairs: Array<{ handle: string; contractAddress: string }>,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddresses: string[],
    userAddress: string,
    startTimeStamp: string,
    durationDays: string
  ): Promise<Record<`0x${string}`, bigint>> {
    const result: Record<`0x${string}`, bigint> = {}

    for (const pair of handleContractPairs) {
      result[pair.handle as `0x${string}`] = 200n // Mock decrypted value
    }

    return result
  }
}

// Mock SDK initialization
let isInitialized = false
let mockInstance: MockFhevmInstance | null = null

export async function initSDK(): Promise<void> {
  if (isInitialized) return

  // Simulate async initialization
  await new Promise((resolve) => setTimeout(resolve, 10))
  isInitialized = true
}

export async function createInstance(config: any): Promise<FhevmInstance> {
  if (!isInitialized) {
    throw new Error('SDK not initialized. Call initSDK first.')
  }

  if (!mockInstance) {
    mockInstance = new MockFhevmInstance()
  }

  return mockInstance as unknown as FhevmInstance
}

export const SepoliaConfig = {
  networkUrl: 'https://sepolia.infura.io/v3/test',
  gatewayUrl: 'https://gateway.zama.ai',
  chainId: 11155111,
}

// Reset function for tests
export function __resetMockSDK() {
  isInitialized = false
  mockInstance = null
}
