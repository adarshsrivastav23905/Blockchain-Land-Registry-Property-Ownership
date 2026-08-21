# Troubleshooting

## npm Cannot Find package.json

The repository contains a nested project directory. Run commands from the outer directory with `npm --prefix`:

```powershell
npm --prefix .\Blockchain-Land-Registry-Property-Ownership test
```

Or enter the nested directory first:

```powershell
cd .\Blockchain-Land-Registry-Property-Ownership
npm test
```

## MetaMask Is Not Connected

Use a desktop browser with the MetaMask extension installed. Select `Hardhat Local` and use:

- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency: `ETH`

## Could Not Decode Result Data

Confirm that the local node is still running and that the frontend uses the latest address printed by `deploy:local`. A new deployment gets a new address. The frontend ABI must describe `getProperty` as a single tuple returned from the Solidity struct.

## Property Does Not Exist

The deployment script registers and verifies demo property ID `1`. Redeploy the contract and copy the new address into the frontend.

## RPC Parse Error

Do not open port `8545` as a normal webpage. It accepts JSON-RPC POST requests. Use the frontend at `http://127.0.0.1:5173/`.

## Recovery Phrase Safety

Never share a MetaMask recovery phrase or private key. Use only synthetic local accounts for this educational project.
