import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hre from "hardhat";
import { parseUnits, isAddress } from "viem";

const { viem, networkHelpers } = await hre.network.connect();

describe("ConfidentialTokenFactory", function () {
  async function deployFactoryFixture() {
    const [owner, user1, user2] = await viem.getWalletClients();
    const factory = await viem.deployContract("ConfidentialTokenFactory", []);
    return { factory, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      assert.ok(isAddress(factory.address));
    });

    it("Should have zero wrapped tokens initially", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      const count = await factory.read.getAllWrappedTokensCount();
      assert.equal(count, 0n);
    });
  });

  describe("Creating Confidential Tokens", function () {
    it("Should create a confidential token for an ERC20", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);
      const usderc20 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20.address]);

      const confidentialToken = await factory.read.getConfidentialToken([
        usderc20.address,
      ]) as `0x${string}`;

      assert.ok(isAddress(confidentialToken));
      assert.notEqual(
        confidentialToken,
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("Should set correct name and symbol for confidential token", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);
      const usderc20 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20.address]);

      const confidentialTokenAddress = await factory.read.getConfidentialToken(
        [usderc20.address]
      ) as `0x${string}`;

      const confidentialToken = await viem.getContractAt(
        "ConfidentialERC20Wrapper",
        confidentialTokenAddress
      );

      const name = await confidentialToken.read.name();
      const symbol = await confidentialToken.read.symbol();

      assert.equal(name, "Confidential Test USD");
      assert.equal(symbol, "ctUSD");
    });

    it("Should link to the correct underlying token", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);
      const usderc20 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20.address]);

      const confidentialTokenAddress = await factory.read.getConfidentialToken(
        [usderc20.address]
      ) as `0x${string}`;

      const confidentialToken = await viem.getContractAt(
        "ConfidentialERC20Wrapper",
        confidentialTokenAddress
      );

      const underlying = await confidentialToken.read.underlying() as `0x${string}`;
      assert.equal(underlying.toLowerCase(), usderc20.address.toLowerCase());
    });

    it("Should increment wrapped tokens count", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);
      const usderc20 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20.address]);

      const count = await factory.read.getAllWrappedTokensCount();
      assert.equal(count, 1n);
    });

    it("Should revert if token already wrapped", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);
      const usderc20 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20.address]);

      await assert.rejects(
        factory.write.createConfidentialToken([usderc20.address]),
        /TokenAlreadyWrapped/
      );
    });

    it("Should revert if ERC20 address is zero", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      await assert.rejects(
        factory.write.createConfidentialToken([
          "0x0000000000000000000000000000000000000000",
        ]),
        /InvalidTokenAddress/
      );
    });
  });

  describe("Multiple Token Creation", function () {
    it("Should create multiple confidential tokens", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      const usderc20_1 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);
      const usderc20_2 = await viem.deployContract("USDERC20", [
        "Test USDC",
        "tUSDC",
        6,
      ]);
      const usderc20_3 = await viem.deployContract("USDERC20", [
        "Test DAI",
        "tDAI",
        18,
      ]);

      await factory.write.createConfidentialToken([usderc20_1.address]);
      await factory.write.createConfidentialToken([usderc20_2.address]);
      await factory.write.createConfidentialToken([usderc20_3.address]);

      const count = await factory.read.getAllWrappedTokensCount();
      assert.equal(count, 3n);
    });

    it("Should return correct addresses for each token", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      const usderc20_1 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);
      const usderc20_2 = await viem.deployContract("USDERC20", [
        "Test USDC",
        "tUSDC",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20_1.address]);
      await factory.write.createConfidentialToken([usderc20_2.address]);

      const ct1 = await factory.read.getConfidentialToken([
        usderc20_1.address,
      ]) as `0x${string}`;
      const ct2 = await factory.read.getConfidentialToken([
        usderc20_2.address,
      ]) as `0x${string}`;

      assert.notEqual(ct1, ct2);
      assert.ok(isAddress(ct1));
      assert.ok(isAddress(ct2));
    });

    it("Should allow different users to create tokens", async function () {
      const { factory, user1 } = await networkHelpers.loadFixture(deployFactoryFixture);

      const usderc20_1 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);
      const usderc20_2 = await viem.deployContract("USDERC20", [
        "Test USDC",
        "tUSDC",
        6,
      ]);

      // Owner creates first token
      await factory.write.createConfidentialToken([usderc20_1.address]);

      // User1 creates second token
      await factory.write.createConfidentialToken([usderc20_2.address], { account: user1.account });

      const count = await factory.read.getAllWrappedTokensCount();
      assert.equal(count, 2n);
    });
  });

  describe("Query Functions", function () {
    it("Should return correct confidential token address", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);
      const usderc20 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20.address]);

      const confidentialToken = await factory.read.getConfidentialToken([
        usderc20.address,
      ]) as `0x${string}`;

      assert.ok(isAddress(confidentialToken));
      assert.notEqual(
        confidentialToken,
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("Should return zero address for non-wrapped tokens", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      const randomAddress = "0x0000000000000000000000000000000000000001";
      const result = await factory.read.getConfidentialToken([randomAddress]);

      assert.equal(result, "0x0000000000000000000000000000000000000000");
    });

    it("Should return correct count of wrapped tokens", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      const usderc20_1 = await viem.deployContract("USDERC20", [
        "Test USD",
        "tUSD",
        6,
      ]);
      const usderc20_2 = await viem.deployContract("USDERC20", [
        "Test USDC",
        "tUSDC",
        6,
      ]);

      await factory.write.createConfidentialToken([usderc20_1.address]);
      await factory.write.createConfidentialToken([usderc20_2.address]);

      const count = await factory.read.getAllWrappedTokensCount();
      assert.equal(count, 2n);
    });

    it("Should return correct tokens with pagination", async function () {
      const { factory } = await networkHelpers.loadFixture(deployFactoryFixture);

      // Create 4 tokens
      for (let i = 0; i < 4; i++) {
        const token = await viem.deployContract("USDERC20", [
          `Token ${i}`,
          `T${i}`,
          6,
        ]);
        await factory.write.createConfidentialToken([token.address]);
      }

      const count = await factory.read.getAllWrappedTokensCount();
      assert.equal(count, 4n);

      // Get first 2
      const first2 = await factory.read.getWrappedTokens([0n, 2n]) as `0x${string}`;
      assert.equal(first2.length, 2);

      // Get next 2
      const next2 = await factory.read.getWrappedTokens([2n, 2n]) as `0x${string}`;
      assert.equal(next2.length, 2);

      // Get with limit exceeding total
      const all = await factory.read.getWrappedTokens([0n, 10n]) as `0x${string}`;
      assert.equal(all.length, 4);
    });
  });
});
