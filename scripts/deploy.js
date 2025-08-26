/**
 * Smart Contract Deployment Script
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Deploys the USDCMerkleDistributor contract with the generated
 * Merkle tree data from CSV processing.
 * 
 * Usage: npx hardhat run scripts/deploy.js --network polygon
 * 
 * @license MIT
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🍴 sSPORK USDC Distribution - Contract Deployment");
    console.log("Created by: @cryptowampum");
    console.log("Developed with: Claude AI\n");

    // Load deployment configuration
    const deploymentInfoPath = path.join(__dirname, "..", "deployment-info.json");
    
    if (!fs.existsSync(deploymentInfoPath)) {
        console.error("❌ deployment-info.json not found!");
        console.error("   Please run: npm run process-csv <your-csv-file>");
        process.exit(1);
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));
    
    // Get network information
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? "localhost" : network.name;
    
    console.log(`🌐 Deploying to network: ${networkName} (Chain ID: ${network.chainId})`);
    
    // Get USDC address for current network
    let usdcAddress;
    if (network.chainId === 137) {
        usdcAddress = deploymentInfo.usdcTokenAddresses.polygon;
        console.log("💱 Using Polygon USDC address");
    } else if (network.chainId === 80001) {
        usdcAddress = deploymentInfo.usdcTokenAddresses.mumbai;
        console.log("💱 Using Mumbai testnet USDC address");
    } else if (network.chainId === 1) {
        usdcAddress = deploymentInfo.usdcTokenAddresses.ethereum;
        console.log("💱 Using Ethereum USDC address");
    } else {
        console.error(`❌ Unsupported network: ${networkName} (Chain ID: ${network.chainId})`);
        console.error("   Supported networks: polygon (137), mumbai (80001), ethereum (1)");
        process.exit(1);
    }
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await deployer.getBalance();
    
    console.log(`👤 Deployer address: ${deployer.address}`);
    console.log(`💰 Deployer balance: ${ethers.utils.formatEther(deployerBalance)} ETH`);
    
    // Display deployment parameters
    console.log("\n📋 Deployment Parameters:");
    console.log(`   🏦 USDC Token: ${usdcAddress}`);
    console.log(`   🌳 Merkle Root: ${deploymentInfo.merkleRoot}`);
    console.log(`   💰 Total Allocation: ${deploymentInfo.totalUSDCAmount} USDC`);
    console.log(`   👥 Total Recipients: ${deploymentInfo.totalClaims}`);
    
    // Estimate gas costs
    const USDCMerkleDistributor = await ethers.getContractFactory("USDCMerkleDistributor");
    const deploymentData = USDCMerkleDistributor.interface.encodeDeploy([
        usdcAddress,
        deploymentInfo.merkleRoot,
        deploymentInfo.totalAllocation
    ]);
    
    const estimatedGas = await ethers.provider.estimateGas({
        data: deploymentData
    });
    
    const gasPrice = await ethers.provider.getGasPrice();
    const estimatedCost = estimatedGas.mul(gasPrice);
    
    console.log(`\n⛽ Gas Estimates:`);
    console.log(`   📊 Estimated gas: ${estimatedGas.toLocaleString()}`);
    console.log(`   💲 Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
    console.log(`   💸 Estimated cost: ${ethers.utils.formatEther(estimatedCost)} ETH`);
    
    // Check if deployer has enough balance
    if (deployerBalance.lt(estimatedCost.mul(110).div(100))) { // 10% buffer
        console.error(`❌ Insufficient balance for deployment`);
        console.error(`   Required: ${ethers.utils.formatEther(estimatedCost.mul(110).div(100))} ETH`);
        console.error(`   Available: ${ethers.utils.formatEther(deployerBalance)} ETH`);
        process.exit(1);
    }
    
    console.log(`\n🚀 Deploying contract...`);
    
    // Deploy the contract
    const contract = await USDCMerkleDistributor.deploy(
        usdcAddress,
        deploymentInfo.merkleRoot,
        deploymentInfo.totalAllocation
    );
    
    console.log(`⏳ Transaction submitted: ${contract.deployTransaction.hash}`);
    
    // Wait for deployment
    await contract.deployed();
    
    const deploymentReceipt = await contract.deployTransaction.wait();
    const actualGasUsed = deploymentReceipt.gasUsed;
    const actualCost = actualGasUsed.mul(gasPrice);
    
    console.log(`\n✅ Contract deployed successfully!`);
    console.log(`   📍 Contract Address: ${contract.address}`);
    console.log(`   🧾 Transaction Hash: ${contract.deployTransaction.hash}`);
    console.log(`   ⛽ Gas Used: ${actualGasUsed.toLocaleString()}`);
    console.log(`   💸 Actual Cost: ${ethers.utils.formatEther(actualCost)} ETH`);
    
    // Verify contract is working
    console.log(`\n🔍 Verifying deployment...`);
    
    try {
        const merkleRoot = await contract.merkleRoot();
        const totalAllocation = await contract.totalAllocation();
        const usdcToken = await contract.usdcToken();
        
        console.log(`   ✅ Merkle root: ${merkleRoot}`);
        console.log(`   ✅ Total allocation: ${totalAllocation.toString()}`);
        console.log(`   ✅ USDC token: ${usdcToken}`);
        
        // Check if parameters match
        if (merkleRoot !== deploymentInfo.merkleRoot) {
            console.warn(`   ⚠️  Merkle root mismatch!`);
        }
        if (totalAllocation.toString() !== deploymentInfo.totalAllocation) {
            console.warn(`   ⚠️  Total allocation mismatch!`);
        }
        if (usdcToken.toLowerCase() !== usdcAddress.toLowerCase()) {
            console.warn(`   ⚠️  USDC address mismatch!`);
        }
        
    } catch (error) {
        console.error(`   ❌ Verification failed:`, error.message);
    }
    
    // Generate post-deployment instructions
    console.log(`\n📋 Next Steps:`);
    console.log(`   1. 💰 Send ${deploymentInfo.totalUSDCAmount} USDC to: ${contract.address}`);
    console.log(`   2. 🔧 Update src/config/contracts.js:`);
    console.log(`      MERKLE_DISTRIBUTOR: { ${networkName}: "${contract.address}" }`);
    console.log(`   3. 🧪 Test claiming functionality on frontend`);
    console.log(`   4. 🚀 Deploy frontend to production`);
    console.log(`   5. 📝 Submit to Unicorn App Center`);
    
    if (network.chainId === 137 || network.chainId === 1) {
        console.log(`   6. ✅ Verify on block explorer:`);
        const explorerUrl = network.chainId === 137 
            ? `https://polygonscan.com/address/${contract.address}`
            : `https://etherscan.io/address/${contract.address}`;
        console.log(`      ${explorerUrl}`);
        
        console.log(`\n🔍 To verify source code:`);
        console.log(`   npx hardhat verify --network ${networkName} ${contract.address} "${usdcAddress}" "${deploymentInfo.merkleRoot}" "${deploymentInfo.totalAllocation}"`);
    }
    
    // Save deployment info
    const deploymentRecord = {
        network: networkName,
        chainId: network.chainId,
        contractAddress: contract.address,
        deploymentTx: contract.deployTransaction.hash,
        deploymentBlock: deploymentReceipt.blockNumber,
        deploymentTime: new Date().toISOString(),
        gasUsed: actualGasUsed.toString(),
        gasCost: ethers.utils.formatEther(actualCost),
        deployer: deployer.address,
        merkleRoot: deploymentInfo.merkleRoot,
        totalAllocation: deploymentInfo.totalAllocation,
        usdcAddress: usdcAddress
    };
    
    const deploymentRecordPath = path.join(__dirname, "..", `deployment-${networkName}-${Date.now()}.json`);
    fs.writeFileSync(deploymentRecordPath, JSON.stringify(deploymentRecord, null, 2));
    
    console.log(`\n📄 Deployment record saved: ${deploymentRecordPath}`);
    console.log(`\n🎉 Deployment completed successfully!`);
}

// Run deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    });