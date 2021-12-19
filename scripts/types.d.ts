import EventEmitter from "events";

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
};

export type HostEnv = "local" | "server";
export type AppEnv = "test" | "development" | "production";
export type ChainEnv = "localnet" | "testnet" | "mainnet";

/**
 * LocalNetwork class
 */
export interface LocalNetworkInterface {
  startPolygoNode(): void;
  killActiveNetwork(port: number): boolean;
  deployMarketplaceContract(): void;
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
export interface DeploySmartContractInterface {

}