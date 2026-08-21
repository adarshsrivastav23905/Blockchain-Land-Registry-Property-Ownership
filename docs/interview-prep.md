# Interview Preparation — 10 Questions and Strong Answers

## 1. Explain your project.

I built an educational blockchain-based land registry prototype using Solidity and Hardhat. It uses synthetic property data and test wallets to demonstrate property registration, authority-based verification, ownership transfer, document-hash verification, and event-based ownership history. The key learning was how smart contracts can enforce rules and create a tamper-evident audit trail. I also tested unauthorized actions and transfer edge cases.

## 2. Why did you use blockchain for this project?

The main reason is auditability. Each state-changing operation becomes a blockchain transaction, and emitted events provide a chronological history. That makes the recorded sequence tamper-evident. It does not mean the data entered by an authorized person is automatically truthful or legally valid.

## 3. What is a smart contract?

A smart contract is a program deployed on a blockchain that executes deterministic rules. In my project, the contract validates registration and transfer conditions, stores property state, and emits events.

## 4. Why did you use structs and mappings?

The `Property` struct groups related fields into one logical record. Mappings provide efficient key-based storage such as property ID to property and owner address to property IDs.

## 5. How did you implement access control?

I made the deployer the `admin` and created an `onlyAdmin` modifier for authority-only functions such as registration and verification. Transfer uses a separate owner check so only the current owner can transfer a property.

## 6. Why is document hashing useful?

I keep the sample document off-chain and store only its SHA-256 hash in the contract. If the document changes, the new hash changes too. This lets a verifier detect that the file is not the same byte-for-byte file that was originally hashed.

## 7. How does ownership transfer work?

The current owner calls `transferOwnership` with the buyer's test-wallet address. The contract checks ownership, verification, non-zero address, and non-disputed status. Then it updates current and previous owner fields, timestamps, owner indexes, and emits an event.

## 8. What is `msg.sender`?

`msg.sender` is the address that called the current function. I use it for the admin check and the current-owner check because permissions must be tied to the caller's wallet address.

## 9. What security cases did you test?

I tested unauthorized registration and verification, duplicate property IDs, zero addresses, transfer before verification, non-owner transfers, old-owner transfers after ownership changed, invalid property lookup, owner-list maintenance, and event emission.

## 10. What is the biggest real-world limitation?

The biggest limitation is the connection between a wallet address and real legal identity and title. Blockchain can preserve a tamper-evident record, but it cannot independently determine whether the original property information is legally correct. A real system would need registrar integration, identity verification, cadastral records, legal approvals, and dispute-resolution procedures.
