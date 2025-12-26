# @shieldkit/react

React hooks and providers for ShieldKit - Easy integration of confidential token operations in React applications.

## Features

- 🎣 **React Hooks**: Easy-to-use hooks for all confidential token operations
- ⚛️ **FHE Context**: Global FHE instance and signer management
- 🔐 **Encryption Built-in**: Automatic FHE encryption for confidential operations
- 🎨 **Theme System**: Built-in theming with light/dark mode and customizable colors
- 🎯 **Type-Safe**: Full TypeScript support with comprehensive types
- ⚡ **Optimized**: Built on wagmi/viem with singleton FHE initialization
- 📦 **Lightweight**: Minimal dependencies, framework-agnostic core

## Installation

```bash
# or
bun add @shieldkit/react @shieldkit/core wagmi viem ethers
```

## Quick Start

### Option 1: Use Pre-built Widget (Fastest)

```tsx
import { FHEProvider, ConfidentialWidget } from '@shieldkit/react'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi-config'

function App() {
  return (
    <WagmiProvider config={config}>
      <FHEProvider>
        <ConfidentialWidget
          tokens={[
            { symbol: 'USDC', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', decimals: 6, name: 'USD Coin' }
          ]}
          defaultTab="wrap"
          features={{ wrap: true, transfer: true, unwrap: true }}
          theme={{ type: 'dark', accent: 'purple', radius: 'medium' }}
        />
      </FHEProvider>
    </WagmiProvider>
  )
}
```

### Option 2: Use Hooks for Custom UI

```tsx
import { FHEProvider, useWrap, useFHEContext } from '@shieldkit/react'
import { WagmiProvider } from 'wagmi'

function App() {
  return (
    <WagmiProvider config={config}>
      <FHEProvider>
        <YourCustomUI />
      </FHEProvider>
    </WagmiProvider>
  )
}

function YourCustomUI() {
  const { isFHEReady } = useFHEContext()
  const { wrap, isLoading } = useWrap({
    tokenAddress: '0x...',
    onSuccess: () => console.log('Wrapped!')
  })

  if (!isFHEReady) return <div>Initializing FHE...</div>

  return (
    <button onClick={() => wrap('100')} disabled={isLoading}>
      {isLoading ? 'Wrapping...' : 'Wrap 100 Tokens'}
    </button>
  )
}
```

## API Reference

### UI Components

#### ConfidentialWidget

Complete pre-built widget for confidential token operations with wrap, transfer, and unwrap functionality.

```tsx
import { ConfidentialWidget } from '@shieldkit/react'

<ConfidentialWidget
  tokens={[
    { symbol: 'USDC', address: '0x...', decimals: 6, name: 'USD Coin' }
  ]}
  defaultTab="wrap"
  features={{ wrap: true, transfer: true, unwrap: true }}
  theme={{ type: 'dark', accent: 'purple', radius: 'medium' }}
  graphqlUrl="https://indexer.example.com/v1/graphql"
  onWrapSuccess={(token, amount) => console.log('Wrapped!', token, amount)}
  onTransferSuccess={(token, recipient, amount) => console.log('Transferred!')}
  onUnwrapSuccess={(token, amount) => console.log('Unwrapped!')}
/>
```

**Props:**
- `tokens?: TokenConfig[]` - List of supported tokens
- `defaultTab?: 'wrap' | 'transfer' | 'unwrap'` - Default tab (default: `'wrap'`)
- `features?: { wrap?: boolean; transfer?: boolean; unwrap?: boolean }` - Feature toggles (default: all `true`)
- `theme?: ThemeConfig` - Theme configuration (default: `{ type: 'dark', accent: 'purple', radius: 'medium' }`)
- `graphqlUrl?: string` - GraphQL endpoint for unwrap queue (defaults to env var)
- `className?: string` - Additional CSS class
- `style?: React.CSSProperties` - Additional inline styles
- `onWrapSuccess?: (token: Address, amount: bigint) => void` - Wrap success callback
- `onTransferSuccess?: (token: Address, recipient: Address, amount: bigint) => void` - Transfer success callback
- `onUnwrapSuccess?: (token: Address, amount: bigint) => void` - Unwrap success callback

