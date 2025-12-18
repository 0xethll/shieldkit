# @z-payment/react

React hooks and providers for Z-Payment - Easy integration of confidential token operations in React applications.

## Features

- 🎣 **React Hooks**: Easy-to-use hooks for all confidential token operations
- ⚛️ **FHE Context**: Global FHE instance and signer management
- 🔐 **Encryption Built-in**: Automatic FHE encryption for confidential operations
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive types
- ⚡ **Optimized**: Built on wagmi/viem with singleton FHE initialization
- 📦 **Lightweight**: Minimal dependencies, framework-agnostic core

## Installation

```bash
# or
bun add @z-payment/react @z-payment/core wagmi viem ethers
```

## Quick Start

### 1. Setup Provider

Wrap your app with `FHEProvider` to manage FHE initialization:

```tsx
import { FHEProvider } from '@z-payment/react'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi-config'

function App() {
  return (
    <WagmiProvider config={config}>
      <FHEProvider>
        <YourApp />
      </FHEProvider>
    </WagmiProvider>
  )
}
```

### 2. Use Hooks

```tsx
import { useWrap, useFHEContext } from '@z-payment/react'

function WrapComponent() {
  const { isFHEReady } = useFHEContext()
  const { wrap, isLoading, isSuccess } = useWrap({
    tokenAddress: '0xYourTokenAddress',
    onSuccess: () => console.log('Wrapped!')
  })

  if (!isFHEReady) return <div>Initializing FHE...</div>

  return (
    <button
      onClick={() => wrap('100')}
      disabled={isLoading}
    >
      {isLoading ? 'Wrapping...' : 'Wrap 100 Tokens'}
    </button>
  )
}
```

## API Reference

### Providers

#### FHEProvider

Global provider that manages FHE instance and ethers.js signer.

```tsx
import { FHEProvider } from '@z-payment/react'

<FHEProvider>
  {children}
</FHEProvider>
```

**Features:**
- Singleton FHE instance (prevents multiple initializations)
- Delayed initialization using `requestIdleCallback` for better performance
- Auto-manages ethers.js signer when wallet connects
- Global state synchronization across components

### Context Hooks

#### useFHEContext

Access FHE instance and signer.

```tsx
import { useFHEContext } from '@z-payment/react'

function MyComponent() {
  const { isFHEReady, fheInstance, signer, fheError, retryFHE } = useFHEContext()

  if (fheError) {
    return <button onClick={retryFHE}>Retry FHE Init</button>
  }

  return isFHEReady ? <App /> : <Loading />
}
```

**Returns:**
- `isFHEReady: boolean` - Whether FHE is initialized and ready
- `fheInstance: FhevmInstance | null` - FHE instance for encryption/decryption
- `fheError: string | null` - Initialization error message
- `retryFHE: () => void` - Retry FHE initialization
- `signer: Signer | null` - ethers.js signer (null if wallet not connected)

### Operation Hooks

#### useWrap

Wrap ERC20 tokens into confidential tokens.

```tsx
import { useWrap } from '@z-payment/react'

const { wrap, isLoading, isSuccess, error, txHash, reset } = useWrap({
  tokenAddress: '0x...',
  decimals: 6, // default: 6
  onSuccess: () => console.log('Wrapped successfully!')
})

// Wrap 100.5 tokens
await wrap('100.5')
```

**Parameters:**
- `tokenAddress?: Address` - Confidential token wrapper address
- `decimals?: number` - Token decimals (default: 6)
- `onSuccess?: () => void` - Callback on successful wrap

**Returns:**
- `wrap: (amount: string) => Promise<void>` - Wrap function
- `isLoading: boolean` - Whether operation is in progress
- `isSuccess: boolean` - Whether operation succeeded
- `error: string | null` - Error message if failed
- `txHash: Hash | undefined` - Transaction hash
- `reset: () => void` - Reset hook state

#### useUnwrap

Unwrap confidential tokens back to ERC20 (creates unwrap request).

