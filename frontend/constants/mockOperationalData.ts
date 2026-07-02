export interface InvestigationCase {
  caseNumber: string;
  assignedOfficer: string;
  priority: "High" | "Medium" | "Low";
  status: "FIR Registered" | "Investigation Started" | "Evidence Collection" | "Arrest Completed" | "Charge Sheet Filed" | "Court Proceedings" | "Case Closed";
  district: string;
  deadline: string; // YYYY-MM-DD
  category: string;
  durationDays: number;
}

export interface OfficerPerformance {
  name: string;
  assignedCases: number;
  solvedCases: number;
  pendingCases: number;
  rating: number; // 0-5 stars
  efficiency: number; // percentage
  availability: "Available" | "On Leave" | "Suspended" | "On Field";
  workload: number; // percentage
}

export interface StationPerformance {
  name: string;
  completionRate: number; // percentage
  pendingCases: number;
  officerAvailability: number; // active count
  responseTime: number; // mins
  clearanceRate: number; // percentage
}

export interface OperationalAlert {
  id: string;
  severity: "High" | "Medium" | "Low";
  type: "Investigation Delay" | "Officer Overload" | "High Priority Case" | "Missed Deadline" | "Resource Shortage";
  title: string;
  description: string;
  recommendation: string;
  relatedInvestigation: string;
}

export const mockInvestigations: InvestigationCase[] = [
  { caseNumber: "KA-2026-9011", assignedOfficer: "Inspector K. Patil", priority: "High", status: "Evidence Collection", district: "Bengaluru City", deadline: "2026-07-15", category: "Cybercrime", durationDays: 14 },
  { caseNumber: "KA-2026-9012", assignedOfficer: "Inspector R. Nayak", priority: "High", status: "FIR Registered", district: "Mysuru City", deadline: "2026-07-20", category: "Narcotics", durationDays: 2 },
  { caseNumber: "KA-2026-9013", assignedOfficer: "Inspector S. Kumar", priority: "Medium", status: "Investigation Started", district: "Hubballi-Dharwad", deadline: "2026-07-28", category: "Assault & Violence", durationDays: 5 },
  { caseNumber: "KA-2026-9014", assignedOfficer: "Detective M. Hegde", priority: "High", status: "Arrest Completed", district: "Belagavi City", deadline: "2026-07-10", category: "Homicide", durationDays: 25 },
  { caseNumber: "KA-2026-9015", assignedOfficer: "Detective A. Gowda", priority: "Low", status: "Charge Sheet Filed", district: "Mangaluru City", deadline: "2026-07-08", category: "Theft & Burglary", durationDays: 18 },
  { caseNumber: "KA-2026-9016", assignedOfficer: "Detective V. Rao", priority: "Medium", status: "Court Proceedings", district: "Kalaburagi", deadline: "2026-08-02", category: "Financial Fraud", durationDays: 32 },
  { caseNumber: "KA-2026-9017", assignedOfficer: "Inspector K. Patil", priority: "Low", status: "Case Closed", district: "Bengaluru City", deadline: "2026-06-30", category: "Cybercrime", durationDays: 45 },
  { caseNumber: "KA-2026-9018", assignedOfficer: "Inspector R. Nayak", priority: "High", status: "Evidence Collection", district: "Mysuru City", deadline: "2026-07-12", category: "Narcotics", durationDays: 10 },
  { caseNumber: "KA-2026-9019", assignedOfficer: "Inspector S. Kumar", priority: "Low", status: "Case Closed", district: "Hubballi-Dharwad", deadline: "2026-06-25", category: "Theft & Burglary", durationDays: 15 },
  { caseNumber: "KA-2026-9020", assignedOfficer: "Detective M. Hegde", priority: "Medium", status: "Investigation Started", district: "Belagavi City", deadline: "2026-07-25", category: "Assault & Violence", durationDays: 6 },
];

export const mockOfficersPerformance: OfficerPerformance[] = [
  { name: "Inspector K. Patil", assignedCases: 12, solvedCases: 8, pendingCases: 4, rating: 4.8, efficiency: 92, availability: "Available", workload: 85 },
  { name: "Inspector R. Nayak", assignedCases: 15, solvedCases: 10, pendingCases: 5, rating: 4.5, efficiency: 88, availability: "On Field", workload: 90 },
  { name: "Inspector S. Kumar", assignedCases: 8, solvedCases: 6, pendingCases: 2, rating: 4.2, efficiency: 82, availability: "Available", workload: 50 },
  { name: "Detective M. Hegde", assignedCases: 10, solvedCases: 7, pendingCases: 3, rating: 4.7, efficiency: 90, availability: "On Field", workload: 75 },
  { name: "Detective A. Gowda", assignedCases: 6, solvedCases: 4, pendingCases: 2, rating: 4.0, efficiency: 78, availability: "On Leave", workload: 40 },
  { name: "Detective V. Rao", assignedCases: 9, solvedCases: 5, pendingCases: 4, rating: 4.1, efficiency: 80, availability: "Available", workload: 65 },
];

