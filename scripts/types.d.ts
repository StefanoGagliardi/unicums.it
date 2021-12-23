import EventEmitter from "events";
import { ContractName } from "./setup";
/**
 * Argument console for setup.ts
 */
export type SetupArgs = {
  /**
   * NodeJs exe path
   */
  nodePath: string;

  /**
   * Current script file path
   */
  filePath: string;

  /**
   * Additional argument to define local or server env
   */
  hostEnv: HostEnv;

  /**
   * Additional argument app env
   */
  appEnv: AppEnv;

  /**
   * Define env for blockchain: localnet, testnet, or mainnet
   */
  chainEnv: ChainEnv;

  /**
   * Reset hardhat data (also plugins like typechain-generator)
   */
  resetHardhat: boolean;
};

export type HostEnv = "local" | "server";
export type AppEnv = "test" | "development" | "production";
export type ChainEnv = "localnet" | "testnet" | "mainnet";

/**
 * LocalNetwork class
 * NB: Abstract is required for static method
 */
export abstract class LocalNetworkInterface implements LNI {
  /**
   * Create class with async/await constructor via static method that return class
   */
  static async createInstanceAsync(): Promise<typeof LocalNetworkInterface>;

  startPolygoNode(): void;
  killActiveNetwork(port: number): boolean;
  deploytContractsList(contractsList: ContractsListItem[]): void;
}

/**
 * Event emitter class for blockchain event streammed
 */
export interface BlockchainEventInterface extends EventEmitter {
  nodeIsReady(): void;
}

/**
 * Interface for class SmartConract Deploy
 */
export abstract class DeploySmartContractInterface {
  public deployedContracts: DeployedContractItem[] = [];

  static async createInstanceAsync(): Promise<
    typeof DeploySmartContractInterface
  >;

  deployContract(contractsName: ContractsListItem[]): Promise<boolean>;
  getDeployedContracts(): DeployedContracts[];
}

/**
 * Store deploy contract address
 */
export type DeployedContractItem = {
  name: string;
  address: string;
};

/**
 * Store deploy contract address
 */
export type ContractsListItem = {
  name: string;
  contractName: ContractName;
};

/**
 * Class or Handle new thread with nodeJs
 */
export interface ThreadManagerInterface {}
