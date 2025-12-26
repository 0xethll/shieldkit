/**
 * Manual mock for wagmi
 * Automatically used by Vitest when vi.mock('wagmi') is called
 */

import { vi } from 'vitest'

// Mock hooks with default implementations
export const useAccount = vi.fn(() => ({
  address: '0x1234567890123456789012345678901234567890',
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
  isReconnecting: false,
  status: 'connected',
}))

export const useWriteContract = vi.fn(() => ({
  writeContract: vi.fn(),
  writeContractAsync: vi.fn(),
  data: undefined,
  error: null,
  isError: false,
  isIdle: true,
  isPending: false,
  isSuccess: false,
  reset: vi.fn(),
  status: 'idle',
}))

export const useWaitForTransactionReceipt = vi.fn(() => ({
  data: undefined,
  error: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  status: 'idle',
}))

export const useConfig = vi.fn(() => ({
  chains: [],
  connectors: [],
}))

export const useConnect = vi.fn(() => ({
  connect: vi.fn(),
  connectAsync: vi.fn(),
  connectors: [],
  data: undefined,
  error: null,
  isError: false,
  isIdle: true,
  isPending: false,
  isSuccess: false,
  reset: vi.fn(),
  status: 'idle',
}))

export const useDisconnect = vi.fn(() => ({
  disconnect: vi.fn(),
  disconnectAsync: vi.fn(),
  error: null,
  isError: false,
  isIdle: true,
  isPending: false,
  isSuccess: false,
  reset: vi.fn(),
  status: 'idle',
}))

export const createConfig = vi.fn((config: any) => config)

export const http = vi.fn(() => ({ type: 'http' }))

// Export other commonly used wagmi utilities
export const WagmiProvider = ({ children }: { children: any }) => children
