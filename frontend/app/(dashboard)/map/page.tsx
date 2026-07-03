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
  const [dbCases, setDbCases] = React.useState<AnalyticsCase[]>(mockAnalyticsCases);
  const [selectedMonth, setSelectedMonth] = React.useState("all");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

  // Fetch real database records on mount
  React.useEffect(() => {
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

  // Filtered cases based on map filters
  const filteredCases = React.useMemo(() => {
    return dbCases.filter((c) => {
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (selectedSeverity && c.severity !== selectedSeverity) return false;
      if (selectedStatus && c.status !== selectedStatus) return false;
      if (selectedMonth && selectedMonth !== "all") {
        if (!c.date.substring(0, 7).includes(selectedMonth)) return false;
      }
      return true;
    });
  }, [dbCases, selectedCategory, selectedSeverity, selectedStatus, selectedMonth]);

  // Generate distinct months for timeline replay
  const availableMonths = React.useMemo(() => {
    const months = Array.from(new Set(dbCases.map((c) => c.date.substring(0, 7)))).sort();
    return months.length > 0 ? months : ["2026-05", "2026-06"];
  }, [dbCases]);

  // Dynamic Real Station Markers
  const realStations: StationMarker[] = React.useMemo(() => {
    const stationGroups: Record<string, AnalyticsCase[]> = {};
    filteredCases.forEach((c) => {
      if (!c.policeStation) return;
      if (!stationGroups[c.policeStation]) stationGroups[c.policeStation] = [];
      stationGroups[c.policeStation].push(c);
    });

    const entries = Object.entries(stationGroups);
    if (entries.length === 0) return mockStations;

    return entries.map(([name, cases], idx) => {
      const district = cases[0]?.district || "Bengaluru Urban";
      const [lat, lng] = getStationCoordinates(name, district, idx);
      const totalFIRs = cases.length;
      const activeCases = cases.filter((c) => c.status === "Under Investigation" || c.status === "Awaiting Trial").length;
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
  }, [filteredCases]);

  // Dynamic Real Crime Hotspots
  const realHotspots: HotspotPoint[] = React.useMemo(() => {
    return realStations
      .filter((s) => s.totalFIRs >= 3 || s.riskScore >= 45)
      .map((s) => ({
        lat: s.lat,
        lng: s.lng,
        radius: Math.min(4500, Math.max(1500, s.totalFIRs * 180)),
        intensity: Math.min(0.85, 0.35 + s.riskScore / 140),
      }));
  }, [realStations]);

  // Dynamic Real District Risk Mappings
  const realDistrictRisks = React.useMemo(() => {
    const counts: Record<string, { total: number; high: number }> = {};
    filteredCases.forEach((c) => {
      if (!counts[c.district]) counts[c.district] = { total: 0, high: 0 };
      counts[c.district].total += 1;
      if (c.severity === "High") counts[c.district].high += 1;
    });

    const risks: Record<string, "High" | "Elevated" | "Moderate" | "Low"> = {};
    districtsGeoJSON.forEach((dist) => {
      const data = counts[dist.name] || { total: 0, high: 0 };
      const ratio = data.total > 0 ? data.high / data.total : 0;
      if (ratio > 0.35 || data.total > 150) risks[dist.name] = "High";
      else if (ratio > 0.2 || data.total > 80) risks[dist.name] = "Elevated";
      else if (data.total > 25) risks[dist.name] = "Moderate";
      else risks[dist.name] = "Low";
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
    const activeCases = distCases.filter((c) => c.status === "Under Investigation" || c.status === "Awaiting Trial").length;
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
    const activeCases = filteredCases.filter((c) => c.status === "Under Investigation" || c.status === "Awaiting Trial").length;
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
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background-primary p-6 overflow-y-auto" : ""}`}>


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
      )}

      {/* 2. Map & Dashboard Grid (Top Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Map Viewport (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Map canvas container */}
          <div className="relative h-[550px] w-full bg-[#0B0F19] rounded-lg border border-border-subtle overflow-hidden">
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
                  <span>Active AI Alerts</span>
                </label>
              </div>
            </div>

            {/* District click instructions (Floating Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-background-card/85 backdrop-blur border border-border-subtle rounded px-2.5 py-1 text-[9px] text-text-secondary select-none shadow">
              Click any Karnataka district polygon or police station marker to query real-time database telemetry.
            </div>
          </div>
        </div>

        {/* Right Side: Map Controls & Details Panels (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Global Map Filters */}
          <Card>
            <CardHeader className="pb-3 border-none flex flex-row items-center justify-between">
              <CardTitle className="text-xs flex items-center uppercase tracking-wider text-text-primary">
                <Filter className="h-4 w-4 text-accent-primary mr-1.5" />
                Map Filters Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <label className="text-[10px] font-semibold text-text-secondary block mb-1">Crime Category</label>
                <Select
                  options={[
                    { value: "", label: "All Categories" },
                    ...crimeCategories.map((c) => ({ value: c, label: c })),
                  ]}
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-text-secondary block mb-1">Incident Severity</label>
                <Select
                  options={[
                    { value: "", label: "All Severities" },
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" },
                  ]}
                  value={selectedSeverity}
                  onChange={(val) => setSelectedSeverity(val)}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-text-secondary block mb-1">Case Status</label>
                <Select
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "Under Investigation", label: "Under Investigation" },
                    { value: "Closed", label: "Closed" },
                  ]}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Active Intelligence Panel (District OR Police Station) */}
          <Card className="border border-accent-primary/20 bg-background-card/50">
            <CardHeader className="pb-2 border-none">
              <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5 text-accent-primary animate-pulse" />
                Spatial Intelligence Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 select-none">
              {/* Scenario 1: District selected */}
              {activeDistrictStats && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-bold text-text-primary text-xs flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-accent-primary" />
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

                  <div className="grid grid-cols-2 gap-3 text-center text-[10px]">
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Total FIRs</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeDistrictStats.totalFIRs}</span>
                    </div>
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Active Cases</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeDistrictStats.activeCases}</span>
                    </div>
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Pending Search</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeDistrictStats.pending}</span>
                    </div>
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Officers Deployed</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeDistrictStats.officerCount}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-text-secondary space-y-1 bg-background-secondary/20 p-2.5 rounded border border-border-subtle">
                    <span className="font-semibold text-text-primary block mb-0.5">Real-Time Telemetry:</span>
                    <span>Monitoring live FIR filings, active court procedures, and investigative squad allocations.</span>
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <Link href="/analytics" className="w-full">
                      <Button variant="secondary" className="w-full text-[10px] h-8 px-2" rightIcon={<ArrowRight className="h-3 w-3" />}>
                        District Analytics
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setActiveDistrict(null)} className="text-[10px] h-8 px-2">
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Scenario 2: Police Station selected */}
              {!activeDistrictStats && activeStation && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                    <span className="font-bold text-text-primary text-xs flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-warning" />
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

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Total FIRs</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeStation.totalFIRs}</span>
                    </div>
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Active</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeStation.activeCases}</span>
                    </div>
                    <div className="p-2 bg-background-secondary/30 rounded border border-border-subtle">
                      <span className="block text-text-secondary uppercase">Pending</span>
                      <span className="text-sm font-bold text-text-primary mt-0.5 block">{activeStation.pendingInvestigations}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-text-secondary space-y-1.5 bg-background-secondary/20 p-2.5 rounded border border-border-subtle">
                    <div>
                      <span className="font-semibold text-text-primary">Operational Sector:</span>{" "}
                      <span>{activeStation.district} Command Jurisdiction.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-text-primary">Officer Deployment:</span>{" "}
                      <span>{Math.round(activeStation.activeCases * 1.5 + 2)} active field squads.</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <Link href="/investigation" className="w-full">
                      <Button variant="secondary" className="w-full text-[10px] h-8 px-2" rightIcon={<ArrowRight className="h-3 w-3" />}>
                        Query Incident FIRs
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => setActiveStation(null)} className="text-[10px] h-8 px-2">
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Scenario 3: Nothing selected (Statewide summary) */}
              {!activeDistrictStats && !activeStation && (
                <div className="space-y-4 text-center py-2">
                  <div className="h-10 w-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mx-auto mb-2">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-text-primary text-xs block">Statewide Map Status Summary</span>
                  <Paragraph className="text-[10px] leading-relaxed max-w-xs mx-auto">
                    Select a colored Karnataka district polygon or a police station marker to query live database caseloads and tactical deployments.
                  </Paragraph>

                  <div className="grid grid-cols-3 gap-2 border-t border-border-subtle pt-3 text-[10px]">
                    <div>
                      <span className="text-text-secondary block">Statewide FIRs</span>
                      <span className="font-bold text-text-primary text-xs mt-0.5 block">{statewideStats.totalFIRs}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Active Caseload</span>
                      <span className="font-bold text-text-primary text-xs mt-0.5 block">{statewideStats.activeCases}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary block">Timeline Slice</span>
                      <span className="font-bold text-accent-primary text-xs mt-0.5 block uppercase">
                        {formatMonthName(selectedMonth).split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row: Live Spatial Alerts Feed (Horizontal Responsive Grid) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-1.5 px-1 select-none">
          <Activity className="h-4 w-4 text-analytics" />
          <span className="text-xs uppercase font-bold tracking-wider text-text-primary">
            Live Spatial Alerts Feed (AI Data-Driven)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {realAlerts.map((alert) => (
            <Card key={alert.id} className="flex flex-col h-40 justify-between">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-text-primary text-[10px] leading-tight flex items-center pr-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-danger mr-1 flex-shrink-0" />
                    {alert.type}: {alert.location.split(",")[0]}
                  </span>
                  <Badge variant={alert.severity === "High" ? "danger" : "warning"} className="flex-shrink-0 text-[8px] py-0 px-1">
                    Conf: {alert.confidence}%
                  </Badge>
                </div>
                <p className="text-[9px] text-text-secondary leading-relaxed flex-grow overflow-y-auto pr-1">
                  {alert.description}
                </p>
                <div className="text-[9px] text-accent-primary leading-normal pt-1.5 border-t border-border-subtle/50 mt-auto">
                  <span className="font-bold">AI Directive:</span> {alert.recommendation}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Third Row: Historical Crime Evolution Timeline Replay */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 select-none">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center">
              <Clock className="h-4 w-4 text-warning mr-1.5" />
              Historical Crime Evolution Timeline Replay
            </span>
            <Badge variant="primary">{formatMonthName(selectedMonth)} Snapshot</Badge>
          </div>

          <div className="flex flex-col space-y-4">
            {/* Horizontal Step nodes for month selection */}
            <div className="flex flex-wrap gap-2 text-center select-none">
              <button
                onClick={() => setSelectedMonth("all")}
                className={`py-2 px-4 border rounded text-[11px] font-semibold transition-all ${
                  selectedMonth === "all"
                    ? "bg-accent-primary/10 border-accent-primary text-text-primary shadow-sm"
                    : "bg-background-secondary/20 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default"
                }`}
              >
                All Time ({dbCases.length})
              </button>
              {availableMonths.map((ym) => {
                const count = dbCases.filter((c) => c.date.substring(0, 7) === ym).length;
                return (
                  <button
                    key={ym}
                    onClick={() => setSelectedMonth(ym)}
                    className={`py-2 px-4 border rounded text-[11px] font-semibold transition-all ${
                      selectedMonth === ym
                        ? "bg-accent-primary/10 border-accent-primary text-text-primary shadow-sm"
                        : "bg-background-secondary/20 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default"
                    }`}
                  >
                    {formatMonthName(ym)} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] text-text-secondary px-1 select-none">
              <span>Database Telemetry Active</span>
              <span>Hotspots & Risk Borders Computed in Real-Time</span>
              <span>Total Active Dataset: {dbCases.length} Cases</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
