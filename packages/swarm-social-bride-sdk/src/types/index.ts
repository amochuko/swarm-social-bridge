export interface PublishBatchParams {
    signer: string;
    bzzHashes: string[];
    metadataUris: string[];
    nonce: bigint;
    deadline: bigint;
}

export interface BatchSignature {
    v:string;
    r:string;
    s:string;
}

