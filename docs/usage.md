# Usage

## Test
Note: make sure you have coinmarketcap key in .env to able see price in fiat and update gas value in package.json if it needed
```
$ npm run test
```
![unit-test-result](./images/unit-test-result.png)

## Deploy
Note: make sure that you have MNEMONIC or PRIVATE_KEYS in .env and ethers on your acocunt.
```
$ truffle migrate --network goerli

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.


Starting migrations...
======================
> Network name:    'goerli'
> Network id:      5
> Block gas limit: 30000000 (0x1c9c380)


1_deploy_with_proxy.js
======================

   Deploying 'GoldToken'
   ---------------------
   > transaction hash:    0x3016dcfd2b210e522f509e18bdda916c663bf549fb36ee52dedf09ab6c32318a
   > Blocks: 3            Seconds: 29
   > contract address:    0x472a7896D98414C8b799571342850685f707313E
   > block number:        7768852
   > block timestamp:     1665763656
   > account:             0xfbC410a7f679aA29533036ccC8d4EFDeE2dA983d
   > balance:             0.923420640291653776
   > gas used:            1661316 (0x195984)
   > gas price:           6.799397562 gwei
   > value sent:          0 ETH
   > total cost:          0.011295947960111592 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x82f8c4ab5bb3ffada61e35298661024db03e2938a3bc9d8f67a89f603eedefe7
   > Blocks: 2            Seconds: 29
   > contract address:    0x28Dd2cf70328E2a4cdd699B2e605B2233eD13D5b
   > block number:        7768855
   > block timestamp:     1665763704
   > account:             0xfbC410a7f679aA29533036ccC8d4EFDeE2dA983d
   > balance:             0.91861585267674694
   > gas used:            751202 (0xb7662)
   > gas price:           6.396132618 gwei
   > value sent:          0 ETH
   > total cost:          0.004804787614906836 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.016100735575018428 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.016100735575018428 ETH$
```

## Interact with contract by Truffle command

```
# Open truffle console
$ npx truffle console --network goerli

# Check imported accounts
truffle(goerli)> let accounts = await web3.eth.getAccounts()
undefined
truffle(goerli)> accounts[0]
'0xfbC410a7f679aA29533036ccC8d4EFDeE2dA983d'
truffle(goerli)> accounts[1]
'0xb0a3425Aa5978124bBe8F5391ABEF488495B9f6E'

# Check gold escrow account balance and approve to GoldSale contract
truffle(goerli)> const goldToken  = await GoldToken.at("0x472a7896D98414C8b799571342850685f707313E");
undefined
truffle(goerli)> const balanceOfEscrow = await goldToken.balanceOf("0xb0a3425Aa5978124bBe8F5391ABEF488495B9f6E");
undefined
truffle(goerli)> balanceOfEscrow.toString()
'100000000000000000'
truffle(goerli)> await goldToken.approve("0x28Dd2cf70328E2a4cdd699B2e605B2233eD13D5b", "123456789", {from: "0xb0a3425Aa5978124bBe8F5391ABEF488495B9f6E"});

# User purchase GoldToken from GoldSale
truffle(goerli)> const goldSale  = await GoldSale.at("0x28Dd2cf70328E2a4cdd699B2e605B2233eD13D5b");
truffle(goerli)> goldSale.address
'0x28Dd2cf70328E2a4cdd699B2e605B2233eD13D5b'
truffle(goerli)> await goldSale.purchase("2", {from: "0xfbC410a7f679aA29533036ccC8d4EFDeE2dA983d", value: "2460000000000000"});

# Check User balance
truffle(goerli)> const balanceOfUser = await goldToken.balanceOf("0xfbC410a7f679aA29533036ccC8d4EFDeE2dA983d");
undefined
truffle(goerli)> balanceOfUser.toString()
'2'truffle(goerli)> .exit
```

## Contracts Utils

### Format solidity and javascript source code
```
$ npm run prettier
```

### Solidity code linter
```
$ npm run linter
```

### Check contract size
```
$ npm run contract-size
┌──────────────────────────────────────────────────────────────────────┬──────────┐
│ Contract                                                             │ Size     │
├──────────────────────────────────────────────────────────────────────┼──────────┤
│ GoldSale                                                             │ 4.73 KiB │
├──────────────────────────────────────────────────────────────────────┼──────────┤
│ GoldSaleV1                                                           │ 4.47 KiB │
├──────────────────────────────────────────────────────────────────────┼──────────┤
│ GoldToken                                                            │ 6.59 KiB │
└──────────────────────────────────────────────────────────────────────┴──────────┘
```

### Verify contract on etherscan
Note: make sure you have ethereumscan key in .env to able verify the contract
```
$ truffle run verify GoldSale --network goerli
Verifying GoldSale
Verifying proxy implementation GoldSale at 0xcfec12678950ea709c9a9fb1364023d462856bfe
Linking proxy and implementation addresses
Pass - Verified: https://goerli.etherscan.io/address/0x28Dd2cf70328E2a4cdd699B2e605B2233eD13D5b#code
Successfully verified 1 contract(s).
```

## Git hook scripts
### pre-commit: 
- It runs hooks on every commit to format the code and automatically point out issues in code such as missing semicolons, trailing whitespace, and debug statements.
Note: you can skip pre-commit by the following command
```
git commit -m "commit message" --no-verify
```

### pre-push: 
- It is useful for identifying issues and passing all unit-tests before submission to code review.
- Note: you can skip pre-push by the following command
```
git push --no-verify
```
