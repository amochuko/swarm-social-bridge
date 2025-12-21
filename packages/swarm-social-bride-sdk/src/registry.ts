import { ethers, TypedDataDomain, TypedDataField } from "ethers";
import { SWARM_REGISTRY_ABI } from "./abi";
import { RegistryClientConfig } from "./types";

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

