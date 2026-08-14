export const dummyDesignations = [
  { _id: "d1", title: "Professor", rate: 800 },
  { _id: "d2", title: "Associate Professor", rate: 600 },
  { _id: "d3", title: "Assistant Professor", rate: 400 },
  { _id: "d4", title: "Lecturer", rate: 300 },
];

export const dummyExaminers = [
  { _id: "e1", name: "Dr. Ramesh Patel", designation: { _id: "d1", title: "Professor", rate: 800 } },
  { _id: "e2", name: "Priya Shah", designation: { _id: "d3", title: "Assistant Professor", rate: 400 } },
  { _id: "e3", name: "Amit Mehta", designation: { _id: "d2", title: "Associate Professor", rate: 600 } },
];

export const dummyTheoryEntries = [
  { _id: "t1", examinerId: "e1", totalRemuneration: 4000 },
  { _id: "t2", examinerId: "e2", totalRemuneration: 1600 },
];

export const dummyPracticalEntries = [
  { _id: "p1", examinerId: "e1", total: 3200 },
  { _id: "p2", examinerId: "e3", total: 2400 },
];

export const dummyBankDetails = [];

export const dummySummaryData = [
  {
    _id: "b1",
    examinerName: "Dr. Ramesh Patel",
    accountNumber: "123456789012",
    ifscCode: "SBIN0001234",
    bankName: "State Bank of India",
    amount: 7200,
  },
  {
    _id: "b2",
    examinerName: "Priya Shah",
    accountNumber: "987654321098",
    ifscCode: "HDFC0005678",
    bankName: "HDFC Bank",
    amount: 1600,
  },
  {
    _id: "b3",
    examinerName: "Amit Mehta",
    accountNumber: "456789123456",
    ifscCode: "ICIC0009876",
    bankName: "ICICI Bank",
    amount: 2400,
  },
];