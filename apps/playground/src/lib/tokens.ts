// Token information and registry
// Mirrors apps/web/lib/tokens.ts for consistency

import type { Address } from 'viem'

export interface TokenInfo {
  address: Address
  name: string
  symbol: string
  decimals: number
  logoURI?: string
}

/**
 * Mainstream tokens on Sepolia testnet
 * These are the default tokens available in the playground
 */
export const MAINSTREAM_TOKENS: TokenInfo[] = [
  {
    address: '0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a',
    name: 'USD Token',
    symbol: 'USD',
    decimals: 6,
  },
  {
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  {
    address: '0xb060796D171EeEdA5Fb99df6B2847DA6D4613CAd',
    name: 'wBTC',
    symbol: 'wBTC',
    decimals: 8,
  },
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    name: 'Sepolia USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    name: 'Test Tether USD',
    symbol: 'USDT',
    decimals: 6,
  },
]

/**
 * Get token info by address
 */
export function getTokenByAddress(address: Address): TokenInfo | undefined {
  return MAINSTREAM_TOKENS.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}

/**
 * Get token info by symbol
 */
export function getTokenBySymbol(symbol: string): TokenInfo | undefined {
  return MAINSTREAM_TOKENS.find(
    (token) => token.symbol.toUpperCase() === symbol.toUpperCase()
  )
}

/**
 * Check if a token address is in the mainstream list
 */
export function isMainstreamToken(address: Address): boolean {
  return MAINSTREAM_TOKENS.some(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}
