const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

const main = async () => {
    console.log("\n\n 📡 Deploying...\n");
  
    const Address = await deploy("Address");
    const Counters = await deploy("Counters");
    const EnumerableSet = await deploy("EnumerableSet");
    const SafeMath = await deploy("SafeMath");
    const Strings = await deploy("Strings");
    const ClaimToken = await deploy("ClaimToken");
    const BeneficiaryStream = await deploy("BeneficiaryStream");

    // use for local token bridging
    // const mockToken = await deploy("MockERC20") // <-- add in constructor args like below vvvv
  
    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
    //const secondContract = await deploy("SecondContract")
  
    // const exampleToken = await deploy("ExampleToken")
    // const examplePriceOracle = await deploy("ExamplePriceOracle")
    // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])
  
    /*
    //If you want to send value to an address from the deployer
    const deployerWallet = ethers.provider.getSigner()
    await deployerWallet.sendTransaction({
      to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
      value: ethers.utils.parseEther("0.001")
    })
    */
  
    /*
    //If you want to send some ETH to a contract on deploy (make your constructor payable!)
    const yourContract = await deploy("YourContract", [], {
    value: ethers.utils.parseEther("0.05")
    });
    */
  
    //If you want to verify your contract on tenderly.co (see setup details in the scaffold-eth README!)
    /*
    await tenderlyVerify(
      {contractName: "YourContract",
       contractAddress: yourContract.address
    })
    */
  
    console.log(
      " 💾  Artifacts (address, abi, and args) saved to: ",
      chalk.blue("packages/hardhat/artifacts/"),
      "\n\n"
    );
};

const deploy = async (
    contractName,
    _args = [],
    overrides = {},
    libraries = {}
) => {
    console.log(` 🛰  Deploying: ${contractName}`);
  
    const contractArgs = _args || [];
    const contractArtifacts = await ethers.getContractFactory(contractName, {
      libraries: libraries,
    });
    const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
    const encoded = abiEncodeArgs(deployed, contractArgs);
    fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);
  
    let extraGasInfo = "";
    if (deployed && deployed.deployTransaction) {
      const gasUsed = deployed.deployTransaction.gasLimit.mul(
        deployed.deployTransaction.gasPrice
      );
      extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${
        deployed.deployTransaction.hash
      }`;
    }
  
    console.log(
      " 📄",
      chalk.cyan(contractName),
      "deployed to:",
      chalk.magenta(deployed.address)
    );
    console.log(" ⛽", chalk.grey(extraGasInfo));
  
    if (!encoded || encoded.length <= 2) return deployed;
    fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));
  
    return deployed;
};
  
// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
    // not writing abi encoded args if this does not pass
    if (
      !contractArgs ||
      !deployed ||
      !R.hasPath(["interface", "deploy"], deployed)
    ) {
      return "";
    }
    const encoded = utils.defaultAbiCoder.encode(
      deployed.interface.deploy.inputs,
      contractArgs
    );
    return encoded;
};

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});