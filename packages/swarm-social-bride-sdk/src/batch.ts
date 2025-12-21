import { ethers } from "ethers";
import { BatchSignature, PublishBatchParams } from "./types";

const abi = ethers.AbiCoder.defaultAbiCoder();

export const PublishBatchTypes = {
  PublishBatch: [
    { name: "signer", type: "address" },
    { name: "bzzHashesHash", type: "bytes32" },
    { name: "metadataUrisHash", type: "bytes32" },
    { name: "nonce", type: "uiint256" },
    { name: "deadline", type: "uiint256" },
  ],
};

export function makeDomain(chainId: number, verifyingContract: string) {
  return {
    name: "SwarmRegistry",
    version: "1",
    chainId,
    verifyingContract,
  };
}

export function hashBatch(bzzHashes: string[], metadataUris: string[]) {
  // Pre-hash arrays before signing
  const bzzHashesHash = ethers.keccak256(
    abi.encode(["bytes32[]"], [bzzHashes])
  );

  // Pre-hash arrays before signing
  const metadataUrisHash = ethers.keccak256(
    abi.encode(
      ["bytes32[]"],
      [metadataUris.map((uri) => ethers.keccak256(ethers.toUtf8Bytes(uri)))]
    )
  );
  return { bzzHashesHash, metadataUrisHash };
}

export async function signPublishBatch(
  signer: ethers.Signer,
  chainId: bigint,
  verifyingContract: string,
  params: PublishBatchParams
): Promise<BatchSignature> {
  const domain = makeDomain(Number(chainId), verifyingContract);
  const { bzzHashesHash, metadataUrisHash } = hashBatch(
    params.bzzHashes,
    params.metadataUris
  );

  const value = {
    signer: params.signer,
    bzzHashesHash,
    metadataUrisHash,
    nonce: params.nonce,
    deadline: params.deadline,
  };

  const signature = await signer.signTypedData(
    domain,
    PublishBatchTypes,
    value
  );

  const sig = ethers.Signature.from(signature);

  return {
    v: sig.v.toString(),
    r: sig.r,
    s: sig.s,
  };
}
