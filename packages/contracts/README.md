# @z-payment/contracts

Smart contracts, ABIs, and deployment addresses for Z-Payment.

## Contents

- ✅ **Solidity Contracts**: Source code for all contracts
- 📜 **ABIs**: Contract ABIs for frontend integration
- 🌐 **Addresses**: Deployed contract addresses by network
- 🧪 **Tests**: Comprehensive test suite

## Contracts

### ConfidentialTokenFactory

Factory contract for creating confidential wrappers for any ERC20 token.

```solidity
function createConfidentialToken(address erc20Token)
    external
    returns (address confidentialToken)
```

### ConfidentialERC20Wrapper

Confidential ERC20 token wrapper implementing ERC7984 standard.

- `wrap()`: Convert ERC20 to confidential tokens
- `unwrap()`: Convert confidential tokens back to ERC20
- `confidentialTransfer()`: Private transfers with encrypted amounts
- `finalizeUnwrap()`: Complete unwrap with public decryption

## Usage

### In TypeScript/JavaScript

```typescript
import { CONTRACTS, CONTRACT_ADDRESSES, CHAIN_IDS } from '@z-payment/contracts'

// Get contract ABI
const factoryABI = CONTRACTS.ConfidentialTokenFactory.abi

// Get contract address
const factoryAddress = CONTRACT_ADDRESSES[CHAIN_IDS.SEPOLIA].ConfidentialTokenFactory
```

### Testing

```bash
# Run all tests
bun run test

# Run specific test
bun run test:confidential

# Coverage report
bun run test:coverage
```

## Deployed Addresses

### Sepolia Testnet

- **ConfidentialTokenFactory**: `0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c`
- **cUSD (Example)**: `0xdCE9Fa07b2ad32D2E6C8051A895262C9914E9445`
- **USD ERC20 (Test Token)**: `0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a`

## Development

### Build

```bash
bun run build
```

### Deploy

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

## License

MIT