```tsx
import { useUnwrap } from '@z-payment/react'

const { unwrap, isLoading, isFHEReady } = useUnwrap({
  tokenAddress: '0x...',
  onSuccess: () => console.log('Unwrap requested!')
})

// Request to unwrap 50 tokens
if (isFHEReady) {
  await unwrap('50')
}
```

**Parameters:**
- `tokenAddress?: Address` - Confidential token wrapper address
- `onSuccess?: () => void` - Callback on successful unwrap

**Returns:**
- `unwrap: (amount: string) => Promise<void>` - Unwrap function (encrypts amount internally)
- `isLoading: boolean` - Whether operation is in progress
- `isSuccess: boolean` - Whether operation succeeded
- `error: string | null` - Error message if failed
- `txHash: Hash | undefined` - Transaction hash
- `reset: () => void` - Reset hook state
- `isFHEReady: boolean` - Whether FHE is ready for encryption

**Note:** Unwrap creates a request that must be finalized later using `useFinalizeUnwrap`.

#### useTransfer

Transfer confidential tokens to another address.

```tsx
import { useTransfer } from '@z-payment/react'

const { transfer, isLoading, canTransfer } = useTransfer({
  tokenAddress: '0x...',
  decimals: 6,
  onSuccess: () => console.log('Transferred!')
})

// Transfer 25.5 tokens
if (canTransfer) {
  await transfer('0xRecipientAddress...', '25.5')
}
```

**Parameters:**
- `tokenAddress?: Address` - Confidential token address
- `decimals?: number` - Token decimals (default: 6)
- `onSuccess?: () => void` - Callback on successful transfer

**Returns:**
- `transfer: (recipient: Address, amount: string) => Promise<void>` - Transfer function
- `isLoading: boolean` - Whether operation is in progress (includes encryption time)
- `isSuccess: boolean` - Whether operation succeeded
- `error: string | null` - User-friendly error message
- `txHash: Hash | undefined` - Transaction hash
- `canTransfer: boolean` - Whether user can transfer (wallet connected && FHE ready)
- `reset: () => void` - Reset hook state
- `isFHEReady: boolean` - Whether FHE is ready

**Error Messages:**
- "Insufficient balance to complete this transfer"
- "Transaction was rejected by user"
- "Insufficient funds to pay for gas fees"
- "Invalid encryption proof. Please try again"

#### useUnwrapQueue

Fetch pending unwrap requests from the indexer.

```tsx
import { useUnwrapQueue } from '@z-payment/react'

const { unwrapRequests, isLoading, error, refetch } = useUnwrapQueue({
  tokenAddress: '0x...',
  graphqlUrl: 'https://indexer.example.com/v1/graphql',
  enableAutoRefetch: true,
  refetchInterval: 15000 // ms
})

// Display unwrap requests
unwrapRequests.map(req => (
  <div key={req.id}>
    Amount: {req.burntAmount}
    Status: {req.isFinalized ? 'Finalized' : 'Pending'}
  </div>
))
```

**Parameters:**
- `tokenAddress?: Address` - Confidential token address
- `graphqlUrl?: string` - GraphQL endpoint URL (defaults to env or localhost)
- `includeFinalized?: boolean` - Include finalized requests (default: false)
- `refetchInterval?: number` - Auto-refetch interval in ms (default: 10000)
- `enableAutoRefetch?: boolean` - Enable auto-refetch (default: false)

**Returns:**
- `unwrapRequests: UnwrapRequest[]` - Array of unwrap requests
- `isLoading: boolean` - Whether query is loading
- `error: string | undefined` - Error message if query failed
- `refetch: () => Promise<void>` - Manually refetch requests

**UnwrapRequest Type:**
```tsx
interface UnwrapRequest {
  id: string
  burntAmount: string
  recipient: string
  requestBlockNumber: string
  requestTransactionHash: string
  requestTimestamp: string
  isFinalized: boolean
  cleartextAmount?: string
  finalizedBlockNumber?: string
  finalizedTransactionHash?: string
  finalizedTimestamp?: string
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
}
```

