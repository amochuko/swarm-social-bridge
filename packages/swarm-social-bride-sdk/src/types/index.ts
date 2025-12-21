import { Provider, Signer } from "ethers";

export interface BatchSignature {
  v: string;
  r: string;
  s: string;
}

export type PublishItem = {
  bzzHash: string;
  metadataUri: string;
};
export interface PublishBatchParams {
  nonce: bigint;
  items: PublishItem[];
  deadline?: bigint;
}

export type RegistryClientConfig = {
  contractAddress: string;
  chainId: bigint;
  provider: Provider;
  signer?: Signer;
};


