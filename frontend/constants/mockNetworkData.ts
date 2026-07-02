export interface GraphNode {
  id: string;
  label: string;
  type:
    | "Suspect"
    | "Victim"
    | "Case"
    | "Police Station"
    | "District"
    | "Crime Scene"
    | "Vehicle"
    | "Weapon"
    | "Mobile Number"
    | "Gang"
    | "Investigation Officer";
  riskScore: number; // 0-100
  metadata: {
    status?: string;
    details?: string;
    repeatOffender?: boolean;
    organizedCrime?: boolean;
    crossDistrict?: boolean;
    highRisk?: boolean;
    investigationPriority?: boolean;
    knownAssociations?: string[];
    history?: { date: string; event: string }[];
    cases?: { firNumber: string; category: string; status: string; officer: string; district: string }[];
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type:
    | "Involved In"
    | "Reported By"
    | "Investigated By"
    | "Arrested In"
    | "Associated With"
    | "Same Vehicle"
    | "Same Weapon"
    | "Same Location"
    | "Same Gang"
    | "Same Mobile Number";
}

export interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
}

export const mockOverviewStats = {
  totalCriminals: 48,
  repeatOffenders: 18,
  activeNetworks: 6,
  connectedCases: 32,
  organizedGroups: 4,
  crossDistrictLinks: 12,
};

export const mockNetworkNodes: GraphNode[] = [
  // 1. Suspects
  {
    id: "S-101",
    label: "John 'Snake' Doe",
    type: "Suspect",
    riskScore: 92,
    metadata: {
      status: "Active Search",
      details: "Prime suspect in multiple phishing scams and local drug distribution.",
      repeatOffender: true,
      organizedCrime: true,
      crossDistrict: true,
      highRisk: true,
      investigationPriority: true,
      knownAssociations: ["Sarah Connor (Victim)", "Ramon Gang", "Swift Fortuner (Vehicle)", "KA-01-Mobile"],
      history: [
        { date: "2026-06-28", event: "Identified in phishing corridor coordinate reports" },
        { date: "2026-05-15", event: "Arrested for illegal drug possession at Koramangala" },
        { date: "2025-11-04", event: "Case filed for financial card duplicate fraud" },
      ],
      cases: [
        { firNumber: "KA-2026-2501", category: "Cybercrime", status: "Under Investigation", officer: "Inspector K. Patil", district: "Bengaluru City" },
        { firNumber: "KA-2026-2580", category: "Narcotics", status: "Awaiting Trial", officer: "Inspector K. Patil", district: "Bengaluru City" },
      ],
    },
  },
  {
    id: "S-102",
    label: "Akram 'Tech' Khan",
    type: "Suspect",
    riskScore: 78,
    metadata: {
      status: "Under Surveillance",
      details: "Facilitator for financial cloning scripts and bank phishing domains.",
      repeatOffender: true,
      organizedCrime: true,
      crossDistrict: false,
      highRisk: false,
      investigationPriority: true,
      knownAssociations: ["John 'Snake' Doe", "KA-02-Mobile"],
      history: [
        { date: "2026-06-25", event: "Triggered alert for bank portal cloning scripts" },
        { date: "2026-03-10", event: "Questioned regarding credit card leaks" },
      ],
      cases: [
        { firNumber: "KA-2026-2501", category: "Cybercrime", status: "Under Investigation", officer: "Inspector K. Patil", district: "Bengaluru City" },
      ],
    },
  },
  {
    id: "S-103",
    label: "Raju 'Viper' Kumar",
    type: "Suspect",
    riskScore: 85,
    metadata: {
      status: "In Custody",
      details: "Enforcer for Ramon Gang. History of armed brawls.",
      repeatOffender: true,
      organizedCrime: true,
      crossDistrict: true,
      highRisk: true,
      investigationPriority: false,
      knownAssociations: ["Ramon Gang", "Colt .45 (Weapon)", "Lashkar Scene"],
      history: [
        { date: "2026-06-20", event: "Arrested at highway border during narcotics search" },
        { date: "2025-08-12", event: "Booked for physical assault in Devaraja sector" },
      ],
      cases: [
        { firNumber: "KA-2026-2510", category: "Assault & Violence", status: "Closed", officer: "Inspector R. Nayak", district: "Mysuru City" },
        { firNumber: "KA-2026-2521", category: "Narcotics", status: "Charge Sheet Filed", officer: "Inspector R. Nayak", district: "Mysuru City" },
      ],
    },
  },

  // 2. Cases
  {
    id: "C-2501",
    label: "KA-2026-2501 (Phishing Scam)",
    type: "Case",
    riskScore: 75,
    metadata: {
      status: "Under Investigation",
      details: "Phishing ring targeting senior citizen pensions in Koramangala.",
      cases: [{ firNumber: "KA-2026-2501", category: "Cybercrime", status: "Under Investigation", officer: "Inspector K. Patil", district: "Bengaluru City" }],
    },
  },
  {
    id: "C-2521",
    label: "KA-2026-2521 (Drug Ring)",
    type: "Case",
    riskScore: 90,
    metadata: {
      status: "Charge Sheet Filed",
      details: "Narcotics distribution hub linked to corridor logistics.",
      cases: [{ firNumber: "KA-2026-2521", category: "Narcotics", status: "Charge Sheet Filed", officer: "Inspector R. Nayak", district: "Mysuru City" }],
    },
  },

  // 3. Victims
  { id: "V-301", label: "Sarah Connor", type: "Victim", riskScore: 10, metadata: { status: "Protected Witness", details: "Complainant in Koramangala Phishing Scam." } },
  { id: "V-302", label: "Devi Gowda", type: "Victim", riskScore: 15, metadata: { status: "Protected Witness", details: "Witness in Ramon Gang drug distribution case." } },

  // 4. Gangs
  { id: "G-401", label: "Ramon Gang", type: "Gang", riskScore: 95, metadata: { status: "Monitored", details: "Organized cartel active in illegal transport and extortion.", organizedCrime: true } },

  // 5. Vehicles
  { id: "VH-501", label: "Swift Fortuner (KA-04-M-9922)", type: "Vehicle", riskScore: 70, metadata: { status: "Impounded", details: "Black Toyota Fortuner used in drug hauling corridor." } },

  // 6. Weapons
  { id: "W-601", label: "Colt .45 Pistol", type: "Weapon", riskScore: 80, metadata: { status: "Recovered", details: "Semiautomatic pistol linked to extortion scenes." } },

  // 7. Mobile Numbers
  { id: "M-701", label: "+91 98450 11223 (KA-01-Mobile)", type: "Mobile Number", riskScore: 82, metadata: { status: "Active Tap", details: "IMSI coordinates matched John Doe's burner device." } },
  { id: "M-702", label: "+91 98860 44556 (KA-02-Mobile)", type: "Mobile Number", riskScore: 68, metadata: { status: "Active Tap", details: "Contacted John Doe multiple times during fraud hour." } },

  // 8. Locations / Crime Scenes
  { id: "L-801", label: "Koramangala Sector 4", type: "Crime Scene", riskScore: 60, metadata: { status: "Patrolled", details: "Primary site of phishing domain setups." } },
  { id: "L-802", label: "Lashkar Road Border", type: "Crime Scene", riskScore: 75, metadata: { status: "Border Checkpoint", details: "Site of drug corridor vehicle impound." } },

  // 9. Officers
  { id: "O-901", label: "Inspector K. Patil", type: "Investigation Officer", riskScore: 5, metadata: { status: "Active Duty", details: "Cyber unit case manager." } },
  { id: "O-902", label: "Inspector R. Nayak", type: "Investigation Officer", riskScore: 5, metadata: { status: "Active Duty", details: "Narcotics cell manager." } },

  // 10. Districts & Police Stations
  { id: "D-1", label: "Bengaluru City", type: "District", riskScore: 70, metadata: { status: "Active HQ", details: "State capital command." } },
  { id: "P-1", label: "Koramangala PS", type: "Police Station", riskScore: 65, metadata: { status: "Active Station", details: "Command sector 4." } },
];

