/*
 * File: hardhat.config.ts - https://hardhat.org/config/
 *
 * @author Stefano Gagliardi <stefano.gagliardi@sitisrl.it>
 * @Version - 1.5.0
 */

// Typescript type binding
import '@typechain/hardhat';  

// Standard import for hardhat
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

const fs = require('fs')
const privateKey = fs.readFileSync(".secret").toString().trim() || "K0RVajGlPkuAIOsHYXT6EgZeSFQUnL9N"
console.log("Private key", privateKey);

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  typechain: {
    outDir: './typechain-types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
}