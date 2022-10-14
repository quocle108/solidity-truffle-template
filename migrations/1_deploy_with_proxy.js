const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const GoldToken = artifacts.require("GoldToken");
const GoldSaleV1 = artifacts.require("GoldSaleV1");
const GoldSale = artifacts.require("GoldSale");

const etherPrice = web3.utils.toBN("1230000000000000");
const maxTokenPerPurchase = web3.utils.toBN("100");
const maxTokenPerAddress = web3.utils.toBN("250");
const goldEscrow = "0xb0a3425Aa5978124bBe8F5391ABEF488495B9f6E";

module.exports = async function (deployer, network) {
  if (network !== "development" && network !== "test") {
    // It is recommended to make separated file for each contract deployment. So it can easy to retry once you have faced with an issue
    await deployer.deploy(GoldToken, goldEscrow, "GOLDToken", "GOLD");

    // Deploy contract
    await deployProxy(
      GoldSaleV1,
      [
        GoldToken.address,
        goldEscrow,
        etherPrice,
        maxTokenPerPurchase,
        maxTokenPerAddress,
      ],
      { deployer }
    );
    // Upgrade contract
    await upgradeProxy(GoldSaleV1.address, GoldSale, { deployer });
  }
};
