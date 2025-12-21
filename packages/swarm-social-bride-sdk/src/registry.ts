import { ethers, TypedDataDomain, TypedDataField } from "ethers";
import { SWARM_REGISTRY_ABI } from "./abi";
import { hashBzzHashes, hashMetadataUris } from "./helpers";
import { PublishBatchParams, RegistryClientConfig } from "./types";

// EIP-712 Types (must match those defined in the smart contract)
const TYPES: Record<string, TypedDataField[]> = {
  PublishBatch: [
    { name: "signer", type: "address" },
    { name: "bzzHashesHash", type: "bytes32" },
    { name: "metadataUrisHash", type: "bytes32" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

export function createRegistryClient(config: RegistryClientConfig) {
  const contract = new ethers.Contract(
    config.contractAddress,
    SWARM_REGISTRY_ABI,
    config.signer || config.provider
  );

  const domain: TypedDataDomain = {
    name: "SwarmRegistry",
    version: "1",
    chainId: config.chainId,
    verifyingContract: config.contractAddress,
  };

  async function publishBatch(params: PublishBatchParams) {
    if (!config.signer) {
      throw new Error("Signer is required to publish a batch");
    }

    const signerAddress = await config.signer.getAddress();
    const nonce = await contract.getNonce(signerAddress);

    const deadline = params.deadline ?? Math.floor(Date.now() / 1000) + 3600; // default 1 hour from now

    const bzzHashes = params.items.map((item) => item.bzzHash);
    const metadataUris = params.items.map((item) => item.metadataUri);

    const message = {
      signer: signerAddress,
      bzzHashesHash: hashBzzHashes(bzzHashes),
      metadataUrisHash: hashMetadataUris(metadataUris),
      nonce,
      deadline,
    };

    const signature = await config.signer.signTypedData(domain, TYPES, message);

    const { v, r, s } = ethers.Signature.from(signature);

    return contract.publishBatchWithSig(
      signerAddress,
      bzzHashes,
      metadataUris,
      nonce,
      v,
      r,
      s
    );
  }

  async function getPublisher(bzzHash:string) {
    return contract.getPublisher(bzzHash);
  }

  
}
