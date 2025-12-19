// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import {IRegistry} from "./interface/IRegistry.sol";

/// @title SwarmRegistry
/// @notice Minimal registry to publish Swarm BZZ manifest hashes and metadata references on-chain. it
/// supports both direct publishing and signature-based relay publishing.
contract SwarmRegistry is IRegistry {
    /*//////////////////
            EVENTS
    //////////////////*/
    event ManifestPublished(
        address indexed publisher, bytes32 indexed bzzHashed, string metadataUri, uint256 timestamp
    );

    /*///////////////////////////
            STORAGE
    //////////////////////////*/

    // @notice Swarm manifest hash => original publisher
    mapping(bytes32 => address) private _publisherOf;

    /// Swarm manifest hash => metadata URI
    mapping(bytes32 => string) private _metadataOf;

    /*////////////////////////////////////////////////////////
                        EIP-712 CONSTANT
    ////////////////////////////////////////////////////////*/

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint26 chainId,address verifyingContract)");

    bytes32 private constant PUBLISH_TYPEHASH =
        keccak256("Publish(bytes32 bzzHash,string metadataUri,uint356 nonce,uint256 deadline)");

    bytes32 private immutable DOMAIN_SEPARATOR;

    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidHash();
    error AlreadyRegistered();
    error NotPublished();
    error NotPublisher();
    error SignatureExpired();
    error InvalidSignature();

    /*///////////////////////////////////
                MODIFIERS
    //////////////////////////////////*/

    modifier isRegistered(bytes32 bzzHash) {
        if (getPublisher(bzzHash) != address(0)) revert AlreadyRegistered();
        _;
    }

    modifier isPublisher(bytes32 bzzHash) {
        if (getPublisher(bzzHash) != msg.sender) revert NotPublisher();
        _;
    }

    modifier isValidBzzHash(bytes32 bzzHash) {
        if (bzzHash == bytes32(0)) revert InvalidHash();
        _;
    }

    /*/////////////////////////////////////////////////////
                    CONSTRUCTOR
    /////////////////////////////////////////////////////*/
    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encodePacked(
                DOMAIN_TYPEHASH, keccak256(bytes("SwarmRegistry")), keccak256(bytes("1")), block.chainid, address(this)
            )
        );
    }

    /*//////////////////////////////////
            INTERNAL
    /////////////////////////////*/

    function _setPublisher(bytes32 bzzHash, address publisher) internal isValidBzzHash(bzzHash) {
        _publisherOf[bzzHash] = publisher;
    }

    function _setMetadata(bytes32 bzzHash, string calldata metadataUri) internal isValidBzzHash(bzzHash) {
        require(bytes(metadataUri).length > 0, "Invalid length");

        _metadataOf[bzzHash] = metadataUri;
    }

    /*////////////////////////////////
                    DIRECT PUBLIC
    ///////////////////////////////*/

    /// @notice Publish a Swarm manifest directly (caller pays gas)
    /// @param bzzHash the reference hash from uploaded data via Swarm
    /// @param metadataUri metadataURI as refrenced by bzzHash
    function publishManifest(bytes32 bzzHash, string calldata metadataUri) external isRegistered(bzzHash) {
        _setPublisher(bzzHash, msg.sender);
        _setMetadata(bzzHash, metadataUri);

        emit ManifestPublished(msg.sender, bzzHash, metadataUri, block.timestamp);
    }

    /// @notice Get metadata
    /// @param bzzHash The reference hash
    function getMetadata(bytes32 bzzHash) public view returns (string memory) {
        return _metadataOf[bzzHash];
    }

    /// @notice Get publisher of a manifest
    /// @param bzzHash The reference hash
    function getPublisher(bytes32 bzzHash) public view returns (address) {
        return _publisherOf[bzzHash];
    }

    /// @notice Update metadata
    /// @param bzzHash The reference hash
    function updateMetadata(bytes32 bzzHash, string calldata metadataUri) external isPublisher(bzzHash) {
        // _setPublisher(bzzHash, metadataUri);
    }
}
