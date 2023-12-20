// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function GetPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData(); // retuns eth in usd
        // price will be of 8 decimal places
        return uint256(price * 1e10);
    }

    function GetConversionRate(
        uint256 _ether,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 _ethPrice = GetPrice(priceFeed);
        uint256 _ethAmountInUSD = (_ethPrice * _ether) / 1e18; // _ether will be in wei
        return _ethAmountInUSD;
    }
}
