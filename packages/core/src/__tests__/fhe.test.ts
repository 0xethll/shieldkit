import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initializeFHE, createFHEInstance, encryptUint64, decryptPublicly, decryptForUser } from '../fhe'

// Mock window and ethereum
beforeEach(() => {
  // Reset global state
  vi.resetModules()

  // Setup window mock
  global.window = {
    ethereum: {
      request: vi.fn(),
    },
  } as any
})

describe('initializeFHE', () => {
  it('should throw error if window is not defined', async () => {
    delete (global as any).window

    await expect(initializeFHE()).rejects.toThrow(
      'FHE SDK can only be used in the browser'
    )
  })

  it('should initialize FHE SDK successfully', async () => {
    // Mock the FHE SDK module
    vi.doMock('@zama-fhe/relayer-sdk/web', async () => {
      const mockModule = await import('../__mocks__/@zama-fhe/relayer-sdk/web')
      return mockModule
    })

    const { initializeFHE: init } = await import('../fhe')
    await expect(init()).resolves.toBeUndefined()
  })
})

describe('createFHEInstance', () => {
  it('should throw error if window is not defined', async () => {
    delete (global as any).window

    await expect(createFHEInstance()).rejects.toThrow(
      'Ethereum provider not available'
    )
  })

  it('should throw error if ethereum provider is not available', async () => {
    global.window = {} as any

    await expect(createFHEInstance()).rejects.toThrow(
      'Ethereum provider not available'
    )
  })

  it('should create FHE instance successfully', async () => {
    // Mock the FHE SDK module
    vi.doMock('@zama-fhe/relayer-sdk/web', async () => {
      const mockModule = await import('../__mocks__/@zama-fhe/relayer-sdk/web')
      return mockModule
    })

    const { createFHEInstance: create, initializeFHE: init } = await import('../fhe')

    // Initialize first
    await init()

    const instance = await create()
    expect(instance).toBeDefined()
    expect(instance.createEncryptedInput).toBeDefined()
  })
})

describe('encryptUint64', () => {
  it('should encrypt a value successfully', async () => {
    // Mock the FHE SDK module
    vi.doMock('@zama-fhe/relayer-sdk/web', async () => {
      const mockModule = await import('../__mocks__/@zama-fhe/relayer-sdk/web')
      return mockModule
    })

    const { encryptUint64: encrypt, createFHEInstance: create, initializeFHE: init } = await import('../fhe')

    // Initialize and create instance
    await init()
    const instance = await create()

    const result = await encrypt(
      instance,
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      100n
    )

    expect(result).toBeDefined()
    expect(result.handle).toBeInstanceOf(Uint8Array)
    expect(result.proof).toBeInstanceOf(Uint8Array)
  })

  it('should handle encryption of different values', async () => {
    // Mock the FHE SDK module
    vi.doMock('@zama-fhe/relayer-sdk/web', async () => {
      const mockModule = await import('../__mocks__/@zama-fhe/relayer-sdk/web')
      return mockModule
    })

    const { encryptUint64: encrypt, createFHEInstance: create, initializeFHE: init } = await import('../fhe')

    await init()
    const instance = await create()

    const contractAddr = '0x1234567890123456789012345678901234567890'
    const userAddr = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'

    const values = [0n, 1n, 100n, 1000000n]

    for (const value of values) {
      const result = await encrypt(instance, contractAddr, userAddr, value)
      expect(result.handle).toBeInstanceOf(Uint8Array)
      expect(result.proof).toBeInstanceOf(Uint8Array)
    }
  })
})

describe('decryptPublicly', () => {
  it('should decrypt a ciphertext publicly', async () => {
    // Mock the FHE SDK module
    vi.doMock('@zama-fhe/relayer-sdk/web', async () => {
      const mockModule = await import('../__mocks__/@zama-fhe/relayer-sdk/web')
      return mockModule
    })

    const { decryptPublicly: decrypt, createFHEInstance: create, initializeFHE: init } = await import('../fhe')

    await init()
    const instance = await create()

    const [value, proof] = await decrypt(instance, '0xencrypted123')

    expect(typeof value).toBe('bigint')
    expect(value).toBeGreaterThanOrEqual(0n)
    expect(proof).toMatch(/^0x/)
  })
})

describe('decryptForUser', () => {
  it('should decrypt a ciphertext for a specific user', async () => {
    // Mock the FHE SDK module
    vi.doMock('@zama-fhe/relayer-sdk/web', async () => {
      const mockModule = await import('../__mocks__/@zama-fhe/relayer-sdk/web')
      return mockModule
    })

    const { decryptForUser: decrypt, createFHEInstance: create, initializeFHE: init } = await import('../fhe')

    await init()
    const instance = await create()

    // Mock signer
    const mockSigner = {
      signTypedData: vi.fn().mockResolvedValue('0xsignature'),
      getAddress: vi.fn().mockResolvedValue('0xuser123'),
    }

    const value = await decrypt(
      instance,
      '0xhandle123',
      '0xcontract123',
      mockSigner as any
    )

    expect(typeof value).toBe('bigint')
    expect(value).toBeGreaterThanOrEqual(0n)
    expect(mockSigner.signTypedData).toHaveBeenCalled()
  })
})
