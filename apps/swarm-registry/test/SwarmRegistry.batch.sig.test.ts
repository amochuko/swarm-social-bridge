import { expect } from "chai";
import hre from "hardhat";
import { makeDomain, types } from "./helpers.js";

const { ethers, networkHelpers } = await hre.network.connect();
const abi = ethers.AbiCoder.defaultAbiCoder();

describe("SwarmRegistry:Batch", () => {
  async function deploySwarmRegistryFixture() {
    const [signer, deployer, relayer] = await ethers.getSigners();

    const swarmRegistry = await ethers.deployContract("SwarmRegistry");
    const network = await ethers.provider.getNetwork();

    return { swarmRegistry, signer, deployer, relayer, network };
  }

  it("publishes a batch via relayer with a vaild signature", async () => {
    const { signer, swarmRegistry, relayer, network } =
      await networkHelpers.loadFixture(deploySwarmRegistryFixture);

    const chainId = network.chainId;
    const domain = makeDomain(chainId, await swarmRegistry.getAddress());

    const bzzHashes = [
      ethers.keccak256(ethers.toUtf8Bytes("file-a")),
      ethers.keccak256(ethers.toUtf8Bytes("file-b")),
    ];

    const metadataUris = ["swarm://meta-1.json", "swarm://meta-2.json"];

    const nonce = await swarmRegistry.getNonce(signer.address);
    const block = await ethers.provider.getBlock("latest");
    const deadline = block!.timestamp + 3600; // 1 hour from now

    // Pre-hash arrays before signing
    const bzzHashesHash = ethers.keccak256(
      abi.encode(["bytes32[]"], [bzzHashes])
    );

    // Pre-hash arrays before signing
    const metadataUrisHash = ethers.keccak256(
      abi.encode(
        ["bytes32[]"],
        [metadataUris.map((uri) => ethers.keccak256(ethers.toUtf8Bytes(uri)))]
      )
    );

    const value = {
      signer: signer.address,
      bzzHashesHash,
      metadataUrisHash,
      nonce,
      deadline,
    };

    const signature = await signer.signTypedData(domain, types, value);
    const { v, r, s } = ethers.Signature.from(signature);

    const res = swarmRegistry
      .connect(relayer)
      .publishBatchWithSig(
        signer.address,
        bzzHashes,
        metadataUris,
        deadline,
        v,
        r,
        s
      );

    const receipt = await res.then((tx: any) => tx.wait());
    console.log(
      "Gas used in publishBatchWithSig: ",
      receipt.gasUsed.toString()
    );

    // event assertions
    const events = receipt.logs.filter(
      (log: any) => log.fragment?.name === "ManifestPublished"
    );

    expect(events.length).to.equal(2);
    expect(await swarmRegistry.getPublisher(bzzHashes[0])).to.equal(
      signer.address
    );
    expect(await swarmRegistry.getMetadata(bzzHashes[1])).to.equal(
      metadataUris[1]
    );

    // nonce incremented by batch size
    expect(await swarmRegistry.getNonce(signer.address)).to.equal(
      nonce + BigInt(2)
    );
  });
});
