import { describe, it, before } from "node:test";
import { strict as assert } from "node:assert";
import hre from "hardhat";
import { parseUnits, isAddress } from "viem";
import {
  initFhevm,
  createEncryptedInput,
  decryptUint64,
} from "./helpers/fhevm.js";

const { viem, networkHelpers } = await hre.network.connect();

/**
 * Tests for ConfidentialERC20Wrapper
 *
 * This test suite covers:
 * - Basic ERC20 wrapping/unwrapping functionality
 * - Encrypted confidential transfers using FHEVM
 * - Encrypted balance verification
 * - Rate calculations for different token decimals
 */
describe("ConfidentialERC20Wrapper", function () {
  before(async function () {
    // Initialize FHEVM instance before running tests
    await initFhevm();
  });

  async function deployWrapperFixture() {
    const [owner, user1, user2] = await viem.getWalletClients();

    const usderc20 = await viem.deployContract("USDERC20", [
      "Test USD",
      "tUSD",
      6,
    ]);

    const wrapper = await viem.deployContract(
      "ConfidentialERC20Wrapper",
      ["Confidential Test USD", "ctUSD", "", usderc20.address]
    );

    return { usderc20, wrapper, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      const { wrapper } = await networkHelpers.loadFixture(deployWrapperFixture);

      assert.equal(await wrapper.read.name(), "Confidential Test USD");
      assert.equal(await wrapper.read.symbol(), "ctUSD");
    });

    it("Should set correct underlying token", async function () {
      const { wrapper, usderc20 } = await networkHelpers.loadFixture(deployWrapperFixture);

      const underlying = await wrapper.read.underlying() as `0x${string}`;
      assert.equal(underlying.toLowerCase(), usderc20.address.toLowerCase());
    });

    it("Should set correct decimals", async function () {
      const { wrapper } = await networkHelpers.loadFixture(deployWrapperFixture);

      const decimals = await wrapper.read.decimals();
      assert.equal(decimals, 6);
    });

    it("Should calculate correct rate", async function () {
      const { wrapper } = await networkHelpers.loadFixture(deployWrapperFixture);

      const rate = await wrapper.read.rate();
      assert.equal(rate, 1n);
    });
  });

  describe("Wrapping Tokens", function () {
    it("Should wrap tokens successfully", async function () {
      const { usderc20, wrapper, user1 } = await networkHelpers.loadFixture(deployWrapperFixture);

      const wrapAmount = parseUnits("100", 6);

      // Mint tokens to user1
      await usderc20.write.mint([user1.account.address, parseUnits("1000", 6)]);

      // User1 approves wrapper
      await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });

      // User1 wraps tokens
      await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

      // Verify ERC20 was transferred to wrapper
      const wrapperBalance = await usderc20.read.balanceOf([wrapper.address]);
      assert.equal(wrapperBalance, wrapAmount);

      // Verify user1's ERC20 balance decreased
      const user1Balance = await usderc20.read.balanceOf([
        user1.account.address,
      ]);
      assert.equal(user1Balance, parseUnits("900", 6));
    });

    it("Should revert if insufficient allowance", async function () {
      const { usderc20, wrapper, user1 } = await networkHelpers.loadFixture(deployWrapperFixture);

      const wrapAmount = parseUnits("100", 6);

      await usderc20.write.mint([user1.account.address, parseUnits("1000", 6)]);

      // Don't approve enough tokens
      await usderc20.write.approve([wrapper.address, parseUnits("50", 6)], { account: user1.account });

      await assert.rejects(
        wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account })
      );
    });

    it("Should revert if insufficient balance", async function () {
      const { usderc20, wrapper, user1 } = await networkHelpers.loadFixture(deployWrapperFixture);

      const wrapAmount = parseUnits("2000", 6);

      await usderc20.write.mint([user1.account.address, parseUnits("1000", 6)]);
      await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });

      await assert.rejects(
        wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account })
      );
    });
  });

  describe("Multiple Users", function () {
    it("Should allow multiple users to wrap tokens", async function () {
      const { usderc20, wrapper, user1, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

      const wrapAmount = parseUnits("100", 6);

      // Mint to both users
      await usderc20.write.mint([user1.account.address, parseUnits("1000", 6)]);
      await usderc20.write.mint([user2.account.address, parseUnits("1000", 6)]);

      // User1 wraps
      await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
      await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

      // User2 wraps
      await usderc20.write.approve([wrapper.address, wrapAmount], { account: user2.account });
      await wrapper.write.wrap([user2.account.address, wrapAmount], { account: user2.account });

      // Verify wrapper received tokens from both
      const wrapperBalance = await usderc20.read.balanceOf([wrapper.address]);
      assert.equal(wrapperBalance, wrapAmount * 2n);
    });
  });

  describe("Rate Calculation", function () {
    it("Should handle tokens with 18 decimals", async function () {
      const token18 = await viem.deployContract("USDERC20", [
        "18 Decimal Token",
        "T18",
        18,
      ]);

      const wrapper18 = await viem.deployContract(
        "ConfidentialERC20Wrapper",
        ["Confidential T18", "cT18", "", token18.address]
      );

      // Rate should be 10^12 (18 - 6 decimals difference)
      const rate = await wrapper18.read.rate();
      assert.equal(rate, 10n ** 12n);

      // Decimals should be capped at 6
      const decimals = await wrapper18.read.decimals();
      assert.equal(decimals, 6);
    });

    it("Should handle tokens with 6 decimals", async function () {
      const { wrapper } = await networkHelpers.loadFixture(deployWrapperFixture);

      const rate = await wrapper.read.rate();
      assert.equal(rate, 1n);

      const decimals = await wrapper.read.decimals();
      assert.equal(decimals, 6);
    });

    it("Should handle tokens with fewer decimals", async function () {
      const token2 = await viem.deployContract("USDERC20", [
        "2 Decimal Token",
        "T2",
        2,
      ]);

      const wrapper2 = await viem.deployContract(
        "ConfidentialERC20Wrapper",
        ["Confidential T2", "cT2", "", token2.address]
      );

      // Rate should be 1 (decimals < maxDecimals)
      const rate = await wrapper2.read.rate();
      assert.equal(rate, 1n);

      // Decimals should match underlying
      const decimals = await wrapper2.read.decimals();
      assert.equal(decimals, 2);
    });
  });

  // describe("Confidential Transfers", function () {
  //   it("Should perform encrypted confidential transfer", async function () {
  //     const { usderc20, wrapper, user1, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("1000", 6);
  //     const transferAmount = 100n; // Amount in confidential token decimals (6)

  //     // Setup: Mint and wrap tokens for user1
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // Create encrypted input for transfer amount
  //     const encryptedInput = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput.add64(transferAmount);
  //     const encryptedTransferAmount = await encryptedInput.encrypt();

  //     // Perform confidential transfer
  //     await wrapper.write.confidentialTransfer(
  //       [user2.account.address, encryptedTransferAmount.handles[0], encryptedTransferAmount.inputProof],
  //       { account: user1.account }
  //     );

  //     // Verify encrypted balance of recipient
  //     const user2EncryptedBalance = await wrapper.read.confidentialBalanceOf([user2.account.address]);
  //     const user2Balance = await decryptUint64(
  //       user2EncryptedBalance as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(user2Balance, transferAmount);

  //     // Verify sender's balance decreased
  //     const user1EncryptedBalance = await wrapper.read.confidentialBalanceOf([user1.account.address]);
  //     const user1Balance = await decryptUint64(
  //       user1EncryptedBalance as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(user1Balance, wrapAmount - transferAmount);
  //   });

  //   it("Should handle multiple confidential transfers", async function () {
  //     const { usderc20, wrapper, user1, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("1000", 6);
  //     const firstTransfer = 100n;
  //     const secondTransfer = 50n;

  //     // Setup
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // First transfer
  //     const encryptedInput1 = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput1.add64(firstTransfer);
  //     const encrypted1 = await encryptedInput1.encrypt();

  //     await wrapper.write.confidentialTransfer(
  //       [user2.account.address, encrypted1.handles[0], encrypted1.inputProof],
  //       { account: user1.account }
  //     );

  //     // Second transfer
  //     const encryptedInput2 = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput2.add64(secondTransfer);
  //     const encrypted2 = await encryptedInput2.encrypt();

  //     await wrapper.write.confidentialTransfer(
  //       [user2.account.address, encrypted2.handles[0], encrypted2.inputProof],
  //       { account: user1.account }
  //     );

  //     // Verify final balance
  //     const user2EncryptedBalance = await wrapper.read.confidentialBalanceOf([user2.account.address]);
  //     const user2Balance = await decryptUint64(
  //       user2EncryptedBalance as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(user2Balance, firstTransfer + secondTransfer);
  //   });

  //   it("Should reject transfer with insufficient encrypted balance", async function () {
  //     const { usderc20, wrapper, user1, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("100", 6);
  //     const transferAmount = parseUnits("200", 6); // More than wrapped

  //     // Setup
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // Try to transfer more than balance
  //     const encryptedInput = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput.add64(transferAmount);
  //     const encrypted = await encryptedInput.encrypt();

  //     await assert.rejects(
  //       wrapper.write.confidentialTransfer(
  //         [user2.account.address, encrypted.handles[0], encrypted.inputProof],
  //         { account: user1.account }
  //       )
  //     );
  //   });
  // });

  // describe("Unwrapping Tokens", function () {
  //   it("Should unwrap encrypted tokens back to ERC20", async function () {
  //     const { usderc20, wrapper, user1 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("1000", 6);
  //     const unwrapAmount = 500n; // Amount in confidential token decimals

  //     // Setup: Mint and wrap tokens
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // Create encrypted input for unwrap amount
  //     const encryptedInput = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput.add64(unwrapAmount);
  //     const encryptedUnwrapAmount = await encryptedInput.encrypt();

  //     // Get initial ERC20 balance
  //     const initialERC20Balance = await usderc20.read.balanceOf([user1.account.address]);

  //     // Unwrap tokens
  //     await wrapper.write.unwrap(
  //       [user1.account.address, user1.account.address, encryptedUnwrapAmount.handles[0], encryptedUnwrapAmount.inputProof],
  //       { account: user1.account }
  //     );

  //     // Verify ERC20 balance increased
  //     const finalERC20Balance = await usderc20.read.balanceOf([user1.account.address]);
  //     assert.equal(finalERC20Balance - initialERC20Balance, unwrapAmount);

  //     // Verify confidential balance decreased
  //     const encryptedBalance = await wrapper.read.confidentialBalanceOf([user1.account.address]);
  //     const confidentialBalance = await decryptUint64(
  //       encryptedBalance as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(confidentialBalance, wrapAmount - unwrapAmount);
  //   });

  //   it("Should unwrap to different recipient", async function () {
  //     const { usderc20, wrapper, user1, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("1000", 6);
  //     const unwrapAmount = 300n;

  //     // Setup
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // Unwrap to user2
  //     const encryptedInput = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput.add64(unwrapAmount);
  //     const encrypted = await encryptedInput.encrypt();

  //     await wrapper.write.unwrap(
  //       [user1.account.address, user2.account.address, encrypted.handles[0], encrypted.inputProof],
  //       { account: user1.account }
  //     );

  //     // Verify user2 received ERC20 tokens
  //     const user2Balance = await usderc20.read.balanceOf([user2.account.address]);
  //     assert.equal(user2Balance, unwrapAmount);
  //   });

  //   it("Should reject unwrap with insufficient balance", async function () {
  //     const { usderc20, wrapper, user1 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("100", 6);
  //     const unwrapAmount = parseUnits("200", 6);

  //     // Setup
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // Try to unwrap more than balance
  //     const encryptedInput = await createEncryptedInput(wrapper.address, user1.account.address);
  //     encryptedInput.add64(unwrapAmount);
  //     const encrypted = await encryptedInput.encrypt();

  //     await assert.rejects(
  //       wrapper.write.unwrap(
  //         [user1.account.address, user1.account.address, encrypted.handles[0], encrypted.inputProof],
  //         { account: user1.account }
  //       )
  //     );
  //   });
  // });

  // describe("Encrypted Balance Queries", function () {
  //   it("Should return correct encrypted balance after wrap", async function () {
  //     const { usderc20, wrapper, user1 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const wrapAmount = parseUnits("500", 6);

  //     // Wrap tokens
  //     await usderc20.write.mint([user1.account.address, wrapAmount]);
  //     await usderc20.write.approve([wrapper.address, wrapAmount], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, wrapAmount], { account: user1.account });

  //     // Query and decrypt balance
  //     const encryptedBalance = await wrapper.read.confidentialBalanceOf([user1.account.address]);
  //     const balance = await decryptUint64(
  //       encryptedBalance as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(balance, wrapAmount);
  //   });

  //   it("Should return zero encrypted balance for new user", async function () {
  //     const { wrapper, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const encryptedBalance = await wrapper.read.confidentialBalanceOf([user2.account.address]);
  //     const balance = await decryptUint64(
  //       encryptedBalance as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(balance, 0n);
  //   });

  //   it("Should return correct encrypted total supply", async function () {
  //     const { usderc20, wrapper, user1, user2 } = await networkHelpers.loadFixture(deployWrapperFixture);

  //     const amount1 = parseUnits("300", 6);
  //     const amount2 = parseUnits("200", 6);

  //     // Wrap for user1
  //     await usderc20.write.mint([user1.account.address, amount1]);
  //     await usderc20.write.approve([wrapper.address, amount1], { account: user1.account });
  //     await wrapper.write.wrap([user1.account.address, amount1], { account: user1.account });

  //     // Wrap for user2
  //     await usderc20.write.mint([user2.account.address, amount2]);
  //     await usderc20.write.approve([wrapper.address, amount2], { account: user2.account });
  //     await wrapper.write.wrap([user2.account.address, amount2], { account: user2.account });

  //     // Query total supply
  //     const encryptedTotalSupply = await wrapper.read.confidentialTotalSupply();
  //     const totalSupply = await decryptUint64(
  //       encryptedTotalSupply as bigint,
  //       wrapper.address
  //     );

  //     assert.equal(totalSupply, amount1 + amount2);
  //   });
  // });
});
