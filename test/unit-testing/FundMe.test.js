const { assert, expect } = require("chai");
const { toBigInt } = require("ethers");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip("TsetFundMeLocal")
    : describe("TsetFundMeLocal", function () {

        let fundMe;
        let deployer;
        let mockV3Aggregator;
        const sendValue = ethers.parseEther("1"); // 1 eth

        beforeEach(async function () {
            // deploy fund me contract using hardhay-deploy
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]); // will deploy all contracts with tag "all"
            fundMe = await ethers.getContract("FundMe", deployer) // will give most recent deplyed contract
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
        })

        describe("constructor", function () {
            it("sets the aggregator address correctly", async function () {
                const localPriceFeed = await fundMe.getPriceFeed();
                assert.equal(await mockV3Aggregator.getAddress(), localPriceFeed);
            })
        })

        describe("funds", function () {
            it("should pass when enought eth is not sent", async function () {
                // will pass if enough Eth is not sent and revert message should be same
                await expect(fundMe.sendFunds()).to.be.revertedWith("Not Enough Eth sent.")
            })

            it("pass when amount funded is >= to required", async function () {
                await fundMe.sendFunds({ value: sendValue });
                const response = await fundMe.getAddressToAmount(deployer);
                assert.equal(response.toString(), sendValue.toString())
            })

            it("add funder to funders array", async function () {
                await fundMe.sendFunds({ value: sendValue });
                const response = await fundMe.getFunder(0);
                assert.equal(response, deployer);
            })
        })

        describe("withdraw", function () {
            beforeEach(async function () {
                await fundMe.sendFunds({ value: sendValue })
            })

            it("withdraw Eth when single founder", async function () {
                // Arrange
                const beforeWithdrawContractBalance = await ethers.provider.getBalance(await fundMe.getAddress());
                const beforeWithdrawDeployerBalance = await ethers.provider.getBalance(deployer);

                // Act
                const txResponse = await fundMe.withdrawFunds();
                const txRecepient = await txResponse.wait(1);
                const { gasUsed, gasPrice } = txRecepient;
                const gasCost = gasUsed * gasPrice;
                const afterWithdrawContractBalance = await ethers.provider.getBalance(await fundMe.getAddress());
                const afterWithdrawDeployerBalance = await ethers.provider.getBalance(deployer);

                // Assert
                assert.equal(afterWithdrawContractBalance, 0);
                assert.equal((beforeWithdrawContractBalance + beforeWithdrawDeployerBalance).toString(),
                    (afterWithdrawDeployerBalance + gasCost).toString())
            })

            it("withdraw Eth from multiple funders", async function () {
                // Arrange
                const accounts = await ethers.getSigners();
                for (let i = 0; i < 6; i++) {
                    const fundMeConnectedAccount = fundMe.connect(accounts[i]);
                    await fundMeConnectedAccount.sendFunds({ value: sendValue });
                }
                const beforeWithdrawContractBalance = await ethers.provider.getBalance(await fundMe.getAddress());
                const beforeWithdrawDeployerBalance = await ethers.provider.getBalance(deployer);

                // Act
                const txResponse = await fundMe.withdrawFunds();
                const txRecepient = await txResponse.wait(1);
                const { gasUsed, gasPrice } = txRecepient;
                const gasCost = gasUsed * gasPrice;
                const afterWithdrawContractBalance = await ethers.provider.getBalance(await fundMe.getAddress());
                const afterWithdrawDeployerBalance = await ethers.provider.getBalance(deployer);

                // Assert
                //owner get all
                assert.equal(afterWithdrawContractBalance, 0);
                assert.equal((beforeWithdrawContractBalance + beforeWithdrawDeployerBalance).toString(),
                    (afterWithdrawDeployerBalance + gasCost).toString())
                // funders are reset properly
                expect(fundMe.getFunder(0)).to.be.reverted;
                // AddressToAmount should be 0 for every address after withdraw
                for (let i = 1; i < 6; i++) {
                    assert.equal(await fundMe.getAddressToAmount(accounts[i].address), 0);
                }
            })

            it("only contract owner can withdraw", async function () {
                const accounts = await ethers.getSigners();
                const attacker = accounts[1]; // 0 will be deployer;
                const attackerConnected = await fundMe.connect(attacker);
                expect(attackerConnected.withdrawFunds()).to.be.revertedWith("FundMe_NotOwner");
            })
        })
    })
