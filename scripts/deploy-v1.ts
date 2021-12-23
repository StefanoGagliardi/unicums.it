// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

// Types
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/dist/src/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  ContractsListItem,
  DeployedContractItem,
  DeploySmartContractInterface,
} from "./types";
import {
  Greeter__factory,
  NFTMarket__factory,
  NFT__factory,
} from "./../typechain-types";
import { ContractName } from "./setup";

// LIbrayr
import type { ethers } from "ethers";
import hre from "hardhat";

import os from "os";
import fs from "fs";

const wrapHre = hre as HardhatRuntimeEnvironment & { ethers: any } & {
  ethers: typeof ethers & HardhatEthersHelpers;
};

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await wrapHre.run("compile");

  // C'è un bug nella libreria

  // We get the contract to deploy
  // Ho aperto una issue per as asy
  // https://github.com/nomiclabs/hardhat/issues/2175
  const Greeter: Greeter__factory = await wrapHre.ethers.getContractFactory(
    "Greeter"
  );
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  const NFTMarket = await wrapHre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await wrapHre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let fileContent = ``;
  fileContent +=
    ` export const nftmarketaddress = "${nftMarket.address}"; ` + os.EOL;
  fileContent += ` export const nftaddress = "${nft.address}"; ` + os.EOL;
  fileContent +=
    ` export const greeteraddress = "${greeter.address}"; ` + os.EOL;

  fs.writeFile("config.js", fileContent as string, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// /**
//  * Class for Deploy contract on net and save address to configuration files
//  */
// class DeploySmartContract implements DeploySmartContractInterface {
//   // Deprecated
//   public deployedContracts: DeployedContractItem[] = [];

//   /**
//    * Class constructor
//    */
//   public __construct() {
//     console.log("Create class: DeploySmartContract");
//   }

//   public static createInstanceAsync = async () => {
//     console.log("Create class DeploySmartContract FROM STATIC FUNCTION");
//     const me = new DeploySmartContract();
//     await me.compileContracts();
//     return me;
//   };

//   /**
//    * Compile smart contract with Hardhat
//    */
//   public async compileContracts() {
//     await wrapHre.run("compile");
//   }

//   /**
//    * Deploy smart contract from name
//    * This function is cycled n times from setup.ts
//    */
//   public async deployContract(
//     contractsName: ContractsListItem[]
//   ): Promise<boolean> {
//     const deployedContractsInternal: DeployedContractItem[] = [];
//     console.log("DEPLOY DEBUG: contractsName: ", contractsName);
//     try {
//       for (let i = 0; i < contractsName.length; i++) {
//         const value: ContractsListItem = contractsName[i];

//         console.log(
//           "deployedContractsInternal: ",
//           deployedContractsInternal,
//           " I:",
//           i
//         );
//         console.log("deployedContractsInternal: ", value);
//         switch (value.contractName) {
//           case "NFTMarket" as ContractName:
//             console.log(
//               "===== SWITCH value.contractName ========",
//               value.contractName
//             );
//             // Get contract factory
//             const NFTMarket: NFTMarket__factory =
//               await wrapHre.ethers.getContractFactory(value.contractName);

//             const nftMarket = await NFTMarket.deploy();
//             await nftMarket.deployed();
//             console.log("nftMarket deployed to:", nftMarket.address);
//             deployedContractsInternal.push({
//               name: value.contractName,
//               address: nftMarket.address,
//             });
//             break;
//           case "NFT" as ContractName:
//             const NFT: NFT__factory = await wrapHre.ethers.getContractFactory(
//               "NFT"
//             );
//             // TODO Render this.deployedContracts dinamico rispetto al primo contratto
//             const nft = await NFT.deploy(deployedContractsInternal[0].address);
//             await nft.deployed();
//             console.log("nft deployed to:", nft.address);

//             // Push deployed contract
//             deployedContractsInternal.push({
//               name: value.contractName,
//               address: nft.address,
//             });
//             break;
//           case "Greeter" as ContractName:
//             // Get contract factory
//             const Greeter: Greeter__factory =
//               await wrapHre.ethers.getContractFactory(value.contractName);

//             const GreeterContract = await Greeter.deploy("Hello, Hardhat!");
//             await GreeterContract.deployed();

//             console.log(
//               "GreeterContract deployed to:",
//               GreeterContract.address
//             );

//             // Push deployed contract
//             deployedContractsInternal.push({
//               name: value.contractName,
//               address: GreeterContract.address,
//             });
//             break;
//         }
//       }

//       console.log("deployedContractsInternal: ", deployedContractsInternal);
//       this.deployedContracts.push(...deployedContractsInternal);

//       return true;
//     } catch (e) {
//       // Print error and kill console with exit code
//       console.error(e);
//       process.exitCode = 1;
//       return false;
//     }
//   }

//   /**
//    * Get successfully deploy contract
//    */
//   public getDeployedContracts(): DeployedContractItem[] {
//     return this.deployedContracts;
//   }
// }

// export default DeploySmartContract;
