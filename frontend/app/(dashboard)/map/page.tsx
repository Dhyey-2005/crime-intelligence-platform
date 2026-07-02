"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  districtsGeoJSON,
  mockStations,
  mockGeographicAlerts,
  timelineSnapshots,
  StationMarker,
  GeographicAlert,
} from "@/constants/mockGeographicData";
import { crimeCategories } from "@/constants/mockAnalyticsData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Form";
import { Badge, Spinner } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import {
  Layers,
  MapPin,
  Clock,
  Settings,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Filter,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Users,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Dynamic import with SSR disabled to prevent server-side leaflet rendering crash
const InteractiveMap = dynamic(() => import("@/components/map/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0B0F19] rounded-lg">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <Paragraph className="text-text-secondary text-xs">Loading GIS Engine...</Paragraph>
      </div>
    </div>
  ),
});

export default function MapPage() {
  // 1. Core States
  const [selectedMonth, setSelectedMonth] = React.useState("apr"); // jan, feb, mar, apr
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

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

  // Find snapshot for the selected month
  const activeSnapshot = React.useMemo(() => {
    return timelineSnapshots.find((s) => s.month === selectedMonth) || timelineSnapshots[3];
  }, [selectedMonth]);

  // Handle Layer Toggle
  const toggleLayer = (layer: keyof typeof layerControls) => {
    setLayerControls((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Selection handlers
  const handleSelectDistrict = (name: string) => {
    setActiveDistrict(name);
    setActiveStation(null);
    toast.info(`Selected District: ${name}`, {
      description: "District intelligence summary is active in panels.",
    });
  };

  const handleSelectStation = (station: StationMarker) => {
    setActiveStation(station);
    setActiveDistrict(null);
    toast.info(`Selected Police Station: ${station.name}`, {
      description: "Police station operational details are active in panels.",
    });
  };

  // Re-calculate district metrics based on active selection (Bengaluru has mock counts)
  const activeDistrictStats = React.useMemo(() => {
    if (!activeDistrict) return null;
    const stations = mockStations.filter((s) => s.district === activeDistrict);
    const totalFIRs = stations.reduce((sum, s) => sum + s.totalFIRs, 0);
    const activeCases = stations.reduce((sum, s) => sum + s.activeCases, 0);
    const pending = stations.reduce((sum, s) => sum + s.pendingInvestigations, 0);
    const officerCount = Math.round(activeCases * 1.8 + 5);
    const risk = activeSnapshot.districtRisks[activeDistrict] || "Low";

    return {
      name: activeDistrict,
      totalFIRs,
      activeCases,
      pending,
      officerCount,
      risk,
    };
  }, [activeDistrict, activeSnapshot]);

  // Overall Statewide metrics
  const statewideStats = React.useMemo(() => {
    const totalFIRs = mockStations.reduce((sum, s) => sum + s.totalFIRs, 0);
    const activeCases = mockStations.reduce((sum, s) => sum + s.activeCases, 0);
    const pending = mockStations.reduce((sum, s) => sum + s.pendingInvestigations, 0);
    return { totalFIRs, activeCases, pending };
  }, []);

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background-primary p-6 overflow-y-auto" : ""}`}>
      <Toaster theme="dark" closeButton />

      {/* 1. Command Header */}
      {!isFullscreen && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-page-title">Geographic Intelligence Command Center</h2>
            <Paragraph className="text-text-secondary">
              Statewide spatial analysis, tactical hotspots mapping, and district operational risk monitoring.
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
              Geographic Intelligence — Fullscreen Mode
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
              districtRisks={activeSnapshot.districtRisks}
              hotspots={activeSnapshot.hotspots}
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
              Click any district polygon or station node to query operational summaries.
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
                  onChange={(val) => {
                    setSelectedCategory(val);
                    toast.info(val ? `Category Filter: ${val}` : "Showing All Categories");
                  }}
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
                    <Badge variant={activeDistrictStats.risk === "High" ? "danger" : activeDistrictStats.risk === "Elevated" ? "warning" : "success"}>
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
                    <span className="font-semibold text-text-primary block mb-0.5">High Priority Crimes:</span>
                    <span>Phishing frauds, Narcotics corridor transport vectors, residential burglaries.</span>
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
                    <Badge variant={activeStation.riskScore > 70 ? "danger" : activeStation.riskScore > 50 ? "warning" : "success"}>
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
                      <span className="font-semibold text-text-primary">Operational Station:</span>{" "}
                      <span>{activeStation.district} Sector Command.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-text-primary">Officer Load Status:</span>{" "}
                      <span>{Math.round(activeStation.activeCases * 1.5)} squad units assigned.</span>
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
                    Select a colored district polygon or a police station marker to query operational summaries, pending backlogs, and resource allocations.
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
                      <span className="text-text-secondary block">Active Month</span>
                      <span className="font-bold text-accent-primary text-xs mt-0.5 block uppercase">{selectedMonth}</span>
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
            Live Spatial Alerts Feed
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockGeographicAlerts.map((alert) => (
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
            <Badge variant="primary">{activeSnapshot.label} Snapshot</Badge>
          </div>
          
          <div className="flex flex-col space-y-4">
            {/* Horizontal Step nodes for month selection */}
            <div className="grid grid-cols-4 gap-2 text-center select-none">
              {timelineSnapshots.map((snap) => (
                <button
                  key={snap.month}
                  onClick={() => {
                    setSelectedMonth(snap.month);
                    toast.success(`Replayed Timeline: ${snap.label}`, {
                      description: `District risks and hotspot coordinates synchronized. Active caseload: ${snap.totalCases}.`,
                    });
                  }}
                  className={`py-2 px-3 border rounded text-[11px] font-semibold transition-all ${
                    selectedMonth === snap.month
                      ? "bg-accent-primary/10 border-accent-primary text-text-primary"
                      : "bg-background-secondary/20 border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-default"
                  }`}
                >
                  {snap.label.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-[10px] text-text-secondary px-1 select-none">
              <span>Start (Jan 2026: {timelineSnapshots[0].totalCases} Cases)</span>
              <span>Active Hotspots updated in Real-Time</span>
              <span>Current (Apr 2026: {timelineSnapshots[3].totalCases} Cases)</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
