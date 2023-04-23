// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Pool.sol";
import "./ERC20.sol";
import "./interfaces/IFactory.sol";
import "./Pool.sol";

contract Factory is IFactory {
    Pool[] public pools;

    // test variable
    address public PoolAdd;

    mapping(address => mapping(address => address)) public getPair;

    struct Pair {
        address base;
        address quote;
    }

    function createPair(
        address tokenA,
        address tokenB
    ) public returns (address pair) {
        // Pool pool = new Pool();
        // pool.initialize(tokenA, tokenB);
        bytes memory bytecode = type(Pool).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(tokenA, tokenB));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        Pool(pair).initialize(tokenA, tokenB);
        pair = pair;
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair;
        // pools.push(pool);
        PoolAdd = pair;
        emit PairCreated(tokenA, tokenB, pair);
    }
}
