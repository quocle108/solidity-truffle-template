const truffleAssert = require("truffle-assertions");
const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
var GoldSale = artifacts.require("./GoldSale.sol");
var GoldSaleV1 = artifacts.require("./Mock/GoldSaleV1.sol");
var GoldToken = artifacts.require("./GoldToken.sol");

contract("GoldSale", (accounts) => {
  const [owner, user, goldEscrow, saleEscrow] = accounts;
  const etherPrice = web3.utils.toBN("123");
  const maxTokenPerPurchase = web3.utils.toBN("100");
  const maxTokenPerAddress = web3.utils.toBN("250");
  beforeEach(async function () {
    this.GoldToken = await GoldToken.new(goldEscrow, "GOLDToken", "GOLD", {
      from: owner,
    });

    this.GoldSaleV1 = await deployProxy(
      GoldSaleV1,
      [
        this.GoldToken.address,
        goldEscrow,
        etherPrice,
        maxTokenPerPurchase,
        maxTokenPerAddress,
      ],
      {
        from: owner,
      }
    );
    this.GoldSale = await upgradeProxy(this.GoldSaleV1.address, GoldSale, {
      from: owner,
    });
  }, 5000);

  describe("Test initialize", () => {
    it("Should initialize data", async function () {
      expect(await this.GoldSale.goldToken()).to.equal(this.GoldToken.address);
      expect(await this.GoldSale.goldEscrow()).to.equal(goldEscrow);
      expect((await this.GoldSale.etherPricePerToken()).toString()).to.equal(
        etherPrice.toString()
      );
      expect((await this.GoldSale.maxTokenPerPurchase()).toString()).to.equal(
        maxTokenPerPurchase.toString()
      );
      expect((await this.GoldSale.maxTokenPerAddress()).toString()).to.equal(
        maxTokenPerAddress.toString()
      );
    });
  });

  describe("Test purchase", () => {
    it("Should purchase with ETH", async function () {
      const purchasesAmount = web3.utils.toBN("100");
      const balanceOfEcrow = await this.GoldToken.balanceOf(goldEscrow);
      await this.GoldToken.approve(this.GoldSale.address, purchasesAmount, {
        from: goldEscrow,
      });
      const price = purchasesAmount.mul(etherPrice);
      await this.GoldSale.purchase(purchasesAmount, {
        value: price,
        from: user,
      });

      let contracBalance = await web3.eth.getBalance(this.GoldSale.address);
      const balanceOfUser = await this.GoldToken.balanceOf(user);
      const reducedAmountEscrow = web3.utils
        .toBN(balanceOfEcrow)
        .sub(await this.GoldToken.balanceOf(goldEscrow));

      expect(web3.utils.toBN(contracBalance).toString()).to.equal(
        price.toString()
      );
      expect(reducedAmountEscrow.toString()).to.equal(
        purchasesAmount.toString()
      );
      expect(balanceOfUser.toString()).to.equal(purchasesAmount.toString());
    });

    it("Should purchase multiple times", async function () {
      let purchasesAmount = web3.utils.toBN("100");
      const balanceOfEcrow = await this.GoldToken.balanceOf(goldEscrow);

      await this.GoldToken.approve(this.GoldSale.address, purchasesAmount, {
        from: goldEscrow,
      });
      let price = purchasesAmount.mul(etherPrice);
      await this.GoldSale.purchase(purchasesAmount, {
        value: price,
        from: user,
      });

      newPurchasesAmount = web3.utils.toBN("50");
      await this.GoldToken.approve(this.GoldSale.address, newPurchasesAmount, {
        from: goldEscrow,
      });
      let newPrice = newPurchasesAmount.mul(etherPrice);
      await this.GoldSale.purchase(newPurchasesAmount, {
        value: newPrice,
        from: user,
      });

      let contracBalance = await web3.eth.getBalance(this.GoldSale.address);
      const balanceOfUser = await this.GoldToken.balanceOf(user);

      expect(contracBalance.toString()).to.equal(
        price.add(newPrice).toString()
      );
      expect(balanceOfUser.toString()).to.equal(
        purchasesAmount.add(newPurchasesAmount).toString()
      );
    });

    it("Should not purchase with ethers amount is smaller than price", async function () {
      const purchasesAmount = web3.utils.toBN("100");
      const balanceOfEcrow = await this.GoldToken.balanceOf(goldEscrow);
      await this.GoldToken.approve(this.GoldSale.address, purchasesAmount, {
        from: goldEscrow,
      });
      let price = purchasesAmount.mul(etherPrice);
      price = price.div(web3.utils.toBN(2));
      await truffleAssert.reverts(
        this.GoldSale.purchase(purchasesAmount, {
          value: price,
          from: user,
        }),
        "invalid ethers value"
      );
    });

    it("Should not purchase with amount exceed limit per purchase", async function () {
      const purchasesAmount = web3.utils.toBN("123456");
      const balanceOfEcrow = await this.GoldToken.balanceOf(goldEscrow);
      await this.GoldToken.approve(this.GoldSale.address, purchasesAmount, {
        from: goldEscrow,
      });
      let price = purchasesAmount.mul(etherPrice);
      await truffleAssert.reverts(
        this.GoldSale.purchase(purchasesAmount, {
          value: price,
          from: user,
        }),
        "exceeded maximum per purchase"
      );
    });

    it("Should not purchase with amount exceed limit per user", async function () {
      const purchasesAmount = web3.utils.toBN("100");
      await this.GoldToken.approve(
        this.GoldSale.address,
        purchasesAmount.mul(web3.utils.toBN(3)),
        {
          from: goldEscrow,
        }
      );

      let price = purchasesAmount.mul(etherPrice);
      await this.GoldSale.purchase(purchasesAmount, {
        value: price,
        from: user,
      });
      await this.GoldSale.purchase(purchasesAmount, {
        value: price,
        from: user,
      });

      await truffleAssert.reverts(
        this.GoldSale.purchase(purchasesAmount, {
          value: price,
          from: user,
        }),
        "Exceeded maximum per address"
      );
    });

    it("Should revert if escrow does not approve yet", async function () {
      const purchasesAmount = web3.utils.toBN("100");

      const price = purchasesAmount.mul(etherPrice);
      await truffleAssert.reverts(
        this.GoldSale.purchase(purchasesAmount, {
          value: price,
          from: user,
        }),
        "revert"
      );
    });
  });

  describe("Test withdraw", () => {
    it("Should withdraw from sale contract", async function () {
      const purchasesAmount = web3.utils.toBN("100");
      let balanceOfEcrow = await web3.eth.getBalance(saleEscrow);
      await this.GoldToken.approve(this.GoldSale.address, purchasesAmount, {
        from: goldEscrow,
      });
      const price = purchasesAmount.mul(etherPrice);
      await this.GoldSale.purchase(purchasesAmount, {
        value: price,
        from: user,
      });

      const receipt = await this.GoldSale.withdraw(saleEscrow, {
        from: owner,
      });

      const increasedAmountEscrow = web3.utils
        .toBN(await web3.eth.getBalance(saleEscrow))
        .sub(web3.utils.toBN(balanceOfEcrow));

      expect(increasedAmountEscrow.toString()).to.equal(price.toString());
      truffleAssert.eventEmitted(receipt, "Withdrawal", {
        _toAddress: saleEscrow,
        _amount: price,
      });
    });

    it("Should not allow other account can withdraw", async function () {
      await truffleAssert.reverts(
        this.GoldSale.withdraw(saleEscrow, {
          from: saleEscrow,
        }),
        "revert"
      );
    });
  });
});
