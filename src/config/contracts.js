/**
 * Smart Contract Configuration
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Contract addresses and configuration for the sSPORK rewards
 * Merkle distribution system.
 * 
 * @license MIT
 */

// TODO: Update these addresses after contract deployment
export const CONTRACTS = {
  // Merkle distributor contract (deployed by you)
  MERKLE_DISTRIBUTOR: {
    polygon: "0x...", // Update after deploying to Polygon mainnet
    mumbai: "0x...",  // Update after deploying to Mumbai testnet
  },
  
  // USDC token addresses (official)
  USDC: {
    polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
    mumbai: "0x...",   // USDC on Mumbai (if available)
    ethereum: "0xA0b86a33E6441c94c5cF8F4D5bF4B3C5E2c3E9e0", // USDC on Ethereum
  }
};

// Current network (update based on deployment)
const CURRENT_NETWORK = process.env.REACT_APP_NETWORK || 'polygon';

/**
 * Get contract address for current network
 * @param {string} contractName - Name of contract (MERKLE_DISTRIBUTOR, USDC)
 * @returns {string} Contract address
 */
export const getContractAddress = (contractName) => {
  const contract = CONTRACTS[contractName];
  if (!contract) {
    throw new Error(`Unknown contract: ${contractName}`);
  }
  
  const address = contract[CURRENT_NETWORK];
  if (!address || address === "0x...") {
    throw new Error(`Contract ${contractName} not deployed on ${CURRENT_NETWORK}`);
  }
  
  return address;
};

// Convenience exports for main contracts
export const MERKLE_DISTRIBUTOR_ADDRESS = getContractAddress('MERKLE_DISTRIBUTOR');
export const USDC_ADDRESS = getContractAddress('USDC');

/**
 * Contract ABI for Merkle Distributor
 * 
 * Only includes the functions we need for the frontend:
 * - claim(address, uint256, bytes32[])
 * - isClaimed(address) 
 * - getRemainingBalance()
 */
export const MERKLE_DISTRIBUTOR_ABI = [
  {
    "inputs": [
      { "name": "account", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "merkleProof", "type": "bytes32[]" }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "account", "type": "address" }],
    "name": "isClaimed", 
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingBalance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view", 
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "account", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ],
    "name": "Claimed",
    "type": "event"
  }
];

/**
 * Network configuration
 */
export const NETWORK_CONFIG = {
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  mumbai: {
    name: 'Mumbai',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.matic.today',
    blockExplorer: 'https://mumbai.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  }
};

export const getCurrentNetwork = () => NETWORK_CONFIG[CURRENT_NETWORK];