const { netwokConnfig, developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify")
const { ethers } = require("@nomicfoundation/hardhat-ethers")
// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments } = hre;
// };

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let priceFeedAddess;
    // when going with localHost or hardhat we will use mock
    if (developmentChains.includes(network.name)) {
        const EthUSDAggregator = await deployments.get("MockV3Aggregator")
        priceFeedAddess = await EthUSDAggregator.address;
    }
    else {
        priceFeedAddess = await netwokConnfig[chainId]["EthUSDPriceFeed"]
    }

    const funcArgs = [priceFeedAddess];
    const fundMe = await deploy("FundMe",
        {
            from: deployer,
            args: funcArgs,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1
        })

    // some verification
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API) {
        await verify(fundMe.address, funcArgs)
    }
    log("-----------------Fund Me Deployed----------------------")
};

module.exports.tags = ["all"];