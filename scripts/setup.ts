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

// Define consts
const TESTNET_LOCAL_PORT: number = 8545;

/**
 * Env variables
 */
const args: SetupArgs = {
  nodePath: "",
  filePath: "",
  hostEnv: "local",
  appEnv: "development",
  chainEnv: "localnet",
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
  }
});

/**
 * Blockchain eventemitter class
 * NB: Interface BlockahinEveInterface extends EventEmitter interface, then BlockchainEvent class implements both interface via first one.
 */
class BlockchainEvent extends EventEmitter implements BlockchainEventInterface {
  constructor() {
    super();
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
  public deployClass: DeploySmartContract;

  public __construct() {
    this.deployClass = new DeploySmartContract();
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
  public async deployMarketplaceContract() {
    const contractMarketAddress = await this.deployClass.deployContract("NFT");
    console.log("contractMarketAddress: ", contractMarketAddress);
  }

  // Reset Hardhat: 1. Cache 2. Compile contract and generate tyoes
  public async resetHardhat() {
    
  }
}
// Initialize LocalNetwork class
const localNet = new LocalNetwork();

/**
 * Start local Polygon node
 */
if (isLocalTestnet(args)) {
  console.log("Create class BlockchainEvent & LocalNetwork");

  // Register event listeners
  registerEventListeners();

  // Clean hardhat cache and build compile ontracts
  localNet.resetHardhat();

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
  blockchainEvent.on("nodeIsReady", () => {
    localNet.deployMarketplaceContract();
  });
}
