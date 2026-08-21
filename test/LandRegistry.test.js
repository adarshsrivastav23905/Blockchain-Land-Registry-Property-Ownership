const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  
const P001 = 1;
const DOC_HASH = "9f5d2aa0e2d8f5b9c5d4b10fb8de3e7a0f3d6c6a3f4b9c2d8f2c6a0aa1b2c3d4";

async function deployFixture() {
  const [admin, owner, buyer, unauthorized, thirdParty] = await ethers.getSigners();
  const Registry = await ethers.getContractFactory("LandRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  return { registry, admin, owner, buyer, unauthorized, thirdParty };
}

async function registerAndVerify(registry, admin, owner) {
  await registry.connect(admin).registerProperty(
    P001,
    "P-001",
    "Synthetic District, Demo City",
    1200,
    "Residential",
    owner.address,
    DOC_HASH
  );
  await registry.connect(admin).verifyProperty(P001);
}

describe("LandRegistry", function () {
  it("deploys with the deployer as admin", async function () {
    const { registry, admin } = await deployFixture();
    expect(await registry.admin()).to.equal(admin.address);
  });

  it("allows the authority to register a property", async function () {
    const { registry, admin, owner } = await deployFixture();
    await registry.connect(admin).registerProperty(
      P001, "P-001", "Synthetic District", 1200, "Residential", owner.address, DOC_HASH
    );
    const p = await registry.getProperty(P001);
    expect(p.currentOwner).to.equal(owner.address);
    expect(p.verified).to.equal(false);
    expect(p.status).to.equal(0n);
  });

  it("rejects duplicate property IDs", async function () {
    const { registry, admin, owner, buyer } = await deployFixture();
    await registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH);
    await expect(
      registry.connect(admin).registerProperty(P001, "P-001B", "B", 200, "Commercial", buyer.address, DOC_HASH)
    ).to.be.revertedWith("Property ID already registered");
  });

  it("rejects a zero initial owner", async function () {
    const { registry, admin } = await deployFixture();
    await expect(
      registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", ethers.ZeroAddress, DOC_HASH)
    ).to.be.revertedWith("Initial owner cannot be zero address");
  });

  it("rejects unauthorized registration", async function () {
    const { registry, unauthorized, owner } = await deployFixture();
    await expect(
      registry.connect(unauthorized).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH)
    ).to.be.revertedWith("Only admin/authority can perform this action");
  });

  it("allows the authority to verify a property", async function () {
    const { registry, admin, owner } = await deployFixture();
    await registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH);
    await expect(registry.connect(admin).verifyProperty(P001))
      .to.emit(registry, "PropertyVerified")
      .withArgs(P001, admin.address, anyValue);

    const p = await registry.getProperty(P001);
    expect(p.verified).to.equal(true);
    expect(p.status).to.equal(1n);
  });

  it("rejects unauthorized verification", async function () {
    const { registry, admin, owner, unauthorized } = await deployFixture();
    await registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH);
    await expect(registry.connect(unauthorized).verifyProperty(P001))
      .to.be.revertedWith("Only admin/authority can perform this action");
  });

  it("rejects transfer before verification", async function () {
    const { registry, admin, owner, buyer } = await deployFixture();
    await registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH);
    await expect(registry.connect(owner).transferOwnership(P001, buyer.address))
      .to.be.revertedWith("Property must be verified before transfer");
  });

  it("allows current owner to transfer after verification", async function () {
    const { registry, admin, owner, buyer } = await deployFixture();
    await registerAndVerify(registry, admin, owner);

    await expect(registry.connect(owner).transferOwnership(P001, buyer.address))
      .to.emit(registry, "OwnershipTransferred")
      .withArgs(P001, owner.address, buyer.address, anyValue);

    const p = await registry.getProperty(P001);
    expect(p.currentOwner).to.equal(buyer.address);
    expect(p.previousOwner).to.equal(owner.address);
    expect(p.status).to.equal(3n);
  });

  it("rejects transfer by the old owner after transfer", async function () {
    const { registry, admin, owner, buyer, thirdParty } = await deployFixture();
    await registerAndVerify(registry, admin, owner);
    await registry.connect(owner).transferOwnership(P001, buyer.address);

    await expect(registry.connect(owner).transferOwnership(P001, thirdParty.address))
      .to.be.revertedWith("Caller is not current owner");
  });

  it("rejects zero new owner", async function () {
    const { registry, admin, owner } = await deployFixture();
    await registerAndVerify(registry, admin, owner);
    await expect(registry.connect(owner).transferOwnership(P001, ethers.ZeroAddress))
      .to.be.revertedWith("New owner cannot be zero address");
  });

  it("rejects invalid property lookup", async function () {
    const { registry } = await deployFixture();
    await expect(registry.getProperty(999)).to.be.revertedWith("Property does not exist");
  });

  it("maintains owner property listings across transfers", async function () {
    const { registry, admin, owner, buyer } = await deployFixture();
    await registerAndVerify(registry, admin, owner);
    expect(await registry.getPropertiesByOwner(owner.address)).to.deep.equal([1n]);
    await registry.connect(owner).transferOwnership(P001, buyer.address);
    expect(await registry.getPropertiesByOwner(owner.address)).to.deep.equal([]);
    expect(await registry.getPropertiesByOwner(buyer.address)).to.deep.equal([1n]);
  });

  it("preserves the document hash", async function () {
    const { registry, admin, owner } = await deployFixture();
    await registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH);
    const p = await registry.getProperty(P001);
    expect(p.documentHash).to.equal(DOC_HASH);
  });

  it("allows admin status updates", async function () {
    const { registry, admin, owner } = await deployFixture();
    await registry.connect(admin).registerProperty(P001, "P-001", "A", 100, "Residential", owner.address, DOC_HASH);
    await registry.connect(admin).updatePropertyStatus(P001, 4); // DISPUTED
    const p = await registry.getProperty(P001);
    expect(p.status).to.equal(4n);
  });
});
