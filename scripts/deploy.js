const hre = require("hardhat");

async function main() {
  const [authority] = await hre.ethers.getSigners();
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const registry = await LandRegistry.deploy();
  await registry.waitForDeployment();
  
  const propertyTx = await registry.registerProperty(
    1,
    "P-001",
    "Synthetic District, Demo City",
    1200,
    "Residential",
    authority.address,
    "6539a8b594ae3f59c3c3835ac458fbb6eb04cdc346a74e9c09163a0d967adf8d"
  );
  await propertyTx.wait();

  const verificationTx = await registry.verifyProperty(1);
  await verificationTx.wait();

  console.log("Authority:", authority.address);
  console.log("LandRegistry:", await registry.getAddress());
  console.log("Demo property: 1 (verified)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
