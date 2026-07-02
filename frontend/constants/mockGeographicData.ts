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
  {
    name: "Bengaluru City",
    center: [12.9716, 77.5946] as [number, number],
    coordinates: [
      [12.85, 77.45],
      [13.15, 77.45],
      [13.15, 77.75],
      [12.85, 77.75],
    ] as [number, number][],
  },
  {
    name: "Mysuru City",
    center: [12.2958, 76.6394] as [number, number],
    coordinates: [
      [12.15, 76.5],
      [12.45, 76.5],
      [12.45, 76.8],
      [12.15, 76.8],
    ] as [number, number][],
  },
  {
    name: "Hubballi-Dharwad",
    center: [15.3647, 75.124] as [number, number],
    coordinates: [
      [15.2, 74.95],
      [15.5, 74.95],
      [15.5, 75.25],
      [15.2, 75.25],
    ] as [number, number][],
  },
  {
    name: "Belagavi City",
    center: [15.8497, 74.4977] as [number, number],
    coordinates: [
      [15.7, 74.3],
      [16.0, 74.3],
      [16.0, 74.6],
      [15.7, 74.6],
    ] as [number, number][],
  },
  {
    name: "Mangaluru City",
    center: [12.9141, 74.856] as [number, number],
    coordinates: [
      [12.75, 74.7],
      [13.05, 74.7],
      [13.05, 75.0],
      [12.75, 75.0],
    ] as [number, number][],
  },
  {
    name: "Kalaburagi",
    center: [17.3297, 76.8343] as [number, number],
    coordinates: [
      [17.15, 76.6],
      [17.5, 76.6],
      [17.5, 77.0],
      [17.15, 77.0],
    ] as [number, number][],
  },
  {
    name: "Shivamogga",
    center: [13.9299, 75.5681] as [number, number],
    coordinates: [
      [13.75, 75.4],
      [14.1, 75.4],
      [14.1, 75.7],
      [13.75, 75.7],
    ] as [number, number][],
  },
];

export const mockStations: StationMarker[] = [
  { id: "PS-1", name: "Koramangala PS", lat: 12.9348, lng: 77.6189, totalFIRs: 142, activeCases: 48, pendingInvestigations: 22, riskScore: 84, district: "Bengaluru City" },
  { id: "PS-2", name: "Indiranagar PS", lat: 12.9784, lng: 77.6408, totalFIRs: 110, activeCases: 32, pendingInvestigations: 14, riskScore: 65, district: "Bengaluru City" },
  { id: "PS-3", name: "Whitefield PS", lat: 12.9698, lng: 77.75, totalFIRs: 95, activeCases: 29, pendingInvestigations: 11, riskScore: 58, district: "Bengaluru City" },
  { id: "PS-4", name: "Devaraja PS", lat: 12.312, lng: 76.6508, totalFIRs: 85, activeCases: 21, pendingInvestigations: 9, riskScore: 42, district: "Mysuru City" },
  { id: "PS-5", name: "Lashkar PS", lat: 12.318, lng: 76.658, totalFIRs: 70, activeCases: 25, pendingInvestigations: 12, riskScore: 78, district: "Mysuru City" },
  { id: "PS-6", name: "Hubballi Town PS", lat: 15.3524, lng: 75.138, totalFIRs: 115, activeCases: 38, pendingInvestigations: 18, riskScore: 70, district: "Hubballi-Dharwad" },
  { id: "PS-7", name: "Dharwad Suburban PS", lat: 15.458, lng: 75.0078, totalFIRs: 62, activeCases: 15, pendingInvestigations: 6, riskScore: 35, district: "Hubballi-Dharwad" },
  { id: "PS-8", name: "Belagavi Town PS", lat: 15.852, lng: 74.508, totalFIRs: 78, activeCases: 24, pendingInvestigations: 11, riskScore: 48, district: "Belagavi City" },
  { id: "PS-9", name: "Kadri PS", lat: 12.875, lng: 74.852, totalFIRs: 90, activeCases: 31, pendingInvestigations: 15, riskScore: 62, district: "Mangaluru City" },
  { id: "PS-10", name: "Kalaburagi Town PS", lat: 17.332, lng: 76.839, totalFIRs: 104, activeCases: 41, pendingInvestigations: 20, riskScore: 75, district: "Kalaburagi" },
  { id: "PS-11", name: "Shivamogga Town PS", lat: 13.932, lng: 75.572, totalFIRs: 58, activeCases: 18, pendingInvestigations: 7, riskScore: 38, district: "Shivamogga" },
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
    location: "Whitefield, Bengaluru City",
  },
  {
    id: "GAL-2",
    type: "Delay",
    title: "Investigation Backlog Alert",
    description: "Lashkar PS has 8 narcotics files exceeding 45 days in pending status without active updates.",
    severity: "High",
    confidence: 88,
    recommendation: "Deploy additional supervisors to audit narcotics investigation progression.",
    location: "Lashkar, Mysuru City",
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
    description: "Bengaluru City average incident index rose above risk boundaries this week.",
    severity: "High",
    confidence: 95,
    recommendation: "Request operational audit summaries from the Bengaluru Commissoner.",
    location: "Bengaluru City",
  },
];

export const timelineSnapshots: TimelineSnapshot[] = [
  {
    month: "jan",
    label: "January 2026",
    totalCases: 640,
    districtRisks: {
      "Bengaluru City": "Elevated",
      "Mysuru City": "Moderate",
      "Hubballi-Dharwad": "Moderate",
      "Belagavi City": "Low",
      "Mangaluru City": "Moderate",
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
      "Bengaluru City": "High",
      "Mysuru City": "Moderate",
      "Hubballi-Dharwad": "Elevated",
      "Belagavi City": "Low",
      "Mangaluru City": "Elevated",
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
      "Bengaluru City": "High",
      "Mysuru City": "Elevated",
      "Hubballi-Dharwad": "Elevated",
      "Belagavi City": "Moderate",
      "Mangaluru City": "Elevated",
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
      "Bengaluru City": "High",
      "Mysuru City": "High",
      "Hubballi-Dharwad": "High",
      "Belagavi City": "Elevated",
      "Mangaluru City": "High",
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
