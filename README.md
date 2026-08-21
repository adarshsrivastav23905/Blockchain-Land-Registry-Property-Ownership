# Blockchain-Based Land Registry & Property Ownership System

> Educational blockchain land-registry prototype using Solidity smart contracts for synthetic property registration, verification, ownership transfer, document-hash verification, and auditable ownership history.

## Important educational disclaimer

This is a student proof-of-work project. It uses only dummy/synthetic property data and test wallets. It does **not** create, transfer, or prove legally valid property ownership. Blockchain records do not automatically replace government registries, legal identity systems, cadastral records, courts, or property law.

## Overview

The project models:

- property registration
- authority-based verification
- wallet-linked ownership
- ownership transfer
- property status
- document hashing
- transaction/event history
- automated security testing
- Remix VM simulation
- optional React + Ethers.js frontend

## Problem Statement

Traditional property records can be fragmented across offices, databases, paper records, and manual workflows. This can make verification, ownership-history tracking, and auditing harder. The prototype explores how a blockchain-backed workflow can provide one tamper-evident transaction history for a synthetic dataset.

## Industry Relevance

The same design concepts can support government registry integrations, property management platforms, proptech systems, housing societies, title verification, mortgage due diligence, document authentication, and audit workflows—provided legal and authoritative systems are integrated.

## Technology Stack

- Solidity 0.8.x
- Ethereum-compatible execution environment
- Hardhat
- Ethers.js
- Remix VM for visual simulation
- MetaMask for optional local/frontend interaction
- React + Vite for optional frontend

### Three implementation options

| Option | Stack | Difficulty | Output | Real crypto? |
|---|---|---|---|---|
| A — Easy | Solidity + Remix + Remix VM | Beginner | Contract demo | No |
| B — Recommended | Solidity + Hardhat + Ethers.js + MetaMask + React + local chain | Beginner–Intermediate | Tested dApp prototype | No |
| C — Advanced | Option B + IPFS + multi-party approval + escrow + DID concepts | Intermediate–Advanced | Expanded Web3 architecture | Not required for local simulation |

**Recommended for students:** Option B because it gives stronger GitHub proof-of-work while remaining fully testable with local accounts.

## Blockchain Concepts Used

| Concept | Purpose in this project |
|---|---|
| Blockchain | Tamper-evident transaction history |
| Ethereum | Smart-contract execution model |
| Smart contract | Encodes registry rules |
| Solidity | Contract programming language |
| Wallet address | On-chain owner identifier in the prototype |
| `msg.sender` | Identifies the caller for permission checks |
| `struct` | Groups property fields |
| `mapping` | Key-based property and owner indexes |
| array | Stores owner property IDs |
| enum | Models property lifecycle states |
| modifier | Reusable access/precondition checks |
| events | Build transaction/audit history |
| `require()` | Reject invalid or unauthorized calls |
| ownership | Current owner wallet state |
| access control | Restricts authority functions |
| document hash | Integrity reference for off-chain documents |
| transaction hash | Identifies a blockchain transaction |
| immutability | Historical records are difficult to alter after confirmation |
| audit trail | Events and transactions form a traceable history |
| testnet/local chain | Safe environment for development |
| dApp | Frontend that calls the contract |
| gas | Execution cost on an EVM chain |
| off-chain metadata | Keeps larger/private files outside the contract |

## Actors and Permissions

| Actor | Permissions |
|---|---|
| Authority/Admin | Register, verify, update administrative status |
| Property Owner | View owned properties; transfer owned verified property |
| Buyer/New Owner | Receive property and become current owner |
| Optional Verifier | Conceptual role for an expanded design |

## System Architecture

See [docs/architecture.md](docs/architecture.md).

```text
Authority / Owner / Buyer UI
          |
       MetaMask
          |
      Ethers.js
          |
   LandRegistry.sol
     |    |    |
 registry owner events
          |
 Ethereum-compatible chain

Synthetic documents --SHA-256--> on-chain hash
```

## Property Data Model

The contract stores:

- `propertyId`
- `propertyNumber`
- `location`
- `area`
- `propertyType`
- `currentOwner`
- `previousOwner`
- `documentHash`
- `verified`
- `status`
- `registeredAt`
- `lastTransferredAt`

