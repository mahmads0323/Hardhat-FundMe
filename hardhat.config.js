const { version } = require("chai");

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('hardhat-deploy')
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("solidity-coverage")
require("@nomiclabs/hardhat-ethers")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      // accounts will be given by hardhat automatically
      chainId: 31337
    }
  },
  // mocha: {
  //   timeout: 60000 // Increase timeout to 60 seconds
  // },
  gasReporter: {
    enabled: true,
    outputFile: "./gas-report.text",
    noColors: true,
    currency: "USD",
    // coinmarketcap: process.env.COINMARKETCAP_API
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    }
  },
  solidity: {
    compilers: [
      { version: "0.8.22" },
      { version: "0.6.0" }
    ]
  }
};
