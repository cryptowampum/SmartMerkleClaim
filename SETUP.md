# 🚀 sSPORK Distribution Setup Guide

> **Created by:** @cryptowampum  
> **Developed with:** Claude AI

## 📁 Complete Directory Structure

Create this **exact** folder structure:

```
sspork-rewards-distribution/
├── src/                              # 🎯 MAIN DAPP CODE
│   ├── index.js                     # React entry point
│   ├── App.js                       # Main application  
│   ├── App.css                      # Styles
│   ├── components/
│   │   └── MerkleDistributor.jsx    # Claiming interface
│   ├── config/
│   │   ├── unicorn.js              # Unicorn wallet config
│   │   └── contracts.js            # Contract addresses
│   └── data/
│       └── merkle-proofs.json      # Generated from CSV
├── public/                          # Static files
│   ├── index.html                  # HTML template
│   ├── manifest.json               # PWA config
│   └── favicon.ico                 # Icon (add your own)
├── contracts/                       # Smart contracts
│   └── USDCMerkleDistributor.sol   
├── scripts/                         # Utility scripts
│   ├── csv-to-merkle.js           
│   └── deploy.js                   
├── data/                           # Your CSV data
│   ├── README.md                   # Data format guide
│   └── sspork-holders.csv          # Your holders (add this)
├── test/                           # Contract tests
│   └── USDCMerkleDistributor.test.js
├── .github/workflows/              # CI/CD
│   └── ci.yml                     
├── package.json                    # Dependencies
├── hardhat.config.js              # Blockchain config
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore
├── LICENSE                        # MIT license
├── README.md                      # Main docs
├── CONTRIBUTING.md                # Dev guidelines
└── CONTINUATION_PROMPT.md         # For future development
```

## ⚡ Quick Setup (5 minutes)

### 1. Create Project Directory
```bash
mkdir sspork-rewards-distribution
cd sspork-rewards-distribution
```

### 2. Initialize Project
```bash
# Initialize npm project
npm init -y

# Copy all the artifacts I created into their respective files
# (Use the file contents from the artifacts above)
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment
```bash
cp .env.example .env
# Edit .env with your wallet private key and settings
```

### 5. Add Your Data
```bash
# Add your CSV file to data/sspork-holders.csv
# Simple format: address,usdc_reward
```

### 6. Generate Merkle Tree
```bash
npm run process-csv data/sspork-holders.csv
```

### 7. Start Development
```bash
npm start
# Opens http://localhost:3000
```

## 🏗️ **Key Files to Create First:**

### **1. Root Files** (create these first):
- `package.json` ← Copy from artifact
- `.env.example` ← Copy from artifact  
- `.gitignore` ← Copy from artifact

### **2. Source Directory** (`src/`):
- `src/index.js` ← **NEW** artifact I just created
- `src/App.js` ← Copy from artifact
- `src/App.css` ← Copy from artifact
- `src/components/MerkleDistributor.jsx` ← Copy from artifact
- `src/config/unicorn.js` ← Copy from artifact
- `src/config/contracts.js` ← Copy from artifact

### **3. Public Directory** (`public/`):
- `public/index.html` ← **NEW** artifact I just created
- `public/manifest.json` ← **NEW** artifact I just created
- `public/favicon.ico` ← Add your own icon

## 🎯 **Most Important Files for dApp**:

1. **`src/index.js`** - React entry point (renders everything)
2. **`src/App.js`** - Main app with Thirdweb provider
3. **`src/components/MerkleDistributor.jsx`** - The actual claiming interface
4. **`public/index.html`** - HTML template that loads React

## 🔧 **Development Commands**:

```bash
npm start          # Start React dev server (localhost:3000)
npm test           # Run tests
npm run build      # Build for production
npm run process-csv data/sspork-holders.csv  # Process your CSV
npm run deploy-contract-testnet  # Deploy to Mumbai
npm run deploy-contract          # Deploy to Polygon
```

## ✅ **Verification Steps**:

1. **Check file structure** matches above exactly
2. **Run `npm start`** - should open React app at localhost:3000
3. **Test CSV processing** with sample data
4. **Deploy to testnet** first
5. **Test claiming flow** end-to-end

## 🆘 **If You Get Errors**:

**"Module not found"** → Check file paths match structure exactly  
**"Cannot resolve"** → Run `npm install` again  
**"Invalid hook call"** → Make sure React version matches package.json  
**"Network error"** → Check your .env file configuration  

## 📱 **Mobile Testing**:

Test the dApp on mobile by:
1. Deploy to Vercel/Netlify (free)
2. Test on actual mobile devices
3. Verify Unicorn AutoConnect works
4. Check responsive design

**Your dApp code goes in the `src/` directory - that's where React lives! 🎯**