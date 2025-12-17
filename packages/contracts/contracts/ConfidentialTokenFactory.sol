// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ConfidentialERC20Wrapper} from "./ConfidentialERC20Wrapper.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";

/**
 * @title ConfidentialTokenFactory
 * @notice Factory contract for creating confidential versions of any ERC20 token
 * @dev Core features:
 *      1. One-click deployment of confidential tokens
 *      2. Prevent duplicate creation (one official confidential version per ERC20)
 *      3. Emit events for indexer monitoring
 */
contract ConfidentialTokenFactory {
    /// @notice Mapping from ERC20 to confidential token
    mapping(address => address) public wrappedTokens;

    /// @notice List of all created confidential tokens
    address[] public allWrappedTokens;

    /// @notice Event emitted when a new confidential token is created
    event TokenWrapped(
        address indexed erc20Token,
        address indexed confidentialToken,
        string name,
        string symbol,
        address indexed creator
    );

    error InvalidTokenAddress();
    error TokenAlreadyWrapped(address existingWrapper);
    error DeploymentFailed();

    /**
     * @notice Create a confidential token for a given ERC20
     * @param erc20Token Address of the ERC20 token to wrap
     * @return confidentialToken Address of the created confidential token
     */
    function createConfidentialToken(
        address erc20Token
    ) external returns (address confidentialToken) {
        // 1. Validate parameters
        if (erc20Token == address(0)) revert InvalidTokenAddress();

        address existing = wrappedTokens[erc20Token];
        if (existing != address(0)) revert TokenAlreadyWrapped(existing);

        // 2. Get ERC20 metadata
        IERC20Metadata token = IERC20Metadata(erc20Token);
        string memory name = string.concat("Confidential ", token.name());
        string memory symbol = string.concat("c", token.symbol());
        string memory uri = ""; // Customizable metadata URI

        // 3. Deploy new confidential token contract
        ConfidentialERC20Wrapper newToken = new ConfidentialERC20Wrapper(
            name,
            symbol,
            uri,
            IERC20(erc20Token)
        );

        confidentialToken = address(newToken);

        // 4. Verify deployment success
        if (confidentialToken == address(0)) revert DeploymentFailed();
        if (address(newToken.underlying()) != erc20Token) revert DeploymentFailed();

        // 5. Record mapping
        wrappedTokens[erc20Token] = confidentialToken;
        allWrappedTokens.push(confidentialToken);

        // 6. Emit event for indexer
        emit TokenWrapped(erc20Token, confidentialToken, name, symbol, msg.sender);
    }

    /**
     * @notice Get the confidential token address for a given ERC20
     * @param erc20Token ERC20 token address
     * @return Confidential token address, or address(0) if not exists
     */
    function getConfidentialToken(address erc20Token) external view returns (address) {
        return wrappedTokens[erc20Token];
    }

    /**
     * @notice Get the total count of all confidential tokens
     */
    function getAllWrappedTokensCount() external view returns (uint256) {
        return allWrappedTokens.length;
    }

    /**
     * @notice Get confidential token addresses in batches (paginated)
     * @param offset Starting index
     * @param limit Number of results to return
     */
    function getWrappedTokens(
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory tokens) {
        uint256 total = allWrappedTokens.length;
        if (offset >= total) return new address[](0);

        uint256 end = offset + limit;
        if (end > total) end = total;

        uint256 length = end - offset;
        tokens = new address[](length);

        for (uint256 i = 0; i < length; i++) {
            tokens[i] = allWrappedTokens[offset + i];
        }
    }
}
