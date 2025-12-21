export function makeDomain(chainId: bigint, verifyingContract: string) {
  return {
    name: "SwarmRegistry",
    version: "1",
    chainId,
    verifyingContract,
  };
}

export const types = {
  PublishBatch: [
    { name: "signer", type: "address" },
    { name: "bzzHashesHash", type: "bytes32" },
    { name: "metadataUrisHash", type: "bytes32" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};
