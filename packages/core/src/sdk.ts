// Core SDK for Confidential Token operations

import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'
import type { Address, Hash } from 'viem'
import { Signer } from 'ethers'
import {
  initializeFHE,
  createFHEInstance,
  encryptUint64,
  decryptPublicly,
  decryptForUser,
} from './fhe'
import type {
  SDKConfig,
  WrapParams,
  WrapResult,
  UnwrapParams,
  UnwrapResult,
  FinalizeUnwrapParams,
  FinalizeUnwrapResult,
  TransferParams,
  TransferResult,
  EncryptedBalance,
  TokenMetadata,
} from './types'

/**
 * SDK for interacting with a single Confidential ERC20 Wrapper contract
 *
 * @example
 * ```typescript
 * const sdk = new ConfidentialTokenSDK({
 *   tokenAddress: '0x...',
 *   provider: window.ethereum
 * })
 *
 * await sdk.init()
 *
 * // Wrap tokens
 * const result = await sdk.wrap({ amount: 100n, to: userAddress })
 * ```
 */
export class ConfidentialTokenSDK {
  private fheInstance: FhevmInstance | null = null
  private isInitialized = false

  public readonly tokenAddress: Address
  public readonly provider: any
  public readonly chainId: number

  constructor(config: SDKConfig) {
    this.tokenAddress = config.tokenAddress
    this.provider = config.provider || (typeof window !== 'undefined' ? window.ethereum : null)
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
   * Get FHE instance (throws if not initialized)
   */
  private getFheInstance(): FhevmInstance {
    if (!this.fheInstance) {
      throw new Error('SDK not initialized. Call init() first.')
    }
    return this.fheInstance
  }

  /**
   * Wrap ERC20 tokens into confidential tokens
   *
   * @param params - Wrap parameters
   * @returns Transaction hash
   *
   * @example
   * ```typescript
   * const result = await sdk.wrap({
   *   amount: parseUnits('100', 6),
   *   to: userAddress
   * })
   * console.log('Transaction:', result.hash)
   * ```
   */
  async wrap(params: WrapParams): Promise<WrapResult> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    // For now, this is a placeholder that should be overridden by the React hooks
    throw new Error('wrap() must be called through a wallet-connected hook')
  }

  /**
   * Unwrap confidential tokens back to ERC20
   * Creates an unwrap request that needs to be finalized later
   *
   * @param params - Unwrap parameters
   * @returns Transaction hash and burnt amount handle
   */
  async unwrap(params: UnwrapParams): Promise<UnwrapResult> {
    this.ensureInitialized()

    const fhe = this.getFheInstance()
    const userAddress = await this.getUserAddress()

    // Encrypt the amount
    const { handle, proof } = await encryptUint64(
      fhe,
      this.tokenAddress,
      userAddress,
      params.amount
    )

    // This will be implemented when integrated with wallet client
    throw new Error('unwrap() must be called through a wallet-connected hook')
  }

  /**
   * Finalize an unwrap request by providing decrypted amount and proof
   *
   * @param params - Finalize parameters
   * @returns Transaction hash and cleartext amount
   */
  async finalizeUnwrap(params: FinalizeUnwrapParams): Promise<FinalizeUnwrapResult> {
    this.ensureInitialized()

    const fhe = this.getFheInstance()

    // Public decryption
    const [cleartextAmount, proof] = await decryptPublicly(fhe, params.burntAmount)

    // This will be implemented when integrated with wallet client
    throw new Error('finalizeUnwrap() must be called through a wallet-connected hook')
  }

  /**
   * Transfer confidential tokens to another address
   *
   * @param params - Transfer parameters
   * @returns Transaction hash
   */
  async transfer(params: TransferParams): Promise<TransferResult> {
    this.ensureInitialized()

    const fhe = this.getFheInstance()
    const userAddress = await this.getUserAddress()

    // Encrypt the amount
    const { handle, proof } = await encryptUint64(
      fhe,
      this.tokenAddress,
      userAddress,
      params.amount
    )

    // This will be implemented when integrated with wallet client
    throw new Error('transfer() must be called through a wallet-connected hook')
  }

  /**
   * Get encrypted balance of an account
   *
   * @param account - Account address
   * @returns Encrypted balance handle
   */
  async getBalance(account: Address): Promise<EncryptedBalance> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    throw new Error('getBalance() must be called through a wallet-connected hook')
  }

  /**
   * Decrypt an encrypted balance for the user
   * Requires user signature
   *
   * @param encryptedBalance - Encrypted balance handle
   * @param signer - Ethers signer
   * @returns Decrypted balance value
   */
  async decryptBalance(
    encryptedBalance: string,
    signer: Signer
  ): Promise<bigint> {
    this.ensureInitialized()

    const fhe = this.getFheInstance()
    return await decryptForUser(fhe, encryptedBalance, this.tokenAddress, signer)
  }

  /**
   * Get token metadata
   *
   * @returns Token name, symbol, decimals, and underlying address
   */
  async getMetadata(): Promise<TokenMetadata> {
    this.ensureInitialized()

    // This will be implemented when integrated with wallet client
    throw new Error('getMetadata() must be called through a wallet-connected hook')
  }

  /**
   * Encrypt an amount for contract use
   * Utility function exposed for advanced use cases
   *
   * @param amount - Amount to encrypt
   * @param userAddress - User address (optional, will auto-detect if not provided)
   * @returns Encrypted handle and proof
   */
  async encryptAmount(
    amount: bigint,
    userAddress?: Address
  ): Promise<{ handle: Uint8Array; proof: Uint8Array }> {
    this.ensureInitialized()

    const fhe = this.getFheInstance()
    const address = userAddress || await this.getUserAddress()

    return await encryptUint64(fhe, this.tokenAddress, address, amount)
  }

  /**
   * Public decrypt a ciphertext
   * Utility function exposed for advanced use cases
   *
   * @param ciphertext - Ciphertext handle to decrypt
   * @returns Cleartext value and decryption proof
   */
  async publicDecrypt(ciphertext: string): Promise<[bigint, `0x${string}`]> {
    this.ensureInitialized()

    const fhe = this.getFheInstance()
    return await decryptPublicly(fhe, ciphertext)
  }

  /**
   * Get user address from provider
   * @private
   */
  private async getUserAddress(): Promise<Address> {
    if (!this.provider) {
      throw new Error('No provider available')
    }

    const accounts = await this.provider.request({ method: 'eth_requestAccounts' })
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found')
    }

    return accounts[0] as Address
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
