import { ethers } from "ethers";
import { useEffect } from "react";
import { useProviderStore } from "../store/useProviderStore";

export function WalletConnectButton() {
  // const provider = useProviderStore((s) => s.provider);
  const account = useProviderStore((s) => s.account);
  const setProvider = useProviderStore((s) => s.setProvider);
  const setAccount = useProviderStore((s) => s.setAccount);
  const setChainId = useProviderStore((s) => s.setChainId);
  const reset = useProviderStore((s) => s.reset);

  // ------------- Auto connect only if not manually disconnected
  useEffect(() => {
    if (!window.ethereum) return;

    const disconnected = localStorage.getItem("walletDisconnected");
    if (disconnected === "true") return;

    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethProvider);

    (async () => {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) setAccount(accounts[0]);

      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(chain, 16));
    })();

    // account change
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        reset();
        localStorage.setItem("walletDisconnected", "true");
      } else setAccount(accounts[0]);
    });

    // chain change
    window.ethereum.on("chainChanged", (chain: string) => {
      setChainId(parseInt(chain, 16));
      window.location.reload();
    });
  }, []);

  const connect = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const ethProvider = new ethers.BrowserProvider(window.ethereum);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    
    setProvider(ethProvider);
    setAccount(accounts[0]);
    localStorage.setItem("walletDisconnected", "false");

    const chain = await window.ethereum.request({ method: "eth_chainId" });
    setChainId(parseInt(chain, 16));
  };

  const disconnect = () => {
    reset();
    localStorage.setItem("walletDisconnected", "true"); // persist
  };

  if (account) {
    const short = `${account.slice(0, 6)}...${account.slice(-4)}`;
    return (
      <div className="flex gap-2">
        <span className="px-3 py-2 bg-green-600 text-white rounded">
          {short}
        </span>
        <button
          className="px-3 py-2 bg-red-500 text-white rounded"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={connect}
    >
      Connect Wallet
    </button>
  );
}
