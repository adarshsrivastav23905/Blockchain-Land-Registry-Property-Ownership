Store captured SHA-256 outputs here as text files, for example:

- `property_001.sha256.txt`
- `property_001_modified.sha256.txt`
  
Do not store real identity documents.

Generate the sample hash with:

```powershell
node scripts/hash-document.js sample_documents/property_001.json
```

The current synthetic sample hash is:

```text
6539a8b594ae3f59c3c3835ac458fbb6eb04cdc346a74e9c09163a0d967adf8d
```
