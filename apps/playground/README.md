# ShieldKit React Hooks Examples

Simple Vite + React example demonstrating how to use `@shieldkit/react` hooks.

## Features

This example app demonstrates:

- **Wrap Example** - Convert ERC20 tokens to confidential tokens
- **Unwrap Example** - Request to unwrap confidential tokens back to ERC20
- **Transfer Example** - Send confidential tokens with encrypted amounts
- **Unwrap Queue Example** - View and finalize pending unwrap requests
- **Factory Example** - Create new confidential token wrappers

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- MetaMask or another Web3 wallet
- Sepolia testnet ETH ([get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# From the monorepo root
bun install

# Or from this directory
cd apps/example
bun install
```

### Development

```bash
# From the monorepo root
bun run --filter='example' dev

# Or from this directory
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
bun run build
```

## Usage

1. **Connect Wallet**
   - Click "Connect with MetaMask" (or your preferred wallet)
   - Switch to Sepolia testnet if prompted
   - Approve the connection

2. **Wait for FHE Initialization**
   - The app will automatically initialize FHE
   - You'll see "✅ FHE Ready" when it's done
   - This may take a few seconds on first load

3. **Try the Examples**
   - Navigate between tabs to try different operations
   - Each tab has a code example showing how to use the hooks
   - Follow the on-screen instructions for each operation

## Example Structure

```
src/
├── App.tsx                 # Main app with tabs and wallet connection
├── wagmi.ts               # Wagmi configuration
├── main.tsx               # Entry point with providers
├── examples/
│   ├── WrapExample.tsx            # useWrap demo
│   ├── UnwrapExample.tsx          # useUnwrap demo
│   ├── TransferExample.tsx        # useTransfer demo
│   ├── UnwrapQueueExample.tsx     # useUnwrapQueue + useFinalizeUnwrap
│   └── FactoryExample.tsx         # useFactory demo
└── App.css                # Styling
```

## Key Concepts

### FHE Provider

All examples are wrapped in `FHEProvider` which manages:
- FHE instance initialization (singleton pattern)
- Ethers.js signer creation from wagmi
- Global state for FHE readiness

```tsx
import { FHEProvider } from '@shieldkit/react'

<FHEProvider>
  <App />
</FHEProvider>
```

### Using Hooks

Each hook follows a similar pattern:

```tsx
import { useWrap } from '@shieldkit/react'

const {
  wrap,           // Function to call
  isLoading,      // Loading state
  isSuccess,      // Success state
  error,          // Error message
  txHash,         // Transaction hash
  reset           // Reset state
} = useWrap({
  tokenAddress: '0x...',
  onSuccess: () => console.log('Done!')
})

// Call the function
await wrap('100')
```

### Two-Step Unwrap Process

Unwrapping requires two steps:

1. **Request Unwrap** (`useUnwrap`)
   - Creates an encrypted unwrap request on-chain
   - Returns immediately after transaction confirms

2. **Finalize Unwrap** (`useFinalizeUnwrap`)
   - Decrypts the amount using FHE
   - Completes the unwrap and transfers ERC20 tokens
   - Can be done by anyone after the request is created

### Auto-Refetching Queue

The unwrap queue automatically refreshes:

```tsx
const { unwrapRequests } = useUnwrapQueue({
  tokenAddress: '0x...',
  enableAutoRefetch: true,
  refetchInterval: 15000 // 15 seconds
})
```

## Environment Variables

Create a `.env` file if you need to customize:

```env
# GraphQL endpoint for unwrap queue queries
VITE_ENVIO_GRAPHQL_URL=https://indexer.example.com/v1/graphql
```

## Testnet Information

**Network**: Sepolia Testnet
**Chain ID**: 11155111

**Contract Addresses** (from `/contracts`):
- Factory: `0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c`

Get testnet ETH from:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)

## Learn More

- **API Documentation**: See `packages/react/README.md` for complete API reference
- **Core SDK**: See `packages/core/README.md` for underlying functionality
- **Smart Contracts**: See `packages/contracts/README.md` for contract details

## Troubleshooting

### FHE Initialization Fails

If FHE fails to initialize:
1. Make sure you're on a supported browser (Chrome, Firefox, Edge)
2. Check that MetaMask is installed and unlocked
3. Try refreshing the page
4. Click the "Retry" button in the error message

### Transactions Fail

Common reasons:
- Insufficient balance (need both tokens and ETH for gas)
- Wallet not on Sepolia testnet
- FHE not ready yet (wait for "✅ FHE Ready")

### Unwrap Queue is Empty

If you don't see unwrap requests:
1. Make sure you've created an unwrap request first (Unwrap tab)
2. Check that you're connected with the same wallet
3. Verify the GraphQL endpoint is accessible (check console for errors)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **ethers.js** - Required for FHE operations
- **@shieldkit/react** - Confidential token hooks
- **@tanstack/react-query** - Async state management

## License

MIT
