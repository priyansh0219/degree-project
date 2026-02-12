// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DegreeVerification {
    // Main admin who can register universities
    address public mainAdmin;
    
    // Counter for unique degree IDs
    uint256 private degreeIdCounter;
    
    // Counter for total degrees issued
    uint256 private totalDegreesCount;
    
    // Struct to store university information
    struct University {
        string name;
        address admin;
        bool isRegistered;
    }
    
    // Struct to store degree information
    struct Degree {
        uint256 degreeId;
        string studentName;
        string studentId;
        string degreeName;
        string universityName;
        address universityAdmin;
        uint256 issueDate;
        bool exists;
    }
    
    // Mapping: University admin address -> University data
    mapping(address => University) public universities;
    
    // Mapping: Degree ID -> Degree data
    mapping(uint256 => Degree) public degrees;
    
    // Mapping: Student ID -> Array of Degree IDs
    mapping(string => uint256[]) private studentDegrees;
    
    // Mapping: Student Name (lowercase) -> Array of Degree IDs for searching
    mapping(string => uint256[]) private studentNameToDegrees;
    
    // Events for logging and tracking
    event UniversityRegistered(address indexed universityAdmin, string universityName);
    event UniversityRemoved(address indexed universityAdmin, string universityName);
    event DegreeIssued(
        uint256 indexed degreeId,
        string indexed studentId,
        string studentName,
        string degreeName,
        string universityName,
        uint256 issueDate
    );
    event DegreeRevoked(uint256 indexed degreeId, string studentId);
    
    // Modifier for main admin only
    modifier onlyMainAdmin() {
        require(msg.sender == mainAdmin, "Only main admin can perform this action");
        _;
    }
    
    // Modifier for registered university admins only
    modifier onlyUniversityAdmin() {
        require(universities[msg.sender].isRegistered, "Only registered university admin can perform this action");
        _;
    }
    
    // Constructor sets the contract deployer as main admin
    constructor() {
        mainAdmin = msg.sender;
        degreeIdCounter = 0;
        totalDegreesCount = 0;
    }
    
    /**
     * @dev Register a new university
     * @param universityAdmin Address of the university admin
     * @param universityName Name of the university
     */
    function registerUniversity(address universityAdmin, string memory universityName) public onlyMainAdmin {
        require(universityAdmin != address(0), "Invalid admin address");
        require(bytes(universityName).length > 0, "University name cannot be empty");
        require(!universities[universityAdmin].isRegistered, "University already registered");
        
        universities[universityAdmin] = University({
            name: universityName,
            admin: universityAdmin,
            isRegistered: true
        });
        
        emit UniversityRegistered(universityAdmin, universityName);
    }
    
    /**
     * @dev Remove a university
     * @param universityAdmin Address of the university admin to remove
     */
    function removeUniversity(address universityAdmin) public onlyMainAdmin {
        require(universities[universityAdmin].isRegistered, "University not registered");
        
        string memory universityName = universities[universityAdmin].name;
        delete universities[universityAdmin];
        
        emit UniversityRemoved(universityAdmin, universityName);
    }
    
    /**
     * @dev Issue Degree: Accepts degree details and stores on blockchain
     * @param studentId Unique identifier for the student
     * @param studentName Full name of the student
     * @param degreeName Name of the degree/program
     */
    function issueDegree(
        string memory studentId,
        string memory studentName,
        string memory degreeName
    ) public onlyUniversityAdmin returns (uint256) {
        // Input validation
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        require(bytes(studentName).length > 0, "Student name cannot be empty");
        require(bytes(degreeName).length > 0, "Degree name cannot be empty");
        
        // Get university info
        University memory university = universities[msg.sender];
        
        // Generate unique degree ID
        degreeIdCounter++;
        uint256 newDegreeId = degreeIdCounter;
        
        // Store degree data
        degrees[newDegreeId] = Degree({
            degreeId: newDegreeId,
            studentName: studentName,
            studentId: studentId,
            degreeName: degreeName,
            universityName: university.name,
            universityAdmin: msg.sender,
            issueDate: block.timestamp,
            exists: true
        });
        
        // Add degree ID to student's degree list
        studentDegrees[studentId].push(newDegreeId);
        
        // Add degree ID to student name mapping (lowercase for case-insensitive search)
        string memory studentNameLower = toLower(studentName);
        studentNameToDegrees[studentNameLower].push(newDegreeId);
        
        // Increment total degrees count
        totalDegreesCount++;
        
        // Emit event for logging
        emit DegreeIssued(newDegreeId, studentId, studentName, degreeName, university.name, block.timestamp);
        
        return newDegreeId;
    }
    
    /**
     * @dev Get Degree by Degree ID
     * @param degreeId The unique degree identifier
     * @return studentName Name of the student
     * @return studentId ID of the student
     * @return degreeName Name of the degree
     * @return universityName Name of the university
     * @return issueDate Timestamp when degree was issued
     * @return exists Whether the degree exists
     */
    function getDegreeById(uint256 degreeId) public view returns (
        string memory studentName,
        string memory studentId,
        string memory degreeName,
        string memory universityName,
        uint256 issueDate,
        bool exists
    ) {
        Degree memory degree = degrees[degreeId];
        return (
            degree.studentName,
            degree.studentId,
            degree.degreeName,
            degree.universityName,
            degree.issueDate,
            degree.exists
        );
    }
    
    /**
     * @dev Get all degree IDs for a student
     * @param studentId The student's unique identifier
     * @return uint256[] Array of degree IDs
     */
    function getStudentDegreeIds(string memory studentId) public view returns (uint256[] memory) {
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        return studentDegrees[studentId];
    }
    
    /**
     * @dev Get all degrees for a student
     * @param studentId The student's unique identifier
     * @return degreeIds Array of degree IDs
     * @return degreeNames Array of degree names
     * @return universityNames Array of university names
     * @return issueDates Array of issue dates
     */
    function getStudentDegrees(string memory studentId) public view returns (
        uint256[] memory degreeIds,
        string[] memory degreeNames,
        string[] memory universityNames,
        uint256[] memory issueDates
    ) {
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        
        uint256[] memory ids = studentDegrees[studentId];
        uint256 count = ids.length;
        
        degreeIds = new uint256[](count);
        degreeNames = new string[](count);
        universityNames = new string[](count);
        issueDates = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Degree memory degree = degrees[ids[i]];
            if (degree.exists) {
                degreeIds[i] = degree.degreeId;
                degreeNames[i] = degree.degreeName;
                universityNames[i] = degree.universityName;
                issueDates[i] = degree.issueDate;
            }
        }
        
        return (degreeIds, degreeNames, universityNames, issueDates);
    }
    
    /**
     * @dev Verify if a specific degree exists
     * @param degreeId The degree's unique identifier
     * @return bool True if degree exists, false otherwise
     */
    function verifyDegree(uint256 degreeId) public view returns (bool) {
        return degrees[degreeId].exists;
    }
    
    /**
     * @dev Verify if a student has any degrees
     * @param studentId The student's unique identifier
     * @return bool True if student has at least one valid degree
     */
    function verifyStudentHasDegrees(string memory studentId) public view returns (bool) {
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        
        uint256[] memory ids = studentDegrees[studentId];
        for (uint256 i = 0; i < ids.length; i++) {
            if (degrees[ids[i]].exists) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get Total Degrees: Returns count of all issued degrees
     * @return uint256 Total number of degrees issued
     */
    function getTotalDegrees() public view returns (uint256) {
        return totalDegreesCount;
    }
    
    /**
     * @dev Revoke a degree (only by the university that issued it)
     * @param degreeId The degree's unique identifier
     */
    function revokeDegree(uint256 degreeId) public onlyUniversityAdmin {
        require(degrees[degreeId].exists, "Degree does not exist");
        require(degrees[degreeId].universityAdmin == msg.sender, "Only the issuing university can revoke this degree");
        
        string memory studentId = degrees[degreeId].studentId;
        
        // Mark degree as non-existent
        degrees[degreeId].exists = false;
        totalDegreesCount--;
        
        emit DegreeRevoked(degreeId, studentId);
    }
    
    /**
     * @dev Transfer main admin rights to a new address
     * @param newAdmin Address of the new main admin
     */
    function transferMainAdmin(address newAdmin) public onlyMainAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        mainAdmin = newAdmin;
    }
    
    /**
     * @dev Check if an address is a registered university
     * @param universityAdmin Address to check
     * @return bool True if registered, false otherwise
     */
    function isUniversityRegistered(address universityAdmin) public view returns (bool) {
        return universities[universityAdmin].isRegistered;
    }
    
    /**
     * @dev Get university information
     * @param universityAdmin Address of the university admin
     * @return name Name of the university
     * @return isRegistered Registration status
     */
    function getUniversityInfo(address universityAdmin) public view returns (
        string memory name,
        bool isRegistered
    ) {
        University memory university = universities[universityAdmin];
        return (university.name, university.isRegistered);
    }
    
    /**
     * @dev Search degrees by student name (case-insensitive)
     * @param studentName The student's name to search for
     * @return degreeIds Array of degree IDs
     * @return studentIds Array of student IDs
     * @return degreeNames Array of degree names
     * @return universityNames Array of university names
     * @return issueDates Array of issue dates
     */
    function searchDegreesByStudentName(string memory studentName) public view returns (
        uint256[] memory degreeIds,
        string[] memory studentIds,
        string[] memory degreeNames,
        string[] memory universityNames,
        uint256[] memory issueDates
    ) {
        require(bytes(studentName).length > 0, "Student name cannot be empty");
        
        string memory nameLower = toLower(studentName);
        uint256[] memory ids = studentNameToDegrees[nameLower];
        uint256 count = ids.length;
        
        degreeIds = new uint256[](count);
        studentIds = new string[](count);
        degreeNames = new string[](count);
        universityNames = new string[](count);
        issueDates = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Degree memory degree = degrees[ids[i]];
            if (degree.exists) {
                degreeIds[i] = degree.degreeId;
                studentIds[i] = degree.studentId;
                degreeNames[i] = degree.degreeName;
                universityNames[i] = degree.universityName;
                issueDates[i] = degree.issueDate;
            }
        }
        
        return (degreeIds, studentIds, degreeNames, universityNames, issueDates);
    }
    
    /**
     * @dev Get formatted degree certificate data (for PDF generation off-chain)
     * @param degreeId The degree's unique identifier
     * @return degreeId_ Degree ID
     * @return studentName Full name of the student
     * @return studentId Student ID
     * @return degreeName Degree name/program
     * @return universityName University name
     * @return issueDate Timestamp of issuance
     * @return isValid Whether the degree is valid
     * @return universityAdmin Address of the university admin (for verification)
     */
    function getDegreeCertificateData(uint256 degreeId) public view returns (
        uint256 degreeId_,
        string memory studentName,
        string memory studentId,
        string memory degreeName,
        string memory universityName,
        uint256 issueDate,
        bool isValid,
        address universityAdmin
    ) {
        require(degrees[degreeId].exists || degreeId <= degreeIdCounter, "Degree ID does not exist");
        
        Degree memory degree = degrees[degreeId];
        
        return (
            degree.degreeId,
            degree.studentName,
            degree.studentId,
            degree.degreeName,
            degree.universityName,
            degree.issueDate,
            degree.exists,
            degree.universityAdmin
        );
    }
    
    /**
     * @dev Helper function to convert string to lowercase
     * @param str Input string
     * @return string Lowercase version of input
     */
    function toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        
        for (uint256 i = 0; i < bStr.length; i++) {
            // Convert uppercase A-Z to lowercase a-z
            if (uint8(bStr[i]) >= 65 && uint8(bStr[i]) <= 90) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        
        return string(bLower);
    }
    
    /**
     * @dev Check if caller is the main admin
     * @return bool True if caller is main admin
     */
    function isMainAdmin() public view returns (bool) {
        return msg.sender == mainAdmin;
    }
    
    /**
     * @dev Get the main admin address
     * @return address Main admin address
     */
    function getMainAdmin() public view returns (address) {
        return mainAdmin;
    }
}
