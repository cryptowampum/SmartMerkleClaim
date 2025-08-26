# 🍴 sSPORK Rewards Distribution

> **Gasless USDC claiming for sSPORK holders via Unicorn.eth integration**

**Created by:** [@cryptowampum](https://github.com/cryptowampum)  
**Developed with:** Claude AI  
**License:** MIT

---

## 📋 Overview

A Merkle tree-based USDC rewards distribution system for sSPORK token holders. Users can claim their rewards through either:
- **🦄 Unicorn wallets** (gasless claiming via App Centers)
- **💼 Regular wallets** (MetaMask, WalletConnect, etc.)

### ✨ Key Features

- ✅ **Gasless claiming** with Unicorn smart account wallets
- ✅ **Secure Merkle proofs** for reward verification
- ✅ **CSV processing** to generate distribution data
- ✅ **Multi-wallet support** (Unicorn + traditional wallets)
- ✅ **Mobile responsive** interface
- ✅ **One-click AutoConnect** from Unicorn App Centers

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Git
- A CSV file with wallet addresses and reward amounts

### Installation

```bash
git clone https://github.com/your-org/sspork-rewards-distribution.git
cd sspork-rewards-distribution
npm install
```

### 1. Process Your CSV Data

```bash
# Prepare your CSV file with simple format: address,usdc_reward
cp your-rewards.csv data/sspork-holders.csv

# Generate Merkle tree and proofs (simplified version)
npm run process-csv-simple data/sspork-holders.csv
```

This generates:
- `merkle-proofs.json` - Frontend data
- `deployment-info.json` - Contract deployment data

### 2. Deploy Smart Contract

```bash
# Copy environment variables
cp .env.example .env
# Edit .env with your private key and network settings

# Deploy to Polygon testnet
npm run deploy-contract-testnet

# Deploy to Polygon mainnet
npm run deploy-contract
```

### 3. Update Frontend Configuration

Edit `src/config/contracts.js` with your deployed contract address:

```javascript
export const MERKLE_DISTRIBUTOR_ADDRESS = "0x..."; // Your deployed contract
```

### 4. Start Development Server

```bash
npm start
```

Visit http://localhost:3000

### 5. Deploy Frontend

```bash
npm run build
# Deploy build/ folder to Vercel, Netlify, or your preferred host
```

### 6. Submit to Unicorn App Center

Fill out the [App Center submission form](https://forms.gle/3kyuEce2fZtd7Umy9) with your deployed URL.

## 📊 Project Structure

```
sspork-rewards-distribution/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── MerkleDistributor.jsx
│   │   └── WalletConnection.jsx
│   ├── config/               # Configuration files
│   │   ├── unicorn.js       # Unicorn wallet setup
│   │   └── contracts.js     # Contract addresses
│   ├── hooks/               # Custom React hooks
│   └── App.js              # Main application
├── contracts/              # Solidity smart contracts
│   └── USDCMerkleDistributor.sol
├── scripts/               # Utility scripts
│   ├── csv-to-merkle.js  # CSV processing
│   └── deploy.js         # Contract deployment
├── data/                 # Data files
├── hardhat.config.js    # Hardhat configuration
└── README.md
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Wallet & Network
PRIVATE_KEY=your_deployment_wallet_private_key
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.matic.today

# Contract Verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Frontend
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
REACT_APP_NETWORK=polygon
```

### CSV Format

Your sSPORK holders CSV should follow this simple format:

```csv
address,usdc_reward
0x742d35Cc6635C0532925a3b8D710432D8c14C3C1,500.50
0x8ba1f109551bD432803012645Hac136c,1001.00
0x...,750.25
```

Clean and simple - just addresses and their USDC rewards! 🎯

## 📱 User Experience

### Via Unicorn App Center
1. User clicks dApp in their community's app center
2. **AutoConnect** - instant wallet connection (no selection needed)
3. **Check eligibility** - automatic lookup of their address
4. **Claim rewards** - gasless transaction via Unicorn smart account
5. **Done!** - USDC appears in wallet with zero gas fees

### Via Direct Access
1. User visits dApp URL directly
2. **Connect wallet** - choose from available options
3. **Check eligibility** - see reward amount if eligible
4. **Claim rewards** - pay gas fees normally (~$3-8)
5. **Done!** - USDC transferred to wallet

## 🛡️ Security Features

- **Merkle proof verification** - Cryptographically secure eligibility
- **Single claim per address** - Prevents double-spending
- **ReentrancyGuard** - Contract-level protection
- **Owner controls** - Emergency functions for admin
- **Audited patterns** - Based on OpenZeppelin standards

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Locally
```bash
# Test with mock URL parameters
http://localhost:3000/?walletId=inApp&authCookie=demo123
```

### Verify Contract
```bash
npm run verify-contract -- DEPLOYED_CONTRACT_ADDRESS
```

## 💰 Costs & Economics

### Contract Deployment
- **Polygon:** ~$1-5 in MATIC
- **Ethereum:** ~$50-200 in ETH

### Distribution Funding
- Total USDC needed: Sum of all rewards in your CSV
- Recommend 1-2% buffer for precision

### Frontend Hosting
- **Free options:** Vercel, Netlify, GitHub Pages
- **Custom domain:** ~$10/year

## 📈 Monitoring & Analytics

Track these key metrics:
- Total unique visitors
- Wallet connection rate
- Successful claim rate
- Unicorn vs EOA wallet usage
- Contract USDC balance
- Gas savings provided to users

Recommended tools:
- Google Analytics for web metrics
- Polygonscan for on-chain monitoring
- Custom dashboard reading contract events

## 🆘 Troubleshooting

### Common Issues

**"Not eligible"**
- Verify CSV address format is correct
- Check address is in processed merkle-proofs.json

**"Transaction failed"**
- Ensure contract has sufficient USDC balance
- Check network settings match deployment

**Wallet won't connect**
- Verify network (Polygon) in wallet settings
- Check if using supported wallet

### Getting Help

- **Smart Contract Issues:** [OpenZeppelin Forum](https://forum.openzeppelin.com/)
- **Unicorn Integration:** [Discord](https://discord.gg/unicorn-developers)
- **General Issues:** Create an issue in this repository

## 🔄 Post-Distribution

### Analytics Report
Track distribution success:
- Total claims processed
- Percentage of eligible users who claimed
- Gas savings provided via Unicorn wallets
- User feedback and satisfaction

### Unclaimed Rewards
Contract owner can withdraw unclaimed USDC after distribution period:

```javascript
// Only contract owner can call
await contract.withdrawRemainingUSDC();
```

### Future Distributions
For subsequent distributions:
1. Process new CSV data
2. Deploy new contract with new Merkle root
3. Update frontend configuration
4. Reuse same codebase and Unicorn integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation for changes
- Ensure mobile responsiveness
- Test both Unicorn and EOA wallet flows

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[@cryptowampum](https://github.com/cryptowampum)** - Product vision and requirements
- **Claude AI** - Technical architecture and development
- **Unicorn.eth** - Gasless wallet infrastructure and AutoConnect
- **OpenZeppelin** - Secure smart contract patterns
- **Thirdweb** - Web3 development framework

## 🔗 Links

- [Live dApp](https://your-deployment-url.com) *(update after deployment)*
- [Contract on Polygonscan](https://polygonscan.com/address/YOUR_CONTRACT_ADDRESS) *(update after deployment)*
- [Unicorn App Center Submission](https://forms.gle/3kyuEce2fZtd7Umy9)
- [Project Documentation](./docs/)

---

**Built with ❤️ for the sSPORK community**