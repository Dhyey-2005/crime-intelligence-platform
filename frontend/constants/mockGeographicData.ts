export interface StationMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  totalFIRs: number;
  activeCases: number;
  pendingInvestigations: number;
  riskScore: number; // 1-100
  district: string;
}

export interface HotspotPoint {
  lat: number;
  lng: number;
  radius: number; // in meters
  intensity: number; // 0-1 (determines opacity / color depth)
}

export interface GeographicAlert {
  id: string;
  type: "Spike" | "Delay" | "Emerging Hotspot" | "High Risk District";
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  confidence: number; // percentage
  recommendation: string;
  location: string;
}

export interface TimelineSnapshot {
  month: string;
  label: string;
  districtRisks: Record<string, "High" | "Elevated" | "Moderate" | "Low">;
  hotspots: HotspotPoint[];
  totalCases: number;
}

export const districtsGeoJSON = [
  { name: "Bengaluru Urban", center: [12.9716, 77.5946] as [number, number], coordinates: [[12.85, 77.45], [13.15, 77.45], [13.15, 77.75], [12.85, 77.75]] as [number, number][] },
  { name: "Mysuru", center: [12.2958, 76.6394] as [number, number], coordinates: [[12.15, 76.5], [12.45, 76.5], [12.45, 76.8], [12.15, 76.8]] as [number, number][] },
  { name: "Belagavi", center: [15.8497, 74.4977] as [number, number], coordinates: [[15.7, 74.3], [16.0, 74.3], [16.0, 74.6], [15.7, 74.6]] as [number, number][] },
  { name: "Mangaluru (Dakshina Kannada)", center: [12.8700, 74.8430] as [number, number], coordinates: [[12.75, 74.7], [13.05, 74.7], [13.05, 75.0], [12.75, 75.0]] as [number, number][] },
  { name: "Hubballi-Dharwad", center: [15.3647, 75.1240] as [number, number], coordinates: [[15.2, 74.95], [15.5, 74.95], [15.5, 75.25], [15.2, 75.25]] as [number, number][] },
  { name: "Shivamogga", center: [13.9299, 75.5681] as [number, number], coordinates: [[13.75, 75.4], [14.1, 75.4], [14.1, 75.7], [13.75, 75.7]] as [number, number][] },
  { name: "Ballari", center: [15.1394, 76.9214] as [number, number], coordinates: [[15.0, 76.8], [15.3, 76.8], [15.3, 77.1], [15.0, 77.1]] as [number, number][] },
  { name: "Kalaburagi", center: [17.3297, 76.8343] as [number, number], coordinates: [[17.15, 76.6], [17.5, 76.6], [17.5, 77.0], [17.15, 77.0]] as [number, number][] },
  { name: "Davanagere", center: [14.4644, 75.9218] as [number, number], coordinates: [[14.3, 75.8], [14.6, 75.8], [14.6, 76.1], [14.3, 76.1]] as [number, number][] },
  { name: "Vijayapura", center: [16.8302, 75.7100] as [number, number], coordinates: [[16.7, 75.5], [17.0, 75.5], [17.0, 75.9], [16.7, 75.9]] as [number, number][] },
  { name: "Tumakuru", center: [13.3392, 77.1011] as [number, number], coordinates: [[13.2, 76.9], [13.5, 76.9], [13.5, 77.3], [13.2, 77.3]] as [number, number][] },
  { name: "Udupi", center: [13.3409, 74.7421] as [number, number], coordinates: [[13.2, 74.6], [13.5, 74.6], [13.5, 74.9], [13.2, 74.9]] as [number, number][] },
  { name: "Kolar", center: [13.1367, 78.1336] as [number, number], coordinates: [[13.0, 78.0], [13.3, 78.0], [13.3, 78.3], [13.0, 78.3]] as [number, number][] },
  { name: "Mandya", center: [12.5223, 76.8958] as [number, number], coordinates: [[12.4, 76.7], [12.7, 76.7], [12.7, 77.0], [12.4, 77.0]] as [number, number][] },
  { name: "Hassan", center: [13.0072, 76.1004] as [number, number], coordinates: [[12.85, 75.9], [13.15, 75.9], [13.15, 76.3], [12.85, 76.3]] as [number, number][] },
  { name: "Chikkamagaluru", center: [13.3161, 75.7720] as [number, number], coordinates: [[13.15, 75.6], [13.45, 75.6], [13.45, 75.9], [13.15, 75.9]] as [number, number][] },
  { name: "Bagalkote", center: [16.1817, 75.6958] as [number, number], coordinates: [[16.0, 75.5], [16.3, 75.5], [16.3, 75.9], [16.0, 75.9]] as [number, number][] },
  { name: "Bidar", center: [17.9104, 77.5199] as [number, number], coordinates: [[17.75, 77.3], [18.05, 77.3], [18.05, 77.7], [17.75, 77.7]] as [number, number][] },
  { name: "Chitradurga", center: [14.2251, 76.3980] as [number, number], coordinates: [[14.1, 76.2], [14.4, 76.2], [14.4, 76.6], [14.1, 76.6]] as [number, number][] },
  { name: "Gadag", center: [15.4321, 75.6318] as [number, number], coordinates: [[15.3, 75.5], [15.6, 75.5], [15.6, 75.8], [15.3, 75.8]] as [number, number][] },
  { name: "Haveri", center: [14.7937, 75.3992] as [number, number], coordinates: [[14.65, 75.2], [14.95, 75.2], [14.95, 75.6], [14.65, 75.6]] as [number, number][] },
  { name: "Kodagu", center: [12.4244, 75.7382] as [number, number], coordinates: [[12.25, 75.6], [12.55, 75.6], [12.55, 75.9], [12.25, 75.9]] as [number, number][] },
  { name: "Koppal", center: [15.3524, 76.1548] as [number, number], coordinates: [[15.2, 76.0], [15.5, 76.0], [15.5, 76.3], [15.2, 76.3]] as [number, number][] },
  { name: "Raichur", center: [16.2008, 77.3621] as [number, number], coordinates: [[16.05, 77.2], [16.35, 77.2], [16.35, 77.5], [16.05, 77.5]] as [number, number][] },
  { name: "Ramanagara", center: [12.7209, 77.2810] as [number, number], coordinates: [[12.6, 77.1], [12.85, 77.1], [12.85, 77.4], [12.6, 77.4]] as [number, number][] },
];

