// Alchemy SDK client for blockchain data queries

import { Alchemy, Network } from 'alchemy-sdk'
import { env } from './env'

/**
 * Singleton Alchemy SDK client for blockchain data queries
 * Used for fetching token balances, metadata, and other on-chain data
 */
export const alchemyClient = new Alchemy({
  apiKey: env.alchemyApiKey,
  network: Network.ETH_SEPOLIA,
})

/**
 * Check if Alchemy client is available
 */
export const isAlchemyAvailable = !!alchemyClient
