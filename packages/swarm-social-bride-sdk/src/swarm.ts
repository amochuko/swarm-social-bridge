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

  
}
