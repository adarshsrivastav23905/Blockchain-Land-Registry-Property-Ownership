# Remix Simulation Guide

Use only Remix VM accounts; do not use real cryptocurrency.

## Accounts

- Account 1: Authority/Admin
- Account 2: Owner A
- Account 3: Buyer B
- Account 4: Unauthorized User

## Run

1. Open Remix IDE.
2. Create `LandRegistry.sol` and paste the contract.
3. Compile with Solidity `0.8.24` or a compatible 0.8.x compiler.
4. Deploy from Account 1 using Remix VM.
5. Register P001:
   - propertyId: `1`
   - propertyNumber: `P-001`
   - location: `Synthetic District, Demo City`
   - area: `1200`
   - propertyType: `Residential`
   - initialOwner: Account 2
   - documentHash: any non-empty SHA-256 hex string from the dummy document
6. Call `getProperty(1)` and confirm Account 2 is owner.
7. Switch to Account 4 and call `verifyProperty(1)`. Confirm it reverts.
8. Switch to Account 1 and verify the property.
9. Switch to Account 2 and transfer to Account 3.
10. Read `getProperty(1)` and confirm Account 3 is now owner.
11. Switch to Account 2 and attempt a second transfer. Confirm it reverts.
12. Review `OwnershipTransferred` logs.

## Evidence screenshots

Capture the deploy transaction, registration transaction, `getProperty` output, unauthorized revert, verification transaction, ownership transfer transaction, updated owner, old-owner revert, and emitted events.
