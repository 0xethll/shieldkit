// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {FHE, externalEuint64, ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {ConfidentialFungibleToken} from "@openzeppelin/confidential-contracts/contracts/token/ConfidentialFungibleToken.sol";
import {ConfidentialFungibleTokenERC20Wrapper} from "@openzeppelin/confidential-contracts/contracts/token/extensions/ConfidentialFungibleTokenERC20Wrapper.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract WrapperToken is SepoliaConfig, ConfidentialFungibleTokenERC20Wrapper {
    using FHE for *;

    constructor(
        string memory name,
        string memory symbol,
        string memory uri,
        IERC20 underlying
    ) ConfidentialFungibleToken(name, symbol, uri) ConfidentialFungibleTokenERC20Wrapper(underlying) {}

    function burn(address from, externalEuint64 amount, bytes memory inputProof) public {
        _burn(from, amount.fromExternal(inputProof));
    }
}