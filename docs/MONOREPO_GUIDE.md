# Z-Payment Monorepo Guide

## 📦 Project Structure

```
z-payment/
├── apps/
│   └── web/                   # Application (Next.js)
│   └── exmaple/
│
├── packages/
│   ├── core/                  # @z-payment/core - FHE utilities and types
│   ├── react/                 # @z-payment/react - React Hooks
│   └── contracts/             # @z-payment/contracts - Smart Contracts
│
├── docs/                      # Documentation
├── package.json               # Root workspace config
├── bunfig.toml               # Bun configuration
└── tsconfig.base.json        # Shared TypeScript config
```

## 🚀 Quick Start

### Installation

```bash
# Install all dependencies
bun install
```

### Development

```bash
# Run demo app
bun run dev

# Or run specific package
bun run dev:demo
bun run dev:core
```

### Build

```bash
# Build all packages
bun run build

# Build only packages (not apps)
bun run build:packages
```

### Testing

```bash
# Run all tests
bun test

# Run contract tests
bun run test:contracts
```

## 📚 Packages

### @z-payment/core

Framework-agnostic FHE utilities and type definitions for confidential token operations.

**Location**: `packages/core/`

**What's included**:
- FHE encryption/decryption functions
- Type definitions for all operations
- Token amount helpers

**Usage**:
```typescript
import { initializeFHE, createFHEInstance, encryptUint64 } from '@z-payment/core'

// Initialize FHE
await initializeFHE()
const fheInstance = await createFHEInstance()

// Encrypt an amount
const { handle, proof } = await encryptUint64(
  fheInstance,
  contractAddress,
  userAddress,
  100n
)
```

**Note**: For React applications, use `@z-payment/react` hooks instead.

[📖 Full Documentation](../packages/core/README.md)

### @z-payment/react

React hooks and providers for easy integration.

**Location**: `packages/react/`

**Usage**:
```tsx
import { ConfidentialTokenProvider, useWrap } from '@z-payment/react'

<ConfidentialTokenProvider tokenAddress="0x...">
  <App />
</ConfidentialTokenProvider>
```

[📖 Full Documentation](../packages/react/README.md)

### @z-payment/contracts

Smart contracts, ABIs, and deployment addresses.

**Location**: `packages/contracts/`

**Usage**:
```typescript
import { CONTRACTS, CONTRACT_ADDRESSES } from '@z-payment/contracts'

const factoryABI = CONTRACTS.ConfidentialTokenFactory.abi
```

[📖 Full Documentation](../packages/contracts/README.md)

## 🔧 Workspace Commands

### Package Management

```bash
# Add dependency to specific package
bun add <package> --cwd packages/core

# Add dev dependency
bun add -D <package> --cwd apps/demo

# Update all dependencies
bun update
```

### Running Scripts

```bash
# Run in all packages
bun run --filter='*' <script>

# Run in specific package
bun run --filter='@z-payment/core' <script>

# Run in all packages
bun run --filter='./packages/*' build
```

### Cleanup

```bash
# Clean all build artifacts
bun run clean

# Remove all node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules
```

## 📖 Development Workflow

### Adding a New Feature

1. **Core Utilities**: Add FHE utilities or types to `packages/core/src/`
2. **React Hooks**: Create hook in `packages/react/src/hooks/`
3. **Example App**: Demonstrate usage in `apps/example/`
4. **Web App**: Integrate into `apps/web/`

### Publishing Packages

```bash
# Build packages
bun run build:packages

# Publish (when ready)
cd packages/core && npm publish
cd packages/react && npm publish
cd packages/contracts && npm publish
```

## 🎯 Next Steps

### Future Enhancements

- [ ] Add `@z-payment/ui` - Pre-built React components
- [ ] Add `@z-payment/widget` - Embeddable widget
- [ ] Add `@z-payment/cli` - Command-line tools
- [ ] Documentation website
- [ ] Example projects

## 🔍 Troubleshooting

### Bun Install Issues

If `bun install` is slow or hangs:
```bash
# Clear cache
rm -rf node_modules bun.lockb
bun install
```

### TypeScript Errors

```bash
# Rebuild TypeScript references
bun run typecheck
```

### Module Resolution Issues

Ensure workspace dependencies use `workspace:*` in package.json:
```json
{
  "dependencies": {
    "@z-payment/core": "workspace:*"
  }
}
```

## 📝 Notes

- All packages use TypeScript source directly (no build step required for development)
- Bun workspace automatically links local packages
- Demo app remains fully functional throughout migration
- Contract tests can run independently

## 🤝 Contributing

See individual package READMEs for specific contribution guidelines.

## 📄 License

MIT
