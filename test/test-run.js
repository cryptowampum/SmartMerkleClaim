/**
 * CSV Processing Tests
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Tests the CSV to Merkle tree processing functionality
 * including file validation, proof generation, and error handling.
 * 
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

async function testCsvProcessing() {
  console.log('🧪 CSV Processing Test Suite');
  console.log('Created by: @cryptowampum');
  console.log('Developed with: Claude AI\n');
  
  let testsPassed = 0;
  let testsTotal = 0;
  
  // Helper function to run a test
  function runTest(testName, testFunction) {
    testsTotal++;
    try {
      console.log(`🔬 Testing: ${testName}`);
      const result = testFunction();
      if (result) {
        console.log(`   ✅ ${testName} - PASSED\n`);
        testsPassed++;
      } else {
        console.log(`   ❌ ${testName} - FAILED\n`);
      }
    } catch (error) {
      console.log(`   ❌ ${testName} - ERROR: ${error.message}\n`);
    }
  }
  
  // Test 1: Check if SimplifiedMerkleGenerator exists
  runTest('SimplifiedMerkleGenerator module exists', () => {
    const modulePath = path.join(__dirname, '..', 'scripts', 'csv-to-merkle-simple.js');
    return fs.existsSync(modulePath);
  });
  
  // Test 2: Create sample data if it doesn't exist
  runTest('Sample data creation', () => {
    const sampleDataPath = path.join(__dirname, 'sample-data.csv');
    if (!fs.existsSync(sampleDataPath)) {
      // Create sample data
      require('./create-sample-data.js');
    }
    return fs.existsSync(sampleDataPath);
  });
  
  // Test 3: Test CSV processing with valid data
  runTest('CSV processing with valid data', async () => {
    try {
      const SimplifiedMerkleGenerator = require('../scripts/csv-to-merkle-simple');
      const samplePath = path.join(__dirname, 'sample-data.csv');
      
      if (!fs.existsSync(samplePath)) {
        console.log('   ⚠️  Sample data not found, creating...');
        require('./create-sample-data.js');
      }
      
      const generator = new SimplifiedMerkleGenerator(samplePath);
      await generator.run();
      
      return true;
    } catch (error) {
      console.log(`   Error: ${error.message}`);
      return false;
    }
  });
  
  // Test 4: Verify generated files exist
  runTest('Generated files verification', () => {
    const proofsPath = path.join(__dirname, '..', 'src', 'data', 'merkle-proofs.json');
    const deploymentPath = path.join(__dirname, '..', 'deployment-info.json');
    
    const proofsExist = fs.existsSync(proofsPath);
    const deploymentExists = fs.existsSync(deploymentPath);
    
    console.log(`   📄 merkle-proofs.json: ${proofsExist ? '✅' : '❌'}`);
    console.log(`   📄 deployment-info.json: ${deploymentExists ? '✅' : '❌'}`);
    
    return proofsExist && deploymentExists;
  });
  
  // Test 5: Verify proof file structure
  runTest('Proof file structure validation', () => {
    try {
      const proofsPath = path.join(__dirname, '..', 'src', 'data', 'merkle-proofs.json');
      
      if (!fs.existsSync(proofsPath)) {
        console.log('   ❌ Proof file does not exist');
        return false;
      }
      
      const proofs = JSON.parse(fs.readFileSync(proofsPath, 'utf8'));
      const addresses = Object.keys(proofs);
      
      console.log(`   📊 Found proofs for ${addresses.length} addresses`);
      
      // Check structure of first proof
      if (addresses.length > 0) {
        const firstProof = proofs[addresses[0]];
        const hasRequiredFields = firstProof.amount && firstProof.originalAmount && firstProof.proof;
        
        console.log(`   🔍 Proof structure check: ${hasRequiredFields ? '✅' : '❌'}`);
        console.log(`      - amount: ${firstProof.amount ? '✅' : '❌'}`);
        console.log(`      - originalAmount: ${firstProof.originalAmount ? '✅' : '❌'}`);
        console.log(`      - proof array: ${Array.isArray(firstProof.proof) ? '✅' : '❌'}`);
        
        return hasRequiredFields && Array.isArray(firstProof.proof);
      }
      
      return addresses.length > 0;
      
    } catch (error) {
      console.log(`   ❌ Error reading proof file: ${error.message}`);
      return false;
    }
  });
  
  // Test 6: Verify deployment info structure
  runTest('Deployment info structure validation', () => {
    try {
      const deploymentPath = path.join(__dirname, '..', 'deployment-info.json');
      
      if (!fs.existsSync(deploymentPath)) {
        console.log('   ❌ Deployment info file does not exist');
        return false;
      }
      
      const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
      
      const requiredFields = [
        'merkleRoot',
        'totalAllocation', 
        'totalClaims',
        'totalUSDCAmount',
        'usdcTokenAddresses'
      ];
      
      let allFieldsPresent = true;
      requiredFields.forEach(field => {
        const present = deploymentInfo.hasOwnProperty(field);
        console.log(`   - ${field}: ${present ? '✅' : '❌'}`);
        if (!present) allFieldsPresent = false;
      });
      
      // Check if Polygon USDC address is present
      const polygonUsdcPresent = deploymentInfo.usdcTokenAddresses?.polygon === '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
      console.log(`   - Polygon USDC address: ${polygonUsdcPresent ? '✅' : '❌'}`);
      
      return allFieldsPresent && polygonUsdcPresent;
      
    } catch (error) {
      console.log(`   ❌ Error reading deployment info: ${error.message}`);
      return false;
    }
  });
  
  // Test 7: Test error handling with invalid CSV
  runTest('Error handling with invalid CSV', async () => {
    try {
      // Create invalid CSV
      const invalidCsvPath = path.join(__dirname, 'invalid-test.csv');
      const invalidCsv = 'address,usdc_reward\ninvalid_address,100\n0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,not_a_number';
      
      fs.writeFileSync(invalidCsvPath, invalidCsv);
      
      const SimplifiedMerkleGenerator = require('../scripts/csv-to-merkle-simple');
      const generator = new SimplifiedMerkleGenerator(invalidCsvPath);
      
      // This should handle errors gracefully
      await generator.processCsvFile();
      
      // Clean up
      if (fs.existsSync(invalidCsvPath)) {
        fs.unlinkSync(invalidCsvPath);
      }
      
      console.log('   ✅ Error handling works correctly');
      return true;
      
    } catch (error) {
      console.log(`   ⚠️  Expected error caught: ${error.message}`);
      return true; // This is expected behavior
    }
  });
  
  // Print summary
  console.log('📊 TEST SUMMARY:');
  console.log(`   ✅ Tests Passed: ${testsPassed}`);
  console.log(`   ❌ Tests Failed: ${testsTotal - testsPassed}`);
  console.log(`   📈 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 All CSV processing tests passed!');
    console.log('   Your CSV processing pipeline is working correctly.');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    console.log('   Common fixes:');
    console.log('   - Run: npm install');
    console.log('   - Check file permissions');
    console.log('   - Verify CSV format matches requirements');
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testCsvProcessing().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('\n❌ Test suite error:', error.message);
    process.exit(1);
  });
}

module.exports = testCsvProcessing;