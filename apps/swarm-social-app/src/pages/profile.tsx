import { useState } from "react";
import { getRegistryClient } from "../sdk";
import { useBeeNodeStore } from "../store/useBeeNodeStore";
import { useProviderStore } from "../store/useProviderStore";
import { swarm } from "../swarm";

export function ProfilePage() {
  const provider = useProviderStore((s) => s.provider);
  const postageBatchId = useBeeNodeStore((b) => b.postageBatchId);

  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");

  async function saveProfile() {
    const profile = {
      type: "profile",
      handle,
      bio,
      createdAt: Date.now(),
    };

    const swarmRegistry = await getRegistryClient();
    const { bzzHash } = await swarm.uploadJSON(
      profile,
      postageBatchId!.toString()
    );
    const signer = await provider?.getSigner();

    await swarmRegistry.publishBatch({
      items: [{ bzzHash: bzzHash.toString(), metadataUri: "swarm://profile" }],
      nonce: BigInt(await signer!.getNonce()),
    });

    alert("Profile published!!");
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
      <h3>Create Profile</h3>
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 480,
          gap: 8,
        }}
      >
        <input
          type="text"
          placeholder="Handle"
          value={handle}
          style={{ height: 24, padding: 8 }}
          onChange={(e) => setHandle(e.target.value)}
        />

        <textarea
          id="Bio"
          style={{ height: 80, padding: 8 }}
          // placeholder="Write something..."
          placeholder="Bio..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
              // cursor: `${content === "" ? "not-allowed" : "pointer"}`,
            }}
            onClick={saveProfile}
            // disabled={content === ""}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
