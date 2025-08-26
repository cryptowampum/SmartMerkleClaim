# Data Directory

> **Created by:** @cryptowampum  
> **Developed with:** Claude AI

This directory contains data files for the sSPORK rewards distribution system.

## File Structure

```
data/
├── README.md                 # This file
├── sspork-holders.csv       # Your CSV file with holder data (add this)
├── example-holders.csv      # Example CSV format
└── .gitkeep                 # Keeps directory in git
```

## CSV Format (Simplified & Clean! ✨)

Your `sspork-holders.csv` file should use this simple, clean format:

```csv
address,usdc_reward
0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,500.50
0x8ba1f109551bD432803012645Hac136c,1001.00
0x1234567890123456789012345678901234567890,750.25
```

### Column Descriptions

- **`address`** - Ethereum wallet address (required)
- **`usdc_reward`** - USDC reward amount (required)

**That's it! Clean and simple.** 🎯

---

## Alternative: Full Format (Optional)

If you want to keep records of sSPORK holdings for audit purposes:

```csv
address,sspork_amount,usdc_reward
0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,1000,500.50
0x8ba1f109551bD432803012645Hac136c,2000,1001.00
0x1234567890123456789012345678901234567890,1500,750.25
```

*Note: sSPORK amount is only for your records - not used by the smart contract.*

### Data Requirements

✅ **Valid Ethereum addresses** - Each address must be a valid 42-character hex string  
✅ **Positive USDC amounts** - All reward amounts must be greater than 0  
✅ **No duplicates** - Each address should appear only once  
✅ **Proper format** - CSV headers must match exactly  

## Processing Your Data

1. **Add your CSV file** to this directory as `sspork-holders.csv`

2. **Run the processing script:**
   ```bash
   npm run process-csv data/sspork-holders.csv
   ```

   *This uses the simplified format by default. For full format with sSPORK records:*
   ```bash
   npm run process-csv-full data/sspork-holders.csv
   ```

3. **Generated files:**
   - `src/data/merkle-proofs.json` - Frontend eligibility data
   - `deployment-info.json` - Contract deployment configuration

## Example Data

Here's a sample CSV with test addresses:

```csv
address,sspork_amount,usdc_reward
0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,1000,500.50
0x8ba1f109551bD432803012645Hac136c,2000,1001.00
0x1234567890123456789012345678901234567890,1500,750.25
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045,3000,1500.00
0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC,500,250.75
```

## Data Security

⚠️ **Important Notes:**
- CSV files with real holder data are excluded from git by default
- The `.gitignore` prevents accidental commits of sensitive data
- Keep holder data secure and only share with authorized personnel
- Generated Merkle proofs are safe to commit (they don't expose raw data)

## Validation

The processing script will validate:
- Address format and checksums
- Positive reward amounts  
- No duplicate addresses
- Proper CSV structure
- Data consistency

Any errors will be reported during processing with specific row numbers.

## Support

If you encounter issues with your CSV data:
1. Check the format matches the example exactly
2. Verify all addresses are valid Ethereum addresses
3. Ensure no negative or zero reward amounts
4. Remove any duplicate entries

For additional help, refer to the main project documentation or create an issue in the repository.