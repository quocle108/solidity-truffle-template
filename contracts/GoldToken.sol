// SPDX-License-Identifier: MIT

pragma solidity >=0.5.8 <0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GoldToken is ERC20, Ownable {
  uint8 public constant DECIMALS = 8;
  uint256 public constant INITIAL_SUPPLY = 1000000000 * 10**uint256(DECIMALS);

  constructor(
    address _escrow,
    string memory _name,
    string memory _symbol
  ) ERC20(_name, _symbol) {
    _mint(_escrow, INITIAL_SUPPLY);
  }

  function decimals() public pure override returns (uint8) {
    return DECIMALS;
  }

  function mintTo(address _to, uint256 _amount) external onlyOwner {
    _mint(_to, _amount);
  }
}