Statuses:

- `REGISTERED`
- `VERIFIED`
- `TRANSFER_PENDING`
- `TRANSFERRED`
- `DISPUTED`

## Core Contract Functions

- `registerProperty()` — authority-only registration
- `verifyProperty()` — authority-only verification
- `getProperty()` — read a property
- `transferOwnership()` — current-owner transfer
- `getPropertiesByOwner()` — list owner property IDs
- `updatePropertyStatus()` — authority-only administrative status update
- `propertyExists()` — existence check

## Events

- `PropertyRegistered`
- `PropertyVerified`
- `OwnershipTransferred`
- `PropertyStatusUpdated`

## Registration Rules

The contract rejects duplicate property IDs, zero owner addresses, invalid area, empty required strings, and missing document hashes. Successful registration emits `PropertyRegistered`.

## Verification Rules

Verification is separate from registration. Registration means the authority has created the record; verification represents a later validation step. This separation makes the lifecycle easier to model and audit.

## Ownership Transfer Rules

Only the current owner can transfer. The new owner cannot be the zero address or the current owner. The property must exist, be verified, and not be disputed. The contract updates current/previous owner, timestamp, owner indexes, status, and emits `OwnershipTransferred`.

### Simple vs multi-step transfer

This repository implements the simple direct transfer: the current owner executes the transfer and the new owner becomes current owner in one transaction.

An advanced production-oriented workflow could split this into `requestTransfer()`, `approveTransfer()`, and `completeTransfer()`, optionally involving an authority, buyer acceptance, escrow, and document checks. That approach is more realistic for regulated workflows but adds more state, events, and security cases.

## Ownership History

The contract emits events for registration, verification, transfer, and status changes. A frontend or indexer can query these events to build a historical timeline. The contract also retains only the immediate `previousOwner`; a full history can be reconstructed from events without storing an unbounded array on-chain.

## Document Hash Verification

The sample file is `sample_documents/property_001.json`.

Generate its hash:

```bash
npm install
node scripts/hash-document.js sample_documents/property_001.json
```

Workflow:

1. Create the document.
2. Generate SHA-256.
3. Store the hash in the property record.
4. Modify the file.
5. Generate SHA-256 again.
6. Compare hashes.

A modified document should produce a different hash.

## Installation

```bash
git clone <your-repository-url>
cd Blockchain-Land-Registry-Property-Ownership
npm install
npm run compile
npm test
```

## Hardhat Local Simulation

Terminal 1:

```bash
npx hardhat node
```

Terminal 2:

```bash
npm run deploy:local
```

See [docs/hardhat-guide.md](docs/hardhat-guide.md).

## Remix VM Simulation

See [docs/remix-simulation.md](docs/remix-simulation.md).

The four-account flow is:

1. Account 1 = authority
2. Account 2 = Owner A
3. Account 3 = Buyer B
4. Account 4 = unauthorized user
5. Register P001
6. Unauthorized verify -> revert
7. Authority verify -> success
8. Owner A transfer -> Buyer B
9. Old Owner A transfer -> revert
10. Review events

## Testing Strategy

The Hardhat suite covers deployment, authority permissions, registration, duplicate prevention, zero-address validation, verification, unauthorized calls, transfer prerequisites, successful ownership transfer, old-owner rejection, owner lists, document hashes, status changes, and invalid lookups.

## Optional Frontend

The starter frontend is under `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

It can connect to MetaMask and read a deployed property by contract address. It is intentionally small so you can extend it with Authority, Owner, Buyer, history, and transfer pages.

## Folder Structure

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
├── hashes/
├── screenshots/
├── reports/
├── docs/
├── README.md
├── hardhat.config.js
├── package.json
├── .env.example
└── .gitignore
```

## Security Controls

- authority-only registration and verification
- unique property IDs
- zero-address rejection
- current-owner-only transfers
- verified-before-transfer rule
- disputed-property transfer block
- event-based audit trail
- owner-index cleanup on transfer

## Real-World Limitations

