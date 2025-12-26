// FHE utilities and configuration for Zama integration

// Import types only for server-side compatibility
import type { FhevmInstance } from '@zama-fhe/relayer-sdk/bundle'
import { Signer } from 'ethers'

/**
 * Encrypted value with proof
 * Returned after encrypting data for confidential computation
 */
export interface EncryptedValue {
  handle: Uint8Array
  proof: Uint8Array
}

/**
 * Initialize the FHE SDK
 * Must be called before using any FHE functionality
 */
export async function initializeFHE(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('FHE SDK can only be used in the browser')
  }

  const fheSdk = await import('@zama-fhe/relayer-sdk/web')

  if (!fheSdk.initSDK) {
    throw new Error('initSDK function not available from FHE SDK')
  }

  await fheSdk.initSDK()
}

/**
 * Create an FHE instance for Sepolia testnet
 * Requires window.ethereum to be available
 */
export async function createFHEInstance(): Promise<FhevmInstance> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('Ethereum provider not available')
  }

  const fheSdk = await import('@zama-fhe/relayer-sdk/web')

  if (!fheSdk.createInstance || !fheSdk.SepoliaConfig) {
    throw new Error('Required FHE SDK functions not available')
  }

  const config = {
    ...fheSdk.SepoliaConfig,
    network: (window as any).ethereum,
  }

  return await fheSdk.createInstance(config)
}

/**
 * Encrypt a 64-bit unsigned integer for contract use
 */
export async function encryptUint64(
  fheInstance: FhevmInstance,
  contractAddress: string,
  userAddress: string,
  value: bigint,
): Promise<EncryptedValue> {
  const input = fheInstance.createEncryptedInput(contractAddress, userAddress)
  input.add64(value)

  const encryptedInput = await input.encrypt()

  const handle = encryptedInput.handles[0]
  if (!handle) {
    throw new Error('Failed to encrypt: no handle returned')
  }

  return {
    handle,
    proof: encryptedInput.inputProof,
  }
}

/**
 * Public decryption - decrypt encrypted value using FHEVM Gateway
 */
export async function decryptPublicly(
  fheInstance: FhevmInstance,
  ciphertext: string,
): Promise<[bigint, `0x${string}`]> {

  const {clearValues, decryptionProof} = await fheInstance.publicDecrypt([ciphertext])

  const decryptedValue = clearValues[ciphertext as `0x${string}`]
  if (decryptedValue === undefined) {
    throw new Error('Failed to decrypt: no value returned')
  }
  if (typeof decryptedValue === 'bigint') {
    return [decryptedValue, decryptionProof]
  }
  return [BigInt(decryptedValue), decryptionProof]
}


/**
 * Decrypt a ciphertext handle for the user
 * Requires user signature for authorization
 */
export async function decryptForUser(
  fheInstance: FhevmInstance,
  ciphertextHandle: string,
  contractAddress: string,
  signer: Signer,
): Promise<bigint> {
  const keypair = fheInstance.generateKeypair()

  const handleContractPairs = [
    {
      handle: ciphertextHandle,
      contractAddress: contractAddress,
    },
  ]

  const startTimeStamp = Math.floor(Date.now() / 1000).toString()
  const durationDays = '10'
  const contractAddresses = [contractAddress]

  const eip712 = fheInstance.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays,
  )

  const userDecryptType = eip712.types.UserDecryptRequestVerification
  if (!userDecryptType) {
    throw new Error('UserDecryptRequestVerification type not found in EIP712 types')
  }

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: userDecryptType,
    },
    eip712.message,
  )

  const result = await fheInstance.userDecrypt(
    handleContractPairs,
    keypair.privateKey,
    keypair.publicKey,
    signature.replace('0x', ''),
    contractAddresses,
    await signer.getAddress(),
    startTimeStamp,
    durationDays,
  )

  const decryptedValue = result[ciphertextHandle as `0x${string}`]
  if (decryptedValue === undefined) {
    throw new Error('Failed to decrypt: no value returned')
  }
  if (typeof decryptedValue === 'bigint') {
    return decryptedValue
  }
  return BigInt(decryptedValue)
}

/**
 * Format tokens for display (assuming 6 decimals)
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 6,
): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.replace(/0+$/, '')

  return `${wholePart}.${trimmedFractional}`
}

/**
 * Parse token amount from string to bigint (assuming 6 decimals)
 */
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
  const [wholePart = '0', fractionalPart = ''] = amount.split('.')
  const paddedFractional = fractionalPart
    .padEnd(decimals, '0')
    .slice(0, decimals)
  const fullAmount = wholePart + paddedFractional
  return BigInt(fullAmount)
}
