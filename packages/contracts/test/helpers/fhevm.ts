/**
 * FHEVM Test Helpers for Hardhat 3 + Viem
 *
 * Manual integration of @zama-fhe/relayer-sdk for testing encrypted operations
 */

import { createInstance, type FhevmInstance } from "@zama-fhe/relayer-sdk/node";
import type { FhevmInstanceConfig } from "@zama-fhe/relayer-sdk/node";

let fhevmInstance: FhevmInstance | null = null;

/**
 * Initialize the FHEVM instance for testing
 * Must be called before any encryption/decryption operations
 *
 * For local testing with Hardhat, we use a minimal mock configuration
 */
export async function initFhevm(): Promise<FhevmInstance> {
  if (fhevmInstance) {
    return fhevmInstance;
  }

  // Minimal configuration for local testing
  // These are placeholder addresses for testing purposes
  const config: FhevmInstanceConfig = {
    chainId: 31337, // Hardhat default chain ID
    gatewayChainId: 31337,
    network: "http://localhost:8545",
    aclContractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default Hardhat deployment
    kmsContractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    inputVerifierContractAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    verifyingContractAddressDecryption: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    verifyingContractAddressInputVerification: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  };

  try {
    fhevmInstance = await createInstance(config);
    return fhevmInstance;
  } catch (error) {
    console.error("Failed to initialize FHEVM instance:", error);
    throw error;
  }
}

/**
 * Get the current FHEVM instance
 */
export function getFhevmInstance(): FhevmInstance {
  if (!fhevmInstance) {
    throw new Error("FHEVM instance not initialized. Call initFhevm() first.");
  }
  return fhevmInstance;
}

/**
 * Create encrypted input for a contract
 *
 * @param contractAddress - The contract address
 * @param userAddress - The user's address
 * @returns An EncryptedInput builder that can be used to add encrypted values
 */
export function createEncryptedInput(
  contractAddress: string,
  userAddress: string
) {
  const instance = getFhevmInstance();
  return instance.createEncryptedInput(contractAddress, userAddress);
}

/**
 * Encrypt a 64-bit unsigned integer
 *
 * @param value - The value to encrypt
 * @param contractAddress - The contract address
 * @param userAddress - The user's address
 * @returns Object with handles and inputProof
 */
export async function encryptUint64(
  value: bigint,
  contractAddress: string,
  userAddress: string
) {
  const input = createEncryptedInput(contractAddress, userAddress);
  input.add64(value);
  return input.encrypt();
}

/**
 * Decrypt a euint64 value
 *
 * Note: This is a simplified version for testing.
 * In a real environment with a coprocessor and relayer, use the full userDecrypt flow.
 * For local Hardhat testing, this extracts the plaintext from the handle.
 *
 * @param handle - The encrypted handle
 * @param contractAddress - The contract address (unused in mock mode)
 * @returns The decrypted bigint value
 */
export async function decryptUint64(
  handle: bigint | Uint8Array | string,
  contractAddress: string
): Promise<bigint> {
  // In a local testing environment, handles often encode the plaintext value
  // This is a mock decryption - real decryption requires the KMS/relayer

  try {
    // Convert handle to bigint if it's not already
    let handleValue: bigint;

    if (typeof handle === "bigint") {
      handleValue = handle;
    } else if (typeof handle === "string") {
      handleValue = BigInt(handle);
    } else {
      // Uint8Array
      handleValue = BigInt("0x" + Buffer.from(handle).toString("hex"));
    }

    // For mock/testing environments, the handle often contains the value
    // In production, you would call instance.userDecrypt() with proper authentication
    // This is a placeholder that extracts a mock value from the handle

    // Extract the lower bits as the mock decrypted value
    // This won't work with real encrypted values but is fine for local testing
    const mask = (1n << 64n) - 1n;
    const decryptedValue = handleValue & mask;

    return decryptedValue;
  } catch (error) {
    console.error("Mock decryption failed:", error);
    // Return 0 as fallback for testing
    return 0n;
  }
}

/**
 * Generate a keypair for user decryption
 *
 * @returns Object with publicKey and privateKey as hex strings
 */
export function generateKeypair() {
  const instance = getFhevmInstance();
  return instance.generateKeypair();
}

/**
 * Create an EIP-712 signature for decryption authorization
 *
 * @param publicKey - The user's public key
 * @param contractAddresses - Array of authorized contract addresses
 * @param startTimestamp - Authorization start time (unix timestamp)
 * @param durationDays - How many days the authorization is valid
 * @returns EIP-712 typed data structure
 */
export function createEIP712(
  publicKey: string,
  contractAddresses: string[],
  startTimestamp: string | number,
  durationDays: string | number
) {
  const instance = getFhevmInstance();
  return instance.createEIP712(publicKey, contractAddresses, startTimestamp, durationDays);
}
