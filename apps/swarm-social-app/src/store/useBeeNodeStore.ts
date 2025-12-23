import { BatchId } from "@swarm-registry/registry-sdk";
import { create } from "zustand";

interface AccountState {
  postageBatchId: BatchId | null;
  setPostageBatchId: (postageId: BatchId) => void;
}

export const useBeeNodeStore = create<AccountState>((set) => ({
  postageBatchId: null,

  setPostageBatchId: (p) => set({ postageBatchId: p }),
}));
