# Contributing to sSPORK Rewards Distribution

> **Created by:** [@cryptowampum](https://github.com/cryptowampum)  
> **Developed with:** Claude AI

Thank you for your interest in contributing to the sSPORK rewards distribution system! This project enables gasless USDC claiming for sSPORK token holders via Unicorn.eth integration.

## 🤝 How to Contribute

### Types of Contributions Welcome

- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🧪 Additional testing and validation
- 🎨 UI/UX improvements
- 🔧 Development tooling enhancements

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/sspork-rewards-distribution.git
   cd sspork-rewards-distribution
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Guidelines

### Code Style

- **JavaScript/React:** Use modern ES6+ syntax
- **Solidity:** Follow OpenZeppelin standards
- **Comments:** Include attribution comments in new files
- **Formatting:** Use Prettier (will be added to project)

### File Header Template

Include this header in new files:

```javascript
/**
 * [File Description]
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * [Additional description]
 * 
 * @license MIT
 */
```

### Testing Requirements

- Test smart contract changes on Mumbai testnet first
- Verify frontend changes work with both Unicorn and EOA wallets
- Include edge case testing
- Document any breaking changes

### Commit Message Format

Use clear, descriptive commit messages:

```
feat: add support for multiple networks
fix: resolve claim button loading state
docs: update deployment instructions
test: add edge case testing for invalid proofs
```

## 🔧 Development Setup

### Smart Contract Development

1. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

2. **Run tests**
   ```bash
   npx hardhat test
   ```

3. **Deploy to testnet**
   ```bash
   npm run deploy-contract-testnet
   ```

### Frontend Development

1. **Start development server**
   ```bash
   npm start
   ```

2. **Test Unicorn AutoConnect**
   ```bash
   # Add URL parameters to simulate App Center access
   http://localhost:3000/?walletId=inApp&authCookie=demo123
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🧪 Testing Guidelines

### Smart Contract Testing

- Test all claim scenarios (valid, invalid, already claimed)
- Verify Merkle proof validation
- Test emergency withdrawal functions
- Test with different token amounts

### Frontend Testing

- Test wallet connection flows
- Verify eligibility checking
- Test claim transactions
- Test error handling
- Test mobile responsiveness

### Integration Testing

- Test end-to-end claim process
- Verify gas sponsorship works with Unicorn
- Test with real CSV data
- Validate against deployed contracts

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Breaking changes are documented
- [ ] Feature works on both desktop and mobile

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other: ___

## Testing Done
- [ ] Smart contract tests pass
- [ ] Frontend functionality verified
- [ ] Mobile responsiveness checked
- [ ] Unicorn wallet integration tested

## Additional Notes
Any additional context or screenshots
```

### Review Process

1. **Automated checks** will run on your PR
2. **Maintainer review** will be conducted
3. **Testing** on staging environment if needed
4. **Merge** after approval

## 🐛 Bug Reports

### Creating Issues

Use the issue template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Wallet: [e.g. Unicorn, MetaMask]
- Network: [e.g. Polygon, Mumbai]
```

### Security Issues

For security-related issues:
- **DO NOT** create public issues
- Email: security@your-domain.com
- Include full details and reproduction steps

## 💡 Feature Requests

### Suggesting Features

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** your feature would solve
3. **Propose a solution** with implementation ideas
4. **Consider alternatives** and their trade-offs

### Feature Priorities

Current priority areas:
- Enhanced mobile experience
- Multi-network support
- Analytics and monitoring
- Additional wallet integrations
- Performance optimizations

## 🚀 Development Roadmap

### Upcoming Features

- [ ] Multi-network deployment support
- [ ] Enhanced analytics dashboard
- [ ] Batch claiming for multiple addresses
- [ ] Integration with more wallet providers
- [ ] Advanced admin controls

### Long-term Goals

- Expand to other EVM networks
- Support for different token standards
- Enhanced security features
- Improved user experience

## 📚 Resources

### Documentation

- [Unicorn.eth Documentation](https://docs.unicorn.eth)
- [Thirdweb Docs](https://portal.thirdweb.com/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)

### Community

- [Project Discord](#) *(add your community links)*
- [Telegram Group](#)
- [Twitter](#)

## 🙏 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- Social media announcements

### Hall of Fame

*Contributors will be listed here as they make significant contributions*

## ❓ Questions

For questions about contributing:
- Create a GitHub discussion
- Join our Discord community
- Email: contributors@your-domain.com

## 📋 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow community guidelines

### Enforcement

Violations of the code of conduct may result in:
- Warning
- Temporary suspension
- Permanent ban from the project

---

**Thank you for helping improve the sSPORK rewards distribution system! 🚀**