export const mockStations: StationMarker[] = [
  { id: "PS-1", name: "Koramangala PS", lat: 12.9348, lng: 77.6189, totalFIRs: 142, activeCases: 48, pendingInvestigations: 22, riskScore: 84, district: "Bengaluru Urban" },
  { id: "PS-2", name: "Indiranagar PS", lat: 12.9784, lng: 77.6408, totalFIRs: 110, activeCases: 32, pendingInvestigations: 14, riskScore: 65, district: "Bengaluru Urban" },
  { id: "PS-3", name: "Whitefield PS", lat: 12.9698, lng: 77.7500, totalFIRs: 95, activeCases: 29, pendingInvestigations: 11, riskScore: 58, district: "Bengaluru Urban" },
  { id: "PS-4", name: "Devaraja PS", lat: 12.3120, lng: 76.6508, totalFIRs: 85, activeCases: 21, pendingInvestigations: 9, riskScore: 42, district: "Mysuru" },
  { id: "PS-5", name: "Lashkar PS", lat: 12.3180, lng: 76.6580, totalFIRs: 70, activeCases: 25, pendingInvestigations: 12, riskScore: 78, district: "Mysuru" },
  { id: "PS-6", name: "Hubballi Town PS", lat: 15.3524, lng: 75.1380, totalFIRs: 115, activeCases: 38, pendingInvestigations: 18, riskScore: 70, district: "Hubballi-Dharwad" },
  { id: "PS-7", name: "Dharwad Suburban PS", lat: 15.4580, lng: 75.0078, totalFIRs: 62, activeCases: 15, pendingInvestigations: 6, riskScore: 35, district: "Hubballi-Dharwad" },
  { id: "PS-8", name: "Belagavi Town PS", lat: 15.8520, lng: 74.5080, totalFIRs: 78, activeCases: 24, pendingInvestigations: 11, riskScore: 48, district: "Belagavi" },
  { id: "PS-9", name: "Kadri PS", lat: 12.8750, lng: 74.8520, totalFIRs: 90, activeCases: 31, pendingInvestigations: 15, riskScore: 62, district: "Mangaluru (Dakshina Kannada)" },
  { id: "PS-10", name: "Kalaburagi Town PS", lat: 17.3320, lng: 76.8390, totalFIRs: 104, activeCases: 41, pendingInvestigations: 20, riskScore: 75, district: "Kalaburagi" },
  { id: "PS-11", name: "Shivamogga Town PS", lat: 13.9320, lng: 75.5720, totalFIRs: 58, activeCases: 18, pendingInvestigations: 7, riskScore: 38, district: "Shivamogga" },
  { id: "PS-12", name: "Ballari Town PS", lat: 15.1420, lng: 76.9250, totalFIRs: 74, activeCases: 22, pendingInvestigations: 8, riskScore: 52, district: "Ballari" },
  { id: "PS-13", name: "Udupi Town PS", lat: 13.3420, lng: 74.7450, totalFIRs: 50, activeCases: 14, pendingInvestigations: 5, riskScore: 30, district: "Udupi" },
  { id: "PS-14", name: "Tumakuru Town PS", lat: 13.3410, lng: 77.1020, totalFIRs: 68, activeCases: 19, pendingInvestigations: 7, riskScore: 45, district: "Tumakuru" },
];

