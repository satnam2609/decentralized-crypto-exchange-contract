const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe(" Pool test", async () => {
  it("Should work", async () => {
    let accounts = await ethers.getSigners();
    let owner = accounts[0];
    let user = accounts[1];

    // 0x5FbDB2315678afecb367f032d93F642f64180aa3',
    // '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

    const Token = await ethers.getContractFactory("Token");

    const neutron = await Token.deploy("Neutron", "NTR", 100);
    const proton = await Token.deploy("Proton", "PTR", 100);

    const Pool = await ethers.getContractFactory("Pool");
    const pool = await Pool.attach(
      "0xc85E05fF55569B52574896c76FfbbB4Ed702De5e"
    );

    await neutron.connect(owner).transfer(user.address, tokens(20));
    await proton.connect(owner).transfer(user.address, tokens(20));

    let approveA = await neutron
      .connect(user)
      .approve(pool.address, tokens(20));

    await approveA.wait();

    let approveB = await proton.connect(user).approve(pool.address, tokens(20));

    await approveB.wait();

    console.log("balances", await neutron.balanceOf(user.address));
    console.log(
      "add Liqudity--->",
      await pool.connect(user).addLiquidity(tokens(20), tokens(20))
    );

    console.log(
      "USER BALANCE AFTER LIQUIDTY",
      (await neutron.connect(user).balanceOf(user.address)) / tokens(1)
    );
  });
});
