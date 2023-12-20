const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        log("Development Network Identified! Deploying Mocks...");
        await deploy("MockV3Aggregator",
            {
                contract: "MockV3Aggregator",
                from: deployer,
                log: true,
                args: [DECIMALS, INITIAL_PRICE]
            });
        log("------------------Mock Deployed-----------------------")
    }
};

module.exports.tags = ["all", "mocks"];