/**
 * Unicorn.eth Wallet Configuration
 * 
 * Created by: @cryptowampum
 * Developed with: Claude AI
 * 
 * Configuration for Unicorn smart account wallet integration
 * enabling gasless transactions for sSPORK reward claiming.
 * 
 * @license MIT
 */

import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";

// Official Unicorn.eth configuration values
export const UNICORN_CLIENT_ID = "4e8c81182c3709ee441e30d776223354";
export const UNICORN_FACTORY_ADDRESS = "0xD771615c873ba5a2149D5312448cE01D677Ee48A";

/**
 * Thirdweb client instance for Unicorn integration
 */
export const client = createThirdwebClient({
  clientId: UNICORN_CLIENT_ID,
});

/**
 * Unicorn smart account wallet configuration
 * 
 * Features:
 * - Gasless transactions (sponsored by Unicorn)
 * - Account abstraction for enhanced security
 * - AutoConnect from Unicorn App Centers
 */
export const unicornWallets = [
  inAppWallet({
    smartAccount: {
      factoryAddress: UNICORN_FACTORY_ADDRESS,
      chain: polygon,
      gasless: true, // Enable gas sponsorship
    },
    metadata: {
      name: "sSPORK Rewards Distribution",
      description: "Claim your USDC rewards based on prior year sSPORK holdings",
      url: window.location.origin,
      icons: [window.location.origin + "/favicon.ico"],
    },
  })
];

/**
 * Supported blockchain networks
 */
export const supportedChains = [polygon];

/**
 * App metadata for Unicorn integration
 */
export const APP_METADATA = {
  name: "sSPORK Rewards Distribution",
  description: "Gasless USDC rewards claiming for sSPORK token holders",
  url: window.location.origin,
  icons: [window.location.origin + "/favicon.ico"],
};