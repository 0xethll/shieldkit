// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {ERC7984} from "@openzeppelin/confidential-contracts/contracts/token/ERC7984/ERC7984.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {ERC7984ERC20Wrapper} from "@openzeppelin/confidential-contracts/contracts/token/ERC7984/extensions/ERC7984ERC20Wrapper.sol";

/**
 * @title ConfidentialERC20Wrapper
 * @notice Minimal confidential token wrapper supporting wrap/unwrap for any ERC20
 * @dev Core features only:
 *      - wrap: ERC20 → Confidential token
 *      - unwrap: Confidential token → ERC20
 *      - confidentialTransfer: Private transfer
 */
contract ConfidentialERC20Wrapper is ZamaEthereumConfig, ERC7984ERC20Wrapper {

    constructor(
        string memory name,
        string memory symbol,
        string memory uri,
        IERC20 underlying
    ) ERC7984(name, symbol, uri) ERC7984ERC20Wrapper(underlying) {}
}
