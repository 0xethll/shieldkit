# ShieldKit - React Toolkit for Confidential Web3 Applications

A comprehensive React toolkit for building confidential Web3 applications using Zama's Fully Homomorphic Encryption (FHE). Built on OpenZeppelin ERC7984, ShieldKit provides hooks, components, and utilities for confidential token operations with encrypted balances.

## Live Demo

🚀 **Try it now:** [https://shieldkit.vercel.app/](https://shieldkit.vercel.app/)

## Key Features

- **Universal ERC20 Wrapping**: Convert any ERC20 token to its confidential version
- **Confidential Transfers**: Execute transactions with fully encrypted amounts and balances
- **Trustless Unwrapping**: Public decryption ensures transparent withdrawal process
- **Developer-Friendly**: Simple React hooks and composable components
- **Type-Safe**: Full TypeScript support with comprehensive type definitions

## Quick Start

### Prerequisites

- **Bun** >= 1.0.0
- **MetaMask** or another Web3 wallet
- **Sepolia testnet ETH** ([get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/0xethll/ShieldKit.git
cd ShieldKit

# Install dependencies
bun install
```

### Development

```bash
# Run playgroud
bun run dev

# Or run specific packages
bun run dev:web        # Run web app
bun run dev:core       # Run core package in watch mode
```

### Build

```bash
# Build all packages and apps
bun run build

# Or build separately
bun run build:packages  # Build packages only
bun run build:apps      # Build apps only
```

## Monorepo Structure

This is a **Bun workspaces** monorepo containing packages and applications:

### 📦 Packages (`/packages`)

- **[@shieldkit/core](./packages/core)** - Core SDK for FHE operations and smart contract interactions
- **[@shieldkit/react](./packages/react)** - React hooks and components for confidential token operations

### 🚀 Applications (`/apps`)

- **[playground](./apps/playground)** - Interactive demo showcasing Dialog and Sidebar integration modes
- **[web](./apps/web)** - z-payment

### 🔧 Additional Directories

- **/contracts** - Smart contracts (ERC7984 implementations)
- **/indexer** - GraphQL indexer for unwrap queue queries
- **/docs** - Documentation and guides

## Package Overview

### @shieldkit/core

Core SDK providing:
- FHE instance management
- Smart contract wrappers (Factory, ERC7984)
- Token operations (wrap, transfer, unwrap)
- Utilities for encryption and proofs

**Install:**
```bash
bun add @shieldkit/core ethers
```

**Usage:**
```typescript
import { FHEFactory } from '@shieldkit/core'

const factory = new FHEFactory(factoryAddress, signer)
const wrapper = await factory.createWrapper(tokenAddress, 'cUSDC')
```

[→ Full API Documentation](./packages/core/README.md)

---

### @shieldkit/react

React hooks and utilities:
- `useWrap` - Wrap ERC20 tokens to confidential tokens
- `useTransfer` - Transfer confidential tokens
- `useUnwrap` - Request unwrap to ERC20
- `useFinalizeUnwrap` - Complete unwrap with decryption
- `useFactory` - Create new wrapper contracts
- `FHEProvider` - Global FHE context provider

**Install:**
```bash
bun add @shieldkit/react @shieldkit/core ethers wagmi viem
```

**Usage:**
```tsx
import { FHEProvider } from '@shieldkit/react'
import { WagmiProvider } from 'wagmi'

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <FHEProvider>
        <YourApp />
      </FHEProvider>
    </WagmiProvider>
  )
}
```

[→ Full Hook Documentation](./packages/react/README.md)

---

## Confidential Token Unwrap Flow with Public Decryption

```
  Client                    ERC7984 Contract              External Index Service
    |                              |                              |
    |--unwrap(from, to, -------->  |                              |
    |  encryptedAmount,            |                              |
    |  inputProof)                 |                              |
    |                              |                              |
    |                        _burn(from, amount)                  |
    |                        returns burntAmount                  |
    |                              |                              |
    |                              |--emit UnwrapRequested(-----> |
    |                              |  to, burntAmount)            |
    |                              |                              |
    |<-------query pending---------|                              |
    |         requests-------------|----------------------------->|
    |                              |                              |
    | fheInstance.publicDecrypt(burntAmount)                      |
    | → gets cleartextAmount + decryptionProof                    |
    |                              |                              |
    |--finalizeUnwrap(--------->   |                              |
    |  burntAmount,                |                              |
    |  cleartextAmount,            |                              |
    |  decryptionProof)            |                              |
    |                              |                              |
```

**Key Innovation:**
- Unwrap uses **public decryption** - anyone can decrypt and finalize
- No trusted third party needed
- Transparent and verifiable on-chain

## Development Workflow

### Running Tests

```bash
# Run all package tests
bun run test

# Run specific package tests
bun run --filter='@shieldkit/core' test
bun run --filter='@shieldkit/react' test
```

### Type Checking

```bash
# Check types across all packages
bun run typecheck
```

### Linting

```bash
# Lint all packages
bun run lint
```

### Cleaning

```bash
# Remove all node_modules and build artifacts
bun run clean
```

## Using in Your Project

### 1. Install Packages

```bash
bun add @shieldkit/react @shieldkit/core ethers wagmi viem
```

### 2. Setup Providers

```tsx
import { FHEProvider } from '@shieldkit/react'
import { WagmiProvider, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

const config = createConfig({
  chains: [sepolia],
  // ... your wagmi config
})

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

### 3. Use Hooks

```tsx
import { useWrap, useTransfer, useUnwrap } from '@shieldkit/react'

function ConfidentialBalance() {
  const { wrap, isLoading } = useWrap({
    tokenAddress: '0x...',
    onSuccess: () => console.log('Wrapped!')
  })

  return (
    <button onClick={() => wrap('100')} disabled={isLoading}>
      {isLoading ? 'Wrapping...' : 'Wrap 100 tokens'}
    </button>
  )
}
```

## Technical Implementation

- **Smart Contracts**: OpenZeppelin Confidential Contracts v0.3.0
- **FHE Technology**: Zama's fhEVM for on-chain encryption
- **Frontend Framework**: React 19 with TypeScript
- **Blockchain Library**: ethers.js v6 + viem
- **State Management**: @tanstack/react-query
- **Build Tool**: Vite (apps) + tsup (packages)

## Contract Addresses (Sepolia Testnet)

**Factory:** `0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c`

**Test Tokens:**
- USDC: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- USDT: `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`
- WETH: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`
- wBTC: `0xb060796D171EeEdA5Fb99df6B2847DA6D4613CAd`

## Examples

### Playground App

See the [Playground README](./apps/playground/README.md) for an interactive demo with:
- 2 integration modes (Dialog and Sidebar patterns)
- Configurable widget features
- Live code preview for each mode

### Basic Usage Examples

Check individual package READMEs for detailed examples:
- [Core SDK Examples](./packages/core/README.md#examples)
- [React Hook Examples](./packages/react/README.md#examples)

## Learn More

### Documentation
- [Core SDK API](./packages/core/README.md)
- [React Hooks API](./packages/react/README.md)
- [Playground Guide](./apps/playground/README.md)

### External Resources
- [Zama fhEVM Documentation](https://docs.zama.org/fhevm)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
- [ERC7984 Specification](https://eips.ethereum.org/EIPS/eip-7984)

## Troubleshooting

### FHE Initialization Fails

**Symptoms:** Widget doesn't work, console shows FHE errors

**Solutions:**
1. Ensure you're on a supported browser (Chrome, Firefox, Edge)
2. Check wallet is connected and unlocked
3. Verify you're on Sepolia testnet
4. Clear browser cache and reload

### Transaction Failures

**Common causes:**
- Insufficient ETH for gas
- Token not approved (call `approve()` first)
- FHE not initialized yet (wait for "✅ FHE Ready")
- Wrong network (must be Sepolia)

### Build Issues

```bash
# Clear everything and reinstall
bun run clean
rm -rf node_modules bun.lock
bun install

# Rebuild from scratch
bun run build
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - see [LICENSE](./LICENSE) file for details

## Credits

Built with:
- [Zama](https://zama.org) - FHE technology
- [OpenZeppelin](https://openzeppelin.com) - Confidential contracts framework
- [wagmi](https://wagmi.sh) - React hooks for Ethereum

---

**Made with ❤️ by ShieldKit**

For questions or support, please open an issue on [GitHub](https://github.com/0xethll/ShieldKit/issues).
