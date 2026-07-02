export interface FIRRecord {
  id: string;
  firNumber: string;
  date: string; // YYYY-MM-DD
  district: string;
  policeStation: string;
  category: string;
  status: "Under Investigation" | "Charge Sheet Filed" | "Awaiting Trial" | "Closed";
  riskLevel: "High" | "Medium" | "Low";
  repeatOffender: boolean;
  alertSeverity: "High" | "Medium" | "None";
}

export interface AIAlert {
  id: string;
  severity: "High" | "Medium";
  confidence: number; // 0-100
  title: string;
  explanation: string;
  suggestedAction: string;
  date: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // HH:MM or date
  type: "FIR" | "Investigation" | "Chargesheet" | "Alert";
  description: string;
}

export const districts = [
  "Bengaluru City",
  "Mysuru City",
  "Hubballi-Dharwad",
  "Belagavi City",
  "Mangaluru City",
  "Kalaburagi",
  "Shivamogga",
];

export const policeStationsMap: Record<string, string[]> = {
  "Bengaluru City": ["Koramangala PS", "Indiranagar PS", "Whitefield PS", "Jayanagar PS"],
  "Mysuru City": ["Devaraja PS", "Lashkar PS", "Vidyaranyapuram PS"],
  "Hubballi-Dharwad": ["Hubballi Town PS", "Dharwad Suburban PS"],
  "Belagavi City": ["Belagavi Town PS", "Khade Bazar PS"],
  "Mangaluru City": ["Kadri PS", "Pandeshwar PS"],
  Kalaburagi: ["Kalaburagi Town PS", "Chowk PS"],
  Shivamogga: ["Shivamogga Town PS", "Doddapete PS"],
};

export const crimeCategories = [
  "Theft & Burglary",
  "Cybercrime",
  "Assault & Violence",
  "Narcotics",
  "Financial Fraud",
  "Homicide",
];

// Generates 150 realistic consistent records
const generateMockFIRs = (): FIRRecord[] => {
  const records: FIRRecord[] = [];
  const startYear = 2026;
  
  // Static seed data to maintain strict internal consistency
  const dataSeed = [
    { district: "Bengaluru City", station: "Koramangala PS", cat: "Cybercrime", status: "Under Investigation", risk: "High", offender: true, alert: "High", date: "2026-06-28" },
    { district: "Bengaluru City", station: "Indiranagar PS", cat: "Theft & Burglary", status: "Closed", risk: "Low", offender: false, alert: "None", date: "2026-06-25" },
    { district: "Bengaluru City", station: "Whitefield PS", cat: "Financial Fraud", status: "Charge Sheet Filed", risk: "Medium", offender: false, alert: "None", date: "2026-06-27" },
    { district: "Bengaluru City", station: "Jayanagar PS", cat: "Assault & Violence", status: "Awaiting Trial", risk: "Medium", offender: true, alert: "Medium", date: "2026-06-29" },
    { district: "Mysuru City", station: "Devaraja PS", cat: "Theft & Burglary", status: "Under Investigation", risk: "Low", offender: false, alert: "None", date: "2026-06-15" },
    { district: "Mysuru City", station: "Lashkar PS", cat: "Narcotics", status: "Under Investigation", risk: "High", offender: true, alert: "High", date: "2026-06-28" },
    { district: "Hubballi-Dharwad", station: "Hubballi Town PS", cat: "Homicide", status: "Charge Sheet Filed", risk: "High", offender: true, alert: "High", date: "2026-06-20" },
    { district: "Hubballi-Dharwad", station: "Dharwad Suburban PS", cat: "Theft & Burglary", status: "Closed", risk: "Low", offender: false, alert: "None", date: "2026-06-22" },
    { district: "Belagavi City", station: "Belagavi Town PS", cat: "Assault & Violence", status: "Under Investigation", risk: "Medium", offender: false, alert: "None", date: "2026-06-26" },
    { district: "Mangaluru City", station: "Kadri PS", cat: "Cybercrime", status: "Awaiting Trial", risk: "Medium", offender: false, alert: "Medium", date: "2026-06-27" },
    { district: "Kalaburagi", station: "Kalaburagi Town PS", cat: "Narcotics", status: "Charge Sheet Filed", risk: "High", offender: true, alert: "Medium", date: "2026-06-24" },
    { district: "Shivamogga", station: "Shivamogga Town PS", cat: "Theft & Burglary", status: "Under Investigation", risk: "Low", offender: false, alert: "None", date: "2026-06-21" },
  ];

  // Populate first 12 records
  dataSeed.forEach((d, i) => {
    records.push({
      id: `FIR-2026-${1000 + i}`,
      firNumber: `KA-2026-${2500 + i}`,
      date: d.date,
      district: d.district,
      policeStation: d.station,
      category: d.cat,
      status: d.status as any,
      riskLevel: d.risk as any,
      repeatOffender: d.offender,
      alertSeverity: d.alert as any,
    });
  });

  // Generatively pad the rest with deterministic mapping to ensure static consistency
  for (let i = 12; i < 150; i++) {
    const distIndex = i % districts.length;
    const district = districts[distIndex];
    const stations = policeStationsMap[district];
    const station = stations[i % stations.length];
    const category = crimeCategories[i % crimeCategories.length];
    
    let status: FIRRecord["status"] = "Under Investigation";
    if (i % 4 === 1) status = "Charge Sheet Filed";
    else if (i % 4 === 2) status = "Awaiting Trial";
    else if (i % 4 === 3) status = "Closed";

    let riskLevel: FIRRecord["riskLevel"] = "Low";
    if (i % 3 === 0) riskLevel = "High";
    else if (i % 3 === 1) riskLevel = "Medium";

    const repeatOffender = i % 5 === 0 || i % 5 === 2;
    
    let alertSeverity: FIRRecord["alertSeverity"] = "None";
    if (riskLevel === "High" && i % 2 === 0) alertSeverity = "High";
    else if (riskLevel === "Medium" && i % 2 === 1) alertSeverity = "Medium";

    // Date spreading over June 2026
    const day = 1 + (i % 29);
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const date = `${startYear}-06-${dayString}`;

    records.push({
      id: `FIR-2026-${1000 + i}`,
      firNumber: `KA-2026-${2500 + i}`,
      date,
      district,
      policeStation: station,
      category,
      status,
      riskLevel,
      repeatOffender,
      alertSeverity,
    });
  }

  return records;
};

