# Security and Real-World Limitations

## Prototype controls

- Only admin can register and verify records.
- Property IDs are unique.
- Zero-address owners are rejected.
- Only the current owner can transfer.
- Transfers require verification and reject disputed properties.
- Important operations emit events.

## Threats still outside the prototype

**Compromised keys:** blockchain access control cannot protect a wallet whose private key has been stolen.

**Fraudulent authority:** if an authorized wallet is malicious or compromised, it can enter incorrect records.

**Garbage in, garbage out:** the chain makes recorded state tamper-evident; it does not prove the original off-chain information was truthful.

**Document forgery:** a valid hash only proves that the hash matches a particular byte sequence. It does not prove that the underlying document is legally authentic.

**Wallet identity vs legal identity:** an Ethereum address is not automatically a legally verified person or organization.

**Real property law:** inheritance, liens, mortgages, court orders, disputes, cadastral corrections, and title registration require legal processes and authoritative integrations.

**Privacy:** personal identity documents should generally remain off-chain. Store only the minimum necessary hashes/references.

## Production requirements

A production-grade solution would require government/registrar integration, identity/KYC controls as legally appropriate, cadastral/survey data, authorized workflows, court/dispute procedures, audit controls, key management, privacy architecture, and legal recognition.
