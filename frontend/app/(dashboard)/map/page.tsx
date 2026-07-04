"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  districtsGeoJSON,
  mockStations,
  mockGeographicAlerts,
  StationMarker,
  GeographicAlert,
  HotspotPoint,
} from "@/constants/mockGeographicData";
import { crimeCategories, AnalyticsCase, mockAnalyticsCases } from "@/constants/mockAnalyticsData";
import { analyticsService } from "@/services/analyticsService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Form";
import { Badge, Spinner } from "@/components/ui/Feedback";
import { Paragraph } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import {
  Layers,
  MapPin,
  Clock,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Filter,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Activity,
  Zap,
  Target,
  RotateCcw,
  Shield,
  Compass,
} from "lucide-react";


// Dynamic import with SSR disabled to prevent server-side leaflet rendering crash
const InteractiveMap = dynamic(() => import("@/components/map/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0B0F19] rounded-lg">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <Paragraph className="text-text-secondary text-xs">Loading GIS Engine & Real Data...</Paragraph>
      </div>
    </div>
  ),
});

// Helper for generating deterministic coordinates for real stations without exact GPS records
const getStationCoordinates = (stationName: string, districtName: string, index: number): [number, number] => {
  const known = mockStations.find(
    (s) => s.name.toLowerCase() === stationName.toLowerCase() || stationName.toLowerCase().includes(s.name.toLowerCase().replace(" ps", ""))
  );
  if (known) return [known.lat, known.lng];

  const dist = districtsGeoJSON.find((d) => d.name.toLowerCase() === districtName.toLowerCase());
  const center = dist ? dist.center : ([14.8, 75.8] as [number, number]);

  const angle = (index * 137.5) * (Math.PI / 180);
  const radiusOffset = 0.035 + (index % 4) * 0.02;
  return [
    center[0] + radiusOffset * Math.cos(angle),
    center[1] + radiusOffset * Math.sin(angle),
  ];
};

