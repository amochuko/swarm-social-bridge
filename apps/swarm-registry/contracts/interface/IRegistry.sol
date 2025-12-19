// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRegistry {
    function publishManifest(bytes32 bzzHash, string calldata metadataUri) external;
    function getMetadata(bytes32 bzzHash) external view returns (string memory);
    function getPublisher(bytes32 bzzHash) external view returns (address);
    function updateMetadata(bytes32 bzzHash, string calldata metadataUri) external;
    function publishWithSig(
        address signer,
        bytes32 bzzHash,
        string calldata metadataUri,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    function getNonce(address signer) external view returns (uint256);
}
