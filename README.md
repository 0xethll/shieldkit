# ShieldKit - React Toolkit for Confidential Web3 Applications

A comprehensive React toolkit for building confidential Web3 applications using Zama's Fully Homomorphic Encryption (FHE). Built on OpenZeppelin ERC7984, ShieldKit provides hooks, components, and utilities for private token operations with encrypted balances.

## Live Demo

🚀 **Try it now:** [https://shieldkit.vercel.app/](https://shieldkit.vercel.app/)

## Key Features

- **Universal ERC20 Wrapping**: Convert any ERC20 token to its confidential version
- **Private Transfers**: Execute transactions with fully encrypted amounts and balances
- **Trustless Unwrapping**: Public decryption ensures transparent withdrawal process

### Confidential Token Unwrap Flow with Public Decryption

```
  Client                    ERC7984 Contract              External Index Service
    |                              |                              |
    |--unwrap(from, to, -------->  |                              |
    |  encryptedAmount,            |                              |
    |  inputProof)                 |                              |
    |                              |                              |
    |                        _burn(from, amount)                  |
    |                        returns burntAmount                  |
    |                              |                              |
    |                              |--emit UnwrapRequested(-----> |
    |                              |  to, burntAmount)            |
    |                              |                              |
    |<-------query pending---------|                              |
    |         requests-------------|----------------------------->|
    |                              |                              |
    | fheInstance.publicDecrypt(burntAmount)                      |
    | → gets cleartextAmount + decryptionProof                    |
    |                              |                              |
    |--finalizeUnwrap(--------->   |                              |
    |  burntAmount,                |                              |
    |  cleartextAmount,            |                              |
    |  decryptionProof)            |                              |
    |                              |                              |
```

## Technical Implementation

-   Smart contracts built on OpenZeppelin Confidential Contracts v0.3.0
-   Next.js frontend with comprehensive UI/UX optimizations
