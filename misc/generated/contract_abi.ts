const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "studentId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "degreeName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "universityName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
    ],
    name: "DegreeIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "studentId",
        type: "string",
      },
    ],
    name: "DegreeRevoked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "degreeName",
        type: "string",
      },
    ],
    name: "issueDegree",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
      {
        internalType: "string",
        name: "universityName",
        type: "string",
      },
    ],
    name: "registerUniversity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
    ],
    name: "removeUniversity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
    ],
    name: "revokeDegree",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "transferMainAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "universityName",
        type: "string",
      },
    ],
    name: "UniversityRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "universityName",
        type: "string",
      },
    ],
    name: "UniversityRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "degrees",
    outputs: [
      {
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
      {
        internalType: "string",
        name: "degreeName",
        type: "string",
      },
      {
        internalType: "string",
        name: "universityName",
        type: "string",
      },
      {
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
    ],
    name: "getDegreeById",
    outputs: [
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
      {
        internalType: "string",
        name: "degreeName",
        type: "string",
      },
      {
        internalType: "string",
        name: "universityName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
    ],
    name: "getDegreeCertificateData",
    outputs: [
      {
        internalType: "uint256",
        name: "degreeId_",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
      {
        internalType: "string",
        name: "degreeName",
        type: "string",
      },
      {
        internalType: "string",
        name: "universityName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
      {
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMainAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
    ],
    name: "getStudentDegreeIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
    ],
    name: "getStudentDegrees",
    outputs: [
      {
        internalType: "uint256[]",
        name: "degreeIds",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "degreeNames",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "universityNames",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "issueDates",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalDegrees",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
    ],
    name: "getUniversityInfo",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isMainAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "universityAdmin",
        type: "address",
      },
    ],
    name: "isUniversityRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mainAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "studentName",
        type: "string",
      },
    ],
    name: "searchDegreesByStudentName",
    outputs: [
      {
        internalType: "uint256[]",
        name: "degreeIds",
        type: "uint256[]",
      },
      {
        internalType: "string[]",
        name: "studentIds",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "degreeNames",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "universityNames",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "issueDates",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "universities",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "degreeId",
        type: "uint256",
      },
    ],
    name: "verifyDegree",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
    ],
    name: "verifyStudentHasDegrees",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default contractABI;
