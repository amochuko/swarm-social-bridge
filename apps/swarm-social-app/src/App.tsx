import { useEffect, useState } from "react";
import "./App.css";
import { WalletConnectButton } from "./components/WalletConnect";
import { Feed } from "./pages/feed";
import { MessagePage } from "./pages/message";
import { NewPost } from "./pages/new-post";
import { ProfilePage } from "./pages/profile";
import { useBeeNodeStore } from "./store/useBeeNodeStore";
import { useProviderStore } from "./store/useProviderStore";
import { swarm } from "./swarm";

function App() {
  const provider = useProviderStore((s) => s.provider);
  const account = useProviderStore((s) => s.account);
  const setPostageBatchId = useBeeNodeStore((b) => b.setPostageBatchId);
  const postageBatchId = useBeeNodeStore((b) => b.postageBatchId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (provider && account) {
      swarm
        .getOrCreatePostageBatch()
        .then((p) => {
          setPostageBatchId(p);
        })
        .catch((err) => {
          console.error("Failed to get or create postage batch:", err);
          alert("Failed to get or create postage batch:" + err.message);
        });
    }
  }, [provider, account, postageBatchId, setPostageBatchId]);

  // Render loading until ready
  if (!provider || !account) {
    return (
      <div>
        <WalletConnectButton />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <WalletConnectButton />
      <h3>Swarm Social App</h3>
      <p>Connected account: {account}</p>

      <ProfilePage postageId="" />
      <NewPost
        postageId={postageBatchId!.toString()}
        onPost={(p) => setPosts([p, ...posts])}
      />
      <Feed posts={posts} />
      <MessagePage />
    </div>
  );
}

export default App;
