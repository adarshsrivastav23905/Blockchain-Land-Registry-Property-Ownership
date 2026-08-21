// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LandRegistry
 * @notice Educational property-registry prototype using synthetic data only.
 * @dev This contract does NOT create or prove legal ownership of real property.
 */
contract LandRegistry {
    address public immutable admin;

    enum PropertyStatus {
        REGISTERED,
        VERIFIED,
        TRANSFER_PENDING,
        TRANSFERRED,
        DISPUTED
    }

    struct Property {
        uint256 propertyId;
        string propertyNumber;
        string location;
        uint256 area;
        string propertyType;
        address currentOwner;
        address previousOwner;
        string documentHash;
        bool verified;
        PropertyStatus status;
        uint256 registeredAt;
        uint256 lastTransferredAt;
    }

    mapping(uint256 => Property) private properties;
    mapping(uint256 => bool) private registered;
    mapping(address => uint256[]) private ownerPropertyIds;
    mapping(address => mapping(uint256 => uint256)) private ownerPropertyIndex;

    event PropertyRegistered(
        uint256 indexed propertyId,
        string propertyNumber,
        address indexed initialOwner,
        uint256 timestamp
    );

    event PropertyVerified(
        uint256 indexed propertyId,
        address indexed verifier,
        uint256 timestamp
    );

    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    event PropertyStatusUpdated(
        uint256 indexed propertyId,
        PropertyStatus oldStatus,
        PropertyStatus newStatus,
        address indexed updatedBy,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin/authority can perform this action");
        _;
    }

    modifier onlyExistingProperty(uint256 propertyId) {
        require(registered[propertyId], "Property does not exist");
        _;
    }

    modifier onlyPropertyOwner(uint256 propertyId) {
        require(properties[propertyId].currentOwner == msg.sender, "Caller is not current owner");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Register a new synthetic property.
     * @dev Only the authority/admin may create the record.
     */
    function registerProperty(
        uint256 propertyId,
        string calldata propertyNumber,
        string calldata location,
        uint256 area,
        string calldata propertyType,
        address initialOwner,
        string calldata documentHash
    ) external onlyAdmin {
        require(!registered[propertyId], "Property ID already registered");
        require(initialOwner != address(0), "Initial owner cannot be zero address");
        require(area > 0, "Area must be greater than zero");
        require(bytes(propertyNumber).length > 0, "Property number is required");
        require(bytes(location).length > 0, "Location is required");
        require(bytes(propertyType).length > 0, "Property type is required");
        require(bytes(documentHash).length > 0, "Document hash is required");

        Property storage p = properties[propertyId];
        p.propertyId = propertyId;
        p.propertyNumber = propertyNumber;
        p.location = location;
        p.area = area;
        p.propertyType = propertyType;
        p.currentOwner = initialOwner;
        p.previousOwner = address(0);
        p.documentHash = documentHash;
        p.verified = false;
        p.status = PropertyStatus.REGISTERED;
        p.registeredAt = block.timestamp;
        p.lastTransferredAt = 0;

        registered[propertyId] = true;
        _addPropertyToOwner(initialOwner, propertyId);

        emit PropertyRegistered(propertyId, propertyNumber, initialOwner, block.timestamp);
    }

    /**
     * @notice Mark a registered property as verified.
     * @dev In this student prototype the deployer represents the authority/verifier.
     */
    function verifyProperty(uint256 propertyId) external onlyAdmin onlyExistingProperty(propertyId) {
        require(!properties[propertyId].verified, "Property already verified");
        require(properties[propertyId].status != PropertyStatus.DISPUTED, "Disputed property cannot be verified");

        properties[propertyId].verified = true;
        PropertyStatus oldStatus = properties[propertyId].status;
        properties[propertyId].status = PropertyStatus.VERIFIED;

        emit PropertyVerified(propertyId, msg.sender, block.timestamp);
        emit PropertyStatusUpdated(
            propertyId,
            oldStatus,
            PropertyStatus.VERIFIED,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Transfer a verified property directly from the current owner to a new owner.
     */
    function transferOwnership(
        uint256 propertyId,
        address newOwner
    ) external onlyExistingProperty(propertyId) onlyPropertyOwner(propertyId) {
        require(newOwner != address(0), "New owner cannot be zero address");
        require(newOwner != msg.sender, "New owner must differ from current owner");
        require(properties[propertyId].verified, "Property must be verified before transfer");
        require(properties[propertyId].status != PropertyStatus.DISPUTED, "Disputed property cannot transfer");

        address oldOwner = properties[propertyId].currentOwner;
        PropertyStatus oldStatus = properties[propertyId].status;

        _removePropertyFromOwner(oldOwner, propertyId);
        _addPropertyToOwner(newOwner, propertyId);

        properties[propertyId].previousOwner = oldOwner;
        properties[propertyId].currentOwner = newOwner;
        properties[propertyId].lastTransferredAt = block.timestamp;
        properties[propertyId].status = PropertyStatus.TRANSFERRED;

        emit OwnershipTransferred(propertyId, oldOwner, newOwner, block.timestamp);
        emit PropertyStatusUpdated(
            propertyId,
            oldStatus,
            PropertyStatus.TRANSFERRED,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Authority can update a property lifecycle status for administrative purposes.
     * @dev This is intentionally restricted to the authority in the educational prototype.
     */
    function updatePropertyStatus(
        uint256 propertyId,
        PropertyStatus newStatus
    ) external onlyAdmin onlyExistingProperty(propertyId) {
        PropertyStatus oldStatus = properties[propertyId].status;
        properties[propertyId].status = newStatus;

        if (newStatus == PropertyStatus.VERIFIED) {
            properties[propertyId].verified = true;
        }

        emit PropertyStatusUpdated(
            propertyId,
            oldStatus,
            newStatus,
            msg.sender,
            block.timestamp
        );
    }

    function getProperty(uint256 propertyId)
        external
        view
        onlyExistingProperty(propertyId)
        returns (Property memory)
    {
        return properties[propertyId];
    }

    function getPropertiesByOwner(address owner)
        external
        view
        returns (uint256[] memory)
    {
        return ownerPropertyIds[owner];
    }

    function propertyExists(uint256 propertyId) external view returns (bool) {
        return registered[propertyId];
    }

    function getOwnerPropertyCount(address owner) external view returns (uint256) {
        return ownerPropertyIds[owner].length;
    }

    function _addPropertyToOwner(address owner, uint256 propertyId) internal {
        ownerPropertyIndex[owner][propertyId] = ownerPropertyIds[owner].length;
        ownerPropertyIds[owner].push(propertyId);
    }

    function _removePropertyFromOwner(address owner, uint256 propertyId) internal {
        uint256 index = ownerPropertyIndex[owner][propertyId];
        uint256 lastIndex = ownerPropertyIds[owner].length - 1;

        if (index != lastIndex) {
            uint256 lastPropertyId = ownerPropertyIds[owner][lastIndex];
            ownerPropertyIds[owner][index] = lastPropertyId;
            ownerPropertyIndex[owner][lastPropertyId] = index;
        }

        ownerPropertyIds[owner].pop();
        delete ownerPropertyIndex[owner][propertyId];
    }
}
