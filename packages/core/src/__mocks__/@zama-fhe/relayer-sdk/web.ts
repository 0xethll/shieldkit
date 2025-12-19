/**
 * Mock implementation of @zama-fhe/relayer-sdk/web for testing
 */

import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'

// Mock FHE instance
class MockFhevmInstance implements Partial<FhevmInstance> {
  createEncryptedInput(contractAddress: string, userAddress: string) {
    const values: Array<boolean | number | bigint | string> = []

    const input = {
      addBool(value: boolean | number | bigint) {
        values.push(value)
        return input
      },
      add8(value: number | bigint) {
        values.push(value)
        return input
      },
      add16(value: number | bigint) {
        values.push(value)
        return input
      },
      add32(value: number | bigint) {
        values.push(value)
        return input
      },
      add64(value: number | bigint) {
        values.push(value)
        return input
      },
      add128(value: number | bigint) {
        values.push(value)
        return input
      },
      add256(value: number | bigint) {
        values.push(value)
        return input
      },
      addAddress(value: string) {
        values.push(value)
        return input
      },
      getBits() {
        return values.map(() => 64 as any)
      },
      async encrypt() {
        return {
          handles: values.map(() => new Uint8Array([1, 2, 3, 4])),
          inputProof: new Uint8Array([5, 6, 7, 8]),
        }
      },
    }

    return input
  }

  async publicDecrypt(handles: (string | Uint8Array)[]): Promise<{
    clearValues: Record<`0x${string}`, bigint>
    abiEncodedClearValues: `0x${string}`
    decryptionProof: `0x${string}`
  }> {
    const clearValues: Record<`0x${string}`, bigint> = {}

    for (const handle of handles) {
      const key = typeof handle === 'string' ? handle : '0xhandle'
      clearValues[key as `0x${string}`] = 100n // Mock decrypted value
    }

    return {
      clearValues,
      abiEncodedClearValues: '0xencoded123',
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
    startTimestamp: string | number,
    durationDays: string | number
  ) {
    return {
      domain: {
        name: 'MockDomain',
        version: '1',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      primaryType: 'UserDecryptRequestVerification',
      types: {
        UserDecryptRequestVerification: [
          { name: 'publicKey', type: 'string' },
          { name: 'contractAddresses', type: 'address[]' },
        ],
      },
      message: {
        publicKey,
        contractAddresses,
        startTimestamp: String(startTimestamp),
        durationDays: String(durationDays),
      },
    }
  }

  async userDecrypt(
    handles: Array<{ handle: string | Uint8Array; contractAddress: string }>,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddresses: string[],
    userAddress: string,
    startTimestamp: string | number,
    durationDays: string | number
  ): Promise<Record<`0x${string}`, bigint>> {
    const result: Record<`0x${string}`, bigint> = {}

    for (const pair of handles) {
      const key = typeof pair.handle === 'string' ? pair.handle : '0xhandle'
      result[key as `0x${string}`] = 200n // Mock decrypted value
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
