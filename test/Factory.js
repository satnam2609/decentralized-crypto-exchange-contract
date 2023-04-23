const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Factort and Pool test", async () => {
  it("Should work", async () => {
    let accounts = await ethers.getSigners();
    let owner = accounts[0];
    let user = accounts[1];

    const Token = await ethers.getContractFactory("Token");

    const Factory = await ethers.getContractFactory("Factory");
    const neutron = await Token.deploy("Neutron", "NTR", tokens(100));
    const proton = await Token.deploy("Proton", "PTR", tokens(100));

    const factory = await Factory.deploy();
    const Pool = await ethers.getContractFactory("Pool");

    // pair creating
    await factory.createPair(neutron.address, proton.address);
    console.log("pool address", await factory.PoolAdd());

    const poolAddress = async (tokenAdd_A, tokenAdd_B) => {
      return await factory.getPair(tokenAdd_A, tokenAdd_B);
    };

    const pool = await Pool.attach(
      poolAddress(neutron.address, proton.address)
    );

    // console.log(
    //   "Pairs --->",
    //   await factory.getPairs("0x75537828f2ce51be7289709686A69CbFDbB714F1")
    // );

    await neutron.connect(owner).transfer(user.address, tokens(40));
    await proton.connect(owner).transfer(user.address, tokens(40));

    let approveA = await neutron
      .connect(user)
      .approve(pool.address, tokens(20));

    await approveA.wait();

    let approveB = await proton.connect(user).approve(pool.address, tokens(10));

    await approveB.wait();

    console.log("balances", await neutron.balanceOf(user.address));
    console.log(
      "add Liquidity--->",
      await pool.connect(user).addLiquidity(tokens(20), tokens(10))
    );

    console.log(
      "USER BALANCE AFTER LIQUIDTY",
      (await neutron.connect(user).balanceOf(user.address)) / tokens(1)
    );

    poolAddress(neutron.address, proton.address).then((res) =>
      console.log("POOL ADDRESS====>>>>>>>", res)
    );

    // extra

    approveA = await neutron.connect(user).approve(pool.address, tokens(10));

    await approveA.wait();

    approveB = await proton.connect(user).approve(pool.address, tokens(5));

    await approveB.wait();

    console.log("Total shares ======>", await pool.connect(user).totalShares());

    await approveA.wait();

    await approveB.wait();

    console.log(
      "Price for tokens trading",
      await pool
        .connect(user)
        .getTradePrice(neutron.address, proton.address, tokens(5))
    );

    console.log(
      "trading",
      await pool.connect(user).swap(neutron.address, proton.address, tokens(5))
    );

    console.log(
      "user balance",
      (await neutron.balanceOf(user.address)) / tokens(1)
    );

    console.log(
      "user balance",
      (await proton.balanceOf(user.address)) / tokens(1)
    );
  });
});

describe("New Pool", async () => {
  it("Should work for new pool", async () => {
    let accounts = await ethers.getSigners();
    let owner = accounts[0];
    let user = accounts[1];

    const Token = await ethers.getContractFactory("Token");

    const Factory = await ethers.getContractFactory("Factory");
    const usdt = await Token.deploy("USDT", "USDT", tokens(100));
    const dai = await Token.deploy("DAI", "DAI", tokens(100));

    const factory = await Factory.deploy();
    const Pool = await ethers.getContractFactory("Pool");

    // pair creating
    await factory.createPair(usdt.address, dai.address);
    console.log("pool address", await factory.PoolAdd());

    const poolAddress = async (tokenAdd_A, tokenAdd_B) => {
      return await factory.getPair(tokenAdd_A, tokenAdd_B);
    };

    const pool = await Pool.attach(poolAddress(usdt.address, dai.address));

    await usdt.connect(owner).transfer(user.address, tokens(40));
    await dai.connect(owner).transfer(user.address, tokens(40));

    let approveA = await usdt.connect(user).approve(pool.address, tokens(20));

    await approveA.wait();

    let approveB = await dai.connect(user).approve(pool.address, tokens(10));

    await approveB.wait();

    console.log("balances", await usdt.balanceOf(user.address));
    console.log(
      "get Price Feed--->",
      await pool.connect(user).addLiquidity(tokens(20), tokens(10))
    );

    console.log(
      "USER BALANCE AFTER LIQUIDTY",
      (await usdt.connect(user).balanceOf(user.address)) / tokens(1)
    );

    poolAddress(usdt.address, dai.address).then((res) =>
      console.log("POOL ADDRESS====>>>>>>>", res)
    );

    approveA = await usdt.connect(user).approve(pool.address, tokens(10));

    await approveA.wait();

    approveB = await dai.connect(user).approve(pool.address, tokens(5));

    await approveB.wait();

    console.log("Total shares ======>", await pool.connect(user).totalShares());

    await approveA.wait();

    await approveB.wait();

    console.log(
      "Price for tokens trading",
      await pool
        .connect(user)
        .getTradePrice(usdt.address, dai.address, tokens(5))
    );

    console.log(
      "trading",
      await pool.connect(user).swap(usdt.address, dai.address, tokens(5))
    );

    console.log(
      "user balance",
      (await usdt.balanceOf(user.address)) / tokens(1)
    );

    console.log(
      "user balance",
      (await dai.balanceOf(user.address)) / tokens(1)
    );

    console.log(
      "Removing liquidity",
      await pool.connect(user).removeLiquidity(tokens(20))
    );
  });
});
