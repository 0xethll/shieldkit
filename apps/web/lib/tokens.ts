// Token information and mainstream token list

export interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  isMainstream?: boolean // Mark if this is a preset mainstream token
}

/**
 * Mainstream tokens on Sepolia testnet
 * These tokens will always be displayed in the token list,
 * even if the user has zero balance
 */
export const MAINSTREAM_TOKENS: TokenInfo[] = [
  {
    address: '0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a',
    name: 'USD Token',
    symbol: 'USD',
    decimals: 6,
    isMainstream: true,
  },
  {
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    isMainstream: true,
  },
  {
    address: '0xb060796D171EeEdA5Fb99df6B2847DA6D4613CAd',
    name: 'wBTC',
    symbol: 'wBTC',
    decimals: 8,
    isMainstream: true,
  },
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    name: 'Sepolia USDC',
    symbol: 'USDC',
    decimals: 6,
    isMainstream: true,
  },
  {
    address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    name: 'Test Tether USD',
    symbol: 'USDT',
    decimals: 6,
    isMainstream: true,
  },
  // Add more Sepolia testnet tokens here as needed
]

/**
 * Check if a token address is in the mainstream list
 */
export function isMainstreamToken(address: string): boolean {
  return MAINSTREAM_TOKENS.some(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}

/**
 * Get token info from mainstream list
 */
export function getMainstreamTokenInfo(address: string): TokenInfo | undefined {
  return MAINSTREAM_TOKENS.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}
