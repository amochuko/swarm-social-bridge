import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
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
  const [error, setError] = useState<Error | string | null>(null);
  const setPostageBatchId = useBeeNodeStore((b) => b.setPostageBatchId);

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
          setError(err);
          console.error("Failed to get or create postage batch:", err);
        });
    }
  }, [account, provider, setPostageBatchId]);

  return (
    <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
      <Header />
      <div>
        {provider && account && (
          <>
            <h3>Swarm Social App</h3>

            <ProfilePage />
            <NewPost onPost={(p) => setPosts([p, ...posts])} />
            <Feed posts={posts} />
            <MessagePage />
          </>
        )}

        {!provider && !account && (
          <div>Connect your wallet to get started.</div>
        )}

        {error && (
          <div style={{ color: "red" }}>
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
