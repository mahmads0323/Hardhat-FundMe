const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    console.log("verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        });
    } catch (exception) {
        if (exception.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
        }
        else {
            console.log("Custom Error", exception);
        }
    }
}

module.exports = { verify };