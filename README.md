# Blockchain-Based Land Registry and Property Ownership System

> An educational blockchain prototype for synthetic property registration, authority verification, ownership transfer, document-hash verification, and auditable ownership history.

## Author

**Adarsh Srivastav**    
Computer Science and Engineering Student  
Blockchain | Solidity | Web3 | Smart Contracts

## Project Status

### Functional Local dApp Prototype

The project is implemented and tested on a local Hardhat network. It uses synthetic property data and test wallets only. It does not create, transfer, or prove legally valid ownership of real property.

## Project Overview

Traditional property records may be distributed across offices, databases, paper documents, and manual workflows. This project explores a blockchain-backed workflow for maintaining one tamper-evident history for synthetic property records.

The prototype supports:

- authority-controlled property registration
- separate property verification
- wallet-linked current ownership
- direct ownership transfer after verification
- property lifecycle status management
- SHA-256 document-hash storage
- event-based audit history
- automated security and behavior testing
- MetaMask-connected React property lookup

## Objectives

- Model a synthetic property record on an EVM-compatible blockchain.
- Restrict registration and verification to an authority account.
- Connect current ownership to wallet addresses.
- Enforce verified-before-transfer rules.
- Preserve document integrity through a SHA-256 hash.
- Emit events for registration, verification, transfer, and status changes.
- Validate successful and rejected workflows with Hardhat tests.
- Demonstrate property lookup through a local Web3 frontend.

## Key Features

- Solidity smart contract using structs, mappings, enums, modifiers, and events.
- Admin-only registration, verification, and administrative status updates.
- Duplicate property-ID prevention and input validation.
- Current-owner-only transfer with zero-address protection.
- Disputed-property transfer protection.
- Owner property indexes that are updated after transfers.
- Document hash verification without storing the source document on-chain.
- Local Hardhat deployment and MetaMask integration.
- Reproducible test cases, outputs, reports, and technical documentation.

## System Architecture

```text
Authority / Owner / Buyer
            |
            v
     React + Ethers.js
            |
            v
        MetaMask
            |
            v
   Hardhat Local Network
            |
            v
      LandRegistry.sol
       |      |      |
       v      v      v
   Property  Owners  Events
    state    indexes  and audit history

Synthetic document --SHA-256--> document hash on-chain
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
Updated State + Blockchain Events
```

## Technology Stack

| Area | Technology |
|---|---|
| Smart contract | Solidity 0.8.24 |
| Blockchain | Hardhat local network |
| Contract testing | Hardhat, Ethers, Chai |
| Frontend | React + Vite |
| Wallet | MetaMask |
| Contract interaction | Ethers.js |
| Document hashing | Node.js SHA-256 |
| Documentation | Markdown |
| Version control | Git and GitHub |

## Property Data Model

The `LandRegistry` contract stores:

| Field | Purpose |
|---|---|
| `propertyId` | Unique numeric property identifier |
| `propertyNumber` | Human-readable property number |
| `location` | Synthetic property location |
| `area` | Property area |
| `propertyType` | Residential, commercial, or other type |
| `currentOwner` | Current owner wallet address |
| `previousOwner` | Immediate previous owner wallet address |
| `documentHash` | SHA-256 integrity reference |
| `verified` | Authority verification flag |
| `status` | Property lifecycle status |
| `registeredAt` | Registration timestamp |
| `lastTransferredAt` | Most recent transfer timestamp |

Supported statuses are `REGISTERED`, `VERIFIED`, `TRANSFER_PENDING`, `TRANSFERRED`, and `DISPUTED`.

## Actors and Permissions

| Actor | Permissions |
|---|---|
| Authority/Admin | Register, verify, and update administrative status |
| Current Owner | Transfer an owned, verified property |
| Buyer/New Owner | Receive ownership after a successful transfer |
| Unauthorized Account | No privileged operations |

## Core Contract Functions

| Function | Purpose |
|---|---|
| `registerProperty()` | Create a new synthetic property; authority only |
| `verifyProperty()` | Mark an existing property as verified; authority only |
| `transferOwnership()` | Transfer a verified property from its current owner |
| `updatePropertyStatus()` | Apply an administrative lifecycle status |
| `getProperty()` | Read complete property data |
| `getPropertiesByOwner()` | Return property IDs for an owner address |
| `getOwnerPropertyCount()` | Return the number of properties for an owner |
| `propertyExists()` | Check whether a property ID exists |

## Events and Audit History

The contract emits:

