# @shieldkit/core

Core utilities and types for ShieldKit - Framework-agnostic FHE operations built on Zama's Fully Homomorphic Encryption (FHE).

## Features

- 🔐 **FHE Utilities**: Complete set of FHE encryption/decryption functions
- 🌐 **Framework Agnostic**: Works with any JavaScript framework
- 📦 **Lightweight**: Minimal dependencies
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Efficient**: Optimized for performance

## Installation

```bash
npm install @shieldkit/core
# or
yarn add @shieldkit/core
# or
bun add @shieldkit/core
```

## What's Included

This package provides:

1. **FHE Utility Functions** - Encryption, decryption, and FHE instance management
2. **Type Definitions** - TypeScript types for all operations
3. **Helper Functions** - Token amount formatting and parsing

**Note**: This is a low-level utility package. For React applications, use `@shieldkit/react` which provides ready-to-use hooks.

## Quick Start

### Initialize FHE

```typescript
import { initializeFHE, createFHEInstance } from '@shieldkit/core'

// Initialize FHE (call once at app startup)
await initializeFHE()

// Create FHE instance
const fheInstance = await createFHEInstance()
```

### Encrypt Values

```typescript
import { encryptUint64 } from '@shieldkit/core'

// Encrypt an amount for contract use
const { handle, proof } = await encryptUint64(
  fheInstance,
  contractAddress,  // Contract that will use this value
  userAddress,      // User's address
  1000000n          // Amount to encrypt (6 decimals = 1 token)
)

// Use handle and proof in contract calls
const encryptedAmount = `0x${Buffer.from(handle).toString('hex')}`
const inputProof = `0x${Buffer.from(proof).toString('hex')}`
```

### Decrypt Values

```typescript
import { decryptPublicly, decryptForUser } from '@shieldkit/core'

// Public decryption (anyone can decrypt)
const [cleartextAmount, proof] = await decryptPublicly(
  fheInstance,
  ciphertextHandle
)

// User-specific decryption (requires signature)
const balance = await decryptForUser(
  fheInstance,
  encryptedBalance,
  contractAddress,
  ethersSigner  // ethers.js Signer
)
```

## API Reference

### FHE Functions

#### `initializeFHE()`

Initialize the FHE system. Must be called once before using any FHE functions.

```typescript
await initializeFHE()
```

#### `createFHEInstance()`

Create a new FHE instance for encryption/decryption operations.

```typescript
const fheInstance = await createFHEInstance()
```

**Returns:** `FhevmInstance` - FHE instance object

#### `encryptUint64(fheInstance, contractAddress, userAddress, value)`

Encrypt a uint64 value for use in confidential contracts.

```typescript
const { handle, proof } = await encryptUint64(
  fheInstance,
  '0xContractAddress',
  '0xUserAddress',
  1000000n
)
```

**Parameters:**
- `fheInstance` - FHE instance from `createFHEInstance()`
- `contractAddress` - Contract address that will use the encrypted value
- `userAddress` - User's Ethereum address
- `value` - Value to encrypt (as bigint)

**Returns:** `{ handle: Uint8Array, proof: Uint8Array }` - Encrypted handle and proof

#### `decryptPublicly(fheInstance, ciphertext)`

Decrypt a value that was encrypted for public decryption.

```typescript
const [amount, proof] = await decryptPublicly(
  fheInstance,
  '0xCiphertextHandle'
)
```

**Returns:** `[bigint, 0x${string}]` - Decrypted value and proof

#### `decryptForUser(fheInstance, ciphertext, contractAddress, signer)`

Decrypt a value for a specific user (requires signature).

```typescript
const balance = await decryptForUser(
  fheInstance,
  encryptedBalance,
  contractAddress,
  ethersSigner
)
```

**Returns:** `bigint` - Decrypted balance

### Helper Functions

#### `formatTokenAmount(amount, decimals)`

Format a token amount for display.

```typescript
import { formatTokenAmount } from '@shieldkit/core'

formatTokenAmount(1000000n, 6)  // "1.0"
formatTokenAmount(1500000n, 6)  // "1.5"
```

#### `parseTokenAmount(amount, decimals)`

Parse a user input string to token amount.

```typescript
import { parseTokenAmount } from '@shieldkit/core'

parseTokenAmount("1.5", 6)  // 1500000n
parseTokenAmount("100", 6)  // 100000000n
```

## Type Definitions

### Operation Types

All operation parameter and result types are exported:

```typescript
import type {
  WrapParams,
  WrapResult,
  UnwrapParams,
  UnwrapResult,
  TransferParams,
  TransferResult,
  FinalizeUnwrapParams,
  FinalizeUnwrapResult,
  CreateWrapperParams,
  CreateWrapperResult,
  EncryptedBalance,
  UnwrapRequest,
  FhevmInstance
} from '@shieldkit/core'
```

### Example: WrapParams

```typescript
interface WrapParams {
  amount: bigint
  to: Address
}
```

### Example: UnwrapRequest

```typescript
interface UnwrapRequest {
  id: string
  burntAmount: string
  recipient: Address
  requestBlockNumber: string
  requestTransactionHash: string
  requestTimestamp: string
  isFinalized: boolean
  cleartextAmount?: string
  // ... more fields
}
```

## Usage with React

For React applications, use `@shieldkit/react` which provides:
- `FHEProvider` - Context provider for FHE instance
- `useWrap`, `useUnwrap`, `useTransfer` - Operation hooks
- `useUnwrapQueue`, `useFinalizeUnwrap` - Queue management hooks
- `useFactory` - Factory operations

See `@shieldkit/react` documentation for details.

## Usage with Other Frameworks

This package is framework-agnostic. To use with Vue, Svelte, or other frameworks:

1. Initialize FHE at app startup:
   ```typescript
   await initializeFHE()
   const fheInstance = await createFHEInstance()
   ```

2. Store the FHE instance in your state management (Vuex, Pinia, etc.)

3. Use the utility functions for encryption/decryption

4. Integrate with your wallet library (wagmi, ethers, etc.)

## Example: Complete Encryption Flow

```typescript
import {
  initializeFHE,
  createFHEInstance,
  encryptUint64,
  parseTokenAmount
} from '@shieldkit/core'

// 1. Initialize (once at startup)
await initializeFHE()
const fheInstance = await createFHEInstance()

// 2. Parse user input
const amount = parseTokenAmount("100.5", 6)  // 100500000n

// 3. Encrypt the amount
const { handle, proof } = await encryptUint64(
  fheInstance,
  contractAddress,
  userAddress,
  amount
)

// 4. Convert to hex for contract calls
const encryptedAmount = `0x${Buffer.from(handle).toString('hex')}`
const inputProof = `0x${Buffer.from(proof).toString('hex')}`

// 5. Use in contract transaction (with wagmi, ethers, etc.)
await writeContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'wrap',
  args: [userAddress, encryptedAmount, inputProof]
})
```

## Browser Compatibility

FHE operations require:
- Modern browser (Chrome, Firefox, Edge, Safari)
- WebAssembly support
- IndexedDB support

## Performance Notes

- FHE initialization can take 1-2 seconds on first load
- Use singleton pattern to avoid re-initialization
- Encryption operations are fast (< 100ms)
- Decryption may take longer depending on proof complexity

## Notes

- This package provides low-level utilities only
- Wallet integration must be handled by your application
- For complete React integration, use `@shieldkit/react`
- FHE operations require browser environment (not Node.js)

## License

MIT
