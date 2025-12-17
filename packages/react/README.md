# @z-payment/react

React hooks and providers for Z-Payment - Easy integration of confidential token operations in React applications.

## Features

- 🎣 **React Hooks**: Easy-to-use hooks for all operations
- ⚛️ **Context Providers**: Global state management
- 🔄 **Auto-refresh**: Automatic balance updates
- 🎯 **Type-Safe**: Full TypeScript support
- ⚡ **Optimized**: Built on wagmi for optimal performance

## Installation

```bash
npm install @z-payment/react @z-payment/core wagmi viem
# or
yarn add @z-payment/react @z-payment/core wagmi viem
# or
bun add @z-payment/react @z-payment/core wagmi viem
```

## Quick Start

```tsx
import { ConfidentialTokenProvider, useWrap } from '@z-payment/react'

function App() {
  return (
    <ConfidentialTokenProvider tokenAddress="0x...">
      <MyComponent />
    </ConfidentialTokenProvider>
  )
}

function MyComponent() {
  const { wrap, isLoading, error } = useWrap()

  const handleWrap = async () => {
    await wrap(100n)
  }

  return (
    <button onClick={handleWrap} disabled={isLoading}>
      {isLoading ? 'Wrapping...' : 'Wrap Tokens'}
    </button>
  )
}
```

## API Reference

### Providers

#### ConfidentialTokenProvider

Main provider for confidential token operations.

```tsx
<ConfidentialTokenProvider
  tokenAddress="0x..."
  factoryAddress="0x..."
>
  {children}
</ConfidentialTokenProvider>
```

### Hooks

#### useWrap

Hook for wrapping ERC20 tokens.

```tsx
const { wrap, isLoading, error, txHash } = useWrap()

await wrap(amount)
```

#### useUnwrap

Hook for unwrapping confidential tokens.

```tsx
const { unwrap, isLoading, error } = useUnwrap()

await unwrap(amount)
```

#### useTransfer

Hook for transferring confidential tokens.

```tsx
const { transfer, isLoading, error } = useTransfer()

await transfer(recipientAddress, amount)
```

#### useUnwrapQueue

Hook for managing unwrap requests.

```tsx
const { requests, finalize, isLoading } = useUnwrapQueue()

// Finalize an unwrap request
await finalize(burntAmount)
```

#### useConfidentialToken

Combined hook with all operations.

```tsx
const {
  balance,
  decryptedBalance,
  wrap,
  unwrap,
  transfer,
  unwrapRequests,
  finalizeUnwrap,
  isLoading
} = useConfidentialToken(tokenAddress)
```

## Advanced Usage

### Factory Operations

```tsx
import { useFactory } from '@z-payment/react'

function CreateWrapper() {
  const { createWrapper, isLoading } = useFactory()

  const create = async (erc20Address) => {
    const result = await createWrapper(erc20Address)
    console.log('Created at:', result.wrapperAddress)
  }

  return <button onClick={() => create('0x...')}>Create</button>
}
```

## Status

**Note**: Full implementation is in progress. Core hooks will be migrated from the demo app in Phase 6.

## License

MIT
