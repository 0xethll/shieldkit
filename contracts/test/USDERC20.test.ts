import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import hre from "hardhat";
import { parseUnits } from "viem";

const { viem, networkHelpers } = await hre.network.connect();

describe("USDERC20", function () {
  async function deployTokenFixture() {
    const [owner, user1, user2] = await viem.getWalletClients();
    const usderc20 = await viem.deployContract("USDERC20", [
      "Test USD",
      "tUSD",
      6,
    ]);
    return { usderc20, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      const { usderc20 } = await networkHelpers.loadFixture(deployTokenFixture);

      assert.equal(await usderc20.read.name(), "Test USD");
      assert.equal(await usderc20.read.symbol(), "tUSD");
    });

    it("Should set the correct decimals", async function () {
      const { usderc20 } = await networkHelpers.loadFixture(deployTokenFixture);

      assert.equal(await usderc20.read.decimals(), 6);
    });

    it("Should have zero initial supply", async function () {
      const { usderc20 } = await networkHelpers.loadFixture(deployTokenFixture);

      assert.equal(await usderc20.read.totalSupply(), 0n);
    });
  });

  describe("Minting", function () {
    it("Should allow anyone to mint tokens", async function () {
      const { usderc20, user1 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);

      const balance = await usderc20.read.balanceOf([user1.account.address]);
      assert.equal(balance, mintAmount);
    });

    it("Should cap mint amount at MAX_MINT_AMOUNT", async function () {
      const { usderc20, user1 } = await networkHelpers.loadFixture(deployTokenFixture);
      const maxMintAmount = parseUnits("10000000", 6);
      const exceedAmount = parseUnits("20000000", 6);

      await usderc20.write.mint([user1.account.address, exceedAmount]);

      const balance = await usderc20.read.balanceOf([user1.account.address]);
      assert.equal(balance, maxMintAmount);
    });

    it("Should update total supply after minting", async function () {
      const { usderc20, user1, user2 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);
      await usderc20.write.mint([user2.account.address, mintAmount]);

      const totalSupply = await usderc20.read.totalSupply();
      assert.equal(totalSupply, mintAmount * 2n);
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their own tokens", async function () {
      const { usderc20, user1 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);
      const burnAmount = parseUnits("500", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);
      await usderc20.write.burn([burnAmount], { account: user1.account });

      const finalBalance = await usderc20.read.balanceOf([
        user1.account.address,
      ]);
      assert.equal(finalBalance, mintAmount - burnAmount);
    });

    it("Should decrease total supply after burning", async function () {
      const { usderc20, user1 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);
      const burnAmount = parseUnits("500", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);
      const initialSupply = await usderc20.read.totalSupply();

      await usderc20.write.burn([burnAmount], { account: user1.account });

      const finalSupply = await usderc20.read.totalSupply();
      assert.equal(finalSupply, initialSupply - burnAmount);
    });

    it("Should revert if burning more than balance", async function () {
      const { usderc20, user1 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);
      const excessAmount = parseUnits("2000", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);

      await assert.rejects(
        usderc20.write.burn([excessAmount], { account: user1.account }),
        /ERC20InsufficientBalance/
      );
    });
  });

  describe("BurnFrom", function () {
    it("Should allow approved spender to burn tokens", async function () {
      const { usderc20, user1, user2 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);
      const burnAmount = parseUnits("500", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);

      // User1 approves user2
      await usderc20.write.approve([user2.account.address, burnAmount], { account: user1.account });

      // User2 burns user1's tokens
      await usderc20.write.burnFrom([user1.account.address, burnAmount], { account: user2.account });

      const balance = await usderc20.read.balanceOf([user1.account.address]);
      assert.equal(balance, parseUnits("500", 6));
    });

    it("Should decrease allowance after burnFrom", async function () {
      const { usderc20, user1, user2 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);
      const approveAmount = parseUnits("1000", 6);
      const burnAmount = parseUnits("500", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);
      await usderc20.write.approve([user2.account.address, approveAmount], { account: user1.account });
      await usderc20.write.burnFrom([user1.account.address, burnAmount], { account: user2.account });

      const allowance = await usderc20.read.allowance([
        user1.account.address,
        user2.account.address,
      ]);
      assert.equal(allowance, approveAmount - burnAmount);
    });

    it("Should revert if burning more than allowance", async function () {
      const { usderc20, user1, user2 } = await networkHelpers.loadFixture(deployTokenFixture);
      const mintAmount = parseUnits("1000", 6);
      const approveAmount = parseUnits("300", 6);
      const burnAmount = parseUnits("500", 6);

      await usderc20.write.mint([user1.account.address, mintAmount]);
      await usderc20.write.approve([user2.account.address, approveAmount], { account: user1.account });

      await assert.rejects(
        usderc20.write.burnFrom([user1.account.address, burnAmount], { account: user2.account }),
        /burn amount exceeds allowance/
      );
    });
  });
});
