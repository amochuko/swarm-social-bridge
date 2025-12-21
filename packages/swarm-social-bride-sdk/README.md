# Swarm Registry SDK (Polygon)

A lightweight TypeScript SDK that bridges **Swarm content storage** with **Polygon smart contracts**, enabling scalable, gas-efficient publication of Swarm manifests on-chain.

This SDK is designed for DApps that want:

- Permanent, decentralized data storage (Swarm)
- Verifiable on-chain references (Polygon)
- Gas abstraction via batching and relayers
- Prevent EIP-712 mismatches

---

## What This SDK Solves

Storing data on-chain is expensive.  
Storing data off-chain lacks coordination and discoverability.

This SDK provides a minimal, trustless primitive:

> Store data on Swarm, publish verifiable references on Polygon.

---

## Architecture Overview

User
├─ uploads data → Swarm (Bee)
├─ signs batch intent → EIP-712
└─ relayer submits tx → Polygon

Polygon stores:

- Publisher address
- Swarm manifest hash
- Metadata URI

Swarm stores:

- Actual content

---

## Installation

```bash
npm install @swarm-registry/registry-sdk
```


## Usage

1. Upload Data to Swarm

```javascript
import { createSwarmClient } from "@sswarm-registrywarm/registry-sdk";

const swarm = createSwarmClient({
  beeUrl: "https://api.gateway.ethswarm.org"
});

const { bzzHash } = await swarm.uploadJSON({
  title: "Hello Swarm",
  content: "This post lives on Swarm"
});
 

```

2. Publish Reference on Polygon (Batch + Gas Abstracted)

```javascript
import { createRegistryClient } from "@swarm-registry/registry-sdk";
import { JsonRpcProvider, Wallet } from "ethers";

const provider = new JsonRpcProvider(POLYGON_RPC);
const signer = new Wallet(PRIVATE_KEY, provider);

const registry = createRegistryClient({
  contractAddress: "0xSwarmRegistryAddress",
  chainId: 80001n, // Polygon Amoy
  provider,
  signer,
});

await registry.publishBatch({
  items: [
    {
      bzzHash,
      metadataUri: "swarm://post-metadata.json"
    }
  ]
});

```

## Key Features

- Batch publishing – amortize signature and gas costs
- Relayer-friendly – users sign, relayers pay gas
- Replay protection – per-signer nonces
- Chain-agnostic – deployable on any EVM chain
- Minimal surface – no custody, no permissions


## Contract Compatibility

This SDK targets the SwarmRegistry smart contract, which exposes:

- publishBatchWithSig
- getPublisher
- getMetadata
- getNonce

The SDK’s EIP-712 schema is guaranteed to match the deployed contract.

## Status

- Registry contract deployed on Polygon testnet
- Full test coverage (signature recovery, batching, nonce correctness)
- Used as the foundation for a Swarm-native social DApp

## License
MIT
