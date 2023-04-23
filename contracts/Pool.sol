// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./interfaces/IPool.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Pool is IPool {
    address public token0;
    address public token1;

    using SafeMath for uint256;
    uint256 public totalShares;

    uint256 public reserveA;
    uint256 public reserveB;

    mapping(address => uint) public poolBalanceOf;

    modifier isDXandDYareCorrect(uint256 _dx, uint256 _dy) {
        uint256 X = reserveA;
        uint256 Y = reserveB;
        if (X == 0 && Y == 0) {
            _;
        } else {
            console.log("_dx ======>>>>", ((Y * _dx) / X) / 1e18);
            console.log("_dy ======>>>>", ((X * _dy) / Y) / 1e18);
            require(
                _dy == (Y * _dx) / X,
                "_dx and _dy should satisfy the equation"
            );
            _;
        }
    }

    function initialize(address _token0, address _token1) external {
        token0 = _token0;
        token1 = _token1;
    }

    function _mint(address _to, uint256 _amount) private {
        poolBalanceOf[_to] += _amount;
        totalShares += _amount;
    }

    function _burn(address _to, uint256 _amount) private {
        poolBalanceOf[_to] -= _amount;
        totalShares -= _amount;
    }

    function _updateReserve(uint256 _resA, uint256 _resB) private {
        reserveA = _resA;
        reserveB = _resB;
    }

    function addLiquidity(
        uint256 _dx,
        uint256 _dy
    ) external isDXandDYareCorrect(_dx, _dy) returns (uint256 shares) {
        // transfering the tokens to the pool

        Token(token0).transferFrom(msg.sender, address(this), _dx);
        Token(token1).transferFrom(msg.sender, address(this), _dy);

        uint256 X = Token(token0).balanceOf(address(this));
        uint256 Y = Token(token1).balanceOf(address(this));

        if (totalShares > 0) {
            shares = (_dx.mul(totalShares)).div(X);
            _mint(msg.sender, shares);
        } else {
            shares = _dx + _dy;
        }
        require(shares > 0, "shares=0");
        _updateReserve(X, Y);
        _mint(msg.sender, shares);
    }

    function removeLiquidity(
        uint256 _shares
    ) external returns (uint256, uint256) {
        require(_shares > 0);
        uint256 X = reserveA;
        uint256 Y = reserveB;

        uint256 amount0Out = (X.mul(_shares)).div(totalShares);
        uint256 amount1Out = (Y.mul(_shares)).div(totalShares);

        _burn(msg.sender, _shares);

        if (amount0Out > 0 && amount1Out > 0) {
            Token(token0).transfer(msg.sender, amount0Out);
            Token(token1).transfer(msg.sender, amount1Out);
        }
        _updateReserve(X, Y);
        return (amount0Out, amount1Out);
    }

    function getTradePrice(
        address from,
        address to,
        uint256 amount
    ) public view returns (uint256) {
        uint256 X = Token(from).balanceOf(address(this));
        uint256 Y = Token(to).balanceOf(address(this));

        return (Y.mul(amount)).div(X + amount);
    }

    function swap(address from, address to, uint256 amount) external {
        require(amount > 0, "amount =0");
        Token(from).transferFrom(msg.sender, address(this), amount);
        //  approve

        Token(to).transfer(msg.sender, getTradePrice(from, to, amount));
        console.log("Tradeed");
    }
}
