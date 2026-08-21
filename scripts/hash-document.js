const fs = require("fs");
const crypto = require("crypto");

const file = process.argv[2] || "sample_documents/property_001.json";
if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

const buffer = fs.readFileSync(file);
const hash = crypto.createHash("sha256").update(buffer).digest("hex");
console.log(`SHA-256(${file}) = ${hash}`);