#### useFinalizeUnwrap

Finalize unwrap requests (decrypt and complete unwrap).

```tsx
import { useFinalizeUnwrap } from '@z-payment/react'

const { finalizeUnwrap, isFinalizing, isFHEReady } = useFinalizeUnwrap({
  tokenAddress: '0x...',
  onSuccess: () => {
    console.log('Finalized!')
    refetchQueue()
  }
})

// Finalize an unwrap request
if (isFHEReady) {
  await finalizeUnwrap('0xBurntAmountHandle...')
}
```

**With Pre-decryption Cache (Optimized):**
```tsx
import { useFinalizeUnwrap, useDecryptedAmounts } from '@z-payment/react'

// Pre-decrypt amounts in background
const decryptedCache = useDecryptedAmounts(unwrapRequests, fheInstance)

// Pass cache for instant finalization
const { finalizeUnwrap } = useFinalizeUnwrap({
  tokenAddress: '0x...',
  decryptedCache // Skips decryption if already cached
})
```

**Parameters:**
- `tokenAddress?: Address` - Confidential token address
- `onSuccess?: () => void` - Callback on successful finalization
- `decryptedCache?: Map<string, DecryptionResult>` - Optional pre-decrypted amounts cache

**Returns:**
- `finalizeUnwrap: (burntAmount: 0x${string}) => Promise<void>` - Finalize function
- `isFinalizing: boolean` - Whether finalization is in progress
- `isSuccess: boolean` - Whether finalization succeeded
- `error: string | undefined` - Error message if failed
- `txHash: Hash | undefined` - Transaction hash
- `pendingTx: string | null` - The burnt amount currently being finalized
- `isFHEReady: boolean` - Whether FHE is ready

### Factory Hooks

#### useFactory

Create new confidential token wrappers.

```tsx
import { useFactory } from '@z-payment/react'

const { createWrapper, isLoading, isSuccess, factoryAddress } = useFactory({
  onSuccess: (wrapperAddress) => {
    console.log('Wrapper created at:', wrapperAddress)
  }
})

// Create wrapper for an ERC20 token
await createWrapper('0xERC20Address...')
```

**Parameters:**
- `onSuccess?: (wrapperAddress?: Address) => void` - Callback on success
- `chainId?: number` - Chain ID (default: Sepolia)

**Returns:**
- `createWrapper: (erc20Address: Address) => Promise<void>` - Create wrapper function
- `isLoading: boolean` - Whether operation is in progress
- `isSuccess: boolean` - Whether operation succeeded
- `error: string | undefined` - Error message if failed
- `txHash: Hash | undefined` - Transaction hash
- `reset: () => void` - Reset hook state
- `factoryAddress: Address` - Factory contract address

#### useWrappedTokenAddress

Check if a wrapper exists for an ERC20 token.

```tsx
import { useWrappedTokenAddress } from '@z-payment/react'

const { wrappedAddress, isLoading, refetch } = useWrappedTokenAddress(
  '0xERC20Address...',
  11155111 // chainId (optional, defaults to Sepolia)
)

if (wrappedAddress) {
  console.log('Wrapper exists at:', wrappedAddress)
} else {
  console.log('No wrapper found, create one first')
}
```

**Parameters:**
- `erc20Address?: Address | null` - ERC20 token address to check
- `chainId?: number` - Chain ID (default: Sepolia)

