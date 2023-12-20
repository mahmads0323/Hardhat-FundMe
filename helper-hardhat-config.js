const netwokConnfig = {
    11155111: {
        name: "sepolia",
        EthUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    // 31337
}
const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8;
const INITIAL_PRICE = 200000000000;

module.exports = { netwokConnfig, developmentChains, DECIMALS, INITIAL_PRICE };