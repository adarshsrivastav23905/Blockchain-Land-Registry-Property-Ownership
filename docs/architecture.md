# System Architecture

## High-level

```text
+----------------------+          +----------------------+
| Authority Dashboard  |          | Owner / Buyer UI     |
| Register / Verify    |          | Search / Transfer   |
+----------+-----------+          +----------+-----------+
           |                                 |
           +---------------+-----------------+
                           |
                     MetaMask / Ethers.js
                           |
                           v
                 +-----------------------+
                 |   LandRegistry.sol    |
                 |-----------------------|
                 | Property registry     |
                 | Owner mapping         |
                 | Verification logic    |
                 | Transfer logic        |
                 | Events / audit trail  |
                 +-----------+-----------+
                             |
                             v
                  Ethereum-compatible chain

Off-chain: synthetic property documents / images / metadata
             |
             +--> SHA-256 hash --> smart contract
```

## Registration flow

1. Authority submits synthetic property details.
2. Contract validates uniqueness, owner address, area, required strings, and document hash.
3. Property is stored with `REGISTERED` status.
4. `PropertyRegistered` event is emitted.

## Verification flow

1. Authority calls `verifyProperty`.
2. Contract checks existence and prevents repeat verification.
3. `verified = true`, status becomes `VERIFIED`.
4. Verification events are emitted.

## Ownership transfer flow

1. Current owner calls `transferOwnership` with buyer/test-wallet address.
2. Contract checks ownership, verification, non-zero address, and non-disputed state.
3. Previous owner and timestamps are recorded.
4. Owner index lists are updated.
5. `OwnershipTransferred` event is emitted.

## Real-world boundary

A blockchain entry is only the on-chain state captured by this prototype. It does not by itself establish legal title. A production system would require authoritative registry data, identity verification, legal approvals, cadastral records, and dispute/court workflows.