export const mockStationsPerformance: StationPerformance[] = [
  { name: "Koramangala PS", completionRate: 88, pendingCases: 22, officerAvailability: 12, responseTime: 8, clearanceRate: 85 },
  { name: "Indiranagar PS", completionRate: 75, pendingCases: 18, officerAvailability: 10, responseTime: 12, clearanceRate: 72 },
  { name: "Whitefield PS", completionRate: 82, pendingCases: 15, officerAvailability: 8, responseTime: 10, clearanceRate: 80 },
  { name: "Devaraja PS", completionRate: 90, pendingCases: 9, officerAvailability: 6, responseTime: 6, clearanceRate: 88 },
  { name: "Lashkar PS", completionRate: 78, pendingCases: 12, officerAvailability: 5, responseTime: 9, clearanceRate: 75 },
  { name: "Hubballi Town PS", completionRate: 80, pendingCases: 18, officerAvailability: 9, responseTime: 11, clearanceRate: 78 },
];

export const mockOperationalAlerts: OperationalAlert[] = [
  {
    id: "OPAL-01",
    severity: "High",
    type: "Investigation Delay",
    title: "Critical Evidence Collection Delay",
    description: "Homicide case KA-2026-9014 has spent 12 days in Evidence Collection without active progress logs.",
    recommendation: "Direct Detective Hegde to log forensic audits immediately or assign auxiliary team.",
    relatedInvestigation: "KA-2026-9014",
  },
  {
    id: "OPAL-02",
    severity: "High",
    type: "Officer Overload",
    title: "Officer Overload Warning",
    description: "Inspector R. Nayak's caseload is at 90% utilization (15 active files, 5 pending investigations).",
    recommendation: "Reassign incoming narcotics files to Inspector S. Kumar (50% utilization).",
    relatedInvestigation: "Multiple Cases",
  },
  {
    id: "OPAL-03",
    severity: "Medium",
    type: "Missed Deadline",
    title: "Imminent Deadline Breach",
    description: "Theft file KA-2026-9015 is approaching charge sheet submission deadline (July 8, 2026).",
    recommendation: "Alert Detective Gowda for immediate filing compliance check.",
    relatedInvestigation: "KA-2026-9015",
  },
  {
    id: "OPAL-04",
    severity: "Medium",
    type: "Resource Shortage",
    title: "Patrol Vehicle Deficit",
    description: "Whitefield PS active patrol vehicle utilization stands at 95% (Resource capacity limits exceeded).",
    recommendation: "Deploy 2 additional tactical vehicles from district reserve logistics.",
    relatedInvestigation: "Whitefield Precinct",
  },
];

export const mockResourceAllocation = {
  officersTotal: 142,
  officersActive: 110,
  vehiclesTotal: 35,
  vehiclesActive: 28,
  investigationCapacity: 85, // percentage
  districtCapacity: {
    "Bengaluru City": 88,
    "Mysuru City": 76,
    "Hubballi-Dharwad": 62,
    "Belagavi City": 50,
  },
  stationCapacity: {
    "Koramangala PS": 82,
    "Indiranagar PS": 75,
    "Whitefield PS": 90,
  },
};

export const mockRecommendedActions = [
  { id: "MOP-1", title: "Reassign Narcotics Case 9018", description: "Inspector Nayak is overloaded. Move case to Inspector Kumar to accelerate evidence logs.", action: "Reassign Case" },
  { id: "MOP-2", title: "Prioritize Phishing Investigation 9011", description: "KA-2026-9011 contains high-risk priority alerts. Push to Evidence Collection review.", action: "Prioritize Case" },
  { id: "MOP-3", title: "Review Homicide Timeline 9014", description: "Homicide case is delayed. Open timeline console to inspect bottlenecks.", action: "Inspect Timeline" },
  { id: "MOP-4", title: "Allocate Auxiliary Patrol Officers", description: "Whitefield PS experiences officer utilization overloads. Dispatch 3 reserve guards.", action: "Deploy Manpower" },
];
