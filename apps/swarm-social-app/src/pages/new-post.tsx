import { useState } from "react";
import { getRegistryClient } from "../sdk";
import { useBeeNodeStore } from "../store/useBeeNodeStore";
import { useProviderStore } from "../store/useProviderStore";
import { swarm } from "../swarm";

type NewPostProps = {
  onPost: (p: unknown) => void;
};

export function NewPost(props: NewPostProps) {
  const provider = useProviderStore((s) => s.provider);
  const [content, setContent] = useState("");
  const postageBatchId = useBeeNodeStore((b) => b.postageBatchId);

  async function publish() {
    const signer = await provider?.getSigner();

    const post = {
      type: "post",
      content,
      createdAt: Date.now(),
    };

    const { bzzHash } = await swarm.uploadJSON(
      post,
      postageBatchId!.toString()
    );
    const swarmRegistry = await getRegistryClient();

    await swarmRegistry.publishBatch({
      items: [{ bzzHash: bzzHash.toString(), metadataUri: "swarm://post" }],
      nonce: BigInt(await signer!.getNonce()),
    });

    props.onPost({ ...post, bzzHash });
    setContent("");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginBottom: 24,
        alignItems: "center",
        padding: 16,
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 480,
          gap: 8,
        }}
      >
        <textarea
          id="post"
          style={{ height: 80 , padding: 8,  }}
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div
          className="post-btn"
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              minWidth: 120,
              fontWidth: "bold",
              padding: "8px 16px",
              cursor: `${content === "" ? "not-allowed" : "pointer"}`,
            }}
            onClick={publish}
            disabled={content === ""}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
