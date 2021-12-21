# Unicums - NFT for italian artisans

**Authos:** [stefano.gagliardi@sitisrl.it](mailto:stefano.gagliardi@sitisrl.it)  
**Version:** 0.1 Alpha
**Inspired:** [dev.to article](https://dev.to/dabit3/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb)

## Next Step

1. The Graph - Graphql query sdk for Blockchain data

### Run ecosystem in localhost localnet

**1. Run test node**
`npx hardhat node`

**Import one of twenty generate wallet in Metamask (1000 EHT)**

**Deploy contract on chain and return Contract address**
`npx hardhat run scripts/deploy.ts --network`

**Add address to config.js**

**Run app**
`npm run dev`

## Start script

List of all avaible scripts:

**Application scripts:**

1. `npm run build` - Build NextJs app
2. `npm run dev` - Run NextJs app in development mode
3. `npm run test` - Run test
4. `npm run start` - Run NextJs build app
5. `npm run setup:local:testnet` - Setup enviroment for local development on local testnet

**Blockchain scripts:**

1. `npx hardhat node` - Start Polygon local blockchain
2. `npx hardhat run scripts/deploy.ts --network` - Deploy smart contract on current active network
   NB: Questo script può essere lanciato da node e non da "hardhat" come indicato nella loro doc [Standalone scripts](https://hardhat.org/guides/scripts.html#standalone-scripts-using-hardhat-as-a-library)

   1. Installare npm install --save-dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
   2. Installare npm install --save-dev hardhat-deploy-ethers ethers3
   3.

**setup:local:testnet:**

**For all definitions see 'scripts/types.d.ts'**
This script invoke file `./scripts/setup.ts` with argument "--local", "--development" and "localnet", beacause same file will be used for production setup.

## Static Type Binding

Vedere ROAM
https://github.com/dethcrypto/TypeChain/tree/master/packages/hardhat

1. `npm install --save-dev typechain @typechain/hardhat @typechain/ethers-v5 --force`
   Sono dovuto andare di --force per problemi di dipendneze di alcuni tipi

2. Creare un fle tsconfig dedicato
   Now typings should be automatically generated each time contract recompilation happens.

3. `npx hardhat clean`- Clean cache

4. Add plugin to Hardhat configuration:

```typescript
module.exports = {
  typechain: {
    outDir: "./typechain-types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
};
```

5. Compile contract and generate Typescript types: `npx hardhat compile` inside previous declared folder "typechain-types"
