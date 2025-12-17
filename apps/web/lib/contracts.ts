// Contract addresses and ABIs for the application

export const CONTRACTS = {
  ConfidentialTokenFactory: {
    address: '0x08B2616Eb8F33700014fd53f143aFcaD1d6e512c' as const,
    abi: [
      {
        inputs: [],
        name: 'DeploymentFailed',
        type: 'error',
      },
      {
        inputs: [],
        name: 'InvalidTokenAddress',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'existingWrapper',
            type: 'address',
          },
        ],
        name: 'TokenAlreadyWrapped',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'erc20Token',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'confidentialToken',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
        ],
        name: 'TokenWrapped',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'allWrappedTokens',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'erc20Token',
            type: 'address',
          },
        ],
        name: 'createConfidentialToken',
        outputs: [
          {
            internalType: 'address',
            name: 'confidentialToken',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getAllWrappedTokensCount',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'erc20Token',
            type: 'address',
          },
        ],
        name: 'getConfidentialToken',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'offset',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'limit',
            type: 'uint256',
          },
        ],
        name: 'getWrappedTokens',
        outputs: [
          {
            internalType: 'address[]',
            name: 'tokens',
            type: 'address[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'wrappedTokens',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
  },
  cUSD_ERC7984: {
    address: '0xdCE9Fa07b2ad32D2E6C8051A895262C9914E9445' as const,
    abi: [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
          {
            internalType: 'address',
            name: '_facilitator',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'underlying',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'length',
            type: 'uint256',
          },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'requestId',
            type: 'uint256',
          },
        ],
        name: 'ERC7984InvalidGatewayRequest',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'ERC7984InvalidReceiver',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'ERC7984InvalidSender',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'caller',
            type: 'address',
          },
        ],
        name: 'ERC7984UnauthorizedCaller',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'holder',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'ERC7984UnauthorizedSpender',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
          {
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
        ],
        name: 'ERC7984UnauthorizedUseOfEncryptedAmount',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'holder',
            type: 'address',
          },
        ],
        name: 'ERC7984ZeroBalance',
        type: 'error',
      },
      {
        inputs: [],
        name: 'InvalidKMSSignatures',
        type: 'error',
      },
      {
        inputs: [],
        name: 'InvalidShortString',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
        ],
        name: 'InvalidUnwrapRequest',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'uint8',
            name: 'bits',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'SafeCastOverflowedUintDowncast',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
        ],
        name: 'SafeERC20FailedOperation',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: 'str',
            type: 'string',
          },
        ],
        name: 'StringTooLong',
        type: 'error',
      },
      {
        inputs: [],
        name: 'ZamaProtocolUnsupported',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'euint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'requester',
            type: 'address',
          },
        ],
        name: 'AmountDiscloseRequested',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'euint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            indexed: false,
            internalType: 'uint64',
            name: 'amount',
            type: 'uint64',
          },
        ],
        name: 'AmountDisclosed',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'nonce',
            type: 'bytes32',
          },
        ],
        name: 'AuthorizationUsed',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
        ],
        name: 'ConfidentialTransfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'holder',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint48',
            name: 'until',
            type: 'uint48',
          },
        ],
        name: 'OperatorSet',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'bytes32[]',
            name: 'handlesList',
            type: 'bytes32[]',
          },
          {
            indexed: false,
            internalType: 'bytes',
            name: 'abiEncodedCleartexts',
            type: 'bytes',
          },
        ],
        name: 'PublicDecryptionVerified',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'euint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            indexed: false,
            internalType: 'uint64',
            name: 'cleartextAmount',
            type: 'uint64',
          },
        ],
        name: 'UnwrapFinalized',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
        ],
        name: 'UnwrapRequested',
        type: 'event',
      },
      {
        inputs: [],
        name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        name: 'authorizationState',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'amount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'confidentialBalanceOf',
        outputs: [
          {
            internalType: 'euint64',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'confidentialProtocolId',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'confidentialTotalSupply',
        outputs: [
          {
            internalType: 'euint64',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
        ],
        name: 'confidentialTransfer',
        outputs: [
          {
            internalType: 'euint64',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
        ],
        name: 'confidentialTransfer',
        outputs: [
          {
            internalType: 'euint64',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'confidentialTransferAndCall',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'confidentialTransferAndCall',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
        ],
        name: 'confidentialTransferFrom',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
        ],
        name: 'confidentialTransferFrom',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'confidentialTransferFromAndCall',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'confidentialTransferFromAndCall',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'contractURI',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'euint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            internalType: 'uint64',
            name: 'cleartextAmount',
            type: 'uint64',
          },
          {
            internalType: 'bytes',
            name: 'decryptionProof',
            type: 'bytes',
          },
        ],
        name: 'discloseEncryptedAmount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
          {
            internalType: 'bytes1',
            name: 'fields',
            type: 'bytes1',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'version',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'chainId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'verifyingContract',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'uint256[]',
            name: 'extensions',
            type: 'uint256[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'facilitator',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'euint64',
            name: 'burntAmount',
            type: 'bytes32',
          },
          {
            internalType: 'uint64',
            name: 'burntAmountCleartext',
            type: 'uint64',
          },
          {
            internalType: 'bytes',
            name: 'decryptionProof',
            type: 'bytes',
          },
        ],
        name: 'finalizeUnwrap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'holder',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'isOperator',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'onTransferReceived',
        outputs: [
          {
            internalType: 'bytes4',
            name: '',
            type: 'bytes4',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'rate',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'euint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
        ],
        name: 'requestDiscloseEncryptedAmount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'until',
            type: 'uint48',
          },
        ],
        name: 'setOperator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes4',
            name: 'interfaceId',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'encryptedValue',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'validAfter',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'validBefore',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'nonce',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        name: 'transferWithAuthorization',
        outputs: [
          {
            internalType: 'euint64',
            name: 'transferred',
            type: 'bytes32',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'underlying',
        outputs: [
          {
            internalType: 'contract IERC20',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'externalEuint64',
            name: 'encryptedAmount',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'inputProof',
            type: 'bytes',
          },
        ],
        name: 'unwrap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'bytes32',
          },
        ],
        name: 'unwrap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'newFacilitator',
            type: 'address',
          },
        ],
        name: 'updateFacilitator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'wrap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
  },
  USD_ERC20: {
    address: '0xA9062b4629bc8fB79cB4eE904C5c9E179e9F492a' as const,
    abi: [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'uint8',
            name: 'decimals_',
            type: 'uint8',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'allowance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'needed',
            type: 'uint256',
          },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'needed',
            type: 'uint256',
          },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'approver',
            type: 'address',
          },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [],
        name: 'MAX_MINT_AMOUNT',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
  },
} as const

// Contract constants
export const MINT_AMOUNT = BigInt(1000 * 1000000) // 1000 tokens with 6 decimals
export const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111
