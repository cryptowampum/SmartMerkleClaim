// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title USDCMerkleDistributor
 * @dev Distributes USDC tokens to sSPORK holders based on a Merkle tree
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * This contract enables gasless claiming of USDC rewards for sSPORK token holders
 * through Merkle proof verification, with support for Unicorn.eth smart accounts.
 * 
 * @license MIT
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract USDCMerkleDistributor is Ownable, ReentrancyGuard {
    // USDC token contract
    IERC20 public immutable usdcToken;
    
    // Merkle root containing all eligible claims
    bytes32 public immutable merkleRoot;
    
    // Total amount of USDC allocated for distribution
    uint256 public immutable totalAllocation;
    
    // Track claimed addresses to prevent double-spending
    mapping(address => bool) public hasClaimed;
    
    // Track total claimed amount for analytics
    uint256 public totalClaimed;
    
    // Events
    event Claimed(
        address indexed account, 
        uint256 amount,
        uint256 totalClaimedSoFar
    );
    
    event EmergencyWithdraw(
        address indexed token, 
        uint256 amount,
        address indexed to
    );
    
    // Custom errors for gas efficiency
    error AlreadyClaimed();
    error InvalidProof();
    error TransferFailed();
    error InsufficientContractBalance();
    error ZeroAmount();
    
    /**
     * @dev Constructor
     * @param _usdcToken Address of USDC token contract on this network
     * @param _merkleRoot Root of the Merkle tree containing all eligible claims
     * @param _totalAllocation Total USDC amount allocated for this distribution
     */
    constructor(
        address _usdcToken,
        bytes32 _merkleRoot,
        uint256 _totalAllocation
    ) {
        require(_usdcToken != address(0), "Invalid USDC token address");
        require(_merkleRoot != bytes32(0), "Invalid merkle root");
        require(_totalAllocation > 0, "Total allocation must be > 0");
        
        usdcToken = IERC20(_usdcToken);
        merkleRoot = _merkleRoot;
        totalAllocation = _totalAllocation;
    }
    
    /**
     * @dev Claim USDC tokens for a given address and amount
     * 
     * This function supports gasless transactions through Unicorn.eth smart accounts
     * and regular EOA wallets. The Merkle proof ensures only eligible addresses can claim.
     * 
     * @param account Address claiming the tokens (can be different from msg.sender for gasless)
     * @param amount Amount of USDC to claim (in wei, 6 decimals for USDC)
     * @param merkleProof Merkle proof verifying the claim eligibility
     */
    function claim(
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external nonReentrant {
        // Input validation
        if (amount == 0) revert ZeroAmount();
        if (hasClaimed[account]) revert AlreadyClaimed();
        
        // Verify the Merkle proof
        bytes32 node = keccak256(abi.encodePacked(account, amount));
        if (!MerkleProof.verify(merkleProof, merkleRoot, node)) {
            revert InvalidProof();
        }
        
        // Check contract has sufficient balance
        uint256 contractBalance = usdcToken.balanceOf(address(this));
        if (contractBalance < amount) revert InsufficientContractBalance();
        
        // Mark as claimed and update totals
        hasClaimed[account] = true;
        totalClaimed += amount;
        
        // Transfer USDC tokens
        bool success = usdcToken.transfer(account, amount);
        if (!success) revert TransferFailed();
        
        emit Claimed(account, amount, totalClaimed);
    }
    
    /**
     * @dev Check if an address has already claimed their rewards
     * @param account Address to check
     * @return bool indicating if address has claimed
     */
    function isClaimed(address account) external view returns (bool) {
        return hasClaimed[account];
    }
    
    /**
     * @dev Get remaining USDC balance in contract
     * @return uint256 Current USDC balance available for claims
     */
    function getRemainingBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
    
    /**
     * @dev Get distribution statistics
     * @return claimed Total amount claimed so far
     * @return remaining USDC balance remaining in contract
     * @return allocated Total amount allocated for distribution
     * @return percentageClaimed Percentage of total allocation that has been claimed (scaled by 10000)
     */
    function getDistributionStats() external view returns (
        uint256 claimed,
        uint256 remaining,
        uint256 allocated,
        uint256 percentageClaimed
    ) {
        claimed = totalClaimed;
        remaining = usdcToken.balanceOf(address(this));
        allocated = totalAllocation;
        
        // Calculate percentage (scaled by 10000 for precision)
        // e.g., 5000 = 50.00%
        percentageClaimed = totalAllocation > 0 
            ? (totalClaimed * 10000) / totalAllocation 
            : 0;
    }
    
    /**
     * @dev Emergency withdrawal function for contract owner
     * 
     * This should only be used in emergency situations or to withdraw
     * unclaimed tokens after the distribution period ends.
     * 
     * @param token Address of token to withdraw (typically USDC)
     * @param amount Amount to withdraw (0 = withdraw all)
     * @param to Address to send tokens to
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        address to
    ) external onlyOwner {
        require(to != address(0), "Cannot withdraw to zero address");
        
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        
        // If amount is 0, withdraw entire balance
        uint256 withdrawAmount = amount == 0 ? balance : amount;
        require(withdrawAmount <= balance, "Insufficient token balance");
        
        bool success = tokenContract.transfer(to, withdrawAmount);
        require(success, "Token transfer failed");
        
        emit EmergencyWithdraw(token, withdrawAmount, to);
    }
    
    /**
     * @dev Convenience function to withdraw all remaining USDC after distribution
     * @param to Address to send remaining USDC to
     */
    function withdrawRemainingUSDC(address to) external onlyOwner {
        uint256 remaining = usdcToken.balanceOf(address(this));
        require(remaining > 0, "No USDC remaining");
        
        emergencyWithdraw(address(usdcToken), 0, to);
    }
    
    /**
     * @dev View function to verify a Merkle proof without claiming
     * 
     * Useful for frontend validation before submitting claim transaction.
     * 
     * @param account Address to verify
     * @param amount Amount to verify
     * @param merkleProof Proof to verify
     * @return bool indicating if proof is valid
     */
    function verifyProof(
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external view returns (bool) {
        bytes32 node = keccak256(abi.encodePacked(account, amount));
        return MerkleProof.verify(merkleProof, merkleRoot, node);
    }
}