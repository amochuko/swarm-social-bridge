import { Bee, RedundantUploadOptions } from "@ethersphere/bee-js";
import { SwarmClientConfig } from "./types";

export function createSwarmClient(config: SwarmClientConfig) {
  const bee = new Bee(config.beeNodeUrl);

  async function uploadJSON<T>(
    data: T,
    postageBatchId: string,
    opts?: RedundantUploadOptions
  ) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));

    const result = await bee.uploadData(postageBatchId, bytes, opts);

    return { bzzHash: result.reference };
  }

  async function downloadJSON<T>(bzzHash: string): Promise<T> {
    const data = await bee.downloadData(bzzHash);

    const text = new TextDecoder().decode(data.toUint8Array());
    return JSON.parse(text) as T;
  }

  async function getOrCreatePostageBatch() {
    const batches = await bee.getPostageBatches();
    const usable = batches.find((x) => x.usable);

    if (usable) {
      return usable.batchID;
    } else {
      throw new Error("No usable postage batch found");
    }
  }

  return {
    uploadJSON,
    downloadJSON,
    getOrCreatePostageBatch,
  };
}
