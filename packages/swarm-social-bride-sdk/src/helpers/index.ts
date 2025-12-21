import { ethers } from "ethers";

const abi = ethers.AbiCoder.defaultAbiCoder();

export function hashBzzHashes(bzzHashes: string[]) {
  // Pre-hash arrays before signing
  const bzzHashesHash = ethers.keccak256(
    abi.encode(["bytes32[]"], [bzzHashes])
  );

  return bzzHashesHash;
}
