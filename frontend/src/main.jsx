import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserProvider, Contract, isAddress } from "ethers";
import "./styles.css";

const ABI = [
  "function admin() view returns (address)",
  "function registerProperty(uint256,string,string,uint256,string,address,string)",
  "function verifyProperty(uint256)",
  "function transferOwnership(uint256,address)",
  "function getProperty(uint256) view returns (tuple(uint256 propertyId,string propertyNumber,string location,uint256 area,string propertyType,address currentOwner,address previousOwner,string documentHash,bool verified,uint8 status,uint256 registeredAt,uint256 lastTransferredAt))",
  "function getPropertiesByOwner(address) view returns (uint256[])"
];

const HARDHAT_CHAIN_ID = "0x7a69";
const DEPLOYED_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const HARDHAT_NETWORK = {
  chainId: HARDHAT_CHAIN_ID,
  chainName: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["http://127.0.0.1:8545"]
};

function App() {
  const [account, setAccount] = useState("");
  const [contractAddress, setContractAddress] = useState(DEPLOYED_CONTRACT_ADDRESS);
  const [propertyId, setPropertyId] = useState("1");
  const [property, setProperty] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!window.ethereum) return undefined;

    const handleAccountsChanged = accounts => setAccount(accounts[0] || "");
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed. Install it and reload this page.");

      try {
        await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: HARDHAT_CHAIN_ID }] });
      } catch (error) {
        if (error.code !== 4902) throw error;
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [HARDHAT_NETWORK] });
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setAccount(await (await provider.getSigner()).getAddress());
      setMessage("MetaMask connected to Hardhat Local.");
    } catch (error) {
      setMessage(error.code === 4001 ? "MetaMask connection was rejected." : error.shortMessage || error.message);
    }
  }

  async function loadProperty() {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
      if (!isAddress(contractAddress)) throw new Error("Enter a valid contract address.");
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 31337n) throw new Error("Switch MetaMask to Hardhat Local (chain ID 31337).");
      if ((await provider.getCode(contractAddress)) === "0x") {
        throw new Error("No contract found at this address on Hardhat Local. Use the current deployed address.");
      }
      const contract = new Contract(contractAddress, ABI, provider);
      setProperty(await contract.getProperty(propertyId));
      setMessage("Property loaded.");
    } catch (e) {
      setMessage(e.shortMessage || e.message);
    }
  }

  return (
    <main className="container">
      <h1>Blockchain-Based Land Registry</h1>
      <p className="note">Educational prototype. All property data and wallets are synthetic/test data.</p>
      <button onClick={connectWallet}>Connect MetaMask</button>
      <p>Connected: {account || "Not connected"}</p>
      <label>Contract address</label>
      <input value={contractAddress} onChange={e => setContractAddress(e.target.value)} placeholder="0x..." />
      <label>Property ID</label>
      <input value={propertyId} onChange={e => setPropertyId(e.target.value)} />
      <button onClick={loadProperty}>Search Property</button>
      {message && <p>{message}</p>}
      {property && (
        <section className="card">
          <h2>{property.propertyNumber}</h2>
          <p>Location: {property.location}</p>
          <p>Area: {property.area.toString()} sq ft</p>
          <p>Type: {property.propertyType}</p>
          <p>Current owner: {property.currentOwner}</p>
          <p>Verified: {property.verified ? "Yes" : "No"}</p>
          <p>Document hash: {property.documentHash}</p>
          <p>Status enum: {property.status.toString()}</p>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
