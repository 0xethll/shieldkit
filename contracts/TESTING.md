# Contract Testing Guide

## Overview

Comprehensive test suite for smart contracts using **Hardhat 3**, **Viem**, and **node:test**.

## Quick Start

```bash
cd contracts

# Run all tests
npm test

# Run specific test
npx hardhat test test/USDERC20.test.ts

# Run with gas reporting
npm run test:gas
```

## Test Framework

- **Test Runner**: `node:test` (Node.js built-in, no external dependencies)
- **Assertions**: `node:assert` (Node.js strict assertions)
- **Contract Interaction**: Viem (type-safe Ethereum library)
- **Deployment**: Hardhat Ignition

## Test Structure

### 1. USDERC20 Tests

Basic ERC20 token functionality:

```typescript
describe("USDERC20", function () {
  // Deployment tests
  it("Should set the correct name and symbol");
  it("Should set the correct decimals");
  it("Should have zero initial supply");

  // Minting tests
  it("Should allow anyone to mint tokens");
  it("Should cap mint amount at MAX_MINT_AMOUNT");
  it("Should update total supply after minting");

  // Burning tests
  it("Should allow users to burn their own tokens");
  it("Should decrease total supply after burning");
  it("Should revert if burning more than balance");

  // BurnFrom tests
  it("Should allow approved spender to burn tokens");
  it("Should decrease allowance after burnFrom");
  it("Should revert if burning more than allowance");
});
```

### 2. ConfidentialTokenFactory Tests

Factory pattern and contract creation:

```typescript
describe("ConfidentialTokenFactory", function () {
  // Deployment
  it("Should deploy successfully");
  it("Should have zero wrapped tokens initially");

  // Creating tokens
  it("Should create a confidential token for an ERC20");
  it("Should set correct name and symbol for confidential token");
  it("Should link to the correct underlying token");
  it("Should increment wrapped tokens count");
  it("Should revert if token already wrapped");
  it("Should revert if ERC20 address is zero");

  // Multiple tokens
  it("Should create multiple confidential tokens");
  it("Should return correct addresses for each token");
  it("Should allow different users to create tokens");

  // Queries
  it("Should return correct confidential token address");
  it("Should return zero address for non-wrapped tokens");
  it("Should return correct count of wrapped tokens");
  it("Should return correct tokens with pagination");
});
```

### 3. ConfidentialERC20Wrapper Tests

Basic wrapper functionality (without FHE):

```typescript
describe("ConfidentialERC20Wrapper", function () {
  // Deployment
  it("Should set correct name and symbol");
  it("Should set correct underlying token");
  it("Should set correct decimals");
  it("Should calculate correct rate");

  // Wrapping
  it("Should wrap tokens successfully");
  it("Should revert if insufficient allowance");
  it("Should revert if insufficient balance");

  // Multiple users
  it("Should allow multiple users to wrap tokens");

  // Rate calculation
  it("Should handle tokens with 18 decimals");
  it("Should handle tokens with 6 decimals");
  it("Should handle tokens with fewer decimals");
});
```

## Writing Tests

### Basic Pattern

```typescript
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hre from "hardhat";
import { parseUnits, isAddress } from "viem";

const { viem, networkHelpers } = await hre.network.connect();

describe("MyContract", function () {
  async function deployContractFixture() {
    const [owner, user1, user2] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyContract", [arg1, arg2]);
    return { contract, owner, user1, user2 };
  }

  it("Should test functionality", async function () {
    const { contract } = await networkHelpers.loadFixture(deployContractFixture);

    // Interact
    await contract.write.someFunction([value]);

    // Assert
    const result = await contract.read.getValue();
    assert.equal(result, expectedValue);
  });
});
```

### Testing Reverts

```typescript
it("Should revert with error", async function () {
  const { contract } = await networkHelpers.loadFixture(deployContractFixture);

  await assert.rejects(
    contract.write.failingFunction([]),
    /ExpectedErrorMessage/
  );
});
```

### Using Different Wallets

```typescript
it("Should allow user to interact", async function () {
  const { contract, user1 } = await networkHelpers.loadFixture(deployContractFixture);

  // User1 interacts - use account option (recommended)
  await contract.write.someFunction([value], { account: user1.account });
});
```

**Alternative (verbose) approach:**
```typescript
// Using getContractAt (not recommended unless necessary)
const user1Contract = await viem.getContractAt(
  "MyContract",
  contract.address,
  { client: { wallet: user1 } }
);
await user1Contract.write.someFunction([value]);
```

## Best Practices

### 1. Test Isolation with Fixtures

Use `loadFixture` to ensure each test starts from a clean state:

```typescript
async function deployContractFixture() {
  const [owner, user1, user2] = await viem.getWalletClients();
  const contract = await viem.deployContract("MyContract", []);
  return { contract, owner, user1, user2 };
}

it("Each test independent", async function () {
  const { contract } = await networkHelpers.loadFixture(deployContractFixture);
  // Test logic - starts from fresh blockchain snapshot
});
```

**Benefits of loadFixture:**
- **Performance**: Uses blockchain snapshots instead of redeploying contracts
- **Isolation**: Each test gets a clean state
- **Reusability**: Same fixture can be used across multiple tests

### 2. Descriptive Names

```typescript
// Good ✅
it("Should revert if burning more than balance");

// Bad ❌
it("Test burn");
```

### 3. Type Safety

Use BigInt for amounts:

```typescript
// Good ✅
const amount = parseUnits("100", 6);
assert.equal(balance, 1000n);

// Bad ❌
const amount = 100;
assert.equal(balance, 1000);
```

### 4. Test Edge Cases

Always test:
- Zero values
- Maximum values
- Boundary conditions
- Revert scenarios
- Access control

## Common Issues

### Address Comparison

```typescript
// Addresses may have different cases
assert.equal(
  address1.toLowerCase(),
  address2.toLowerCase()
);
```

### BigInt Operations

```typescript
const total = amount1 + amount2;  // Both must be bigint
const doubled = amount * 2n;       // Use 2n not 2
```

### Test Timeout

For slow operations:

```typescript
it("Slow operation", { timeout: 120000 }, async function () {
  // Test logic
});
```

## Next Steps

- ✅ Basic contract tests complete
- ⬜ Add FHE integration tests
- ⬜ Add gas benchmarking
- ⬜ Set up coverage reporting
- ⬜ Add fuzzing tests

## References

- [Hardhat Viem Plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-viem)
- [Node.js Test Runner](https://nodejs.org/api/test.html)
- [Viem Documentation](https://viem.sh)
- [Zama FHEVM Testing](https://docs.zama.ai/fhevm/guides/testing)
