# @z-payment/core

Core SDK for Z-Payment - Framework-agnostic confidential token operations built on Zama's Fully Homomorphic Encryption (FHE).

## Features

- 🔐 **FHE-based Privacy**: Complete privacy for token balances and transfers
- 🌐 **Framework Agnostic**: Works with any JavaScript framework
- 📦 **Lightweight**: Minimal dependencies
- 🎯 **Type-Safe**: Full TypeScript support
- ⚡ **Efficient**: Optimized for performance

## Installation

```bash
npm install @z-payment/core
# or
yarn add @z-payment/core
# or
bun add @z-payment/core
```

## Quick Start

```typescript
import { ConfidentialTokenSDK } from '@z-payment/core'

// Initialize SDK
const sdk = new ConfidentialTokenSDK({
  tokenAddress: '0x...',
  provider: window.ethereum
})

await sdk.init()

// Wrap ERC20 tokens
await sdk.wrap({
  amount: 100n,
  to: userAddress
})

// Transfer confidential tokens
await sdk.transfer({
  to: recipientAddress,
  amount: 50n
})

// Unwrap back to ERC20
await sdk.unwrap({
  amount: 50n,
  to: userAddress
})
```

## API Reference

### ConfidentialTokenSDK

Main SDK for interacting with confidential ERC20 tokens.

#### Constructor

```typescript
new ConfidentialTokenSDK(config: SDKConfig)
```

#### Methods

- `init()`: Initialize the SDK (must be called first)
- `wrap(params)`: Wrap ERC20 tokens into confidential tokens
- `unwrap(params)`: Unwrap confidential tokens back to ERC20
- `finalizeUnwrap(params)`: Finalize an unwrap request
- `transfer(params)`: Transfer confidential tokens
- `getBalance(account)`: Get encrypted balance
- `decryptBalance(handle, signer)`: Decrypt balance for user
- `encryptAmount(amount)`: Encrypt an amount
- `publicDecrypt(ciphertext)`: Public decrypt a ciphertext

### ConfidentialTokenFactorySDK

SDK for creating new confidential token wrappers.

```typescript
import { ConfidentialTokenFactorySDK } from '@z-payment/core'

const factory = new ConfidentialTokenFactorySDK({
  factoryAddress: '0x...',
  provider: window.ethereum
})

await factory.init()

// Create wrapper for any ERC20
const result = await factory.createWrapper({
  erc20Address: '0x...'
})

// Get existing wrapper
const wrapper = await factory.getWrapper('0x...')
```

## Advanced Usage

### Manual FHE Operations

```typescript
import {
  initializeFHE,
  createFHEInstance,
  encryptUint64
} from '@z-payment/core'

// Initialize FHE
await initializeFHE()
const fheInstance = await createFHEInstance()

// Encrypt a value
const { handle, proof } = await encryptUint64(
  fheInstance,
  contractAddress,
  userAddress,
  amount
)
```

### Token Amount Formatting

```typescript
import { formatTokenAmount, parseTokenAmount } from '@z-payment/core'

// Format for display
const display = formatTokenAmount(1000000n, 6) // "1.0"

// Parse user input
const amount = parseTokenAmount("1.5", 6) // 1500000n
```

## Notes

- This package provides the core SDK logic
- For React integration, use `@z-payment/react`
- Wallet operations need to be implemented through hooks or wallet clients
- FHE operations require browser environment

## License

MIT
