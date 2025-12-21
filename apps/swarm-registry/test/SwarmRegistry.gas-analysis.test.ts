import hre from "hardhat";
import { makeDomain, types } from "./helpers.js";

const { ethers, networkHelpers } = await hre.network.connect();

describe("SwarmRegistry::GasAnalysis", () => {
  async function deploySwarmRegistryFixture() {
    const [signer, deployer, relayer] = await ethers.getSigners();

    const swarmRegistry = await ethers.deployContract("SwarmRegistry");
    const network = await ethers.provider.getNetwork();

    return { swarmRegistry, signer, deployer, relayer, network, types };
  }

  it("gas: single vs batch publish", async () => {
    const { signer, swarmRegistry, relayer, network, types } =
      await networkHelpers.loadFixture(deploySwarmRegistryFixture);

    const chainId = network.chainId;
    const domain = makeDomain(chainId, await swarmRegistry.getAddress());

    // ------ SINGLE PUBLISH ------
    const singleBzzHash = [ethers.keccak256(ethers.toUtf8Bytes("single-file"))];
    const singleMetadataUri = ["swarm://single-file.json"];
    const nonce1 = await swarmRegistry.getNonce(signer.address);
    const deadline =
      (await ethers.provider.getBlock("latest"))!.timestamp + 3600;

    const singleValue = {
      signer: signer.address,
      bzzHashesHash: ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(["bytes32[]"], [singleBzzHash])
      ),
      metadataUrisHash: ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["bytes32[]"],
          [
            singleMetadataUri.map((uri) =>
              ethers.keccak256(ethers.toUtf8Bytes(uri))
            ),
          ]
        )
      ),
      nonce: nonce1,
      deadline,
    };

    const singleSig = ethers.Signature.from(
      await signer.signTypedData(domain, types, singleValue)
    );

    const tx = await swarmRegistry
      .connect(relayer)
      .publishBatchWithSig(
        signer.address,
        singleBzzHash,
        singleMetadataUri,
        deadline,
        singleSig.v,
        singleSig.r,
        singleSig.s
      );
    const receipt = await tx.wait();

    console.log(`Gas used for single publish: ${receipt!.gasUsed.toString()}`);

    // ------ BATCH PUBLISH (5) ------

    const batchSize = 5;
    const bzz = Array.from({ length: batchSize }, (_, i) =>
      ethers.keccak256(ethers.toUtf8Bytes(`batch-file-${i}`))
    );

    const metadataUri = bzz.map((_, i) => `swarm://metadata-${i}.json`);

    const nonce2 = await swarmRegistry.getNonce(signer.address);

    const batchValue = {
      signer: signer.address,
      bzzHashesHash: ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(["bytes32[]"], [bzz])
      ),
      metadataUrisHash: ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["bytes32[]"],
          [metadataUri.map((uri) => ethers.keccak256(ethers.toUtf8Bytes(uri)))]
        )
      ),
      nonce: nonce2,
      deadline,
    };

    const batchSig = ethers.Signature.from(
      await signer.signTypedData(domain, types, batchValue)
    );

    const tx2 = await swarmRegistry
      .connect(relayer)
      .publishBatchWithSig(
        signer.address,
        bzz,
        metadataUri,
        deadline,
        batchSig.v,
        batchSig.r,
        batchSig.s
      );
    const receipt2 = await tx2.wait();

    console.log(
      `Gas used for batch publish of ${batchSize}: ${receipt2!.gasUsed.toString()}`
    );
  });
});
