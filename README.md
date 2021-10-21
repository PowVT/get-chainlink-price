# Get a commodity price using Chainlink 💲

Using the provided contract addresses at: https://data.chain.link/ethereum/mainnet/commodities

One can query these contracts to get the 'latestAnswer'. Aka the price. Using the command line use the hardhat test command to see ether.js in action and return a price.

Using Ethers.js you can use javascript to interact with deployed smart contracts on Ethereum. I have chosen to interact with the XAU/USD (Gold) price feed.

🖋️ In test/goldPrice.js enter your own provider id. I use infura and it has worked well. 

Try running some of the following tasks: 

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/deploy.js
npx hardhat help
```
