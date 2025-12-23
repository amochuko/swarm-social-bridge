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
    <div>
      <h3>Create Profile</h3>
      <input
        type="text"
        placeholder="Handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <br />
      <button onClick={saveProfile}>Save Profile</button>
    </div>
  );
}
