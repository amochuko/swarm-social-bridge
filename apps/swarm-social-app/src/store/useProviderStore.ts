import { create } from "zustand";
import { ethers } from "ethers";

interface WalletState {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  chainId: number | null;

  setProvider: (p: ethers.BrowserProvider | null) => void;
  setAccount: (a: string | null) => void;
  setChainId: (c: number | null) => void;
  reset: () => void;
}

export const useProviderStore = create<WalletState>((set) => ({
  provider: null,
  account: null,
  chainId: null,

  setProvider: (p) => set({ provider: p }),
  setAccount: (a) => set({ account: a }),
  setChainId: (c) => set({ chainId: c }),
  reset: () =>
    set({
      provider: null,
      account: null,
      chainId: null,
    }),
}));
