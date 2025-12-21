# contracts

Smart contracts, ABIs, and deployment addresses for ShieldKit.

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

### Testing

## Deployed Addresses

### Sepolia Testnet

- **ConfidentialTokenFactory**: `0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c`

## Development

## License

MIT
