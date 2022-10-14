# solidity-truffle-template

**A professional truffle solidity template with necessary libraries that support to develop, compile, test, deploy, upgrade, verify solidity smart contract**

 * A template project to develop, compile, test, deploy and upgrade solidity project with truffle
 * Included OpenZeppelin smart contract and Upgradable smart contract Library 
 * Smart contract gas, size testing and solidity verify code
 * Configuration for local, testnet as well as production deployment
 * Supported libraries to format, verify and clean the code
 * [Usage docs](./docs/usage.md)

## Overview
### Quick start

1. Click the "Use this template" button and clone it to your local
2. Make sure that you have truffle in your computer `npm install -g truffle`
3. Enter `npm install`
4. Test the contract with `npm test`
5. Modify the contract/test cases
6. Copy and update  `.env.example` into `.env`
- MNEMONIC Or PRIVATE_KEYS: You can choose one for your project. It be used to deploy your code. Generate new one from [here](https://allprivatekeys.com/mnemonic-code-converter#english)
- INFURA_PROJECT_ID: It be used to connect with the infura service node. You can get free Key from [here](https://infura.io/)
- ETHEREUMSCAN_KEY: Verify your code on ethereumscan. You can get free Key from [here](https://etherscan.io/apis)
- COINMARKETCAP_KEY: Get the gas price in Fiat. You can get free Key from [here](https://coinmarketcap.com/api)

7. Read [Usage docs](./docs/usage.md) to see the detail.

### Included Libraries

- [Openzeppelin/contracts](https://github.com/OpenZeppelin/openzeppelin-contracts): a library for secure smart contract development.
- [Openzeppelin/contracts-upgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable): this repository hosts the Upgradeable variant of OpenZeppelin Contracts.
- [Openzeppelin/truffle-upgrades](https://github.com/OpenZeppelin/openzeppelin-upgrades/): plugins for Truffle to deploy and manage upgradeable contracts on Ethereum.
- [Truffle](https://github.com/trufflesuite/truffle#readme): truffle is a development environment, testing framework.
- [Truffle/hdwallet-provider](https://github.com/trufflesuite/truffle/tree/master/packages/hdwallet-provider#readme): HD Wallet-enabled Web3 provider. Use it to sign transactions.
- [Truffle-assertions](https://github.com/rkalis/truffle-assertions): this package adds additional assertions that can be used to test Ethereum smart contracts inside Truffle tests.
- [Truffle-plugin-verify](https://github.com/rkalis/truffle-plugin-verify#readme): this truffle plugin allows you to automatically verify your smart contracts' source code on Etherscan, straight from the Truffle CLI.
- [Truffle-contract-size](https://github.com/IoBuilders/truffle-contract-size): this Truffle plugin displays the contract size of all or a selection of your smart contracts in kilobytes.
- [Eth-gas-reporter](https://github.com/cgewecke/eth-gas-reporter): mocha reporter which shows gas used per unit test
- [Solhint](https://protofire.github.io/solhint/): solidity code Linter
- [Prettier-plugin-solidity](https://github.com/prettier-solidity/prettier-plugin-solidity#readme): a Prettier Plugin for automatically formatting your Solidity code.
- [Pre-commit](https://github.com/observing/pre-commit): automatically install pre-commit hooks for your npm modules.
- [Pre-push](https://github.com/dflourusso/pre-push): automatically install pre-push hooks for your npm modules.

## Licence
This code is provided as is, under MIT Licence.