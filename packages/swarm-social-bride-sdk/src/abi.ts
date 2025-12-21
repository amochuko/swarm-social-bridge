export const SWARM_REGISTRY_ABI = [
  "function getNonce(address) view returns (uint256)",
  "function getPublisher(bytes32) view returns (address)",
  "function getMetadata(bytes32) view returns (string)",
  "function publishBatchWithSig(address,bytes32[],string[],uint256,uint8,bytes32,bytes32)",
];
