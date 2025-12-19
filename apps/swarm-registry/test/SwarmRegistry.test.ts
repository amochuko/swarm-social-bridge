import { expect } from "chai";
import hre from "hardhat";

const { ethers, networkHelpers } = await hre.network.connect();

describe("SwarmRegistry", () => {
  async function deploySwarmRegistryFixture() {
    const [signer] = await ethers.getSigners();

    const swarmRegistry = await ethers.deployContract("SwarmRegistry");

    return { swarmRegistry, signer };
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
});