**TokenConfig Type:**
```tsx
interface TokenConfig {
  symbol: string          // e.g., 'USDC'
  address: Address        // Token wrapper address
  decimals: number        // Token decimals (6 for USDC, 18 for ETH)
  name: string           // Full token name
}
```

**ThemeConfig Type:**
```tsx
interface ThemeConfig {
  type: 'light' | 'dark'
  accent: 'purple' | 'blue' | 'green' | 'orange'
  radius: 'none' | 'small' | 'medium' | 'large'
}
```

---

### Providers

#### FHEProvider

Global provider that manages FHE instance and ethers.js signer.

```tsx
import { FHEProvider } from '@shieldkit/react'

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
import { useFHEContext } from '@shieldkit/react'

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
import { useWrap } from '@shieldkit/react'

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
import { useUnwrap } from '@shieldkit/react'

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
import { useTransfer } from '@shieldkit/react'

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
import { useUnwrapQueue } from '@shieldkit/react'

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
import { useFinalizeUnwrap } from '@shieldkit/react'

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
import { useFinalizeUnwrap, useDecryptedAmounts } from '@shieldkit/react'

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
import { useFactory } from '@shieldkit/react'

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
import { useWrappedTokenAddress } from '@shieldkit/react'

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

### Theme System

#### ThemeProvider

Apply theme configuration to components using CSS custom properties.

```tsx
import { ThemeProvider } from '@shieldkit/react'

// Controlled mode - external state controls theme
const [theme, setTheme] = useState({
  type: 'dark',
  accent: 'purple',
  radius: 'medium'
})

<ThemeProvider theme={theme}>
  <YourComponents />
</ThemeProvider>

// Uncontrolled mode - uses default theme
<ThemeProvider defaultTheme={{ type: 'light', accent: 'blue', radius: 'large' }}>
  <YourComponents />
</ThemeProvider>

// Minimal - uses built-in default (dark purple medium)
<ThemeProvider>
  <YourComponents />
</ThemeProvider>
```

**Available Options:**
- `type`: `'dark'` | `'light'`
- `accent`: `'purple'` | `'blue'` | `'green'` | `'orange'`
- `radius`: `'none'` | `'small'` | `'medium'` | `'large'`

**Preset Themes:**
```tsx
import { ThemeProvider, PRESET_THEMES } from '@shieldkit/react'

<ThemeProvider theme={PRESET_THEMES.darkPurple}>
  <YourComponents />
</ThemeProvider>

// Available presets:
// - darkPurple (default)
// - darkBlue
// - lightPurple
// - lightBlue
```

**Custom Styling:**
The ThemeProvider sets CSS custom properties that you can use in your styles:

```css
/* Colors */
--color-background
--color-foreground
--color-muted
--color-muted-foreground
--color-border
--color-secondary
--color-secondary-foreground
--color-accent
--color-accent-foreground
--color-primary
--color-primary-hover
--color-primary-foreground

/* Border Radius */
--radius-lg
--radius-md
--radius-sm
```

### Utilities

#### getEthersSigner

Convert wagmi config to ethers.js signer.

```tsx
import { getEthersSigner } from '@shieldkit/react'
import { useConfig } from 'wagmi'

const config = useConfig()
const signer = await getEthersSigner(config, { chainId: 11155111 })
```

#### clientToSigner

Convert viem client to ethers.js signer.

```tsx
import { clientToSigner } from '@shieldkit/react'

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
} from '@shieldkit/react'

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

All types from `@shieldkit/core` are re-exported for convenience:

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
} from '@shieldkit/react'

// Also available: CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS
import { CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS } from '@shieldkit/react'
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
