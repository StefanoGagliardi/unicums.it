/**
 * Setup Blockchain for several enviroments: local, test, production
 *
 * @author Stefano Gagliardi <stefano.gagliardi@sitisrl.it>
 * @since 19/12/2021
 * @version 0.1.0 - Alpha
 */

// Import types
import {
  AppEnv,
  BlockchainEventInterface,
  ChainEnv,
  ContractsListItem,
  DeployedContractItem,
  DeploySmartContractInterface,
  HostEnv,
  LocalNetworkInterface,
  SetupArgs,
} from "./types";

// Child process
import { spawn, execSync } from "child_process";

// Event Emitter
import EventEmitter from "events";

// Class for deploy smart contract
import DeploySmartContract from "./deploy";
import { isLocalTestnet } from "./helpers";

// import third parts\
import fs from "fs";
import os from 'os';

// Define consts
const TESTNET_LOCAL_PORT: number = 8545;

// Contract to deploy then store with address
export type ContractName = "NFTMarket" | "NFT" | "Greeter";
export const contractsList: ContractsListItem[] = [
  { name: "NFTMarket", contractName: "NFTMarket" },
  { name: "NFT", contractName: "NFT" },
  { name: "Greeter", contractName: "Greeter" },
];

// Smart contracts saved with deployed address
const ContractsDeployed: DeployedContractItem[] = [];

/**
 * Env variables
 */
const args: SetupArgs = {
  nodePath: "",
  filePath: "",
  hostEnv: "local",
  appEnv: "development",
  chainEnv: "localnet",
  resetHardhat: false,
};

/**
 * Parse and set console argument
 */
process.argv.forEach(function (val, index) {
  switch (index) {
    case 0:
      args.nodePath = val;
      break;
    case 1:
      args.filePath = val;
      break;
    case 2:
      args.hostEnv = val as HostEnv;
      break;
    case 3:
      args.appEnv = val as AppEnv;
      break;
    case 4:
      args.chainEnv = val as ChainEnv;
      break;
    case 5:
      args.resetHardhat = val === "true" ? true : false;
      break;
  }
});

/**
 * Blockchain eventemitter class
 * NB: Interface BlockahinEveInterface extends EventEmitter interface, then BlockchainEvent class implements both interface via first one.
 */
class BlockchainEvent extends EventEmitter implements BlockchainEventInterface {
  constructor() {
    super();
    console.log("Initialize Class - BlockchainEvent that extends EventEmitter");
  }

  nodeIsReady() {
    this.emit("nodeIsReady");
  }
}
// Initialize Event emitter
const blockchainEvent = new BlockchainEvent();

/**
 * Class for run blockchain, deploy contract and set return address
 * Actions are handled with EventEmitter
 */
class LocalNetwork implements LocalNetworkInterface {
  public deployClass: any = null; // DeploySmartContractInterface

  public __construct() {}

  public static async createInstanceAsync() {
    console.log("Create class DeploySmartContract FROM STATIC FUNCTION");
    const me = new LocalNetwork();
    await me.initializeDeployClass();
    return me;
  }

  public async initializeDeployClass() {
    this.deployClass = await DeploySmartContract.createInstanceAsync();
  }

  // Start node on new thread
  public startPolygoNode() {
    // NB: use Span instead of exec because the first one use EventEmitter for long process output
    //  "exec" print all output at the end
    const child = spawn("npx hardhat node", { shell: true });

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
      //Here is where the output goes
      console.log("stdout: " + typeof data, "  :", data);
      // data = data.toString();
      // console.log("data.toString(): ", data.toString());

      // Emit event for deploy contract
      const regex = /(Account #6:)/;
      if (regex.test(data)) {
        console.log(
          "=============== EMIT EVENT AFTER 6 GENERATED WALLET =========================="
        );
        blockchainEvent.nodeIsReady();
      }
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
      //Here is where the error output goes
      console.log("stderr: " + data);
      data = data.toString();
    });

