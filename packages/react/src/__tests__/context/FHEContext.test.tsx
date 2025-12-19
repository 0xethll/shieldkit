import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { FHEProvider, useFHEContext } from '../../context/FHEContext'
import { MockFHEProvider } from '../../test-utils'

// Use manual mocks
vi.mock('@z-payment/core')
vi.mock('wagmi')

// Mock utils - keep this as inline mock since it's specific to this package
vi.mock('../../utils/client-to-signer', () => ({
  getEthersSigner: vi.fn().mockResolvedValue({
    getAddress: () => Promise.resolve('0x123'),
  }),
}))

describe('useFHEContext', () => {
  it('should throw error when used outside FHEProvider', () => {
    // Suppress console error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const TestComponent = () => {
      useFHEContext()
      return <div>Success</div>
    }

    expect(() => render(<TestComponent />)).toThrow('useFHEContext must be used within a FHEProvider')

    consoleError.mockRestore()
  })

  it('should provide FHE context values from MockFHEProvider', () => {
    const TestComponent = () => {
      const { isFHEReady, fheInstance, fheError } = useFHEContext()
      return (
        <div>
          <div data-testid="ready">{String(isFHEReady)}</div>
          <div data-testid="instance">{fheInstance ? 'yes' : 'no'}</div>
          <div data-testid="error">{fheError || 'none'}</div>
        </div>
      )
    }

    const { getByTestId } = render(
      <MockFHEProvider isFHEReady={true}>
        <TestComponent />
      </MockFHEProvider>
    )

    expect(getByTestId('ready').textContent).toBe('true')
    expect(getByTestId('instance').textContent).toBe('yes')
    expect(getByTestId('error').textContent).toBe('none')
  })
})

describe('MockFHEProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children', () => {
    const { getByText } = render(
      <MockFHEProvider>
        <div>Test Child</div>
      </MockFHEProvider>
    )

    expect(getByText('Test Child')).toBeDefined()
  })

  it('should handle FHE initialization errors', () => {
    const TestComponent = () => {
      const { fheError } = useFHEContext()
      return <div data-testid="error">{fheError || 'none'}</div>
    }

    const { getByTestId } = render(
      <MockFHEProvider fheError="Test error">
        <TestComponent />
      </MockFHEProvider>
    )

    expect(getByTestId('error').textContent).toBe('Test error')
  })

  it('should indicate when FHE is not ready', () => {
    const TestComponent = () => {
      const { isFHEReady } = useFHEContext()
      return <div data-testid="ready">{String(isFHEReady)}</div>
    }

    const { getByTestId } = render(
      <MockFHEProvider isFHEReady={false}>
        <TestComponent />
      </MockFHEProvider>
    )

    expect(getByTestId('ready').textContent).toBe('false')
  })
})
