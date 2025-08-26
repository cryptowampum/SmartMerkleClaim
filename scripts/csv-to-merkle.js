/**
 * Simplified CSV to Merkle Tree Processor
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Simplified version that only requires address and USDC reward amount.
 * No sSPORK amount needed - just the final reward calculations.
 * 
 * Usage: node scripts/csv-to-merkle-simple.js path/to/rewards.csv
 * 
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');
const { ethers } = require('ethers');

/**
 * Simplified sSPORK Merkle Tree Generator
 * 
 * Only requires: address, usdc_reward
 * No sSPORK amounts needed for the distribution system.
 */
class SimplifiedMerkleGenerator {
    constructor(csvFilePath) {
        this.csvFilePath = csvFilePath;
        this.claims = [];
        this.merkleTree = null;
        
        console.log('🍴 sSPORK USDC Distribution - Simplified Merkle Generator');
        console.log('Created by: @cryptowampum');
        console.log('Developed with: Claude AI\n');
    }

    /**
     * Process CSV file with simplified format
     * 
     * Expected CSV format:
     * address,usdc_reward
     * 0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,500.50
     * 0x...,1001.00
     */
    async processCsvFile() {
        return new Promise((resolve, reject) => {
            const claims = [];
            let rowCount = 0;
            let errorCount = 0;
            
            console.log(`📄 Processing CSV file: ${this.csvFilePath}`);
            
            fs.createReadStream(this.csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    rowCount++;
                    
                    try {
                        // Clean and validate address
                        const address = row.address?.trim();
                        if (!address) {
                            console.warn(`Row ${rowCount}: Missing address`);
                            errorCount++;
                            return;
                        }

                        if (!ethers.utils.isAddress(address)) {
                            console.warn(`Row ${rowCount}: Invalid address: ${address}`);
                            errorCount++;
                            return;
                        }

                        // Validate and parse USDC reward amount
                        const usdcAmount = parseFloat(row.usdc_reward || '0');
                        if (isNaN(usdcAmount) || usdcAmount <= 0) {
                            console.warn(`Row ${rowCount}: Invalid USDC reward: ${row.usdc_reward}`);
                            errorCount++;
                            return;
                        }

                        // Convert USDC to wei (6 decimals)
                        const amountWei = ethers.utils.parseUnits(usdcAmount.toString(), 6);

                        // Check for duplicate addresses
                        const checksumAddress = ethers.utils.getAddress(address);
                        if (claims.some(claim => claim.address === checksumAddress)) {
                            console.warn(`Row ${rowCount}: Duplicate address: ${checksumAddress}`);
                            errorCount++;
                            return;
                        }

                        claims.push({
                            address: checksumAddress,
                            amount: amountWei.toString(),
                            originalAmount: usdcAmount,
                        });

                    } catch (error) {
                        console.error(`Row ${rowCount}: Processing error:`, error.message);
                        errorCount++;
                    }
                })
                .on('end', () => {
                    this.claims = claims;
                    
                    console.log(`\n✅ CSV Processing Complete:`);
                    console.log(`   📊 Total rows processed: ${rowCount}`);
                    console.log(`   ✅ Valid claims: ${claims.length}`);
                    console.log(`   ❌ Errors/skipped: ${errorCount}`);
                    
                    if (errorCount > 0) {
                        console.log(`   ⚠️  Please review warnings above`);
                    }
                    
                    resolve(claims);
                })
                .on('error', reject);
        });
    }

    /**
     * Generate Merkle tree from processed claims
     */
    generateMerkleTree() {
        if (this.claims.length === 0) {
            throw new Error('No valid claims to process. Run processCsvFile() first.');
        }

        console.log('\n🌳 Generating Merkle Tree...');

        // Prepare data for Merkle tree: [address, amount]
        const treeData = this.claims.map(claim => [claim.address, claim.amount]);

        // Generate Merkle tree using OpenZeppelin standard
        this.merkleTree = StandardMerkleTree.of(treeData, ['address', 'uint256']);

        console.log(`✅ Merkle tree generated successfully`);
        console.log(`   🌳 Tree depth: ${Math.ceil(Math.log2(this.claims.length))}`);
        console.log(`   📄 Merkle Root: ${this.merkleTree.root}`);
        console.log(`   🔐 Total leaves: ${this.claims.length}`);

        return this.merkleTree;
    }

    /**
     * Generate proofs file for frontend consumption
     */
    generateProofsFile() {
        if (!this.merkleTree) {
            throw new Error('Merkle tree not generated. Run generateMerkleTree() first.');
        }

        console.log('\n📝 Generating proof files...');

        const proofs = {};
        
        for (const [i, claim] of this.claims.entries()) {
            const proof = this.merkleTree.getProof(i);
            
            proofs[claim.address] = {
                amount: claim.amount,
                originalAmount: claim.originalAmount,
                proof: proof,
                index: i
            };
        }

        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Save proofs for frontend
        const proofsPath = path.join(dataDir, 'merkle-proofs.json');
        fs.writeFileSync(proofsPath, JSON.stringify(proofs, null, 2));
        
        console.log(`✅ Frontend proofs saved: ${proofsPath}`);
        console.log(`   📄 File size: ${(fs.statSync(proofsPath).size / 1024).toFixed(1)} KB`);

        return proofs;
    }

    /**
     * Generate contract deployment configuration
     */
    generateContractDeploymentInfo() {
        if (!this.merkleTree) {
            throw new Error('Merkle tree not generated. Run generateMerkleTree() first.');
        }

        const totalUSDC = this.claims.reduce((sum, claim) => {
            return sum + parseFloat(claim.originalAmount);
        }, 0);

        const totalUSDCWei = this.claims.reduce((sum, claim) => {
            return sum.add(ethers.BigNumber.from(claim.amount));
        }, ethers.BigNumber.from(0));

        const deploymentInfo = {
            merkleRoot: this.merkleTree.root,
            totalAllocation: totalUSDCWei.toString(),
            totalClaims: this.claims.length,
            totalUSDCAmount: totalUSDC,
            usdcTokenAddresses: {
                polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                mumbai: '0xA02f6adc7926efeBBd59Fd43A84b4C0B9f2adD45',
                ethereum: '0xA0b86a33E6441c94c5cF8F4D5bF4B3C5E2c3E9e0'
            },
            deploymentNotes: [
                "Deploy USDCMerkleDistributor.sol with these parameters:",
                `- _usdcToken: Use appropriate address for your target network`,
                `- _merkleRoot: ${this.merkleTree.root}`,
                `- _totalAllocation: ${totalUSDCWei.toString()}`,
                "",
                `After deployment, send ${totalUSDC.toFixed(2)} USDC to the contract address`,
                "Update src/config/contracts.js with deployed contract address"
            ]
        };

        // Save deployment info
        const deploymentPath = path.join(process.cwd(), 'deployment-info.json');
        fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
        
        console.log(`✅ Deployment info saved: ${deploymentPath}`);

        return deploymentInfo;
    }

    /**
     * Generate simplified distribution statistics
     */
    generateStatistics() {
        if (this.claims.length === 0) return;

        console.log('\n📊 Distribution Statistics:');

        const amounts = this.claims.map(c => c.originalAmount);
        
        const stats = {
            totalRecipients: this.claims.length,
            totalUSDC: amounts.reduce((sum, amount) => sum + amount, 0),
            averageReward: 0,
            medianReward: 0,
            minReward: Math.min(...amounts),
            maxReward: Math.max(...amounts),
        };

        stats.averageReward = stats.totalUSDC / stats.totalRecipients;
        
        // Calculate median
        const sortedAmounts = [...amounts].sort((a, b) => a - b);
        const mid = Math.floor(sortedAmounts.length / 2);
        stats.medianReward = sortedAmounts.length % 2 === 0 
            ? (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2
            : sortedAmounts[mid];

        console.log(`   👥 Total Recipients: ${stats.totalRecipients.toLocaleString()}`);
        console.log(`   💰 Total USDC: $${stats.totalUSDC.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
        console.log(`   📊 Average Reward: $${stats.averageReward.toFixed(2)}`);
        console.log(`   📊 Median Reward: $${stats.medianReward.toFixed(2)}`);
        console.log(`   📉 Min Reward: $${stats.minReward.toFixed(2)}`);
        console.log(`   📈 Max Reward: $${stats.maxReward.toFixed(2)}`);

        return stats;
    }

    /**
     * Main execution function
     */
    async run() {
        try {
            await this.processCsvFile();
            
            if (this.claims.length === 0) {
                throw new Error('No valid claims found in CSV file');
            }
            
            this.generateStatistics();
            this.generateMerkleTree();
            this.generateProofsFile();
            const deploymentInfo = this.generateContractDeploymentInfo();
            
            console.log('\n🎉 All files generated successfully!');
            console.log('\n📁 Generated Files:');
            console.log('   📄 src/data/merkle-proofs.json - Frontend eligibility data');
            console.log('   📄 deployment-info.json - Contract deployment configuration');
            
            console.log('\n🚀 Next Steps:');
            console.log('   1. Deploy the smart contract using the provided parameters');
            console.log(`   2. Send ${deploymentInfo.totalUSDCAmount.toFixed(2)} USDC to the deployed contract`);
            console.log('   3. Update src/config/contracts.js with the contract address');
            console.log('   4. Test the frontend claiming interface');
            
            // Estimate gas savings
            const gasCostPerClaim = 5; // $5 average on Ethereum
            const totalGasSavings = gasCostPerClaim * this.claims.length;
            
            console.log('\n💡 Gas Savings with Unicorn:');
            console.log(`   💰 Total gas savings: $${totalGasSavings.toLocaleString()}`);
            
        } catch (error) {
            console.error('\n❌ Error:', error.message);
            process.exit(1);
        }
    }
}

// Command line execution
if (require.main === module) {
    const csvFile = process.argv[2];
    
    if (!csvFile) {
        console.error('❌ Usage: node scripts/csv-to-merkle-simple.js <path-to-csv-file>');
        console.error('📝 Example: node scripts/csv-to-merkle-simple.js data/rewards.csv');
        console.error('\n📋 Expected CSV format:');
        console.error('   address,usdc_reward');
        console.error('   0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,500.50');
        process.exit(1);
    }
    
    if (!fs.existsSync(csvFile)) {
        console.error(`❌ CSV file not found: ${csvFile}`);
        process.exit(1);
    }
    
    const generator = new SimplifiedMerkleGenerator(csvFile);
    generator.run();
}

module.exports = SimplifiedMerkleGenerator;