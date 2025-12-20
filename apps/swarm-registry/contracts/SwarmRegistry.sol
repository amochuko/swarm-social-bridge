// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IRegistry} from "./interface/IRegistry.sol";
import {console2} from "forge-std/Test.sol";

/// @title SwarmRegistry
/// @notice Minimal registry to publish Swarm BZZ manifest hashes and metadata references on-chain. it
/// supports both direct publishing and signature-based relay publishing.
contract SwarmRegistry is IRegistry, EIP712 {
    using ECDSA for bytes;

    /*//////////////////
            EVENTS
    //////////////////*/
    event ManifestPublished(address indexed publisher, bytes32 indexed bzzHash, string metadataUri, uint256 timestamp);

    /*///////////////////////////
            STORAGE
    //////////////////////////*/

    // @notice Swarm manifest hash => original publisher
    mapping(bytes32 => address) private _publisherOf;

    /// Swarm manifest hash => metadata URI
    mapping(bytes32 => string) private _metadataOf;

    /// @notice Nonce per signer for replay protection
    mapping(address => uint256) private _nonces;

    /*////////////////////////////////////////////////////////
                        EIP-712 CONSTANT
    ////////////////////////////////////////////////////////*/

    bytes32 private constant PUBLISH_TYPEHASH =
        keccak256(
            "Publish(address signer,bytes32 bzzHash,string metadataUri,uint256 nonce,uint256 deadline)"
        );

    /*//////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidHash();
    error AlreadyRegistered();
    error NotPublished();
    error NotPublisher();
    error SignatureExpired();
    error InvalidSignature();
    error InvalidAddress();
    error InvalidLength();

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
    constructor() EIP712("SwarmRegistry", "1") {}

    /*//////////////////////////////////
            INTERNAL
    /////////////////////////////*/

    function _setPublisher(bytes32 bzzHash, address publisher) internal isValidBzzHash(bzzHash) {
        _publisherOf[bzzHash] = publisher;
    }

    function _setMetadata(bytes32 bzzHash, string calldata metadataUri) internal isValidBzzHash(bzzHash) {
        if (bytes(metadataUri).length == 0) revert InvalidLength();

        _metadataOf[bzzHash] = metadataUri;
    }

    /*////////////////////////////////
                    DIRECT PUBLISH
    ///////////////////////////////*/

    /// @notice Publish a Swarm manifest directly (caller pays gas)
    /// @param bzzHash the reference hash from uploaded data via Swarm
    /// @param metadataUri metadataURI as refrenced by bzzHash
    function publishManifest(bytes32 bzzHash, string calldata metadataUri) external isRegistered(bzzHash) {
        _setPublisher(bzzHash, msg.sender);
        _setMetadata(bzzHash, metadataUri);

        emit ManifestPublished(msg.sender, bzzHash, metadataUri, block.timestamp);
    }

    /*/////////////////////////////////////////////////////
                    SIGNATURE-BASE RELAY PUBLISH
    /////////////////////////////////////////////////////////*/

    function publishWithSig(
        address signer,
        bytes32 bzzHash,
        string calldata metadataUri,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external isValidBzzHash(bzzHash) isRegistered(bzzHash) {
        if (block.timestamp > deadline) revert SignatureExpired();

        if (signer == address(0)) revert InvalidAddress();

        uint256 nonce = _nonces[signer];
        bytes32 structHash =
            keccak256(abi.encode(PUBLISH_TYPEHASH, signer, bzzHash, keccak256(bytes(metadataUri)), nonce, deadline));

        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(digest, v, r, s);

        if (recovered != signer) revert InvalidSignature();

        _nonces[signer]++;

        _setPublisher(bzzHash, signer);
        _setMetadata(bzzHash, metadataUri);

        emit ManifestPublished(signer, bzzHash, metadataUri, block.timestamp);
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

    function getNonce(address signer) external view returns (uint256) {
        return _nonces[signer];
    }
}
