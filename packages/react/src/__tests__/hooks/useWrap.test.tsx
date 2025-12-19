import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWrap } from '../../hooks/useWrap'
import * as wagmi from 'wagmi'

// Use manual mock
vi.mock('wagmi')

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()

  // Set default mock implementations
  vi.mocked(wagmi.useAccount).mockReturnValue({
    address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
  } as any)

  vi.mocked(wagmi.useWriteContract).mockReturnValue({
    writeContract: vi.fn(),
    data: undefined,
    reset: vi.fn(),
    isPending: false,
    error: null,
  } as any)

  vi.mocked(wagmi.useWaitForTransactionReceipt).mockReturnValue({
    isLoading: false,
    isSuccess: false,
    error: null,
  } as any)
})

describe('useWrap', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useWrap())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.txHash).toBeUndefined()
    expect(typeof result.current.wrap).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('should validate wallet connection', async () => {
    // Override default mock for this test
    vi.mocked(wagmi.useAccount).mockReturnValue({ address: undefined } as any)

    const { result } = renderHook(() => useWrap({ tokenAddress: '0xToken' as `0x${string}` }))

    await expect(result.current.wrap('100')).rejects.toThrow('Wallet not connected')
  })

  it('should validate amount', async () => {
    const { result } = renderHook(() => useWrap({ tokenAddress: '0xToken' as `0x${string}` }))

    await expect(result.current.wrap('0')).rejects.toThrow('Invalid amount')
    await expect(result.current.wrap('')).rejects.toThrow('Invalid amount')
  })

  it('should validate token address', async () => {
    const { result } = renderHook(() => useWrap())

    await expect(result.current.wrap('100')).rejects.toThrow('Token address not provided')
  })
})
