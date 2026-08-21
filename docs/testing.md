# Testing and Validation

## Automated Test Command

Run from the outer repository directory:

```powershell
npm --prefix .\Blockchain-Land-Registry-Property-Ownership test
```

Expected result:

```text
15 passing
```

## Compilation Command

```powershell
npm --prefix .\Blockchain-Land-Registry-Property-Ownership run compile
```

`Nothing to compile` is a successful result when no Solidity source has changed.

## Test Coverage

| Area | Covered behavior |
|---|---|
| Deployment | Deployer becomes admin |
| Registration | Admin can register a valid property |
| Validation | Duplicate IDs, zero addresses, and invalid lookups revert |
| Authorization | Non-admin registration and verification revert |
| Verification | Admin verification updates state and emits an event |
| Transfer | Verified current owner can transfer ownership |
| Transfer safety | Unverified, old-owner, and zero-address transfers revert |
| Owner index | Owner property lists update after transfer |
| Integrity | Document hash is preserved |
| Status | Admin status updates are stored |

## Manual Frontend Test

1. Start the local node with `npm --prefix .\Blockchain-Land-Registry-Property-Ownership run node`.
2. Deploy with `npm --prefix .\Blockchain-Land-Registry-Property-Ownership run deploy:local`.
3. Start the frontend from `frontend` with `npm run dev`.
4. Select MetaMask network `Hardhat Local`, chain ID `31337`.
5. Connect MetaMask.
6. Enter the deployment address printed by the deploy command.
7. Search property ID `1`.
8. Confirm the synthetic property details and `Verified: Yes`.
