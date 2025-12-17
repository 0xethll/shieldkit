// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {FHE, externalEuint64, ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";

import {ConfidentialFungibleToken} from "@openzeppelin/confidential-contracts/contracts/token/ConfidentialFungibleToken.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";


contract ConfidentialUSD is SepoliaConfig, ConfidentialFungibleToken {
    uint64 public constant MAX_MINT_AMOUNT = 10_000_000;

    constructor(
        string memory name,
        string memory symbol,
        string memory uri
    ) ConfidentialFungibleToken(name, symbol, uri) {}

    function mint(address to, externalEuint64 amount, bytes memory inputProof) public {
        euint64 max = FHE.asEuint64(MAX_MINT_AMOUNT);

        euint64 eAmount = FHE.fromExternal(amount, inputProof);
        eAmount = FHE.select(FHE.lt(eAmount, max), eAmount, max);
        
        _mint(to, eAmount);
    }
}