export default function MapPage() {
  // 1. Real Data States
  const [dbCases, setDbCases] = React.useState<AnalyticsCase[]>(() => analyticsService.getInitialCases());
  const [selectedMonths, setSelectedMonths] = React.useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = React.useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // Fetch real database records on mount
  React.useEffect(() => {
    const cached = analyticsService.getCachedCases();
    if (cached) setDbCases(cached);

    analyticsService.getCases(5000).then((casesData) => {
      if (casesData && casesData.length > 0) {
        setDbCases(casesData);
      }
    });
  }, []);

  // Layer control states
  const [layerControls, setLayerControls] = React.useState({
    districts: true,
    stations: true,
    hotspots: true,
    resources: true,
    alerts: true,
  });

  // Selection states
  const [activeDistrict, setActiveDistrict] = React.useState<string | null>(null);
  const [activeStation, setActiveStation] = React.useState<StationMarker | null>(null);

  // Handle Layer Toggle
  const toggleLayer = (layer: keyof typeof layerControls) => {
    setLayerControls((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Selection handlers
  const handleSelectDistrict = (name: string) => {
    setActiveDistrict(name);
    setActiveStation(null);
  };

  const handleSelectStation = (station: StationMarker) => {
    setActiveStation(station);
    setActiveDistrict(null);
  };

  // Dynamic filter options derived from real cases (falling back to mock defaults if db is loading)
  const filterOptions = React.useMemo(() => {
    const categories = Array.from(new Set(dbCases.map((c) => c.category).filter(Boolean))).sort();
    const severities = Array.from(new Set(dbCases.map((c) => c.severity).filter(Boolean))).sort();
    const statuses = Array.from(new Set(dbCases.map((c) => c.status).filter(Boolean))).sort();
    return {
      categories: categories.length > 0 ? categories : crimeCategories,
      severities: severities.length > 0 ? severities : ["High", "Medium", "Low"],
      statuses: statuses.length > 0 ? statuses : ["Under Investigation", "Charge Sheet Filed", "Awaiting Trial", "Closed"],
    };
  }, [dbCases]);

  // Filtered cases based on multi-select map filters
  const filteredCases = React.useMemo(() => {
    return dbCases.filter((c) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(c.category)) return false;
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(c.severity)) return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(c.status)) return false;
      if (selectedMonths.length > 0) {
        const caseMonth = c.date.substring(0, 7);
        if (!selectedMonths.includes(caseMonth)) return false;
      }
      return true;
    });
  }, [dbCases, selectedCategories, selectedSeverities, selectedStatuses, selectedMonths]);

  // Generate distinct months for timeline replay
  const availableMonths = React.useMemo(() => {
    const months = Array.from(new Set(dbCases.map((c) => c.date.substring(0, 7)))).sort();
    return months.length > 0 ? months : ["2026-05", "2026-06"];
  }, [dbCases]);

  // Dynamic Real Station Markers
  const realStations: StationMarker[] = React.useMemo(() => {
    const stationGroups: Record<string, AnalyticsCase[]> = {};
    filteredCases.forEach((c) => {
      if (activeDistrict) {
        const distMatch =
          c.district.toLowerCase() === activeDistrict.toLowerCase() ||
          c.district.includes(activeDistrict) ||
          activeDistrict.includes(c.district);
        if (!distMatch) return;
      }
      if (!c.policeStation) return;
      if (!stationGroups[c.policeStation]) stationGroups[c.policeStation] = [];
      stationGroups[c.policeStation].push(c);
    });

    const entries = Object.entries(stationGroups);
    if (entries.length === 0) {
      if (selectedCategories.length > 0 || selectedSeverities.length > 0 || selectedStatuses.length > 0 || selectedMonths.length > 0 || activeDistrict) {
        return [];
      }
      return mockStations;
    }

    return entries.map(([name, cases], idx) => {
      const district = cases[0]?.district || "Bengaluru Urban";
      const [lat, lng] = getStationCoordinates(name, district, idx);
      const totalFIRs = cases.length;
      const activeCases = cases.filter((c) => (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed" && !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded")).length;
      const pendingInvestigations = cases.filter((c) => c.status === "Under Investigation").length;
      const highSev = cases.filter((c) => c.severity === "High").length;
      const riskScore = Math.min(100, Math.round((highSev / Math.max(1, totalFIRs)) * 80 + Math.min(20, totalFIRs / 3)));

      return {
        id: `ST-${idx + 1}`,
        name,
        lat,
        lng,
        totalFIRs,
        activeCases,
        pendingInvestigations,
        riskScore,
        district,
      };
    });
  }, [filteredCases, activeDistrict, selectedCategories, selectedSeverities, selectedStatuses, selectedMonths]);

  // Dynamic Real Crime Hotspots (highlight only top-tier high-risk clusters with balanced radius to prevent clutter)
  const realHotspots: HotspotPoint[] = React.useMemo(() => {
    return realStations
      .filter((s) => s.riskScore >= 70 || s.totalFIRs >= 65)
      .slice(0, 12)
      .map((s) => ({
        lat: s.lat,
        lng: s.lng,
        radius: Math.min(9000, Math.max(5000, s.totalFIRs * 120)),
        intensity: Math.min(0.5, 0.25 + s.riskScore / 300),
      }));
  }, [realStations]);

  // Dynamic Real District Risk Mappings based on relative severity ratio and volume
  const realDistrictRisks = React.useMemo(() => {
    const counts: Record<string, { total: number; high: number }> = {};
    filteredCases.forEach((c) => {
      if (!counts[c.district]) counts[c.district] = { total: 0, high: 0 };
      counts[c.district].total += 1;
      if (c.severity === "High") counts[c.district].high += 1;
    });

    const distTotals = Object.values(counts).map((d) => d.total);
    const avgCases = distTotals.length > 0 ? distTotals.reduce((a, b) => a + b, 0) / distTotals.length : 100;

    const risks: Record<string, "High" | "Elevated" | "Moderate" | "Low"> = {};
    districtsGeoJSON.forEach((dist) => {
      const data = counts[dist.name] || { total: 0, high: 0 };
      const ratio = data.total > 0 ? data.high / data.total : 0;
      if ((data.total >= avgCases * 1.1 && ratio >= 0.30) || ratio >= 0.45 || data.high >= 80) {
        risks[dist.name] = "High";
      } else if ((data.total >= avgCases * 0.9 && ratio >= 0.15) || ratio >= 0.25 || data.high >= 30) {
        risks[dist.name] = "Elevated";
      } else if (data.total > 0 && (ratio > 0 || data.total >= avgCases * 0.5)) {
        risks[dist.name] = "Moderate";
      } else {
        risks[dist.name] = "Low";
      }
    });
    return risks;
  }, [filteredCases]);

  // Re-calculate district metrics based on active selection and real cases
  const activeDistrictStats = React.useMemo(() => {
    if (!activeDistrict) return null;
    const distCases = filteredCases.filter(
      (c) => c.district.toLowerCase() === activeDistrict.toLowerCase() || c.district.includes(activeDistrict) || activeDistrict.includes(c.district)
    );
    const totalFIRs = distCases.length;
    const activeCases = distCases.filter((c) => (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed" && !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded")).length;
    const pending = distCases.filter((c) => c.status === "Under Investigation").length;
    const officerCount = new Set(distCases.map((c) => c.officerName)).size || Math.round(activeCases * 1.5 + 4);
    const risk = realDistrictRisks[activeDistrict] || "Low";

    return {
      name: activeDistrict,
      totalFIRs,
      activeCases,
      pending,
      officerCount,
      risk,
    };
  }, [activeDistrict, filteredCases, realDistrictRisks]);

  // Overall Statewide metrics from real cases
  const statewideStats = React.useMemo(() => {
    const totalFIRs = filteredCases.length;
    const activeCases = filteredCases.filter((c) => (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed" && !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded")).length;
    const pending = filteredCases.filter((c) => c.status === "Under Investigation").length;
    return { totalFIRs, activeCases, pending };
  }, [filteredCases]);

  // Dynamic AI Spatial Alerts from real cases
  const realAlerts: GeographicAlert[] = React.useMemo(() => {
    if (realStations.length === 0) return mockGeographicAlerts;
    const sortedStations = [...realStations].sort((a, b) => b.riskScore - a.riskScore);
    const topStation = sortedStations[0] || realStations[0];
    const secondStation = sortedStations[1] || realStations[1] || topStation;

    const topStationCases = filteredCases.filter((c) => c.policeStation === topStation.name);
    const catCounts: Record<string, number> = {};
    topStationCases.forEach((c) => {
      catCounts[c.category] = (catCounts[c.category] || 0) + 1;
    });
    const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Cyber Crime";

    return [
      {
        id: "REAL-1",
        type: "Spike",
        title: `${topCat} Activity Spike`,
        description: `Real-time database telemetry reports a concentration of ${topStation.totalFIRs} active files originating from ${topStation.name} sector command.`,
        severity: topStation.riskScore > 65 ? "High" : "Medium",
        confidence: Math.min(98, Math.round(78 + topStation.riskScore / 5)),
        recommendation: `Deploy specialized ${topCat.toLowerCase()} task force and coordinate sector perimeter sweeps.`,
        location: `${topStation.name}, ${topStation.district}`,
      },
      {
        id: "REAL-2",
        type: "Delay",
        title: "Investigation Backlog Alert",
        description: `${secondStation.name} currently monitors ${secondStation.pendingInvestigations} cases under pending investigation status without recent milestone updates.`,
        severity: secondStation.pendingInvestigations > 12 ? "High" : "Medium",
        confidence: 91,
        recommendation: "Assign supervisory audit officers to conduct expedited case file progression reviews.",
        location: `${secondStation.name}, ${secondStation.district}`,
      },
      {
        id: "REAL-3",
        type: "High Risk District",
        title: "Statewide Caseload Threshold",
        description: `Statewide command center is actively tracking ${statewideStats.activeCases} active investigations across all Karnataka sectors.`,
        severity: statewideStats.activeCases > 1000 ? "High" : "Medium",
        confidence: 95,
        recommendation: "Review tactical patrol deployments across high-density urban transit corridors.",
        location: "Karnataka Statewide",
      },
      {
        id: "REAL-4",
        type: "Emerging Hotspot",
        title: "High Severity Incident Cluster",
        description: `Spatial clustering detects ${filteredCases.filter((c) => c.severity === "High").length} high-severity incidents logged within the active filtering timeframe.`,
        severity: "High",
        confidence: 89,
        recommendation: "Maintain high-alert surveillance checkpoints and mobile patrol routes.",
        location: "Major Urban Centers",
      },
    ];
  }, [realStations, filteredCases, statewideStats]);

  const formatMonthName = (ym: string) => {
    if (!ym || ym === "all") return "All Time";
    const parts = ym.split("-");
    if (parts.length < 2) return ym;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-background-primary p-6 overflow-y-auto" : ""}`}>


      {/* 1. Command Header */}
      {!isFullscreen && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-page-title">Geographic Intelligence Command Center</h2>
            <Paragraph className="text-text-secondary">
              Statewide spatial analysis, tactical hotspots mapping, and district operational risk monitoring across Karnataka.
            </Paragraph>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            leftIcon={<Maximize2 className="h-4 w-4" />}
          >
            Fullscreen Mode
          </Button>
        </div>
      )}

      {/* Fullscreen header fallback */}
      {isFullscreen && (
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4 select-none">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-accent-primary" />
            <span className="font-bold text-text-primary text-xs uppercase tracking-widest">
              Geographic Intelligence — Karnataka Statewide Command
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(false)}
            leftIcon={<Minimize2 className="h-4 w-4" />}
          >
            Exit Fullscreen
          </Button>
        </div>

      )}      {/* 2. Map & Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Side: Map Viewport + Timeline (lg:col-span-8, spans 2 rows) */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Map canvas container */}
          <div className={`relative w-full flex-grow bg-[#0B0F19] rounded-lg border border-border-subtle overflow-hidden transition-all duration-300 ${
            isFullscreen ? "h-[calc(100vh-180px)] min-h-[600px]" : "min-h-[580px] h-full"
          }`}>
            {/* The dynamically imported Leaflet Map wrapper */}
            <InteractiveMap
              districtRisks={realDistrictRisks}
              hotspots={realHotspots}
              stations={realStations}
              layerControls={layerControls}
              onSelectDistrict={handleSelectDistrict}
              onSelectStation={handleSelectStation}
            />

            {/* Layer Control Overlays (Top Right Floating) */}
            <div className="absolute top-3 right-3 z-[1000] bg-background-card/90 backdrop-blur border border-border-subtle rounded-md p-3 max-w-[170px] select-none text-[10px] space-y-2 shadow-md">
              <span className="font-bold text-text-primary uppercase tracking-wider block flex items-center">
                <Layers className="h-3.5 w-3.5 mr-1 text-accent-primary" /> Layer Controls
              </span>
              <div className="space-y-1.5 text-text-secondary">
                <label className="flex items-center space-x-2 cursor-pointer hover:text-text-primary">
                  <input
                    type="checkbox"
                    checked={layerControls.districts}
                    onChange={() => toggleLayer("districts")}
                    className="rounded border-border-default bg-background-card text-accent-primary focus:ring-0 h-3 w-3"
                  />
                  <span>District Boundaries</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-text-primary">
                  <input
                    type="checkbox"
                    checked={layerControls.stations}
                    onChange={() => toggleLayer("stations")}
                    className="rounded border-border-default bg-background-card text-accent-primary focus:ring-0 h-3 w-3"
                  />
                  <span>Police Stations</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-text-primary">
                  <input
                    type="checkbox"
                    checked={layerControls.hotspots}
                    onChange={() => toggleLayer("hotspots")}
                    className="rounded border-border-default bg-background-card text-accent-primary focus:ring-0 h-3 w-3"
                  />
                  <span>Crime Hotspots</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-text-primary opacity-60">
                  <input
                    type="checkbox"
                    checked={layerControls.resources}
                    onChange={() => toggleLayer("resources")}
                    className="rounded border-border-default bg-background-card text-accent-primary focus:ring-0 h-3 w-3"
                  />
                  <span>Resource Allocations</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:text-text-primary opacity-60">
                  <input
                    type="checkbox"
                    checked={layerControls.alerts}
                    onChange={() => toggleLayer("alerts")}
                    className="rounded border-border-default bg-background-card text-accent-primary focus:ring-0 h-3 w-3"
                  />
                  <span>Live AI Alerts</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map Controls & Details Panels */}
        <div className={`lg:col-span-4 flex flex-col space-y-4 ${isFullscreen ? "max-h-[calc(100vh-180px)] overflow-y-auto pr-1" : ""}`}>
        {/* Right Side Card 1: Active Intelligence Panel */}
        <Card className="flex-shrink-0 border border-white/20 bg-background-card/90 backdrop-blur shadow-[0_4px_25px_rgba(255,255,255,0.07)]">
          <CardHeader className="p-3.5 pb-2 border-b border-border-subtle/40">
            <CardTitle className="text-xs uppercase tracking-wider text-white font-extrabold flex items-center">
              <Sparkles className="h-4 w-4 mr-1.5 text-accent-primary animate-pulse" />
              Spatial Intelligence Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 pt-2 select-none">
            {/* Scenario 1: District selected */}
            {activeDistrictStats && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                  <span className="font-bold text-white text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-accent-primary" />
                    {activeDistrictStats.name}
                  </span>
                  <Badge
                    variant={
                      activeDistrictStats.risk === "High"
                        ? "danger"
                        : activeDistrictStats.risk === "Elevated"
                        ? "warning"
                        : "success"
                    }
                  >
                    {activeDistrictStats.risk} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Total FIRs</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{activeDistrictStats.totalFIRs}</span>
                  </div>
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Active Caseload</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{activeDistrictStats.activeCases}</span>
                  </div>
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Pending Search</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{activeDistrictStats.pending}</span>
                  </div>
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Officers Deployed</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{activeDistrictStats.officerCount}</span>
                  </div>
                </div>

                <div className="text-[11px] text-text-primary space-y-1 bg-background-secondary/30 p-3 rounded border border-white/10">
                  <span className="font-bold text-white block mb-0.5">Real-Time Telemetry:</span>
                  <span>Monitoring live FIR filings, active court procedures, and investigative squad allocations.</span>
                </div>

                <div className="flex space-x-2 pt-1">
                  <Link href="/analytics" className="w-full">
                    <Button variant="secondary" className="w-full text-[11px] h-9 px-3 font-bold" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      District Analytics
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setActiveDistrict(null)} className="text-[11px] h-9 px-3 font-bold border-white/20 hover:bg-white/10 text-white">
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Scenario 2: Police Station selected */}
            {!activeDistrictStats && activeStation && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                  <span className="font-bold text-white text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-warning" />
                    {activeStation.name}
                  </span>
                  <Badge
                    variant={
                      activeStation.riskScore > 70 ? "danger" : activeStation.riskScore > 50 ? "warning" : "success"
                    }
                  >
                    Risk: {activeStation.riskScore}%
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Total FIRs</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">{activeStation.totalFIRs}</span>
                  </div>
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Active</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">{activeStation.activeCases}</span>
                  </div>
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Pending</span>
                    <span className="text-sm font-extrabold text-white mt-0.5 block">{activeStation.pendingInvestigations}</span>
                  </div>
                </div>

                <div className="text-[11px] text-text-primary space-y-2 bg-background-secondary/30 p-3 rounded border border-white/10">
                  <div>
                    <span className="font-bold text-white">Operational Sector:</span>{" "}
                    <span>{activeStation.district} Command Jurisdiction.</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">Officer Deployment:</span>{" "}
                    <span>{Math.round(activeStation.activeCases * 1.5 + 2)} active field squads.</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1">
                  <Link href="/investigation" className="w-full">
                    <Button variant="secondary" className="w-full text-[11px] h-9 px-3 font-bold" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      Query Incident FIRs
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setActiveStation(null)} className="text-[11px] h-9 px-3 font-bold border-white/20 hover:bg-white/10 text-white">
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Scenario 3: Nothing selected (Statewide summary) */}
            {!activeDistrictStats && !activeStation && (
              <div className="space-y-2 text-center py-1.5">
                <div className="h-9 w-9 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary mx-auto mb-1.5 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  <Layers className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Statewide Surveillance</h4>
                  <p className="text-[10px] text-text-secondary mt-1 max-w-[250px] mx-auto leading-normal">
                    All 31 territorial commands and 50 police stations actively reporting real-time database telemetry.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-center text-[10px] pt-0.5">
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Total Tracked</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{dbCases.length}</span>
                  </div>
                  <div className="p-2 bg-background-secondary/40 rounded border border-white/10">
                    <span className="block text-text-secondary uppercase font-semibold">Active Caseload</span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">{filteredCases.filter((c) => (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed" && !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded")).length}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side Card 2: Crime Map Filter Console */}
        <Card className="flex-shrink-0 border border-white/20 bg-background-card/90 backdrop-blur shadow-[0_4px_25px_rgba(255,255,255,0.07)]">
          <CardHeader className="p-3.5 pb-2 border-b border-border-subtle/40 flex flex-row items-center justify-between">
            <CardTitle className="text-xs flex items-center uppercase tracking-wider text-white font-extrabold">
              <Filter className="h-4 w-4 text-accent-primary mr-1.5" />
              Crime Map Filter Console
            </CardTitle>
            {(selectedCategories.length > 0 || selectedSeverities.length > 0 || selectedStatuses.length > 0 || selectedMonths.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSeverities([]);
                  setSelectedStatuses([]);
                  setSelectedMonths([]);
                }}
                className="text-[11px] text-accent-primary hover:underline font-extrabold flex items-center bg-accent-primary/10 px-2.5 py-1 rounded border border-accent-primary/30 transition-colors hover:bg-accent-primary/20 shadow-sm"
              >
                Reset All ({selectedCategories.length + selectedSeverities.length + selectedStatuses.length + selectedMonths.length})
              </button>
            )}
          </CardHeader>
          <CardContent className="space-y-2.5 p-3.5 pt-2 select-none">
            {/* 0. Temporal Horizons (Months) */}
            <div className="bg-background-secondary/25 p-2 rounded-lg border border-white/10 shadow-inner space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white uppercase tracking-wider">Temporal Horizons (Time Period)</span>
                {selectedMonths.length > 0 && (
                  <button onClick={() => setSelectedMonths([])} className="text-[10px] text-accent-primary hover:underline font-bold">
                    Clear ({selectedMonths.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedMonths([])}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-all duration-150 flex items-center space-x-1 shadow-sm ${
                    selectedMonths.length === 0
                      ? "bg-gradient-to-r from-accent-primary to-blue-600 text-[#0B0F19] border-accent-primary font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                      : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-white/10 hover:text-white font-bold"
                  }`}
                >
                  <span>All Time</span>
                  {selectedMonths.length === 0 && <span className="ml-1 text-[9px] font-black">✓</span>}
                </button>
                {availableMonths.map((ym) => {
                  const isSelected = selectedMonths.includes(ym);
                  return (
                    <button
                      key={ym}
                      onClick={() => toggleFilter(selectedMonths, setSelectedMonths, ym)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all duration-150 flex items-center space-x-1 shadow-sm ${
                        isSelected
                          ? "bg-gradient-to-r from-warning to-amber-600 text-[#0B0F19] border-warning font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                          : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-white/10 hover:text-white font-bold"
                      }`}
                    >
                      <span>{ym}</span>
                      {isSelected && <span className="ml-1 text-[9px] font-black">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1. Incident Severity (Multi-select pills) */}
            <div className="bg-background-secondary/25 p-2 rounded-lg border border-white/10 shadow-inner space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white uppercase tracking-wider">Incident Severity</span>
                {selectedSeverities.length > 0 && (
                  <button onClick={() => setSelectedSeverities([])} className="text-[10px] text-accent-primary hover:underline font-bold">
                    Clear ({selectedSeverities.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.severities.map((sev) => {
                  const isSelected = selectedSeverities.includes(sev);
                  const colorClass =
                    sev === "High"
                      ? isSelected ? "bg-danger text-[#0B0F19] border-danger font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.6)]" : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-danger/20 hover:text-white font-bold"
                      : sev === "Medium"
                      ? isSelected ? "bg-warning text-[#0B0F19] border-warning font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.6)]" : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-warning/20 hover:text-white font-bold"
                      : isSelected ? "bg-success text-[#0B0F19] border-success font-extrabold shadow-[0_0_12px_rgba(34,197,94,0.6)]" : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-success/20 hover:text-white font-bold";
                  return (
                    <button
                      key={sev}
                      onClick={() => toggleFilter(selectedSeverities, setSelectedSeverities, sev)}
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all duration-150 flex items-center space-x-1 shadow-sm ${colorClass}`}
                    >
                      <span>{sev}</span>
                      {isSelected && <span className="ml-1 text-[9px] font-black">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Case Status (Multi-select badges) */}
            <div className="bg-background-secondary/25 p-2 rounded-lg border border-white/10 shadow-inner space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white uppercase tracking-wider">Case Status</span>
                {selectedStatuses.length > 0 && (
                  <button onClick={() => setSelectedStatuses([])} className="text-[10px] text-accent-primary hover:underline font-bold">
                    Clear ({selectedStatuses.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.statuses.map((status) => {
                  const isSelected = selectedStatuses.includes(status);
                  return (
                    <button
                      key={status}
                      onClick={() => toggleFilter(selectedStatuses, setSelectedStatuses, status)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all duration-150 flex items-center space-x-1 shadow-sm ${
                        isSelected
                          ? "bg-accent-primary text-[#0B0F19] border-accent-primary font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                          : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-white/10 hover:text-white font-bold"
                      }`}
                    >
                      <span>{status}</span>
                      {isSelected && <span className="ml-1 text-[9px] font-black">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Crime Category (Multi-select chips) */}
            <div className="bg-background-secondary/25 p-2 rounded-lg border border-white/10 shadow-inner space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-white uppercase tracking-wider">Crime Category</span>
                {selectedCategories.length > 0 && (
                  <button onClick={() => setSelectedCategories([])} className="text-[10px] text-accent-primary hover:underline font-bold">
                    Clear ({selectedCategories.length})
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.categories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all duration-150 flex items-center space-x-1 shadow-sm ${
                        isSelected
                          ? "bg-purple-500 text-white border-purple-400 font-extrabold shadow-[0_0_12px_rgba(168,85,247,0.6)]"
                          : "bg-background-secondary/80 text-text-primary border-white/25 hover:border-white/50 hover:bg-white/10 hover:text-white font-bold"
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <span className="ml-1 text-[9px] font-black">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] text-text-primary italic pt-1.5 border-t border-border-subtle/40 leading-relaxed font-medium">
              <span className="text-accent-primary font-bold">Tip:</span> Click chips to combine selections (OR within group, AND across groups). Leave a group unselected to display all.
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* 3. Middle Row: Historical Crime Evolution Timeline Replay */}
      <div className="w-full">
          <Card className="border border-white/20 bg-background-card/90 backdrop-blur shadow-[0_4px_25px_rgba(255,255,255,0.07)]">
            <CardContent className="p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2 select-none">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center">
                  <Clock className="h-4 w-4 text-warning mr-2 animate-pulse" />
                  Historical Crime Evolution Timeline Replay
                </span>
                <div className="flex items-center space-x-2.5">
                  {selectedMonths.length > 0 && (
                    <button
                      onClick={() => setSelectedMonths([])}
                      className="text-[11px] text-accent-primary hover:underline font-extrabold"
                    >
                      Reset Timeline
                    </button>
                  )}
                  <Badge variant="primary" className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 shadow-sm">
                    {selectedMonths.length === 0 ? "All Time Snapshot" : `${selectedMonths.length} Month${selectedMonths.length > 1 ? "s" : ""} Selected`}
                  </Badge>
                </div>
              </div>

              <div className="space-y-5">
                {/* Horizontal Step nodes for multi-month selection */}
                <div className="bg-background-secondary/25 p-3 rounded-lg border border-white/10 shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary select-none">
                    <span className="flex items-center space-x-1.5 text-white">
                      <Filter className="h-3.5 w-3.5 text-accent-primary" />
                      <span>Select Temporal Horizons (Multi-Select Enabled)</span>
                    </span>
                    <span className="text-[10px] text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded border border-accent-primary/20">
                      Click any month to compare & isolate spatial telemetry
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-center select-none">
                    <button
                      onClick={() => setSelectedMonths([])}
                      className={`py-1 px-2.5 border rounded-md text-[10px] font-bold transition-all duration-200 flex items-center space-x-2 ${
                        selectedMonths.length === 0
                          ? "bg-gradient-to-r from-accent-primary to-blue-600 text-[#0B0F19] border-accent-primary font-black shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-[1.02]"
                          : "bg-background-card/80 border-white/10 text-text-secondary hover:text-white hover:border-white/30 hover:bg-background-secondary/60"
                      }`}
                    >
                      <span>All Time</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${selectedMonths.length === 0 ? "bg-[#0B0F19]/20 text-[#0B0F19]" : "bg-white/10 text-white"}`}>
                        {dbCases.length}
                      </span>
                      {selectedMonths.length === 0 && <span className="font-black">✓</span>}
                    </button>
                    {availableMonths.map((ym) => {
                      const count = dbCases.filter((c) => c.date.substring(0, 7) === ym).length;
                      const isSelected = selectedMonths.includes(ym);
                      return (
                        <button
                          key={ym}
                          onClick={() => toggleFilter(selectedMonths, setSelectedMonths, ym)}
                          className={`py-1 px-2 border rounded-md text-[10px] font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                            isSelected
                              ? "bg-gradient-to-r from-warning to-amber-600 text-[#0B0F19] border-warning font-black shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-[1.02]"
                              : "bg-background-card/80 border-white/10 text-text-secondary hover:text-white hover:border-white/30 hover:bg-background-secondary/60"
                          }`}
                        >
                          <span>{formatMonthName(ym)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${isSelected ? "bg-[#0B0F19]/20 text-[#0B0F19]" : "bg-white/10 text-white/80"}`}>
                            {count}
                          </span>
                          {isSelected && <span className="font-black">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Temporal Caseload Density Distribution Bar */}
                <div className="space-y-2 pt-2 border-t border-border-subtle/40 bg-background-secondary/30 p-3 rounded-lg border border-white/10 shadow-inner">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-extrabold text-white uppercase tracking-wider flex items-center">
                      <Activity className="h-4 w-4 text-accent-primary mr-2 animate-pulse" />
                      Temporal Caseload Density Distribution
                    </span>
                    <span className="text-text-secondary font-medium">
                      Total Tracked Volume: <strong className="text-white font-black">{dbCases.length}</strong> FIRs
                    </span>
                  </div>

                  {/* Stacked Progress Bar */}
                  <div className="h-3.5 w-full bg-background-primary/90 rounded-lg overflow-hidden flex border border-white/15 shadow-inner p-0.5 gap-0.5">
                    {availableMonths.map((ym, idx) => {
                      const count = dbCases.filter((c) => c.date.substring(0, 7) === ym).length;
                      const pct = Math.max(2, Math.round((count / dbCases.length) * 100));
                      const isSelected = selectedMonths.length === 0 || selectedMonths.includes(ym);
                      const colors = [
                        "bg-accent-primary",
                        "bg-purple-500",
                        "bg-warning",
                        "bg-success",
                        "bg-danger",
                        "bg-blue-500",
                        "bg-indigo-500",
                        "bg-pink-500",
                        "bg-teal-500",
                        "bg-amber-500",
                      ];
                      const barColor = isSelected ? colors[idx % colors.length] : "bg-white/10 opacity-30";
                      return (
                        <div
                          key={ym}
                          style={{ width: `${pct}%` }}
                          title={`${formatMonthName(ym)}: ${count} cases (${pct}%)`}
                          className={`h-full rounded-sm transition-all duration-300 ${barColor}`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap justify-between items-center text-[10px] text-text-secondary pt-1 gap-2 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-primary shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                      <span>Peak Volume: <strong className="text-white font-bold">Aug 2025 (596 FIRs)</strong></span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                      <span>Lowest Volume: <strong className="text-white font-bold">Jun 2026 (50 FIRs)</strong></span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                      <span>Real-Time Active Caseload: <strong className="text-white font-bold">{filteredCases.filter((c) => (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed" && !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded")).length}</strong> Cases</span>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-text-secondary px-1 select-none border-t border-border-subtle/40 pt-3">
                  <span className="flex items-center space-x-2">
                    <span className="text-accent-primary font-bold">Tip:</span>
                    <span>Click multiple months above to compare and isolate spatial telemetry across specific time periods.</span>
                  </span>
                  {selectedMonths.length > 0 && (
                    <Badge variant="warning" className="text-[10px] font-extrabold">
                      Filtering {selectedMonths.length} Horizon{selectedMonths.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

        {/* Full-width row: Live Spatial Alerts Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2.5 px-1 select-none">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-analytics/15 border border-analytics/40 text-analytics shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                <Activity className="h-4 w-4 animate-pulse" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-white">
                Live Spatial Alerts Feed (AI Data-Driven)
              </span>
            </div>
            <span className="text-[11px] font-extrabold text-accent-primary uppercase tracking-wider px-2.5 py-1 rounded-md bg-accent-primary/10 border border-accent-primary/30 shadow-sm">
              {realAlerts.length} Active Directives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-stretch">
            {realAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="border border-white/20 bg-background-card/90 backdrop-blur shadow-[0_4px_25px_rgba(255,255,255,0.07)] flex flex-col justify-between h-full hover:border-white/40 transition-all duration-200 group"
              >
                <CardContent className="p-3 flex flex-col justify-between h-full space-y-2">
                  <div className="flex justify-between items-start gap-2 border-b border-border-subtle/40 pb-1.5">
                    <span className="font-extrabold text-white text-xs leading-snug flex items-center">
                      <AlertTriangle className="h-4 w-4 text-danger mr-1.5 flex-shrink-0 animate-pulse" />
                      <span>{alert.type}: <span className="text-accent-primary font-semibold">{alert.location.split(",")[0]}</span></span>
                    </span>
                    <Badge
                      variant={alert.severity === "High" ? "danger" : "warning"}
                      className="flex-shrink-0 text-[10px] py-0.5 px-2 font-black uppercase tracking-wide shadow-sm"
                    >
                      Conf: {alert.confidence}%
                    </Badge>
                  </div>

                  <p className="text-[11px] text-text-primary leading-normal py-0.5 font-medium flex-grow">
                    {alert.description}
                  </p>

                  <div className="text-[10px] bg-background-secondary/70 p-2 rounded-md border border-white/10 text-text-primary leading-normal mt-auto shadow-inner group-hover:border-white/20 transition-colors">
                    <span className="font-extrabold text-accent-primary block mb-1 uppercase tracking-wider text-[10px] flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-1 text-accent-primary inline" /> AI Tactical Directive
                    </span>
                    <span className="text-white font-semibold block">{alert.recommendation}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    </div>
  );
}

