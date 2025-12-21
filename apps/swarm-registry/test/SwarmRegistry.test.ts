import { expect } from "chai";
import hre from "hardhat";

const { ethers, networkHelpers } = await hre.network.connect();

describe("SwarmRegistry", () => {
  async function deploySwarmRegistryFixture() {
    const [signer, relayer] = await ethers.getSigners();

    const swarmRegistry = await ethers.deployContract("SwarmRegistry");

    return { swarmRegistry, signer, relayer };
  }

  it("allows direct publishing", async () => {
    const { signer, swarmRegistry } = await networkHelpers.loadFixture(
      deploySwarmRegistryFixture
    );

    const bzzHash = ethers.keccak256(ethers.toUtf8Bytes("direct"));
    const uri = "swarm:/direct.json";

    await swarmRegistry.publishManifest(bzzHash, uri);

    expect(await swarmRegistry.getPublisher(bzzHash)).to.equal(signer.address);
  });

  it("allows relayed publishing with valid signature", async () => {
    const { signer, swarmRegistry, relayer } = await networkHelpers.loadFixture(
      deploySwarmRegistryFixture
    );

    const bzzHash = ethers.keccak256(ethers.toUtf8Bytes("sig"));
    const uri = "swarm://sig.json";
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const nonce = await swarmRegistry.getNonce(signer.address);
    const network = await ethers.provider.getNetwork();

    const domain = {
      name: "SwarmRegistry",
      version: "1",
      chainId: network.chainId,
      verifyingContract: String(swarmRegistry.target),
    };

    const types = {
      Publish: [
        { name: "signer", type: "address" },
        { name: "bzzHash", type: "bytes32" },
        { name: "metadataUri", type: "string" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const value = {
      signer: signer.address,
      bzzHash,
      metadataUri: uri,
      nonce,
      deadline,
    };

    const sig = await signer.signTypedData(domain, types, value);
    const { v, r, s } = ethers.Signature.from(sig);

    await swarmRegistry
      .connect(relayer)
      .publishWithSig(signer.address, bzzHash, uri, deadline, v, r, s);

    const signerAddress = await swarmRegistry.getPublisher(bzzHash);

    expect(signerAddress).to.equal(signer.address);
  });
});
