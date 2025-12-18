// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {FHE, externalEuint64, ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {ConfidentialFungibleToken} from "@openzeppelin/confidential-contracts/contracts/token/ConfidentialFungibleToken.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract FaucetToken is SepoliaConfig, ConfidentialFungibleToken {
    using FHE for *;

    error MintCooldownActive(uint256 timeRemaining);

    uint256 public constant MINT_COOLDOWN = 24 hours;
    uint64 public constant MAX_MINT_AMOUNT = 1000_000_000;
    mapping(address => uint256) public lastMintTime;

    constructor(
        string memory name,
        string memory symbol,
        string memory uri
    ) ConfidentialFungibleToken(name, symbol, uri) {}

    function mint(address to, externalEuint64 amount, bytes memory inputProof) public {
        euint64 max = FHE.asEuint64(MAX_MINT_AMOUNT);

        uint256 timeSinceLastMint = block.timestamp - lastMintTime[to];
        if (lastMintTime[to] != 0 && timeSinceLastMint < MINT_COOLDOWN) {
            revert MintCooldownActive(MINT_COOLDOWN - timeSinceLastMint);
        }

        euint64 eAmount = amount.fromExternal(inputProof);
        eAmount = FHE.select(FHE.lt(eAmount, max), eAmount, max);
        
        lastMintTime[to] = block.timestamp;
        _mint(to, eAmount);
    }

    function getLastMintTime(address user) public view returns (uint256) {
        return lastMintTime[user];
    }

    function burn(address from, externalEuint64 amount, bytes memory inputProof) public {
        _burn(from, amount.fromExternal(inputProof));
    }
}