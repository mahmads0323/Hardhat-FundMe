const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip("TestFundMeTestnet")
    : describe("TestFundMeTestnet", function () {
        let fundMe;
        let deployer;
        const sendValue = ethers.parseEther("0.0006");

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allows people to fund and withdraw", async function () {
            await fundMe.sendFunds({ value: sendValue });
            await fundMe.withdrawFunds();
            const endingContractBalance = await ethers.provider.getBalance(await fundMe.getAddress());
            assert.equal(endingContractBalance.toString(), "0");
        })
    })