- `PropertyRegistered`
- `PropertyVerified`
- `OwnershipTransferred`
- `PropertyStatusUpdated`

These events can be queried by a frontend or indexer to reconstruct registration, verification, transfer, and status history. The contract keeps the immediate `previousOwner`; the complete history is represented by the event log.

## Registration and Transfer Rules

Registration rejects duplicate IDs, zero owner addresses, invalid area, empty required fields, and missing document hashes.

Verification is a separate authority action. A property must be verified before it can be transferred. Only the current owner can transfer, the new owner cannot be the zero address or the current owner, and disputed properties cannot be transferred.

This repository implements direct transfer in one transaction. A production-oriented workflow could add buyer acceptance, authority approval, identity checks, escrow, and registrar integration.

## Document Hash Verification

The sample document is [`sample_documents/property_001.json`](sample_documents/property_001.json).

```bash
npm install
node scripts/hash-document.js sample_documents/property_001.json
```

The verification workflow is:

1. Generate the document SHA-256 hash.
2. Store the hash during property registration.
3. Modify the source document.
4. Generate the hash again.
5. Compare the original and new values.

A changed document should produce a different hash.

## Results

The completed prototype demonstrates:

- synthetic property registration by an authority account
- separate property verification
- verified-owner transfer from Owner A to Buyer B
- rejection of unauthorized and invalid transactions
- owner-list updates after transfer
- SHA-256 document integrity comparison
- event-based registration and ownership history
- 15 automated Hardhat tests
- local React and MetaMask property lookup

The result is a reproducible educational proof of concept, not a legally valid land registry.

## Testing

The Hardhat suite contains 15 passing tests covering:

| Test Area | Expected Result |
|---|---|
| Admin deployment | Pass |
| Property registration | Pass |
| Duplicate property rejection | Revert |
| Zero-address validation | Revert |
| Unauthorized registration | Revert |
| Property verification | Pass |
| Unauthorized verification | Revert |
| Transfer before verification | Revert |
| Valid ownership transfer | Pass |
| Old-owner transfer attempt | Revert |
| Invalid property lookup | Revert |
| Owner property indexes | Pass |
| Document hash preservation | Pass |
| Administrative status update | Pass |
| Event emission checks | Pass |

Run the automated tests with:

```bash
npm test
```

Expected result:

```text
15 passing
```

## Sample Workflow

```text
Account 1: Authority/Admin
Account 2: Owner A
Account 3: Buyer B
Account 4: Unauthorized User

1. Deploy LandRegistry.sol
2. Register synthetic property P-001
3. Reject unauthorized verification
4. Verify P-001 as the authority
5. Transfer P-001 from Owner A to Buyer B
6. Reject a later transfer attempt by old Owner A
7. Review state and emitted events
```

## Installation and Local Execution

```bash
git clone https://github.com/adarshsrivastav23905/Blockchain-Land-Registry-Property-Ownership.git
cd Blockchain-Land-Registry-Property-Ownership
npm install
npm run compile
npm test
```

Start the local blockchain in one terminal:

```bash
npx hardhat node
```

Deploy the contract in a second terminal:

```bash
npm run deploy:local
```

The local network uses RPC `http://127.0.0.1:8545` and chain ID `31337`.

## Optional React Frontend

The frontend is located in [`frontend/`](frontend/). It connects MetaMask to Hardhat Local and reads a deployed property by contract address.

```bash
cd frontend
npm install
npm run dev
```

The current frontend demonstrates wallet connection and property lookup. Registration, verification, transfer, and history views are future extensions.

## Project Structure

```text
Blockchain-Land-Registry-Property-Ownership/
├── contracts/
│   └── LandRegistry.sol
├── scripts/
│   ├── deploy.js
│   └── hash-document.js
├── test/
│   └── LandRegistry.test.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
├── sample_documents/
├── data/
├── hashes/
├── outputs/
├── reports/
├── screenshots/
├── test_cases/
├── docs/
├── PROJECT.md
├── hardhat.config.js
└── package.json
```

## Implementation Workflow

```text
Project Planning
        |
        v
Property Data Model
        |
        v
Authority Access Control
        |
        v
Property Registration
        |
        v
Property Verification
        |
        v
Ownership Transfer Rules
        |
        v
Document Hashing
        |
        v
Events and Audit Trail
        |
        v
Hardhat Testing
        |
        v
Local Deployment
        |
        v
MetaMask + React Frontend
        |
        v
Evidence and Documentation
```

