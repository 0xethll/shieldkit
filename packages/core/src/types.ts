// TypeScript types for Z-Payment SDK

import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'
import type { Address, Hash } from 'viem'

/**
 * SDK Configuration
 */
export interface SDKConfig {
  /** Address of the confidential token wrapper contract */
  tokenAddress: Address
  /** Ethereum provider (e.g., window.ethereum) */
  provider?: any
  /** Chain ID (default: 11155111 for Sepolia) */
  chainId?: number
}

/**
 * Factory SDK Configuration
 */
export interface FactorySDKConfig {
  /** Address of the ConfidentialTokenFactory contract */
  factoryAddress: Address
  /** Ethereum provider (e.g., window.ethereum) */
  provider?: any
  /** Chain ID (default: 11155111 for Sepolia) */
  chainId?: number
}

/**
 * Wrap operation parameters
 */
export interface WrapParams {
  /** Amount of ERC20 tokens to wrap */
  amount: bigint
  /** Recipient address (usually msg.sender) */
  to: Address
}

/**
 * Wrap operation result
 */
export interface WrapResult {
  /** Transaction hash */
  hash: Hash
}

/**
 * Unwrap operation parameters
 */
export interface UnwrapParams {
  /** Encrypted amount to unwrap */
  amount: bigint
  /** Recipient address for ERC20 tokens */
  to: Address
}

/**
 * Unwrap operation result
 */
export interface UnwrapResult {
  /** Transaction hash */
  hash: Hash
  /** Encrypted burnt amount handle */
  burntAmount: string
}

/**
 * Finalize unwrap parameters
 */
export interface FinalizeUnwrapParams {
  /** Encrypted burnt amount handle */
  burntAmount: string
}

/**
 * Finalize unwrap result
 */
export interface FinalizeUnwrapResult {
  /** Transaction hash */
  hash: Hash
  /** Decrypted cleartext amount */
  cleartextAmount: bigint
}

/**
 * Transfer operation parameters
 */
export interface TransferParams {
  /** Recipient address */
  to: Address
  /** Encrypted amount to transfer */
  amount: bigint
}

/**
 * Transfer operation result
 */
export interface TransferResult {
  /** Transaction hash */
  hash: Hash
}

/**
 * Encrypted balance information
 */
export interface EncryptedBalance {
  /** Encrypted balance handle (ciphertext) */
  handle: string
  /** Decrypted value (if available) */
  value?: bigint
}

/**
 * Unwrap request from indexer
 */
export interface UnwrapRequest {
  /** Unique identifier */
  id: string
  /** Encrypted burnt amount handle */
  burntAmount: string
  /** Recipient address */
  recipient: Address
  /** Block number when request was made */
  requestBlockNumber: string
  /** Transaction hash of unwrap request */
  requestTransactionHash: string
  /** Timestamp of unwrap request */
  requestTimestamp: string
  /** Whether the unwrap has been finalized */
  isFinalized: boolean
  /** Cleartext amount (if finalized) */
  cleartextAmount?: string
  /** Block number when finalized */
  finalizedBlockNumber?: string
  /** Transaction hash of finalize */
  finalizedTransactionHash?: string
  /** Timestamp when finalized */
  finalizedTimestamp?: string
  /** Token address */
  tokenAddress: Address
  /** Token name */
  tokenName: string
  /** Token symbol */
  tokenSymbol: string
}

/**
 * Create wrapper parameters
 */
export interface CreateWrapperParams {
  /** ERC20 token address to wrap */
  erc20Address: Address
}

/**
 * Create wrapper result
 */
export interface CreateWrapperResult {
  /** Transaction hash */
  hash: Hash
  /** Address of newly created confidential token */
  wrapperAddress: Address
}

/**
 * Token metadata
 */
export interface TokenMetadata {
  /** Token name */
  name: string
  /** Token symbol */
  symbol: string
  /** Token decimals */
  decimals: number
  /** Underlying ERC20 address */
  underlying: Address
}

/**
 * Export FhevmInstance type
 */
export type { FhevmInstance }
