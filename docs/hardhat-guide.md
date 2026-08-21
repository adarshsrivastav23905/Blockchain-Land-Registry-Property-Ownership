# Hardhat Guide

## Setup

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Local chain + deployment

Terminal 1:

```bash
npx hardhat node
```

Terminal 2:

```bash
npm run deploy:local
```

Copy the deployed contract address into the frontend.

## What the automated tests cover

- deployment/admin assignment
- authority-only registration and verification
- duplicate IDs
- zero addresses
- transfer prerequisites
- successful ownership transfer
- old-owner rejection
- owner listing updates
- document hash preservation
- status updates
- invalid property lookup
