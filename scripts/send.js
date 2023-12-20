const { getNamedAccounts, ethers } = require("hardhat")

const send = async function () {
    const sendValue = ethers.parseEther("0.0006");
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("Sending funds to contract...");
    const txResponse = await fundMe.sendFunds({ value: sendValue });
    await txResponse.wait(1);
    console.log("Funded");
}

send().then(() => {
    process.exit(0);
}).catch(e => {
    console.log(`Error in fundMe.js: ${e}`)
    process.exit(1);
})