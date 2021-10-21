require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
const fs = require("fs");

const DEBUG = true;

//
// Select the network you want to deploy to here:
//
const defaultNetwork = "localhost";

const mainnetGwei = 21;

// Get mnemonic.txt file and return
function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      );
    }
  }
  return "";
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork,
  solidity: "0.8.0",
  networks: {
    mainnet: {
      url: "https://mainnet.infura.io/v3/0998bcf49e0640fd9f31fb01262f8433", // <---- YOUR INFURA ID!
      gasPrice: mainnetGwei*1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    localhost: {
      url: "http://localhost:8545"
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/0998bcf49e0640fd9f31fb01262f8433", // <---- YOUR INFURA ID!
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    kovan: {
      url: "https://kovan.infura.io/v3/0998bcf49e0640fd9f31fb01262f8433", // <---- YOUR INFURA ID!
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    
    ropsten: {
      url: "https://ropsten.infura.io/v3/0998bcf49e0640fd9f31fb01262f8433", // <---- YOUR INFURA ID!
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/0998bcf49e0640fd9f31fb01262f8433", // <---- YOUR INFURA ID!
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  }
};

// See all the local hardhat accounts
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// generate new deployer account with mnemonic
task("generate", "Create a mnemonic for builder deploys", async (_, { ethers }) => {
  const bip39 = require("bip39");
  const { hdkey } = require('ethereumjs-wallet')
  const fs = require("fs");
  const mnemonic = bip39.generateMnemonic();
  if (DEBUG) console.log("mnemonic", mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log("seed", seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0;
  let fullPath = wallet_hdpath + account_index;
  if (DEBUG) console.log("fullPath: ", fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  if (DEBUG) console.log("Wallet: ", wallet);
  const privateKey = "0x" + wallet.privateKey.toString("hex");
  if (DEBUG) console.log("privateKey", privateKey);
  var EthUtil = require("ethereumjs-util");
  const address =
    "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");
  console.log(
    "🔐 Account Generated as " +
      address +
      " and set as mnemonic in packages/hardhat"
  );
  console.log(
    "💬 Use 'yarn run account' to get more information about the deployment account."
  );

  fs.writeFileSync("./" + address + ".txt", mnemonic.toString());
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
});

// View the balance info for your generated account
task(
  "account",
  "Get balance informations for the deployment account.",
  async (_, { ethers }) => {
    const { hdkey } = require('ethereumjs-wallet')
    const bip39 = require("bip39");
    let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    //if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    //if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet.privateKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet.privateKey).toString("hex");

    var qrcode = require("qrcode-terminal");
    qrcode.generate(address);
    console.log("‍📬 Deployer Account is " + address);
    for (let n in config.networks) {
      //console.log(config.networks[n],n)
      try {
        let provider = new ethers.providers.JsonRpcProvider(
          config.networks[n].url
        );
        let balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address))
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  }
);