export const mockNetworkEdges: GraphEdge[] = [
  // John Doe Links
  { id: "E-1", source: "S-101", target: "C-2501", type: "Involved In" },
  { id: "E-2", source: "S-101", target: "C-2521", type: "Involved In" },
  { id: "E-3", source: "S-101", target: "G-401", type: "Associated With" },
  { id: "E-4", source: "S-101", target: "VH-501", type: "Same Vehicle" },
  { id: "E-5", source: "S-101", target: "M-701", type: "Same Mobile Number" },
  { id: "E-6", source: "S-101", target: "L-801", type: "Same Location" },

  // Akram Khan Links
  { id: "E-7", source: "S-102", target: "C-2501", type: "Involved In" },
  { id: "E-8", source: "S-102", target: "S-101", type: "Associated With" },
  { id: "E-9", source: "S-102", target: "M-702", type: "Same Mobile Number" },
  { id: "E-10", source: "M-702", target: "M-701", type: "Associated With" }, // mobile calls link

  // Raju Kumar Links
  { id: "E-11", source: "S-103", target: "C-2521", type: "Involved In" },
  { id: "E-12", source: "S-103", target: "G-401", type: "Same Gang" },
  { id: "E-13", source: "S-103", target: "W-601", type: "Same Weapon" },
  { id: "E-14", source: "S-103", target: "L-802", type: "Same Location" },

  // Case/Victim/Officer Links
  { id: "E-15", source: "V-301", target: "C-2501", type: "Reported By" },
  { id: "E-16", source: "V-302", target: "C-2521", type: "Reported By" },
  { id: "E-17", source: "O-901", target: "C-2501", type: "Investigated By" },
  { id: "E-18", source: "O-902", target: "C-2521", type: "Investigated By" },

  // Vehicle/Weapon scene links
  { id: "E-19", source: "VH-501", target: "L-802", type: "Same Location" },
  { id: "E-20", source: "W-601", target: "L-802", type: "Same Location" },

  // Station and district anchors
  { id: "E-21", source: "P-1", target: "D-1", type: "Arrested In" },
  { id: "E-22", source: "C-2501", target: "P-1", type: "Arrested In" },
];

export const mockRecommendations: RecommendationCard[] = [
  {
    id: "REC-1",
    title: "Review Linked Phishing Cases",
    description: "Compare suspect Akram Khan's domain scripts with open fraud registries in Mysuru and Kalaburagi.",
    actionLabel: "Compare FIR Patterns",
  },
  {
    id: "REC-2",
    title: "Investigate Shared Vehicle Log",
    description: "Audit GPS and highway toll logs for Fortuner (KA-04-M-9922) to discover other co-conspirator locations.",
    actionLabel: "Review Vehicle Coordinates",
  },
  {
    id: "REC-3",
    title: "Monitor Associated Phone Network",
    description: "Run relationship node link traces on contacts dialing KA-01-Mobile burner during midnight hours.",
    actionLabel: "Trace Burner Calls",
  },
  {
    id: "REC-4",
    title: "Escalate Extortion Case Link",
    description: "High priority risk index: Ramon Gang links John Doe and Raju Kumar to the weapon Colt .45. Escalate to state command.",
    actionLabel: "Escalate Directive",
  },
];
