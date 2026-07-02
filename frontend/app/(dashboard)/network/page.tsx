"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  mockNetworkNodes,
  mockNetworkEdges,
  mockOverviewStats,
  mockRecommendations,
  GraphNode,
  GraphEdge,
} from "@/constants/mockNetworkData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Form";
import { Badge, Spinner } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import { StatContainer } from "@/components/ui/DataDisplay";
import Button from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
import {
  Network,
  Share2,
  Users,
  Compass,
  Layers,
  Search,
  AlertTriangle,
  Zap,
  Activity,
  UserCheck,
  TrendingUp,
  FileText,
  ShieldAlert,
  ArrowRight,
  Clock,
  Link as LinkIcon,
  HelpCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Dynamic import with SSR disabled to prevent Cytoscape window is not defined errors
const NetworkGraph = dynamic(() => import("@/components/network/NetworkGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0B0F19] rounded-lg">
      <div className="text-center space-y-3">
        <Spinner size="lg" />
        <Paragraph className="text-text-secondary text-xs">Loading Graph Engine...</Paragraph>
      </div>
    </div>
  ),
});

const entityTypes = [
  "Suspect",
  "Victim",
  "Case",
  "Police Station",
  "District",
  "Crime Scene",
  "Vehicle",
  "Weapon",
  "Mobile Number",
  "Gang",
  "Investigation Officer",
];

const relationshipTypes = [
  "Involved In",
  "Reported By",
  "Investigated By",
  "Arrested In",
  "Associated With",
  "Same Vehicle",
  "Same Weapon",
  "Same Location",
  "Same Gang",
  "Same Mobile Number",
];

