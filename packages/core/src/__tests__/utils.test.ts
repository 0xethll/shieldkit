import { describe, it, expect } from 'vitest'
import { formatTokenAmount, parseTokenAmount } from '../fhe'

describe('formatTokenAmount', () => {
  it('should format whole numbers correctly', () => {
    expect(formatTokenAmount(1000000n, 6)).toBe('1')
    expect(formatTokenAmount(100000000n, 6)).toBe('100')
  })

  it('should format decimal numbers correctly', () => {
    expect(formatTokenAmount(1500000n, 6)).toBe('1.5')
    expect(formatTokenAmount(1234567n, 6)).toBe('1.234567')
  })

  it('should trim trailing zeros', () => {
    expect(formatTokenAmount(1100000n, 6)).toBe('1.1')
    expect(formatTokenAmount(1000010n, 6)).toBe('1.00001')
  })

  it('should handle zero', () => {
    expect(formatTokenAmount(0n, 6)).toBe('0')
  })

  it('should handle very small amounts', () => {
    expect(formatTokenAmount(1n, 6)).toBe('0.000001')
    expect(formatTokenAmount(10n, 6)).toBe('0.00001')
  })

  it('should handle different decimals', () => {
    expect(formatTokenAmount(1000000000000000000n, 18)).toBe('1')
    expect(formatTokenAmount(1500000000000000000n, 18)).toBe('1.5')
  })

  it('should handle large numbers', () => {
    expect(formatTokenAmount(1000000000000n, 6)).toBe('1000000')
    expect(formatTokenAmount(9999999999999999n, 6)).toBe('9999999999.999999')
  })
})

describe('parseTokenAmount', () => {
  it('should parse whole numbers correctly', () => {
    expect(parseTokenAmount('1', 6)).toBe(1000000n)
    expect(parseTokenAmount('100', 6)).toBe(100000000n)
  })

  it('should parse decimal numbers correctly', () => {
    expect(parseTokenAmount('1.5', 6)).toBe(1500000n)
    expect(parseTokenAmount('1.234567', 6)).toBe(1234567n)
  })

  it('should handle zero', () => {
    expect(parseTokenAmount('0', 6)).toBe(0n)
    expect(parseTokenAmount('0.0', 6)).toBe(0n)
  })

  it('should truncate excess decimals', () => {
    expect(parseTokenAmount('1.1234567890', 6)).toBe(1123456n)
  })

  it('should pad insufficient decimals', () => {
    expect(parseTokenAmount('1.1', 6)).toBe(1100000n)
    expect(parseTokenAmount('1.12', 6)).toBe(1120000n)
  })

  it('should handle numbers without decimal point', () => {
    expect(parseTokenAmount('5', 6)).toBe(5000000n)
  })

  it('should handle numbers starting with decimal point', () => {
    expect(parseTokenAmount('.5', 6)).toBe(500000n)
    expect(parseTokenAmount('.123', 6)).toBe(123000n)
  })

  it('should handle different decimals', () => {
    expect(parseTokenAmount('1', 18)).toBe(1000000000000000000n)
    expect(parseTokenAmount('1.5', 18)).toBe(1500000000000000000n)
  })

  it('should handle large numbers', () => {
    expect(parseTokenAmount('1000000', 6)).toBe(1000000000000n)
  })

  it('should be inverse of formatTokenAmount', () => {
    const amounts = [0n, 1n, 1000000n, 1500000n, 1234567n, 100000000n]

    for (const amount of amounts) {
      const formatted = formatTokenAmount(amount, 6)
      const parsed = parseTokenAmount(formatted, 6)
      expect(parsed).toBe(amount)
    }
  })
})
