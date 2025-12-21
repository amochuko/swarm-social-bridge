# Swarm-Social-Bride SDK

This SDK is an intentionally thin, explicit, and auditable abstraction for the SwarmRegistry smart contract that:

- Prevent EIP-712 mismatches
- Make relayer usage trivial
- Encode batch hashing once


It is meant to be a developer-friendly tooling

## Usage
```javascript
import {signPublishBatch} from '@swarm-social-bride/sdk'

const sig = await signPublishBatch(
  userSigner,
  chainId,
  swarmRegistryAddress,
  {
    signer: userAddress,
    bzzHashes,
    metadataUris,
    nonce,
    deadline,
  }
);

await swarmRegistry
  .connect(relayer)
  .publishBatchWithSig(
    userAddress,
    bzzHashes,
    metadataUris,
    deadline,
    sig.v,
    sig.r,
    sig.s
  );

```