export default function NetworkPage() {
  // 1. Filter States
  const [selectedEntityType, setSelectedEntityType] = React.useState("");
  const [selectedRelType, setSelectedRelType] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");

  // Selection states (Default John Doe selected)
  const [selectedNode, setSelectedNode] = React.useState<GraphNode>(mockNetworkNodes[0]);

  // Handle re-filtering of nodes and edges
  const filteredNodes = React.useMemo(() => {
    return mockNetworkNodes.filter((node) => {
      if (selectedEntityType && node.type !== selectedEntityType) return false;
      if (selectedSeverity) {
        if (selectedSeverity === "High" && node.riskScore < 75) return false;
        if (selectedSeverity === "Medium" && (node.riskScore < 50 || node.riskScore >= 75)) return false;
        if (selectedSeverity === "Low" && node.riskScore >= 50) return false;
      }
      if (selectedDistrict) {
        // District filter matching metadata
        if (node.type === "District" && node.label !== selectedDistrict) return false;
        if (node.metadata.cases && !node.metadata.cases.some((c) => c.district === selectedDistrict)) return false;
      }
      return true;
    });
  }, [selectedEntityType, selectedSeverity, selectedDistrict]);

  const filteredEdges = React.useMemo(() => {
    const visibleIds = new Set(filteredNodes.map((n) => n.id));
    return mockNetworkEdges.filter((edge) => {
      // Connect only visible nodes
      if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return false;
      if (selectedRelType && edge.type !== selectedRelType) return false;
      return true;
    });
  }, [filteredNodes, selectedRelType]);

  // Find linked entities for selected node
  const linkedEntities = React.useMemo(() => {
    if (!selectedNode) return [];
    
    // Find all edges connected to selected node
    const connectedEdges = mockNetworkEdges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );

    return connectedEdges.map((edge) => {
      const neighborId = edge.source === selectedNode.id ? edge.target : edge.source;
      const neighborNode = mockNetworkNodes.find((n) => n.id === neighborId);
      
      return {
        id: neighborId,
        label: neighborNode?.label || "Unknown Entity",
        type: neighborNode?.type || "Unknown Type",
        relationship: edge.type,
        risk: neighborNode?.riskScore || 0,
      };
    });
  }, [selectedNode]);

  const handleNodeSelect = (node: GraphNode) => {
    setSelectedNode(node);
    toast.success(`Queried Entity: ${node.label}`, {
      description: `Intelligence profile loaded. Risk score: ${node.riskScore}%.`,
    });
  };

  const handleRecommendationAction = (recTitle: string, action: string) => {
    toast.info(`Executing Action: ${action}`, {
      description: `Dispatched operational order for "${recTitle}".`,
    });
  };

  return (
    <div className="space-y-6">
      <Toaster theme="dark" closeButton />

      {/* 1. Header Navigation */}
      <div>
        <h2 className="text-page-title">Criminal Intelligence & Link Analysis Center</h2>
        <Paragraph className="text-text-secondary">
          Interactive relationship network analysis, repeat offender mapping, and suspect association tracking.
        </Paragraph>
      </div>

      {/* 2. Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatContainer title="Total Criminals" value={mockOverviewStats.totalCriminals} description="Tracked suspect identities" icon={<Users className="h-4 w-4 text-danger" />} />
        <StatContainer title="Repeat Offenders" value={mockOverviewStats.repeatOffenders} description="Priors in 3+ open cases" icon={<UserCheck className="h-4 w-4 text-warning" />} />
        <StatContainer title="Active Networks" value={mockOverviewStats.activeNetworks} description="Identified gang / fraud cartels" icon={<Network className="h-4 w-4 text-accent-primary" />} />
        <StatContainer title="Connected Cases" value={mockOverviewStats.connectedCases} description="Cases linked by shared vehicles/weapons" icon={<Layers className="h-4 w-4 text-analytics" />} />
        <StatContainer title="Organized Groups" value={mockOverviewStats.organizedGroups} description="Monitored crime gang syndicates" icon={<Compass className="h-4 w-4 text-ai" />} />
        <StatContainer title="Cross-District Links" value={mockOverviewStats.crossDistrictLinks} description="Suspects active in multi-jurisdictions" icon={<Share2 className="h-4 w-4 text-success" />} />
      </div>

      {/* 3. Global Filters Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center">
              <Compass className="h-4 w-4 text-accent-primary mr-1.5 animate-spin duration-5000" />
              Graph Filters Console
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedEntityType("");
                setSelectedRelType("");
                setSelectedSeverity("");
                setSelectedDistrict("");
              }}
              className="text-[10px] h-7 px-2"
            >
              Reset Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Entity Type</label>
              <Select
                options={[
                  { value: "", label: "All Entities" },
                  ...entityTypes.map((t) => ({ value: t, label: t })),
                ]}
                value={selectedEntityType}
                onChange={(val) => setSelectedEntityType(val)}
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Relationship Type</label>
              <Select
                options={[
                  { value: "", label: "All Relationships" },
                  ...relationshipTypes.map((r) => ({ value: r, label: r })),
                ]}
                value={selectedRelType}
                onChange={(val) => setSelectedRelType(val)}
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Risk Severity</label>
              <Select
                options={[
                  { value: "", label: "All Levels" },
                  { value: "High", label: "High Risk (>75%)" },
                  { value: "Medium", label: "Medium Risk (50-75%)" },
                  { value: "Low", label: "Low Risk (<50%)" },
                ]}
                value={selectedSeverity}
                onChange={(val) => setSelectedSeverity(val)}
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Active District Link</label>
              <Select
                options={[
                  { value: "", label: "All Districts" },
                  { value: "Bengaluru City", label: "Bengaluru City" },
                  { value: "Mysuru City", label: "Mysuru City" },
                ]}
                value={selectedDistrict}
                onChange={(val) => setSelectedDistrict(val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Graph & Sidebar Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center: Cytoscape Viewport (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="relative h-[550px] w-full rounded-lg border border-border-subtle overflow-hidden">
            {/* The dynamically imported Cytoscape Map canvas */}
            <NetworkGraph
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodeSelect={handleNodeSelect}
            />

            {/* Floating Legend Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 z-10 bg-background-card/90 backdrop-blur border border-border-subtle rounded p-2.5 max-w-[190px] select-none text-[8px] space-y-1.5 shadow-md">
              <span className="font-bold text-text-primary block border-b border-border-subtle pb-0.5">Entity Color Legend</span>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-text-secondary">
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mr-1 inline-block" /> Suspect</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#F97316] mr-1 inline-block" /> Case</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mr-1 inline-block" /> Victim</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#991B1B] mr-1 inline-block" /> Gang</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] mr-1 inline-block" /> Vehicle</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] mr-1 inline-block" /> Weapon</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] mr-1 inline-block" /> Mobile</span>
                <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#EC4899] mr-1 inline-block" /> Officer</span>
              </div>
            </div>

            {/* Node click instruction (Floating Bottom Right) */}
            <div className="absolute bottom-3 right-3 z-10 bg-background-card/80 backdrop-blur border border-border-subtle rounded px-2 py-0.5 text-[9px] text-text-secondary select-none">
              Click node to load profile or drag to rearrange.
            </div>
          </div>

          {/* Associated Case Summary List */}
          {selectedNode?.metadata.cases && (
            <Card>
              <CardHeader className="pb-2 border-none">
                <CardTitle className="text-xs uppercase tracking-wider text-text-primary">
                  Linked Cases Dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full overflow-x-auto rounded-md border border-border-subtle">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                        <th className="p-2.5 font-semibold">FIR Number</th>
                        <th className="p-2.5 font-semibold">Category</th>
                        <th className="p-2.5 font-semibold">Status</th>
                        <th className="p-2.5 font-semibold">Assigned Officer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-text-secondary">
                      {selectedNode.metadata.cases.map((c) => (
                        <tr key={c.firNumber} className="hover:bg-background-secondary/20 transition-colors">
                          <td className="p-2.5 text-text-primary font-bold">{c.firNumber}</td>
                          <td className="p-2.5">{c.category}</td>
                          <td className="p-2.5">
                            <Badge variant={c.status === "Closed" ? "success" : "warning"}>{c.status}</Badge>
                          </td>
                          <td className="p-2.5">{c.officer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Selected Node Details Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Selected Entity Intelligence Panel */}
          {selectedNode ? (
            <Card className="border border-accent-primary/20 bg-background-card/50">
              <CardHeader className="pb-3 border-none flex flex-row items-center justify-between">
                <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                  <ShieldAlert className="h-4.5 w-4.5 mr-1.5 text-accent-primary" />
                  Entity Intelligence Profile
                </CardTitle>
                <Badge variant={selectedNode.riskScore > 75 ? "danger" : selectedNode.riskScore > 40 ? "warning" : "success"}>
                  Risk Score: {selectedNode.riskScore}%
                </Badge>
              </CardHeader>
              <CardContent className="pt-0 space-y-4 select-none text-xs leading-normal">
                
                <div className="border-b border-border-subtle pb-3">
                  <h3 className="font-bold text-text-primary text-sm">{selectedNode.label}</h3>
                  <Caption className="text-text-secondary mt-0.5 uppercase tracking-wider">Type: {selectedNode.type}</Caption>
                  {selectedNode.metadata.status && (
                    <span className="block mt-1 font-semibold text-warning text-[10px]">Status: {selectedNode.metadata.status}</span>
                  )}
                  {selectedNode.metadata.details && (
                    <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">{selectedNode.metadata.details}</p>
                  )}
                </div>

                {/* Risk Indicators badging */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-text-secondary uppercase font-bold block">Risk Analysis Indicators</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.metadata.repeatOffender && <Badge variant="danger">Repeat Offender</Badge>}
                    {selectedNode.metadata.organizedCrime && <Badge variant="danger">Organized Crime Group</Badge>}
                    {selectedNode.metadata.crossDistrict && <Badge variant="warning">Cross-District Activity</Badge>}
                    {selectedNode.metadata.highRisk && <Badge variant="danger">High Risk Suspect</Badge>}
                    {selectedNode.metadata.investigationPriority && <Badge variant="primary">Priority Target</Badge>}
                    {!selectedNode.metadata.repeatOffender && !selectedNode.metadata.organizedCrime && !selectedNode.metadata.highRisk && (
                      <Badge variant="secondary">No Indicators Triggered</Badge>
                    )}
                  </div>
                </div>

                {/* Known Associations List */}
                {selectedNode.metadata.knownAssociations && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-text-secondary uppercase font-bold block">Direct Links Map</span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {selectedNode.metadata.knownAssociations.map((assoc) => (
                        <span key={assoc} className="px-2 py-0.5 bg-background-secondary rounded border border-border-subtle text-text-secondary">
                          {assoc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relationship Explorer Details */}
                <div className="space-y-2 border-t border-border-subtle pt-3">
                  <span className="text-[9px] text-text-secondary uppercase font-bold block flex items-center">
                    <LinkIcon className="h-3.5 w-3.5 mr-1 text-accent-primary" />
                    Relationship Explorer ({linkedEntities.length} Links)
                  </span>
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {linkedEntities.map((link) => (
                      <div
                        key={link.id}
                        className="flex justify-between items-center p-2 bg-background-secondary/30 rounded border border-border-subtle text-[10px]"
                      >
                        <div>
                          <span className="font-semibold text-text-primary block leading-none">{link.label}</span>
                          <span className="text-[8px] text-text-secondary block mt-0.5">{link.type}</span>
                        </div>
                        <Badge variant="secondary">{link.relationship}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History Timeline */}
                {selectedNode.metadata.history && (
                  <div className="space-y-2 border-t border-border-subtle pt-3">
                    <span className="text-[9px] text-text-secondary uppercase font-bold block flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-warning" />
                      Relationship History Timeline
                    </span>
                    <div className="space-y-3 pl-1.5 border-l border-border-default ml-1">
                      {selectedNode.metadata.history.map((hist, index) => (
                        <div key={index} className="relative pl-3 text-[10px] leading-relaxed">
                          <span className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-warning border border-background-card" />
                          <span className="text-[8px] text-text-secondary block leading-none">{hist.date}</span>
                          <span className="text-text-primary font-medium">{hist.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-text-secondary text-xs">
                Select a network node from the graph to load entity intelligence.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Second Row: AI Suggested Directives (Horizontal Responsive Grid) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-1.5 px-1 select-none">
          <Zap className="h-4 w-4 text-warning" />
          <span className="text-xs uppercase font-bold tracking-wider text-text-primary">
            AI Suggested Directives
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockRecommendations.map((rec) => (
            <Card key={rec.id} className="flex flex-col h-40 justify-between">
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-text-primary text-[10px] leading-tight flex items-center pr-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-danger mr-1.5 flex-shrink-0" />
                    {rec.title}
                  </span>
                  <Badge variant="primary" className="flex-shrink-0 text-[8px] py-0 px-1">
                    {rec.id}
                  </Badge>
                </div>
                <p className="text-[9px] text-text-secondary leading-relaxed flex-grow overflow-y-auto pr-1">
                  {rec.description}
                </p>
                <div className="pt-1.5 border-t border-border-subtle/50 mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRecommendationAction(rec.title, rec.actionLabel)}
                    className="w-full text-[9px] h-6 px-2 justify-center"
                  >
                    {rec.actionLabel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
