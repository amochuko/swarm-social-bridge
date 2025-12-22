import { createSwarmClient } from "@swarm-registry/registry-sdk";


export const swarm = createSwarmClient({
    beeNodeUrl: import.meta.env.VITE_BEE_NODE_URL,
});
