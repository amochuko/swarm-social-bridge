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
    <div>
      <textarea
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={publish}>Post</button>
    </div>
  );
}
