// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import {IRegistry} from "./interface/IRegistry.sol";

/// @title SwarmRegistry
/// @notice Minimal registry to publish Swarm BZZ manifest hashes and metadata references on-chain.
contract SwarmRegistry is IRegistry {
    event ManifestPublished(
        address indexed publisher, bytes32 indexed bzzHashed, string metadataUri, uint256 timestamp
    );

    mapping(bytes32 => address) public publisherOf;
    mapping(bytes32 => string) public metadataOf;

    modifier isRegistered(bytes32 bzzHash) {
        require(publisherOf[bzzHash] == address(0), "Already registered");
        _;
    }

    modifier isPublisher(bytes32 bzzHash) {
        require(publisherOf[bzzHash] == msg.sender, "Not publisher");
        _;
    }

    function publishManifest(bytes32 bzzHash, string calldata metadataUri) external isRegistered(bzzHash) {
        require(bzzHash != bytes32(0), "Invalide hash");

        publisherOf[bzzHash] = msg.sender;
        metadataOf[bzzHash] = metadataUri;

        emit ManifestPublished(msg.sender, bzzHash, metadataUri, block.timestamp);
    }

    function getMetadata(bytes32 bzzHash) external view returns (string memory) {
        return metadataOf[bzzHash];
    }

    function getPublisher(bytes32 bzzHash) external view returns (address) {
        return publisherOf[bzzHash];
    }

    function updateMetadata(bytes32 bzzHash, string calldata metadataUri) external isPublisher(bzzHash) {
        metadataOf[bzzHash] = metadataUri;
    }
}