export const mockGeographicAlerts: GeographicAlert[] = [
  {
    id: "GAL-1",
    type: "Spike",
    title: "Phishing Activity Spike",
    description: "Cybercrime unit reports a sudden 30% increase in cyber fraud cases originating from Whitefield PS area.",
    severity: "High",
    confidence: 91,
    recommendation: "Activate public cyber warnings and coordinate IP traces with telecoms.",
    location: "Whitefield, Bengaluru Urban",
  },
  {
    id: "GAL-2",
    type: "Delay",
    title: "Investigation Backlog Alert",
    description: "Lashkar PS has 8 narcotics files exceeding 45 days in pending status without active updates.",
    severity: "High",
    confidence: 88,
    recommendation: "Deploy additional supervisors to audit narcotics investigation progression.",
    location: "Lashkar, Mysuru",
  },
  {
    id: "GAL-3",
    type: "Emerging Hotspot",
    title: "Property Theft Burglary Cluster",
    description: "AI clusters indicate property thefts concentrated around Hubballi Town PS during early hours.",
    severity: "Medium",
    confidence: 84,
    recommendation: "Reposition midnight squad routes towards shopping corridors.",
    location: "Hubballi Town, Hubballi-Dharwad",
  },
  {
    id: "GAL-4",
    type: "High Risk District",
    title: "Extreme Activity Score",
    description: "Bengaluru Urban average incident index rose above risk boundaries this week.",
    severity: "High",
    confidence: 95,
    recommendation: "Request operational audit summaries from the Bengaluru Urban Commissioner.",
    location: "Bengaluru Urban",
  },
];

export const timelineSnapshots: TimelineSnapshot[] = [
  {
    month: "jan",
    label: "January 2026",
    totalCases: 640,
    districtRisks: {
      "Bengaluru Urban": "Elevated",
      "Mysuru": "Moderate",
      "Hubballi-Dharwad": "Moderate",
      "Belagavi": "Low",
      "Mangaluru (Dakshina Kannada)": "Moderate",
      "Kalaburagi": "Moderate",
      "Shivamogga": "Low",
    },
    hotspots: [
      { lat: 12.9348, lng: 77.6189, radius: 1500, intensity: 0.6 },
      { lat: 15.3524, lng: 75.138, radius: 2000, intensity: 0.5 },
      { lat: 17.332, lng: 76.839, radius: 1800, intensity: 0.5 },
    ],
  },
  {
    month: "feb",
    label: "February 2026",
    totalCases: 710,
    districtRisks: {
      "Bengaluru Urban": "High",
      "Mysuru": "Moderate",
      "Hubballi-Dharwad": "Elevated",
      "Belagavi": "Low",
      "Mangaluru (Dakshina Kannada)": "Elevated",
      "Kalaburagi": "Elevated",
      "Shivamogga": "Low",
    },
    hotspots: [
      { lat: 12.9348, lng: 77.6189, radius: 2000, intensity: 0.8 },
      { lat: 12.9784, lng: 77.6408, radius: 1500, intensity: 0.6 },
      { lat: 15.3524, lng: 75.138, radius: 2500, intensity: 0.7 },
      { lat: 12.875, lng: 74.852, radius: 1800, intensity: 0.5 },
    ],
  },
  {
    month: "mar",
    label: "March 2026",
    totalCases: 840,
    districtRisks: {
      "Bengaluru Urban": "High",
      "Mysuru": "Elevated",
      "Hubballi-Dharwad": "Elevated",
      "Belagavi": "Moderate",
      "Mangaluru (Dakshina Kannada)": "Elevated",
      "Kalaburagi": "High",
      "Shivamogga": "Moderate",
    },
    hotspots: [
      { lat: 12.9348, lng: 77.6189, radius: 2500, intensity: 0.9 },
      { lat: 12.9698, lng: 77.75, radius: 2200, intensity: 0.7 },
      { lat: 12.318, lng: 76.658, radius: 1800, intensity: 0.6 },
      { lat: 17.332, lng: 76.839, radius: 2500, intensity: 0.8 },
    ],
  },
  {
    month: "apr",
    label: "April 2026",
    totalCases: 950,
    districtRisks: {
      "Bengaluru Urban": "High",
      "Mysuru": "High",
      "Hubballi-Dharwad": "High",
      "Belagavi": "Elevated",
      "Mangaluru (Dakshina Kannada)": "High",
      "Kalaburagi": "High",
      "Shivamogga": "Moderate",
    },
    hotspots: [
      { lat: 12.9348, lng: 77.6189, radius: 3000, intensity: 0.95 },
      { lat: 12.9784, lng: 77.6408, radius: 2200, intensity: 0.85 },
      { lat: 12.318, lng: 76.658, radius: 2500, intensity: 0.9 },
      { lat: 15.3524, lng: 75.138, radius: 3000, intensity: 0.88 },
      { lat: 12.875, lng: 74.852, radius: 2200, intensity: 0.82 },
      { lat: 17.332, lng: 76.839, radius: 3000, intensity: 0.9 },
    ],
  },
];