Blockchain cannot independently verify that entered property information is legally correct. A malicious or compromised authority can still submit false data. A wallet address is not automatically a legal identity. Real title transfer requires applicable laws, identity verification, registrar/government integration, cadastral and survey data, court/dispute procedures, and other controls.

## GitHub Strategy

Suggested repository name:

`Blockchain-Land-Registry-Property-Ownership`

Suggested description:

> Educational blockchain land registry prototype using Solidity smart contracts for property registration, verification, ownership transfer, document-hash verification, and auditable ownership history.

Suggested topics:

`blockchain`, `solidity`, `land-registry`, `real-estate`, `property`, `ethereum`, `smart-contract`, `web3`, `proptech`, `hardhat`, `ethersjs`, `dapp`

## Git Commands

```bash
git init
git add .
git commit -m "Initialize blockchain land registry project"
git branch -M main
git remote add origin https://github.com/<username>/Blockchain-Land-Registry-Property-Ownership.git
git push -u origin main
```

Recommended development commits:

```text
Initialize blockchain land registry project
Add property data model
Implement authority-based property registration
Add property verification workflow
Implement secure ownership transfer
Add property document hash verification
Add ownership history events
Add Hardhat tests
Add Remix simulation proof
Complete README and documentation
```

## 12-Day Proof-Building Plan

| Day | Work | Commit | Proof |
|---|---|---|---|
| 1 | Architecture + environment | Initialize blockchain land registry project | folder + tool setup |
| 2 | Property struct | Add property data model | contract code |
| 3 | Registration | Implement authority-based property registration | registration transaction |
| 4 | Verification | Add property verification workflow | verified state |
| 5 | Transfer | Implement secure ownership transfer | transfer transaction |
| 6 | Hashing | Add property document hash verification | original + changed hashes |
| 7 | Events | Add ownership history events | event log |
| 8 | Security | Validate failure paths | revert screenshots |
| 9 | Testing | Add Hardhat tests | test report |
| 10 | Remix | Add Remix simulation proof | Remix screenshots |
| 11 | Frontend | Build optional dApp | UI screenshot |
| 12 | Docs | Complete README and documentation | GitHub + README |

## Screenshot Proof Checklist

See [docs/proof-checklist.md](docs/proof-checklist.md) for 19 suggested filenames and what each proves.

## Project Report

See [reports/project-report.md](reports/project-report.md).

## Interview Preparation

See [docs/interview-prep.md](docs/interview-prep.md).

## Learning Outcomes

After completing the project, you should be able to explain Solidity structs/mappings/modifiers, access control, ownership checks, smart-contract events, document hashing, testing, local blockchain simulation, Web3 frontend interaction, and the limits of blockchain-based registry systems.

## Author

Student project / educational proof of work.

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
Local Blockchain Deployment
    |
    v
MetaMask + React Frontend
    |
    v
Evidence and Documentation
```

## Project Status

### Functional Local dApp Prototype

The current repository contains a working Solidity contract, a 15-test Hardhat suite, a local deployment script with verified synthetic property data, and a React + Ethers.js frontend that reads property information through MetaMask.

The project is validated on a local Hardhat network. It is not a government registry, does not prove legal ownership, and has not been tested with real property records or public-network funds.

## Evidence and Reproducibility

The repository follows a reproducible evidence layout:

```text
Blockchain-Land-Registry-Property-Ownership/
├── data/              Sample synthetic state and input data
├── test_cases/        Manual and automated test scenarios
├── outputs/           Reproducible command results
├── screenshots/       Visual proof captured during demos
├── reports/           Academic project report
├── docs/              Technical documentation and checklists
└── PROJECT.md         Compact project brief
```

See [PROJECT.md](PROJECT.md), [docs/testing.md](docs/testing.md), and [docs/troubleshooting.md](docs/troubleshooting.md) for the complete run and evidence workflow.

## Final Validation Commands

Run these commands from the outer repository directory:

```powershell
npm --prefix .\Blockchain-Land-Registry-Property-Ownership test
npm --prefix .\Blockchain-Land-Registry-Property-Ownership run compile
```

Expected result:

```text
15 passing
Nothing to compile
```
