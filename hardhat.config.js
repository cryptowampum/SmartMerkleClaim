/**
 * Hardhat Configuration for sSPORK Distribution
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Configuration for smart contract compilation, deployment,
 * and verification across multiple EVM networks.
 * 
 * @license MIT
 */

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// Environment variables validation
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.matic.today";
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/your-key";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

if (!PRIVATE_KEY) {
  console.warn("⚠️  Warning: PRIVATE_KEY not found in .env file");
  console.warn("   Contract deployment will not work without a private key");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Optimize for deployment cost
      },
      viaIR: false, // Disable for compatibility
    },
  },

  networks: {
    // Local development network
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },

    // Polygon mainnet
    polygon: {
      url: POLYGON_RPC_URL,
      chainId: 137,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 50000000000, // 50 gwei - adjust based on network conditions
      gas: 2000000, // Gas limit
    },

    // Polygon testnet (Mumbai)
    mumbai: {
      url: MUMBAI_RPC_URL,
      chainId: 80001,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 2000000,
    },

    // Ethereum mainnet (if needed)
    ethereum: {
      url: ETHEREUM_RPC_URL,
      chainId: 1,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei - adjust based on network conditions
      gas: 2000000,
    },
  },

  // Contract verification settings
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
    },
  },

  // Gas reporting for optimization
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 50, // gwei
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

  // Path configurations
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  // Mocha test configuration
  mocha: {
    timeout: 40000, // 40 seconds for network operations
  },
};