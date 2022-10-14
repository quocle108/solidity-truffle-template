const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const privKeys = (process.env.PRIVATE_KEYS) ? process.env.PRIVATE_KEYS.split(' ') : undefined;
const mnemonic = (process.env.MNEMONIC) ? process.env.MNEMONIC : undefined;
const projectID = (process.env.INFURA_PROJECT_ID) ? process.env.INFURA_PROJECT_ID : undefined;
const coinmarketcapKey = (process.env.COINMARKETCAP_KEY) ? process.env.COINMARKETCAP_KEY : undefined;
const ethereumscanKey = (process.env.ETHEREUMSCAN_KEY) ? process.env.ETHEREUMSCAN_KEY : undefined;

if(mnemonic  !== undefined && privKeys  !== undefined){
  console.log("Warning: Only Env var MNEMONIC Or PRIVATE_KEYS should be present")
}else if (mnemonic  === undefined&& privKeys === undefined){
  console.log("Error: No Env var MNEMONIC nor PRIVATE_KEYS exists")
}

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    local: {
      provider: () => new HDWalletProvider({
        mnemonic: mnemonic,
        privateKeys: privKeys,
        providerOrUrl: process.env.ETH_ENDPOINT || 'http://localhost:8545'
      }),
      network_id: 1337,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    goerli: {
      provider: () => new HDWalletProvider({
        mnemonic: mnemonic,
        privateKeys: privKeys,
        providerOrUrl: `https://goerli.infura.io/v3/${projectID}`
      }),
      skipDryRun: true,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      network_id: 5
    },
    mainnet: {
      provider: () => new HDWalletProvider({
        mnemonic: mnemonic,
        privateKeys: privKeys,
        providerOrUrl: `https://mainnet.infura.io/v3/${projectID}`
      }),
      network_id: 1,
      skipDryRun: true,
    },
  },

  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD',
      token: 'ETH',
      coinmarketcap: coinmarketcapKey,
      gasPrice: 30 
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.2",    // Fetch exact version from solc-bin (default: truffle's version)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  plugins: [
    'truffle-contract-size',
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: ethereumscanKey
  }
};
