export interface AnalyticsCase {
  id: string;
  firNumber: string;
  date: string; // YYYY-MM-DD
  district: string;
  policeStation: string;
  category: string;
  subcategory: string;
  status: "Under Investigation" | "Charge Sheet Filed" | "Awaiting Trial" | "Closed";
  severity: "High" | "Medium" | "Low";
  riskLevel: "High" | "Medium" | "Low";
  repeatOffender: boolean;
  victimAge: number;
  victimGender: "Male" | "Female" | "Other";
  accusedAge: number;
  accusedGender: "Male" | "Female";
  officerName: string;
  durationDays: number; // days taken to close, or active duration
  arrestCompleted: boolean;
  hourOfDay: number; // 0 to 23
}

export const subcategoryMap: Record<string, string[]> = {
  "Theft & Burglary": ["House Burglary", "Vehicle Theft", "Chain Snatching", "Shoplifting"],
  Cybercrime: ["Phishing Scam", "Online Identity Theft", "Social Media Harassment", "Ransomware Attack"],
  "Assault & Violence": ["Domestic Violence", "Physical Brawl", "Armed Assault", "Parole Brawl"],
  Narcotics: ["Drug Peddling", "Possession", "Synthetic Drug Trafficking"],
  "Financial Fraud": ["Bank Fraud", "Ponzi Scheme", "Tax Evasion", "Credit Card Fraud"],
  Homicide: ["Premeditated Murder", "Accidental Homicide", "Conspiracy Homicide"],
};

export const mockOfficers = [
  "Inspector K. Patil",
  "Inspector R. Nayak",
  "Inspector S. Kumar",
  "Detective M. Hegde",
  "Detective A. Gowda",
  "Detective V. Rao",
];

export const districts = [
  "Bengaluru Urban",
  "Mysuru",
  "Belagavi",
  "Mangaluru (Dakshina Kannada)",
  "Hubballi-Dharwad",
  "Shivamogga",
  "Ballari",
  "Kalaburagi",
  "Davanagere",
  "Vijayapura",
  "Tumakuru",
  "Udupi",
  "Kolar",
  "Mandya",
  "Hassan",
  "Chikkamagaluru",
  "Bagalkote",
  "Bidar",
  "Chitradurga",
  "Gadag",
  "Haveri",
  "Kodagu",
  "Koppal",
  "Raichur",
  "Ramanagara",
];

export const policeStationsMap: Record<string, string[]> = {
  "Bengaluru Urban": ["Koramangala PS", "Indiranagar PS", "Whitefield PS", "Jayanagar PS", "Ashok Nagar PS"],
  "Mysuru": ["Devaraja PS", "Lashkar PS", "Vidyaranyapuram PS", "Saraswathipuram PS"],
  "Belagavi": ["Belagavi Town PS", "Khade Bazar PS", "Camp PS"],
  "Mangaluru (Dakshina Kannada)": ["Kadri PS", "Pandeshwar PS", "Barkur PS", "Ullal PS"],
  "Hubballi-Dharwad": ["Hubballi Town PS", "Dharwad Suburban PS", "Vidyanagar PS"],
  "Shivamogga": ["Shivamogga Town PS", "Doddapete PS", "Kote PS"],
  "Ballari": ["Ballari Town PS", "Cowl Bazaar PS", "Gandhinagar PS"],
  "Kalaburagi": ["Kalaburagi Town PS", "Chowk PS", "Station Bazar PS"],
  "Davanagere": ["Davanagere Extension PS", "KTJ Nagar PS", "RMC PS"],
  "Vijayapura": ["Gandhi Chowk PS", "Golumbaz PS", "Jalal Nagar PS"],
  "Tumakuru": ["Tumakuru Town PS", "NEPS Tumakuru", "Kyathsandra PS"],
  "Udupi": ["Udupi Town PS", "Manipal PS", "Malpe PS"],
  "Kolar": ["Kolar Town PS", "Galpet PS", "Kolar Gold Fields PS"],
  "Mandya": ["Mandya Town PS", "East PS Mandya", "Srirangapatna PS"],
  "Hassan": ["Hassan Town PS", "Pension Mohalla PS", "Extension PS"],
  "Chikkamagaluru": ["Chikkamagaluru Town PS", "Basavanahalli PS"],
  "Bagalkote": ["Bagalkote Town PS", "Navanagar PS"],
  "Bidar": ["Bidar Town PS", "Market PS Bidar", "New Town PS"],
  "Chitradurga": ["Chitradurga Town PS", "Kote PS Chitradurga"],
  "Gadag": ["Gadag Town PS", "Betgeri PS"],
  "Haveri": ["Haveri Town PS", "Vidyanagar PS Haveri"],
  "Kodagu": ["Madikeri Town PS", "Virajpet PS", "Somwarpet PS"],
  "Koppal": ["Koppal Town PS", "Gangavathi PS"],
  "Raichur": ["Raichur Town PS", "Sadar Bazar PS"],
  "Ramanagara": ["Ramanagara Town PS", "Ijoor PS", "Channapatna PS"],
};