**Returns:**
- `wrappedAddress: Address | null` - Wrapper address (null if doesn't exist)
- `isLoading: boolean` - Whether query is loading
- `refetch: () => void` - Refetch wrapper address

### Utilities

#### getEthersSigner

Convert wagmi config to ethers.js signer.

```tsx
import { getEthersSigner } from '@z-payment/react'
import { useConfig } from 'wagmi'

const config = useConfig()
const signer = await getEthersSigner(config, { chainId: 11155111 })
```

#### clientToSigner

Convert viem client to ethers.js signer.

```tsx
import { clientToSigner } from '@z-payment/react'

const signer = clientToSigner(viemClient)
```

## Complete Example

```tsx
import {
  FHEProvider,
  useFHEContext,
  useWrap,
  useUnwrap,
  useTransfer,
  useUnwrapQueue,
  useFinalizeUnwrap
} from '@z-payment/react'

function ConfidentialTokenApp() {
  const tokenAddress = '0xYourTokenAddress'

  return (
    <FHEProvider>
      <TokenOperations tokenAddress={tokenAddress} />
    </FHEProvider>
  )
}

function TokenOperations({ tokenAddress }) {
  const { isFHEReady } = useFHEContext()

  const { wrap, isLoading: isWrapping } = useWrap({
    tokenAddress,
    onSuccess: () => console.log('Wrapped!')
  })

  const { transfer, canTransfer } = useTransfer({
    tokenAddress,
    onSuccess: () => console.log('Transferred!')
  })

  const { unwrap } = useUnwrap({
    tokenAddress,
    onSuccess: () => console.log('Unwrap requested!')
  })

  const { unwrapRequests, refetch } = useUnwrapQueue({
    tokenAddress,
    enableAutoRefetch: true
  })

  const { finalizeUnwrap } = useFinalizeUnwrap({
    tokenAddress,
    onSuccess: () => refetch()
  })

  if (!isFHEReady) {
    return <div>Initializing FHE...</div>
  }

  return (
    <div>
      <button onClick={() => wrap('100')}>
        Wrap 100 Tokens
      </button>

      <button
        onClick={() => transfer('0xRecipient...', '50')}
        disabled={!canTransfer}
      >
        Transfer 50 Tokens
      </button>

      <button onClick={() => unwrap('25')}>
        Request Unwrap 25 Tokens
      </button>

      <h3>Pending Unwrap Requests</h3>
      {unwrapRequests.map(req => (
        <div key={req.id}>
          <span>Amount: {req.burntAmount}</span>
          <button onClick={() => finalizeUnwrap(req.burntAmount)}>
            Finalize
          </button>
        </div>
      ))}
    </div>
  )
}
```

## Re-exported Types

All types from `@z-payment/core` are re-exported for convenience:

```tsx
import type {
  // Core types
  WrapParams,
  UnwrapParams,
  TransferParams,
  EncryptedBalance,
  UnwrapRequest,
  FhevmInstance,

  // Contract types
  ChainId,
  ContractAddresses
} from '@z-payment/react'

// Also available: CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS
import { CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS } from '@z-payment/react'
```

## Performance Tips

1. **Pre-decrypt for Better UX:** Use cached decryption for instant finalization:
   ```tsx
   const decryptedCache = useDecryptedAmounts(unwrapRequests, fheInstance)
   const { finalizeUnwrap } = useFinalizeUnwrap({ decryptedCache })
   ```

2. **Auto-refetch Unwrap Queue:** Enable auto-refetch for real-time updates:
   ```tsx
   const { unwrapRequests } = useUnwrapQueue({
     enableAutoRefetch: true,
     refetchInterval: 10000
   })
   ```

3. **FHE Initialization:** FHEProvider uses `requestIdleCallback` to delay FHE initialization, preventing blocking of initial render.

## Environment Variables

```env
# Required for useUnwrapQueue
NEXT_PUBLIC_ENVIO_GRAPHQL_URL=https://indexer.example.com/v1/graphql
```

## Status

✅ **Phase 2 Complete** - All core hooks migrated from demo app.

### Available Hooks
- ✅ `FHEProvider` & `useFHEContext`
- ✅ `useWrap`
- ✅ `useUnwrap`
- ✅ `useTransfer`
- ✅ `useUnwrapQueue`
- ✅ `useFinalizeUnwrap`
- ✅ `useFactory` & `useWrappedTokenAddress`

## License

MIT
