// Alchemy SDK client for blockchain data queries

import { Alchemy, Network } from 'alchemy-sdk'

/**
 * Alchemy API key from environment variables
 * Vite uses import.meta.env instead of process.env
 */
const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY

/**
 * Singleton Alchemy SDK client for blockchain data queries
 * Used for fetching token balances, metadata, and other on-chain data
 *
 */
export const alchemyClient = new Alchemy({
      apiKey: apiKey!,
      network: Network.ETH_SEPOLIA,
    })

/**
 * Check if Alchemy client is available
 */
export const isAlchemyAvailable = !!alchemyClient
