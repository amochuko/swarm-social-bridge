// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRegistry {
    function publishManifest(bytes32 bzzHash, string calldata metadataUri) external;
    function getMetadata(bytes32 bzzHash) external view returns (string memory);
    function getPublisher(bytes32 bzzHash) external view returns (address);
}
