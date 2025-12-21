import { ethers } from "ethers";

const abi = ethers.AbiCoder.defaultAbiCoder();

export function hashBzzHashes(bzzHashes: string[]) {
  // Pre-hash arrays before signing
  const bzzHashesHash = ethers.keccak256(
    abi.encode(["bytes32[]"], [bzzHashes])
  );

  return bzzHashesHash;
}


export function hashMetadataUris(metadataUris: string[]) {
  // Pre-hash arrays before signing
  const metadataUrisHash = ethers.keccak256(
    abi.encode(
      ["bytes32[]"],
      [metadataUris.map((uri) => ethers.keccak256(ethers.toUtf8Bytes(uri)))]
    )
  );

  return metadataUrisHash;
}
