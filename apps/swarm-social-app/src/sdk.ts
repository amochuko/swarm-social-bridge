import { createRegistryClient } from "@swarm-registry/registry-sdk";
import { ethers } from "ethers";

export async function getRegistryClient() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const newtwork = await provider.getNetwork();

  return createRegistryClient({
    signer,
    chainId: newtwork.chainId,
    contractAddress: import.meta.env.VITE_SWARM_REGISTRY_CONTRACT_ADDRESS,
    provider,
  });
}
