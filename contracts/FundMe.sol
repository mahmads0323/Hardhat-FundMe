// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.22;

// Imports
import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Errors
error FundMe_NotOwner();

// Interfaces
// Libraries

// Contracts
/**
 * @title A contract for crowd funding
 * @author Muhammad Ahmad Shahid
 * @notice Demo of CrowdFunding Contract
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint256 constant MINIMUM_USD = 1 * 1e18; // converting into 18 decimal
    address[] private s_funders;
    mapping(address => uint256) private s_AddressToAmount;
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not Owner");
        if (msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    // -- Function Oder
    /// 1: constructor
    /// 2: receive
    /// 3: fallBack
    /// 4: external
    /// 5: public
    /// 6: internal
    /// 7: private
    /// 8: view/ pure

    // constructor
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive
    // if someone send money without usiing fund functions they will be auttomatically routed to SendFunds()
    receive() external payable {
        sendFunds();
    }

    // fallBack
    fallback() external payable {
        sendFunds();
    }

    function sendFunds() public payable {
        // value must be >= to 1$
        // 1.GetConversionRate() will take 1 as its 1st parameter autoomatically
        require(
            msg.value.GetConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Not Enough Eth sent."
        );
        s_funders.push(msg.sender);
        s_AddressToAmount[msg.sender] =
            s_AddressToAmount[msg.sender] +
            msg.value;
    }

    function withdrawFunds() public onlyOwner {
        address[] memory m_funders = s_funders;
        for (uint256 i = 0; i < m_funders.length; i++) {
            address funder = m_funders[i];
            s_AddressToAmount[funder] = 0;
        }
        // resetting array of funders
        s_funders = new address[](0);

        // 1: Transfer -> returns error if gas > 2300 and reverts automatically
        // msg.sender is of address type so we have to cast it in payable
        // payable(msg.sender).transfer(address(this).balance);

        // 2: Send -> returns bool if gas > 2300 , we have to revert manually
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Sending failed");

        // 3: Call -> forwards all gas and return bool
        // call takes callback function and "" means empty
        // (bool callSuccessed, /* bytes memory dataReturned */) = payable(msg.sender).call{value: address(this).balance}("");
        // require(callSuccessed, "Sending Failed");
    }

    // view/ pure
    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmount(
        address _address
    ) public view returns (uint256) {
        return s_AddressToAmount[_address];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