export const mockFIRs = generateMockFIRs();

export const mockAIAlerts: AIAlert[] = [
  {
    id: "AL-804",
    severity: "High",
    confidence: 94,
    title: "Localized Cyber-Fraud Spike",
    explanation: "AI detected a 45% increase in financial phishing registrations targeting senior citizens in Bengaluru City within 72 hours. Mode of operation involves fake treasury pension updates.",
    suggestedAction: "Initiate public warning alerts via SMS, inspect active treasury portal logs, and deploy cyber unit monitoring resources.",
    date: "2026-06-29",
  },
  {
    id: "AL-805",
    severity: "High",
    confidence: 89,
    title: "Emerging Narcotics Transport Corridor",
    explanation: "Correlative GPS maps link three recent vehicle impounds in Mangaluru City to a single logistics hub in Kalaburagi. High probability of drug supply chain corridor.",
    suggestedAction: "Set up tactical highway checkpoints at the Kalaburagi border and audit registry logs of the identified logistics carrier.",
    date: "2026-06-28",
  },
  {
    id: "AL-806",
    severity: "Medium",
    confidence: 82,
    title: "Repeat Offender Location Congestion",
    explanation: "Three individuals on active parole for burglary have registered overlapping cell tower coordinates in Koramangala PS sector 4 during late hours.",
    suggestedAction: "Increase night shift patrol vehicle frequencies in sector 4 and alert respective parole supervisors for compliance checking.",
    date: "2026-06-27",
  },
  {
    id: "AL-807",
    severity: "Medium",
    confidence: 78,
    title: "Seasonal Theft Risk Trend",
    explanation: "Historical monthly trends indicate a projected 15% increase in residential burglary in Mysuru City coinciding with upcoming temple festival holiday weeks.",
    suggestedAction: "Direct local stations to launch resident awareness bulletins and deploy auxiliary home guards to residential sectors.",
    date: "2026-06-26",
  },
];

export const mockActivityFeed: ActivityLog[] = [
  { id: "ACT-1", timestamp: "14:32", type: "FIR", description: "New cybercrime FIR KA-2026-2580 registered at Koramangala PS, Bengaluru." },
  { id: "ACT-2", timestamp: "13:15", type: "Chargesheet", description: "Chargesheet filed for homicide case KA-2026-2506 in Hubballi Town Court." },
  { id: "ACT-3", timestamp: "11:04", type: "Alert", description: "High Priority Alert AL-804 generated by AI agent (Phishing Surge)." },
  { id: "ACT-4", timestamp: "09:40", type: "Investigation", description: "Status of narcotics case KA-2026-2521 updated to Awaiting Trial at Lashkar PS." },
  { id: "ACT-5", timestamp: "Yesterday", type: "FIR", description: "Theft FIR KA-2026-2575 registered at Vidyaranyapuram PS, Mysuru." },
  { id: "ACT-6", timestamp: "Yesterday", type: "Chargesheet", description: "Chargesheet submitted for assault case KA-2026-2534 at Doddapete PS." },
];

export const mockOfficerWorkload = {
  activeOfficers: 142,
  averageCaseLoad: 4.8,
  highestWorkload: { name: "Inspector K. Patil", count: 9, district: "Bengaluru City" },
  lowestWorkload: { name: "Inspector R. Nayak", count: 1, district: "Shivamogga" },
};
