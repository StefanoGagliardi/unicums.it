/**
 * Helpers function for Blockchain setup steps
 *
 * @author Stefano Gagliardi <stefano.gagliardi@sitisrl.it>
 * @version 0.1.0
 */

// Import types
import { SetupArgs, ThreadManagerInterface } from "./types";

// Validate command line args for different setup
export const isLocalTestnet = (args: SetupArgs): boolean => {
  if (
    args.hostEnv === "local" &&
    args.appEnv !== "production" &&
    args.chainEnv === "testnet"
  ) {
    return true;
  }

  return false;
};

class ThreadManager implements ThreadManagerInterface {}
