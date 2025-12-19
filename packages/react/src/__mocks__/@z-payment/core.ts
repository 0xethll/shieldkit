/**
 * Manual mock for @z-payment/core
 * Automatically used by Vitest when vi.mock('@z-payment/core') is called
 */

import { vi } from 'vitest'

// Mock FHE instance
const mockFHEInstance = {
  createEncryptedInput: vi.fn(() => ({
    add64: vi.fn(),
    encrypt: vi.fn().mockResolvedValue({
      handles: [new Uint8Array([1, 2, 3, 4])],
      inputProof: new Uint8Array([5, 6, 7, 8]),
    }),
  })),
  publicDecrypt: vi.fn().mockResolvedValue({
    clearValues: { '0xtest': 100n },
    decryptionProof: '0xproof',
  }),
  generateKeypair: vi.fn(() => ({
    publicKey: 'mock-public-key',
    privateKey: 'mock-private-key',
  })),
  createEIP712: vi.fn(() => ({
    domain: {},
    types: { UserDecryptRequestVerification: [] },
    message: {},
  })),
  userDecrypt: vi.fn().mockResolvedValue({ '0xhandle': 200n }),
}

export const initializeFHE = vi.fn().mockResolvedValue(undefined)
export const createFHEInstance = vi.fn().mockResolvedValue(mockFHEInstance)
export const encryptUint64 = vi.fn().mockResolvedValue({
  handle: new Uint8Array([1, 2, 3, 4]),
  proof: new Uint8Array([5, 6, 7, 8]),
})
export const decryptPublicly = vi.fn().mockResolvedValue([100n, '0xproof'])
export const decryptForUser = vi.fn().mockResolvedValue(200n)
export const formatTokenAmount = vi.fn((amount: bigint, decimals = 6) => {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor
  if (fractionalPart === 0n) return wholePart.toString()
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.replace(/0+$/, '')
  return `${wholePart}.${trimmedFractional}`
})
export const parseTokenAmount = vi.fn((amount: string, decimals = 6) => {
  const [wholePart = '0', fractionalPart = ''] = amount.split('.')
  const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals)
  const fullAmount = wholePart + paddedFractional
  return BigInt(fullAmount)
})