    child.on("close", function (code) {
      //Here you can get the exit code of the script
      console.log("closing code: " + code);
    });
  }

  // Clean env and kill acive network of prev script running
  // Return true even if port is already killed
  public killActiveNetwork(port: number): boolean {
    const killPortProcess = execSync(`npx kill-port ${port}`);
    const regex = new RegExp("Process on port " + port + " killed");
    if (regex.test(killPortProcess.toString())) {
      return true;
    } else {
      return false;
    }
  }

  // Deplout SmartContract on TestNet
  public async deploytContractsList(
    contractList: ContractsListItem[]
  ): Promise<void> {
    console.log("this.deployClass: ", this.deployClass);
    try {
      await this.deployClass.deployContract(contractList);
    } catch (e: any) {
      console.error(e);
      process.exitCode = 1;
    }
  }

  // Reset Hardhat: 1. Cache 2. Compile contract and generate types

  /**
   * Reset Polygon cache, compile conrtact and generate types
   * NB: Reset cache remove types - types path is defined in hardhat.config.ts
   * 1. Reset Cache `npx hardhat clean`
   */
  public async resetAndCompileHardhat() {
    // NB: use Span instead of exec because the first one use EventEmitter for long process output
    //  "exec" print all output at the end
    const child = spawn("npx hardhat clean && npx hardhat compile", {
      shell: true,
    });

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (data) {
      //Here is where the output goes
      console.log("stdout: " + typeof data, "  :", data);
      // data = data.toString();
      console.log("data.toString(): ", data.toString());
    });

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
      //Here is where the error output goes
      console.log("stderr: " + data);
      data = data.toString();
    });

    child.on("close", function (code) {
      //Here you can get the exit code of the script
      console.log("closing code: " + code);
    });
  }

  /**
   * Retrive deployted contracts list
   */
  public getDeployedContracts(): DeployedContractItem[] {
    return this.deployClass.getDeployedContracts();
  }

  /**
   * Generate javascript file content with contract address
   */
  public genenrateAddressFile(): string | Error {
    const deployed = this.getDeployedContracts();
    console.log("======== BEFORE WRITE FILE deployed: =====", deployed);
    if (!deployed.length) {
      throw new Error(
        "Attenzione! Nessun contract Address trovato nell'array prima di scrivere su file .js"
      );
    }

    let fileContent = ``;

    deployed.map((value: DeployedContractItem) => {
      const contractName = value.name.toLowerCase() + "address";
      fileContent += ` export const ${contractName} = "${value.address}"; `  + os.EOL;
      return value;
    });

    return fileContent;
  }
}

/**
 * Start local Polygon node
 * Rewwap all in async functions for async class insdtnce creation
 */
const main = async () => {
  // Initialize LocalNetwork class
  const localNet = await LocalNetwork.createInstanceAsync();

  if (isLocalTestnet(args)) {
    console.log("Create class BlockchainEvent & LocalNetwork");

    // Register event listeners
    console.log("INitalize regeristerEventListener()");
    registerEventListeners();

    // Clean hardhat cache and build compile ontracts
    if (args.resetHardhat) {
      localNet.resetAndCompileHardhat();
    }

    const isKilled = localNet.killActiveNetwork(TESTNET_LOCAL_PORT);
    if (isKilled) {
      localNet.startPolygoNode();
    }
  }

  /**
   * Regisster listeners for emitted event of class Blokchain event
   */
  async function registerEventListeners() {
    // Catch EventEmitter new event
    blockchainEvent.on("nodeIsReady", async () => {
      await localNet.deploytContractsList(contractsList);
      const keysFileContent = localNet.genenrateAddressFile();

      fs.writeFile("config.js", keysFileContent as string, function (err) {
        if (err) return console.log(err);
        console.log("Hello World > helloworld.txt");
      });
    });
    1;
  }
};

/**
 * Main funciton entry point
 */
main();

/**
 * Initialize all class for start blokchain local setupArgs
 */
const main2 = async () => {};
