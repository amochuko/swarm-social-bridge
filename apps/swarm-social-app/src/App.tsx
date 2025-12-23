import { useEffect, useState } from "react";
import "./App.css";
import { Feed } from "./pages/feed";
import { NewPost } from "./pages/new-post";
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
  }, [account, provider, setPostageBatchId, setError]);

  return (
    <>
      {provider && account && (
        <>
          <NewPost onPost={(p) => setPosts([p, ...posts])} />
          <Feed posts={posts} />
        </>
      )}

      {!provider && !account && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "120px",
          }}
        >
          <h1>Swarm Social DApp</h1>
          <p>Connect your wallet to get started.</p>
        </div>
      )}

      {provider && account && error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "red",
            marginTop: "24px",
          }}
        >
          <span style={{ backgroundColor: "#f9c4c4ff", padding: "4px 8px" }}>
            <strong>Error: </strong>
            {error instanceof Error ? error.message : error}
          </span>

          {error instanceof Error &&
            error.message === "No usable postage batch found" && (
              <p
                style={{
                  backgroundColor: "#d4d4d4ff",
                  padding: "4px 12px",
                  color: "#333",
                }}
              >
                &nbsp;– Please ensure you have a usable postage batch on the
                connected Bee node.
              </p>
            )}
        </div>
      )}
    </>
  );
}

export default App;
