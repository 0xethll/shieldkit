/**
 * Vitest setup file for @z-payment/react
 */

import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.ethereum globally
global.window = global.window || ({} as any)
global.window.ethereum = {
  request: () => Promise.resolve(),
  on: () => {},
  removeListener: () => {},
}

// Mock requestIdleCallback if not available
if (!global.window.requestIdleCallback) {
  global.window.requestIdleCallback = (callback: any, options?: any) => {
    const start = Date.now()
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      })
    }, 1) as any
  }

  global.window.cancelIdleCallback = (id: any) => {
    clearTimeout(id)
  }
}
