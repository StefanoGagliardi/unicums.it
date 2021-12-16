/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
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
  }
}