const { getNamedAccounts, ethers } = require("hardhat")

const withdraw = async function () {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    const txResponse = await fundMe.withdrawFunds();
    const txRecepient = await txResponse.wait(1);
    console.log(`Txn Hash: ${txRecepient.hash}`)
}

withdraw().then(() => {
    process.exit(0);
}).catch(e => {
    console.log(`Error in fundMe.js: ${e}`)
    process.exit(1);
})