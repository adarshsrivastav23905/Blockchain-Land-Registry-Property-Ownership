# Test Cases

The project combines automated Hardhat tests with a manual MetaMask/frontend validation flow.

| ID | Scenario | Expected result |
|---|---|---|
| TC-01 | Deploy contract | Deployer is admin |
| TC-02 | Register valid property | Property ID 1 is stored |
| TC-03 | Register duplicate ID | Transaction reverts |
| TC-04 | Verify property as admin | Property becomes verified |  
| TC-05 | Verify as unauthorized account | Transaction reverts |
| TC-06 | Transfer before verification | Transaction reverts |
| TC-07 | Transfer as current owner | New owner is stored |
| TC-08 | Transfer as old owner | Transaction reverts |
| TC-09 | Query invalid property | Transaction reverts |
| TC-10 | Frontend lookup | Property details appear |

Automated cases are implemented in `test/LandRegistry.test.js`. The manual frontend case is documented in [docs/testing.md](../docs/testing.md).
