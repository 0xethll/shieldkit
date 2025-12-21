import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useTransfer } from '../../hooks/useTransfer'
import { MockFHEProvider } from '../../test-utils'
import * as wagmi from 'wagmi'

// Use manual mocks
vi.mock('wagmi')
vi.mock('@shieldkit/core')

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()

  // Set default mock implementations
  vi.mocked(wagmi.useAccount).mockReturnValue({
    address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    isConnected: true,
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

describe('useTransfer', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useTransfer(), {
      wrapper: ({ children }) => <MockFHEProvider>{children}</MockFHEProvider>,
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.txHash).toBeUndefined()
    expect(result.current.canTransfer).toBe(true)
    expect(result.current.isFHEReady).toBe(true)
    expect(typeof result.current.transfer).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('should validate wallet connection', async () => {
    // Override default mock for this test
    vi.mocked(wagmi.useAccount).mockReturnValue({
      address: undefined,
      isConnected: false
    } as any)

    const { result } = renderHook(
      () => useTransfer({ tokenAddress: '0xToken' as `0x${string}` }),
      { wrapper: ({ children }) => <MockFHEProvider>{children}</MockFHEProvider> }
    )

    await expect(
      result.current.transfer('0xRecipient' as any, '100')
    ).rejects.toThrow('Please connect your wallet first')
  })

  it('should validate recipient address', async () => {
    const { result } = renderHook(
      () => useTransfer({ tokenAddress: '0xToken' as `0x${string}` }),
      { wrapper: ({ children }) => <MockFHEProvider>{children}</MockFHEProvider> }
    )

    await expect(
      result.current.transfer('invalid-address' as any, '100')
    ).rejects.toThrow('Please enter a valid recipient address')
  })

  it('should validate amount', async () => {
    const { result } = renderHook(
      () => useTransfer({ tokenAddress: '0xToken' as `0x${string}` }),
      { wrapper: ({ children }) => <MockFHEProvider>{children}</MockFHEProvider> }
    )

    await expect(
      result.current.transfer('0x1234567890123456789012345678901234567890', '0')
    ).rejects.toThrow('Please enter a valid amount')

    await expect(
      result.current.transfer('0x1234567890123456789012345678901234567890', '')
    ).rejects.toThrow('Please enter a valid amount')
  })

  it('should validate token address', async () => {
    const { result } = renderHook(() => useTransfer(), {
      wrapper: ({ children }) => <MockFHEProvider>{children}</MockFHEProvider>,
    })

    await expect(
      result.current.transfer('0x1234567890123456789012345678901234567890', '100')
    ).rejects.toThrow('Token address not provided')
  })

  it('should indicate when FHE is not ready', () => {
    const { result } = renderHook(() => useTransfer(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MockFHEProvider isFHEReady={false}>{children}</MockFHEProvider>
      ),
    })

    expect(result.current.canTransfer).toBe(false)
    expect(result.current.isFHEReady).toBe(false)
  })
})
