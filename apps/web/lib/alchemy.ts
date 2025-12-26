import { Alchemy, Network } from 'alchemy-sdk'

/**
 * Alchemy API key from environment variables
 */
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

if (!apiKey || apiKey === 'your_alchemy_api_key_here') {
  throw new Error(
    'Alchemy API key not configured. Please add NEXT_PUBLIC_ALCHEMY_API_KEY to your .env file'
  )
}

/**
 * Singleton Alchemy SDK client for blockchain data queries
 * Used for fetching token balances, metadata, and other on-chain data
 */
export const alchemyClient = new Alchemy({
  apiKey,
  network: Network.ETH_SEPOLIA,
})
