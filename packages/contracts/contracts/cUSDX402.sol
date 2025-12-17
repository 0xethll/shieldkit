// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {FHE, externalEuint64, ebool, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {ERC7984} from "@openzeppelin/confidential-contracts/contracts/token/ERC7984/ERC7984.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ERC7984ERC20Wrapper} from "@openzeppelin/confidential-contracts/contracts/token/ERC7984/extensions/ERC7984ERC20Wrapper.sol";


/**
 * @title ConfidentialUSDX402 - Privacy-preserving X402 Compatible Token
 * @notice Supports fully private authorized transfers; the signature does not contain the plaintext transfer value.
 */
contract ConfidentialUSDX402 is ZamaEthereumConfig, ERC7984ERC20Wrapper, EIP712{
    using ECDSA for bytes32;

    // uint64 public constant MAX_MINT_AMOUNT = 10_000_000;

    // Modified EIP-712 type hash (excluding value)
    bytes32 public constant TRANSFER_WITH_AUTHORIZATION_TYPEHASH =
        keccak256(
            "TransferWithAuthorization(address from,address to,bytes32 encryptedValueHandle,uint256 validAfter,uint256 validBefore,bytes32 nonce)"
        );

    // Nonce State Management
    mapping(address => mapping(bytes32 => bool)) public authorizationState;

    address public facilitator;

    /**
       * @notice Authorization Used Event
       * @param from payer
       * @param to recipient
       * @param transferred actual transferred value (Facilitator can decrypt)
       * @param nonce used nonce
       */
      event AuthorizationUsed(
          address indexed from,
          address indexed to,
          euint64 transferred,
          bytes32 indexed nonce
      );

    constructor(
        string memory name,
        string memory symbol,
        string memory uri,
        address _facilitator,
        IERC20 underlying
    ) ERC7984(name, symbol, uri) ERC7984ERC20Wrapper(underlying) EIP712(name, "1") {
        facilitator = _facilitator;
    }

    // function mint(
    //     address to,
    //     externalEuint64 amount,
    //     bytes memory inputProof
    // ) public {
    //     euint64 max = FHE.asEuint64(MAX_MINT_AMOUNT);
    //     euint64 eAmount = FHE.fromExternal(amount, inputProof);
    //     eAmount = FHE.select(FHE.lt(eAmount, max), eAmount, max);
    //     _mint(to, eAmount);
    // }

    /**
     * @notice X402 compatible fully privacy-authorized transfers
     * @dev The signature contains no plaintext value, only a promise to encrypt the value.
     * @param from payer's address
     * @param to Recipient's address
     * @param encryptedValue FHE encrypted transfer amount
     * @param inputProof FHE Input Proof
     * @param validAfter Authorization effective time (Unix timestamp)
     * @param validBefore Authorization expiration time (Unix timestamp)
     * @param nonce 32-byte random value (anti-replay)
     * @param signature EIP-712 signature
     */
    function transferWithAuthorization(
        address from,
        address to,
        externalEuint64 encryptedValue,
        bytes memory inputProof,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        bytes memory signature
    ) public returns (euint64 transferred){
        // === Step 1: Basic verification ===
        require(block.timestamp > validAfter, "Authorization not yet valid");
        require(block.timestamp < validBefore, "Authorization expired");
        require(!authorizationState[from][nonce], "Authorization already used");

        // === Step 2: Decrypted value ===
        euint64 eValue = FHE.fromExternal(encryptedValue, inputProof);        

        // === Step 3: EIP-712 Signature Verification ===
        bytes32 encryptedValueHandle = externalEuint64.unwrap(encryptedValue);

        bytes32 structHash = keccak256(
            abi.encode(
                TRANSFER_WITH_AUTHORIZATION_TYPEHASH,
                from,
                to,
                encryptedValueHandle, // Promises using encrypted value instead of plaintext
                validAfter,
                validBefore,
                nonce
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        require(digest.recover(signature) == from, "Invalid signature");

        // === Step 4: Perform Encrypted Transfer ===
        // Attempt to transfer without pre-verifying the balance
        // If the balance is insufficient, transferred will be 0
        transferred = _transfer(from, to, eValue);
        FHE.allow(transferred, facilitator);

        // === Step 5: Mark Nonce as used (to prevent replay attacks) ===
        authorizationState[from][nonce] = true;

        // === Step 6: Trigger the event ===
        emit AuthorizationUsed(from, to, transferred, nonce);
    }

    function burn(address from, externalEuint64 amount, bytes memory inputProof) public {
        _burn(from, FHE.fromExternal(amount, inputProof));
    }

    // TODO: limit owner
    function updateFacilitator(address newFacilitator) external {
        facilitator = newFacilitator;
    }
}