## Security Controls

- authority-only registration and verification
- unique property IDs
- zero-address rejection
- current-owner-only transfers
- verified-before-transfer requirement
- disputed-property transfer block
- event-based audit trail
- owner-index cleanup after transfer

## Applications

The design concepts can support property-management systems, proptech platforms, housing societies, title-verification workflows, mortgage due diligence, document-authentication systems, and government registry integrations.

## Advantages

- Clear access-control rules.
- Tamper-evident transaction history.
- Verifiable document integrity reference.
- Reproducible local testing.
- Expandable ownership and event model.
- Demonstrates a complete smart-contract development workflow.

## Limitations

- All property information is synthetic.
- Wallet addresses are not legal identities.
- The local chain is not a government or public registry.
- No cadastral, court, identity, or registrar integration exists.
- The frontend currently focuses on wallet connection and lookup.
- The contract does not store complete ownership history on-chain.
- The system has not been audited for production deployment.

## Future Scope

- Add authority, owner, buyer, and history views.
- Add indexed event history to the frontend.
- Add buyer acceptance and multi-step authority approval.
- Add identity and registrar integrations in a compliant system.
- Add IPFS or another controlled document store.
- Add public testnet deployment configuration.
- Add role-based administration and formal contract auditing.

## Skills Demonstrated

### Blockchain and Smart Contracts

- Solidity structs, mappings, enums, modifiers, and events
- EVM transaction and state concepts
- Access control and ownership rules
- Smart-contract testing with Hardhat and Chai

### Web3 and Programming

- Ethers.js contract interaction
- MetaMask wallet integration
- React and Vite frontend development
- Node.js SHA-256 hashing

### Engineering Practices

- Requirements and architecture documentation
- Positive and negative test design
- Local deployment and reproducibility
- Git and GitHub version control

## Industry Relevance

This project demonstrates an end-to-end workflow:

```text
Requirements
    |
    v
Architecture
    |
    v
Smart Contract
    |
    v
Access Control
    |
    v
State and Events
    |
    v
Testing
    |
    v
Frontend Integration
    |
    v
Documentation and Evidence
```

## Evidence and Documentation

- [PROJECT.md](PROJECT.md) - compact project brief
- [docs/architecture.md](docs/architecture.md) - system architecture
- [docs/testing.md](docs/testing.md) - testing workflow
- [docs/security.md](docs/security.md) - security considerations
- [docs/hardhat-guide.md](docs/hardhat-guide.md) - local execution guide
- [docs/proof-checklist.md](docs/proof-checklist.md) - evidence checklist
- [reports/project-report.md](reports/project-report.md) - project report
- [outputs/](outputs/) - reproducible output files
- [test_cases/](test_cases/) - test scenarios

## Project Evidence

Store demonstration screenshots in [`screenshots/`](screenshots/) using descriptive filenames such as:

| Filename | Evidence |
|---|---|
| `01_contract_tests.png` | Hardhat output showing 15 passing tests |
| `02_compile.png` | Successful Solidity compilation |
| `03_local_node.png` | Hardhat local accounts and RPC endpoint |
| `04_deployment.png` | Deployed contract and verified demo property |
| `05_metamask_connection.png` | MetaMask connected to Hardhat Local |
| `06_property_lookup.png` | Frontend lookup for property ID 1 |
| `07_property_verified.png` | Verified property details |
| `08_transfer_event.png` | Ownership transfer event or transaction |
| `09_hash_output.png` | SHA-256 document hash output |
| `10_error_validation.png` | Expected rejected transaction or invalid lookup |

Use synthetic data and local test accounts only. Screenshots demonstrate project behavior and do not prove legal property ownership. See [docs/proof-checklist.md](docs/proof-checklist.md) for the complete evidence plan.

## Conclusion

The Blockchain-Based Land Registry and Property Ownership System demonstrates how a Solidity smart contract can model synthetic property registration, authority verification, wallet-linked ownership, direct transfer, document integrity references, and event-based auditing.

It is a functional local proof of concept and a foundation for future work involving identity, registrar integration, buyer approval, document storage, public testnets, and production-grade security review.

## Project Highlights

```text
Solidity 0.8.24
Hardhat Local Network
15 Automated Tests
Authority-Based Registration
Property Verification
Wallet-Linked Ownership
Ownership Transfer
SHA-256 Document Hashing
Event-Based Audit History
React + Ethers.js Frontend
MetaMask Integration
Git and GitHub
```