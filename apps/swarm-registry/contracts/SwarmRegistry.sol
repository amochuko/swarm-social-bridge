// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

/// @title SwarmRegistry
/// @notice Minimal registry to publish Swarm BZZ manifest hashes and metadata references on-chain.
contract SwarmRegistry {
    event ManifestPublished(
        address indexed publisher, bytes32 indexed bzzHashed, string metadataUri, uint256 timestamp
    );

    mapping(bytes32 => address) public publisherOf;
    mapping(bytes32 => string) public metadataOf;


}
