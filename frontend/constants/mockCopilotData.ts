export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  text: string;
  explainable?: {
    confidence: number;
    reasoning: string;
    metrics: string;
    explanation: string;
    recommendation: string;
  };
}

export interface CopilotHistoryItem {
  id: string;
  title: string;
  dateGroup: "Today" | "Yesterday" | "Last Week";
  preview: string;
}

export interface PredictionCard {
  id: string;
  title: string;
  value: string;
  trend: string;
  description: string;
}

export interface SimilarCase {
  firNumber: string;
  category: string;
  similarity: number; // percentage
  status: string;
  link: string;
}

export const mockHistoryItems: CopilotHistoryItem[] = [
  { id: "h-1", title: "Crime Hotspots Analysis", dateGroup: "Today", preview: "Map coordinates showing cyber fraud clusters..." },
  { id: "h-2", title: "District Workload Comparisons", dateGroup: "Today", preview: "Bengaluru vs Mysuru active case file loads..." },
  { id: "h-3", title: "Burglary Modus Operandi", dateGroup: "Yesterday", preview: "Historical residential break-ins correlation..." },
  { id: "h-4", title: "Narcotics Route Corridor Audit", dateGroup: "Last Week", preview: "Supply checkpoints log audit on border..." },
  { id: "h-5", title: "Parolee Location Overlaps", dateGroup: "Last Week", preview: "Suspect coordinates proximity matching..." },
];

export const mockPredictionCards: PredictionCard[] = [
  { id: "FC-1", title: "Crime Risk Forecast", value: "Elevated (+15%)", trend: "High probability spike in Koramangala cyber sectors next week.", description: "Based on phishing script domains active registrations." },
  { id: "FC-2", title: "Hotspot Forecast", value: "Burglary Threat Cluster", trend: "Projected burglaries in Mysuru residential blocks during holidays.", description: "Derived from seasonal historic holiday home vacancies." },
  { id: "FC-3", title: "Investigation Delay Prediction", value: "High Backlog Risk", trend: "8 open cases approaching 30-day pending threshold.", description: "Identified bottlenecks in forensic ledger verification delays." },
  { id: "FC-4", title: "Resource Demand Forecast", value: "+3 Patrol Squads", trend: "Whitefield precinct predicted officer shortages on Friday hours.", description: "Correlated with weekend public event traffic schedules." },
];

export const mockSimilarCases: SimilarCase[] = [
  { firNumber: "KA-2026-9011", category: "Cybercrime", similarity: 94, status: "Under Investigation", link: "/investigation" },
  { firNumber: "KA-2026-3508", category: "Cybercrime", similarity: 88, status: "Awaiting Trial", link: "/network" },
  { firNumber: "KA-2026-2580", category: "Narcotics", similarity: 75, status: "Closed", link: "/network" },
];

export const mockCopilotResponses: Record<string, ChatMessage["explainable"] & { text: string }> = {
  "Show Crime Hotspots": {
    text: "Analyzing statewide GIS coordinates. I have identified a critical crime hotspot cluster.",
    confidence: 94,
    reasoning: "Spatial clustering algorithm grouped 14 incidents of online phishing fraud in Bengaluru City within a 1.2km radius over 72 hours.",
    metrics: "Bengaluru City: 45% phishing surge. Mysuru City: 10% burglary rise.",
    explanation: "Suspects are using mock treasury portals targeting pension credentials. Inactive coordinates match Koramangala Sector 4.",
    recommendation: "Deploy public SMS alerts via Telecom hubs, monitor ISP endpoints in sector 4, and alert local cyber cells.",
  },
  "Compare Districts": {
    text: "Comparing operational caseloads for Bengaluru City vs Mysuru City.",
    confidence: 92,
    reasoning: "Caseload datasets indicate extreme resource loads in Bengaluru City and Mysuru City.",
    metrics: "Bengaluru City: 142 active cases, average caseload 4.8. Mysuru City: 78 active cases, average caseload 5.2.",
    explanation: "Bengaluru City experiences higher volumes of Cyber fraud, while Mysuru City experiences rising narcotics corridors.",
    recommendation: "Reassign 4 cyber investigators from Mysuru City to Bengaluru City to load-balance pending caseloads.",
  },
  "Explain Crime Growth": {
    text: "Analyzing month-over-month crime growth vectors.",
    confidence: 88,
    reasoning: "June records indicate a 12% overall rise in case filings compared to May datasets.",
    metrics: "Cybercrime growth: +35%. Homicide growth: Stable (+1%). Theft & Burglary growth: +14%.",
    explanation: "Cybercrime spikes correlate with the launch of fake tax refund links. Burglaries correlate with school holidays.",
    recommendation: "Prioritize bank account blocking workflows and deploy home guard auxiliaries to residential blocks.",
  },
  "Identify Repeat Offenders": {
    text: "Running network relationship link analysis for repeat suspect profiles.",
    confidence: 95,
    reasoning: "Suspect John Doe shares 4 distinct links (vehicle KA-04-M-9922, mobile burner, and Ramon Gang) across multiple files.",
    metrics: "John Doe: 3 active cases. Akram Khan: 2 active cases. Raju Kumar: 2 active cases.",
    explanation: "John Doe acts as the courier coordinator for the Ramon Gang drug pipeline, linking multiple case files.",
    recommendation: "Order immediate vehicle checkpoints on Lashkar Road and coordinate with parole monitoring staff.",
  },
  "Recommend Patrol Allocation": {
    text: "Calculating optimal patrol deployments based on current spatial risks.",
    confidence: 89,
    reasoning: "Resource utilization sheets identify vehicle deficits and patrol workload imbalances.",
    metrics: "Whitefield PS: 95% vehicle utilization. Devaraja PS: 50% vehicle utilization.",
    explanation: "Whitefield PS experiences high evening traffic calls, leading to response time delays.",
    recommendation: "Deploy 2 tactical patrol vehicles from Mysuru reserves to Whitefield precinct for weekend shifts.",
  },
  "Generate Intelligence Briefing": {
    text: "Compiling Executive Intelligence Command Briefing.",
    confidence: 96,
    reasoning: "Aggregated state indicators compile emerging threats and operational priorities.",
    metrics: "Total active FIRs: 200. Active AI Alerts: 4. Solved cases this week: 14.",
    explanation: "Operational priority is centered around the narcotics corridor transport link between Kalaburagi and Mangaluru.",
    recommendation: "Escalate joint inter-district coordination meetings and audit logistics carrier registries.",
  },
  "Show Operational Risks": {
    text: "Assessing precinct and officer operational load risks.",
    confidence: 91,
    reasoning: "Workforce indicators highlight officer overloads and investigation backlog bottlenecks.",
    metrics: "Inspector Nayak caseload: 90% utilization. Backlogged investigations (>30 days): 8 cases.",
    explanation: "Backlogs are concentrated in evidence collection audits due to delayed bank transaction record releases.",
    recommendation: "Authorize direct magistrate requests for bank records and reassign 3 cases from Inspector Nayak to Inspector Kumar.",
  },
};

export const mockCopilotWelcome = {
  name: "Sentinel AI Copilot",
  description: "Your strategic cognitive assistant. Ask natural language queries to retrieve case files, compare district workloads, analyze network links, or generate executive briefs.",
  suggestedQuestions: [
    "Show Crime Hotspots",
    "Compare Districts",
    "Explain Crime Growth",
    "Identify Repeat Offenders",
    "Recommend Patrol Allocation",
    "Generate Intelligence Briefing",
    "Show Operational Risks",
  ],
};
