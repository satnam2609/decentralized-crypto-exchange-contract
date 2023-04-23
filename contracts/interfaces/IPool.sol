// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

interface IPool {
    function initialize(address, address) external;

    function swap(
        address base,
        address quote,
        uint256 amountIn
        // uint256 amountOut
    ) external;

    function addLiquidity(
        // address tokenA,
        // address tokenB,
        uint amountA,
        uint amountB
    ) external returns (uint256 shares);

    function removeLiquidity(
        uint256 _shares
    ) external returns (uint256, uint256);
}
