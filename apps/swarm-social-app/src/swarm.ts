import { createSwarmClient } from "@swarm-registry/registry-sdk";
import { config } from "./utils/config";

const { BEE_NODE_URL } = config.env;

if (!BEE_NODE_URL) {
  alert("BEE_NODE_URL is not defined in environment variables");
}

export const swarm = createSwarmClient({
  beeNodeUrl: import.meta.env.VITE_BEE_NODE_URL,
});
