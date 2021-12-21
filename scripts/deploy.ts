// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

// Types
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/dist/src/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployedContracts, DeploySmartContractInterface } from "./types";
import { NFTMarket__factory } from './../typechain-types';

// LIbrayr
import type { ethers } from "ethers";
import hre from "hardhat";

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
  const Greeter = await wrapHre.ethers.getContractFactory("Greeter");
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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/**
 * Class for Deploy contract on net and save address to configuration files
 */
class DeploySmartContract implements DeploySmartContractInterface {
  public deployedContracts: DeployedContracts[] = [];

  /**
   * Class constructor
   */
  public __construct() {
    console.log("Create class: DeploySmartContract");
    this.compileContracts();
  }

  /**
   * Compile smart contract with Hardhat
   */
  public async compileContracts() {
    await wrapHre.run("compile");
  }

  /**
   * Deploy smart contract from name
   */
  public async deployContract(contractName: string): Promise<boolean> {
    
    // Get contract factory
    // NB: His Cotnract type are generated from command:npx hardhat compile
    const NFTMarket: NFTMarket__factory = await wrapHre.ethers.getContractFactory("NFTMarket");
    
    const nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();
    console.log("nftMarket deployed to:", nftMarket.address);
    return true;
  }

  /**
   * Get successfully deploy contract
   */
  public getDeployedContracts(): DeployedContracts[] {
    return this.deployedContracts;
  }
}

export default DeploySmartContract;
