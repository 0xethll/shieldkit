// SDK for Confidential Token Factory operations

import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'
import type { Address } from 'viem'
import { initializeFHE, createFHEInstance } from './fhe'
import type {
  FactorySDKConfig,
  CreateWrapperParams,
  CreateWrapperResult,
} from './types'

/**
 * SDK for interacting with ConfidentialTokenFactory contract
 *
 * @example
 * ```typescript
 * const factory = new ConfidentialTokenFactorySDK({
 *   factoryAddress: '0x...',
 *   provider: window.ethereum
 * })
 *
 * await factory.init()
 *
 * // Create a new confidential wrapper
 * const result = await factory.createWrapper({
 *   erc20Address: '0x...'
 * })
 * ```
 */
export class ConfidentialTokenFactorySDK {
  private fheInstance: FhevmInstance | null = null
  private isInitialized = false

  public readonly factoryAddress: Address
  public readonly provider: any
  public readonly chainId: number

  constructor(config: FactorySDKConfig) {
    this.factoryAddress = config.factoryAddress
    this.provider = config.provider || (typeof window !== 'undefined' ? (window as any).ethereum : null)
    this.chainId = config.chainId || 11155111 // Default to Sepolia
  }

  /**
   * Initialize the SDK
   * Must be called before using any operations
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    await initializeFHE()
    this.fheInstance = await createFHEInstance()
    this.isInitialized = true
  }

  /**
   * Check if SDK is ready to use
   */
  isReady(): boolean {
    return this.isInitialized && this.fheInstance !== null
  }

  /**
   * Create a confidential wrapper for an ERC20 token
   *
   * @param params - Create wrapper parameters
   * @returns Transaction hash and wrapper address
   *
   * @example
   * ```typescript
   * const result = await factory.createWrapper({
   *   erc20Address: '0x...'
   * })
   * console.log('New wrapper at:', result.wrapperAddress)
   * ```
   */
  async createWrapper(params: CreateWrapperParams): Promise<CreateWrapperResult> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    throw new Error('createWrapper() must be called through a wallet-connected hook')
  }

  /**
   * Get the confidential wrapper address for an ERC20 token
   *
   * @param erc20Address - ERC20 token address
   * @returns Wrapper address or null if not created yet
   */
  async getWrapper(erc20Address: Address): Promise<Address | null> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    throw new Error('getWrapper() must be called through a wallet-connected hook')
  }

  /**
   * Get all wrapper addresses with pagination
   *
   * @param offset - Starting index (default: 0)
   * @param limit - Number of results (default: 100)
   * @returns Array of wrapper addresses
   */
  async getAllWrappers(
    offset: number = 0,
    limit: number = 100
  ): Promise<Address[]> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    throw new Error('getAllWrappers() must be called through a wallet-connected hook')
  }

  /**
   * Get total number of wrappers created
   *
   * @returns Total count
   */
  async getWrapperCount(): Promise<bigint> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    throw new Error('getWrapperCount() must be called through a wallet-connected hook')
  }

  /**
   * Ensure SDK is initialized
   * @private
   */
  private ensureInitialized(): void {
    if (!this.isInitialized || !this.fheInstance) {
      throw new Error('SDK not initialized. Call init() first.')
    }
  }
}
