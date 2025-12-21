# SwarmRegistry

This contract facilitates integrations between Polygon and Swarm to enable scalable, interoperable DApp solutions. It's core purpose is to:

- Anchor Swarm manifests on Polygon
- Provide immutable, on-chain references
- Emit events for indexers
- Act as a neutral bridge primitive

## Core
At its core, it uses a signature-based relay method/pattern where:

- Authority is expressed cryptographically, not through msg.sender
- Transactions can be submitted (relayed) by anyone
- The contract verifies intent via signatures
- No custodial bridge or liquidity pool exists

In other words:

- The bridge does not “move assets”.
- It anchors intent and data across systems.
- Swarm servers as an off-chain storage
- Polygon is on-chain verification
- There is nothing to “lock and mint”

### What is being “bridged” if no assets move?

This is the key mental model shift and it bridges:

- Data availability guarantees
- Authorship
- Integrity
- References
- Not tokens.

Polygon is the canonical integrity layer.

Swarm remains the data layer.

# Gas Analysis
On Polygon, batch publishing reduces per-manifest gas costs by ~60–70% 
as demostrated in the test './test/SwarmRegistry.gas-analysis.test.ts' compared to single publishes. This enables relayer-sponsored anchoring of Swarm manifests for high-throughput applications such as social feeds, content indexing, and data availability commitments—use cases that are cost-prohibitive on Ethereum mainnet.
