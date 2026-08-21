# Implementation Plan

## Phase 1 — Environment
**Objective:** install Solidity/Hardhat tooling.

**Steps:** install Node dependencies, run compile, run a first test.

**Code:** `package.json`, `hardhat.config.js`.

**Output:** successful compilation.

**Mistake:** Node or dependency mismatch.

**Debug:** remove `node_modules`, reinstall, inspect first error.

**Proof:** terminal screenshot.

## Phase 2 — Architecture
**Objective:** define actors and state transitions.

**Steps:** draw authority -> registration -> verification -> transfer.

**Code:** `docs/architecture.md`.

**Output:** architecture diagram.

**Mistake:** mixing legal ownership with wallet state.

**Debug:** use the educational disclaimer everywhere.

**Proof:** architecture document.

## Phase 3 — Roles
**Objective:** enforce authority vs owner responsibilities.

**Steps:** implement `onlyAdmin` and `onlyPropertyOwner`.

**Output:** unauthorized actions revert.

**Proof:** revert screenshots/tests.

## Phase 4 — Property Model
**Objective:** define the `Property` struct and indexes.

**Output:** property record with lifecycle fields.

**Proof:** code screenshot.

## Phase 5 — Registration
**Objective:** store a synthetic property safely.

**Output:** `PropertyRegistered` event.

**Proof:** transaction + `getProperty`.

## Phase 6 — Verification
**Objective:** separate registration and verification.

**Output:** `VERIFIED` state.

**Proof:** verification transaction.

## Phase 7 — Transfer
**Objective:** securely update ownership.

**Output:** current/previous owner and owner indexes updated.

**Proof:** successful + rejected transfers.

## Phase 8 — History
**Objective:** make actions auditable.

**Output:** emitted events.

**Proof:** event logs.

## Phase 9 — Document Hash
**Objective:** demonstrate document integrity checking.

**Steps:** hash sample file, alter it, hash again.

**Output:** mismatch after modification.

**Proof:** terminal output.

## Phase 10 — Security
**Objective:** cover invalid states and unauthorized paths.

**Output:** passing negative tests.

**Proof:** Hardhat output.

## Phase 11 — Tests
**Objective:** make behavior reproducible.

**Output:** automated test suite.

**Proof:** test report screenshot.

## Phase 12 — Remix
**Objective:** demonstrate manual operation.

**Output:** visible smart-contract interaction.

**Proof:** Remix screenshots.

## Phase 13 — Frontend
**Objective:** connect a small UI to the contract.

**Output:** property search via MetaMask/Ethers.js.

**Proof:** frontend screenshot.

## Phase 14 — GitHub
**Objective:** make the work understandable to reviewers.

**Steps:** push clean repository, use meaningful commits, include screenshots and README.

**Proof:** repository screenshot + commit history.
