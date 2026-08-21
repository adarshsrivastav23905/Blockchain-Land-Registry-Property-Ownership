# Blockchain-Based Land Registry & Property Ownership System

## Abstract

This project is an educational blockchain prototype that models property registration, verification, ownership transfer, document-hash verification, and auditable event history using Solidity. Synthetic property records and test wallets are used throughout. The project demonstrates how an Ethereum-compatible blockchain can make a digital record tamper-evident while clearly separating an on-chain prototype from legally recognized property ownership.
  
## Introduction

Traditional property records may involve multiple offices, paper records, databases, and manual verification. The prototype explores how a smart contract could coordinate core registry operations and preserve an auditable sequence of blockchain transactions.

## Problem Statement

A land-record workflow can face duplicate records, inconsistent copies, delayed verification, fragmented ownership history, and difficult auditing. These are modeled here without using real government data.

## Proposed System

An authority-controlled smart contract registers synthetic properties. Each property stores its owner wallet, status, timestamps, and document hash. After verification, the current owner can transfer the property to another test wallet. Events provide a machine-readable activity history.

## Objectives

- model structured property registration
- separate registration from verification
- enforce ownership-based transfer permissions
- preserve transfer history through events
- demonstrate off-chain document hashing
- provide automated security tests and a Remix simulation
- produce GitHub-ready technical evidence

## Architecture

See `docs/architecture.md`.

## Actors

| Actor | Core permissions |
|---|---|
| Authority/Admin | register, verify, status administration |
| Property Owner | view own properties, initiate transfer |
| Buyer/New Owner | receive ownership, become current owner |
| Optional Verifier | conceptual role for a production extension |

## Data Model

The `Property` struct contains property ID, property number, location, area, type, current owner, previous owner, document hash, verification flag, status, registration timestamp, and transfer timestamp.

## Smart Contract Design

The contract uses mappings for property and owner indexes, modifiers for access control and preconditions, enums for lifecycle status, and events for history.

## Registration Workflow

Authority -> validation -> property record -> owner index -> `PropertyRegistered`.

## Verification Workflow

Authority -> existence check -> verification flag -> `VERIFIED` status -> verification events.

## Ownership Transfer

Current owner -> validation -> owner-index update -> current/previous owner update -> timestamp -> `OwnershipTransferred`.

## Document Hashing

The dummy JSON document is hashed with SHA-256. The hash is stored as a string in the prototype. Changing the file changes the hash, demonstrating integrity checking.

## Security

The prototype includes role checks, duplicate-ID prevention, zero-address checks, owner-only transfer, verification-before-transfer, and a disputed-state block.

## Testing

Hardhat tests exercise deployment, access control, duplicate prevention, address validation, verification, transfer, event emission, owner listings, and status handling.

## Simulation

The Remix VM scenario uses four test accounts to show expected success and failure paths without real cryptocurrency.

## Results

The prototype demonstrates a complete lifecycle for synthetic P001 from registration to verification and ownership transfer while generating auditable transaction events.

## Applications

The design concepts could inform government registry platforms, proptech workflows, property management, title verification, due diligence, and mortgage verification when combined with authoritative systems and legal processes.

## Limitations and Legal Considerations

This prototype is not a legal land registry. Blockchain does not automatically create legally valid title. Legal ownership depends on applicable law, official records, identity, authoritative data, and formal transfer procedures.

## Future Scope

Potential extensions include multi-party approval, role-based verifiers, IPFS metadata, transfer requests, escrow simulation, richer frontend history, indexing services, and privacy-preserving identity integration.

## Conclusion

The project provides a practical student-level demonstration of Solidity smart contracts, access control, property state management, document hashing, events, automated testing, and Web3 integration, while respecting the boundary between technical proof of work and legal property rights.
