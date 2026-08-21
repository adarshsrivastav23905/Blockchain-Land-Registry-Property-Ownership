# Blockchain Land Registry & Property Ownership

## Author

**Adarsh Srivastav**  
Computer Science and Engineering Student  
Blockchain | Solidity | Web3 | Smart Contracts

## Project Overview

This project is an educational blockchain prototype for registering synthetic property records, verifying them through an authority account, transferring ownership, preserving document hashes, and reconstructing an audit history from smart-contract events.

The prototype uses Solidity, Hardhat, Ethers.js, MetaMask, and a React + Vite frontend. It is validated on a local Ethereum-compatible blockchain and does not represent a legal land registry.

## Objectives

- Model a property record on-chain.
- Restrict registration and verification to an authority account.
- Link synthetic ownership to wallet addresses.
- Enforce verified-before-transfer rules.
- Preserve a SHA-256 document hash.
- Emit auditable registration, verification, transfer, and status events.
- Validate success and failure paths with automated tests.
- Demonstrate property lookup through a MetaMask-connected frontend.

## System Architecture

```text
+-------------------------+
| React + Ethers Frontend  |
+------------+------------+
             |
             v
+-------------------------+
| MetaMask Wallet          |
+------------+------------+
             |
             v
+-------------------------+
| Hardhat Local Network    |
+------------+------------+
             |
             v
+-------------------------+
| LandRegistry.sol         |
+-------------------------+
```

## Working Principle

```text
Synthetic Property Data
          |
          v
Authority Registration
          |
          v
Authority Verification
          |
          v
Owner Lookup or Transfer
          |
          v
Events + Auditable State
```

## Technology Stack

| Area | Technology |
|---|---|
| Smart contract | Solidity 0.8.24 |
| Blockchain | Hardhat local network |
| Contract testing | Hardhat, Ethers, Chai |
| Frontend | React + Vite |
| Wallet | MetaMask |
| Hashing | Node.js SHA-256 |
| Documentation | Markdown |

## Validation Result

The current test suite contains **15 passing tests** covering permissions, registration, verification, transfer rules, owner indexes, document hashes, events, and invalid inputs.

## Limitations

- All property data is synthetic.
- Wallet addresses are not legal identities.
- The local chain is not a public or government network.
- No physical, cadastral, court, identity, or registrar integration exists.
- The frontend currently focuses on wallet connection and property lookup.

## Future Scope

- Add authority, owner, buyer, and history views.
- Add indexed event history to the frontend.
- Add multi-step buyer acceptance and authority approval.
- Add identity and registrar integrations in a compliant production system.
- Add IPFS or another controlled document store.
- Add deployment configuration for a public testnet.