export const crimeCategories = [
  "Theft & Burglary",
  "Cybercrime",
  "Assault & Violence",
  "Narcotics",
  "Financial Fraud",
  "Homicide",
];

const generateAnalyticsCases = (): AnalyticsCase[] => {
  const cases: AnalyticsCase[] = [];
  
  for (let i = 0; i < 5000; i++) {
    const distIndex = i % districts.length;
    const district = districts[distIndex];
    const stations = policeStationsMap[district];
    const station = stations[i % stations.length];
    
    const category = crimeCategories[i % crimeCategories.length];
    const subcats = subcategoryMap[category];
    const subcategory = subcats[i % subcats.length];

    let status: AnalyticsCase["status"] = "Under Investigation";
    if (i % 4 === 1) status = "Charge Sheet Filed";
    else if (i % 4 === 2) status = "Awaiting Trial";
    else if (i % 4 === 3) status = "Closed";

    let severity: AnalyticsCase["severity"] = "Low";
    if (i % 3 === 0) severity = "High";
    else if (i % 3 === 1) severity = "Medium";

    let riskLevel: AnalyticsCase["riskLevel"] = "Low";
    if (i % 3 === 0) riskLevel = "High";
    else if (i % 3 === 1) riskLevel = "Medium";

    const repeatOffender = i % 5 === 0 || i % 5 === 3;
    
    // Deterministic victim demographics
    const victimAge = 18 + ((i * 7) % 65);
    let victimGender: AnalyticsCase["victimGender"] = "Male";
    if (i % 3 === 1) victimGender = "Female";
    else if (i % 11 === 0) victimGender = "Other";

    // Deterministic accused demographics
    const accusedAge = 16 + ((i * 11) % 55);
    const accusedGender: AnalyticsCase["accusedGender"] = i % 4 === 0 ? "Female" : "Male";

    const officerName = mockOfficers[i % mockOfficers.length];
    const durationDays = 5 + ((i * 13) % 95);
    const arrestCompleted = status === "Closed" || status === "Charge Sheet Filed" || i % 3 === 0;
    const hourOfDay = (i * 7) % 24;

    // Date spreading over Jan through June 2026
    const monthNum = 1 + (i % 6);
    const month = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    const day = 1 + (i % 28);
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const date = `2026-${month}-${dayString}`;

    cases.push({
      id: `FIR-2026-${10000 + i}`,
      firNumber: `KA-2026-${35000 + i}`,
      date,
      district,
      policeStation: station,
      category,
      subcategory,
      status,
      severity,
      riskLevel,
      repeatOffender,
      victimAge,
      victimGender,
      accusedAge,
      accusedGender,
      officerName,
      durationDays,
      arrestCompleted,
      hourOfDay,
    });
  }

  return cases;
};

export const mockAnalyticsCases = generateAnalyticsCases();
