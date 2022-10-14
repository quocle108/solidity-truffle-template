// SPDX-License-Identifier: MIT

pragma solidity >=0.5.8 <0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

contract GoldSale is OwnableUpgradeable {
  using SafeMathUpgradeable for uint256;

  address public goldToken;
  address public goldEscrow;
  uint256 public etherPricePerToken;
  uint256 public maxTokenPerPurchase;
  uint256 public maxTokenPerAddress;
  mapping(address => uint256) public purchasedAmountByAddress;

  event Withdrawal(address _toAddress, uint256 _amount);

  modifier validAddress(address _addr) {
    require(_addr != address(0), "Not valid address");
    _;
  }

  function initialize(
    address _goldToken,
    address _goldEscrow,
    uint256 _etherPricePerToken,
    uint256 _maxTokenPerPurchase,
    uint256 _maxTokenPerAddress
  ) public initializer validAddress(_goldToken) {
    __Ownable_init();
    goldToken = _goldToken;
    etherPricePerToken = _etherPricePerToken;
    goldEscrow = _goldEscrow;
    maxTokenPerPurchase = _maxTokenPerPurchase;
    maxTokenPerAddress = _maxTokenPerAddress;
  }

  function purchase(uint256 _numberOfTokens) public payable {
    address buyer = msg.sender;
    require(
      _numberOfTokens <= maxTokenPerPurchase,
      "exceeded maximum per purchase"
    );
    purchasedAmountByAddress[buyer] = purchasedAmountByAddress[buyer].add(
      _numberOfTokens
    );
    require(
      purchasedAmountByAddress[buyer] <= maxTokenPerAddress,
      "Exceeded maximum per address"
    );

    uint256 price = etherPricePerToken.mul(_numberOfTokens);
    require(price <= msg.value, "invalid ethers value");

    IERC20Upgradeable(goldToken).transferFrom(
      goldEscrow,
      buyer,
      _numberOfTokens
    );
  }

  function withdraw(address _toAddress) public onlyOwner {
    uint256 balance = address(this).balance;
    emit Withdrawal(_toAddress, address(this).balance);
    payable(_toAddress).transfer(balance);
  }
}
