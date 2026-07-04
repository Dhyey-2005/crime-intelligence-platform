"use client";

import * as React from "react";
import { useAuthStore } from "@/store/authStore";
import {
  mockInvestigations,
  mockOperationalAlerts,
  mockResourceAllocation,
  mockRecommendedActions,
  InvestigationCase,
} from "@/constants/mockOperationalData";
import { districts, crimeCategories } from "@/constants/mockAnalyticsData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, Input } from "@/components/ui/Form";
import { Badge, ProgressBar } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import { StatContainer } from "@/components/ui/DataDisplay";
import Button from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
import {
  Search,
  Layers,
  Clock,
  Filter,
  ShieldAlert,
  Zap,
  Activity,
  FileText,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Investigation Status Lifecycle Steps
const statusSteps = [
  "FIR Registered",
  "Investigation Started",
  "Evidence Collection",
  "Arrest Completed",
  "Charge Sheet Filed",
  "Court Proceedings",
  "Case Closed",
];

export default function InvestigationPage() {
  const { user } = useAuthStore();

  // 1. Filter States
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Case Table sorting state
  const [sortField, setSortField] = React.useState<keyof InvestigationCase>("caseNumber");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Selected Case for interactive timeline tracking (Default to first case)
  const [selectedCase, setSelectedCase] = React.useState<InvestigationCase>(mockInvestigations[0]);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);

  // Filtered Investigations
  const filteredCases = React.useMemo(() => {
    return mockInvestigations.filter((c) => {
      if (selectedDistrict && c.district !== selectedDistrict) return false;
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (selectedStatus && c.status !== selectedStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          c.caseNumber.toLowerCase().includes(query) ||
          c.assignedOfficer.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedDistrict, selectedCategory, selectedStatus, searchQuery]);

  // Sort implementation
  const sortedCases = React.useMemo(() => {
    const list = [...filteredCases];
    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return list;
  }, [filteredCases, sortField, sortDirection]);

  // Operational KPIs derived dynamically
  const kpis = React.useMemo(() => {
    const active = filteredCases.filter((c) => (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed" && !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded")).length;
    const pending = filteredCases.filter((c) => (c.status as string) === "Investigation Started" || (c.status as string) === "Evidence Collection" || (c.status as string) === "Under Investigation").length;
    const closed = filteredCases.filter((c) => (c.status as string) === "Case Closed" || (c.status as string) === "Closed" || (c.status as string).toLowerCase().includes("closed") || (c.status as string).toLowerCase().includes("compounded")).length;
    const backlog = filteredCases.filter((c) => c.durationDays > 20 && (c.status as string) !== "Case Closed").length;
    const total = filteredCases.length;
    const completionRate = total > 0 ? Math.round((closed / total) * 100) : 100;
    
    // Average time in days
    const avgTime = total > 0 ? Math.round(filteredCases.reduce((sum, c) => sum + c.durationDays, 0) / total) : 0;

    return {
      active,
      pending,
      closed,
      backlog,
      completionRate,
      avgTime,
    };
  }, [filteredCases]);

  const handleSort = (field: keyof InvestigationCase) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectCase = (caseObj: InvestigationCase) => {
    setSelectedCase(caseObj);
    toast.success(`Tracking Case: ${caseObj.caseNumber}`, {
      description: `Investigation lifecycle timeline updated.`,
    });
  };

  const executeAction = (actionTitle: string) => {
    toast.success(`Action Dispatched`, {
      description: `Dispatched operational workflow for "${actionTitle}".`,
    });
  };

  // Helper to determine step index of selected case status
  const currentStepIndex = statusSteps.indexOf(selectedCase?.status || "FIR Registered");

  return (
    <div className="space-y-6">
      <Toaster theme="dark" closeButton />

      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-page-title">Operational Command Center</h2>
          <Paragraph className="text-text-secondary">
            Manage ongoing case files, assign field officers, monitor investigation timelines, and audit caseload backlogs.
          </Paragraph>
        </div>
      </div>

      {/* 2. Operational KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatContainer title="Active Investigations" value={kpis.active} trend={{ value: "+2.4%", direction: "up" }} description="Cases actively open in field" icon={<Activity className="h-5 w-5" />} />
        <StatContainer title="Pending Searches" value={kpis.pending} trend={{ value: "-5.0%", direction: "down" }} description="Cases in starting lifecycle stages" icon={<Clock className="h-5 w-5" />} />
        <StatContainer title="Closed Cases" value={kpis.closed} trend={{ value: "+12.4%", direction: "up" }} description="Archived completed files" icon={<CheckCircle className="h-5 w-5" />} />
        <StatContainer title="Avg Investigation Duration" value={`${kpis.avgTime} Days`} trend={{ value: "Stable", direction: "up" }} description="Average days taken to close case" icon={<Calendar className="h-5 w-5" />} />
        <StatContainer title="Investigation Backlog" value={kpis.backlog} trend={{ value: "+1", direction: "up" }} description="Cases exceeding 20-day limit" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatContainer title="Case Completion Rate" value={`${kpis.completionRate}%`} trend={{ value: "+4.2%", direction: "up" }} description="Caseload resolution percentage" icon={<FileText className="h-5 w-5" />} />
        <StatContainer title="Active Field Officers" value={mockResourceAllocation.officersActive} trend={{ value: "110/142 Available", direction: "up" }} description="Officers currently deployed" icon={<UserCheck className="h-5 w-5" />} />
        <StatContainer title="Officer Capacity Load" value="85%" trend={{ value: "Stable", direction: "up" }} description="Average workforce utilization rate" icon={<Layers className="h-5 w-5" />} />
      </div>

      {/* 3. Filters Console */}
      <Card>
        <CardContent className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center">
              <Filter className="h-4 w-4 text-accent-primary mr-1.5" />
              Operational Filters Bar
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDistrict("");
                setSelectedCategory("");
                setSelectedStatus("");
                setSearchQuery("");
              }}
              className="text-[10px] h-7 px-2"
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Search Cases</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-text-secondary" />
                </span>
                <Input
                  type="search"
                  placeholder="Case #, Officer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">District</label>
              <Select
                options={[
                  { value: "", label: "All Districts" },
                  ...districts.map((d) => ({ value: d, label: d })),
                ]}
                value={selectedDistrict}
                onChange={(val) => setSelectedDistrict(val)}
              />
            </div>

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
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Investigation Lifecycle Stage</label>
              <Select
                options={[
                  { value: "", label: "All Stages" },
                  ...statusSteps.map((s) => ({ value: s, label: s })),
                ]}
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Timeline Progress & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Case Assignment Table (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Reusable Case Assignment Board */}
          <Card>
            <CardHeader>
              <CardTitle>Case Assignment Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-background-card">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                      <th onClick={() => handleSort("caseNumber")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Case Number</th>
                      <th onClick={() => handleSort("assignedOfficer")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Assigned Officer</th>
                      <th onClick={() => handleSort("priority")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Priority</th>
                      <th className="p-3 font-semibold">District</th>
                      <th className="p-3 font-semibold">Lifecycle Stage</th>
                      <th className="p-3 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-text-secondary">
                    {sortedCases.length > 0 ? (
                      sortedCases.map((caseObj) => (
                        <tr
                          key={caseObj.caseNumber}
                          className={`hover:bg-background-secondary/20 transition-colors cursor-pointer ${
                            selectedCase?.caseNumber === caseObj.caseNumber ? "bg-accent-primary/5 font-medium" : ""
                          }`}
                          onClick={() => handleSelectCase(caseObj)}
                        >
                          <td className="p-3 font-semibold text-text-primary">{caseObj.caseNumber}</td>
                          <td className="p-3 text-text-primary">{caseObj.assignedOfficer}</td>
                          <td className="p-3">
                            <Badge variant={caseObj.priority === "High" ? "danger" : caseObj.priority === "Medium" ? "warning" : "secondary"}>
                              {caseObj.priority}
                            </Badge>
                          </td>
                          <td className="p-3">{caseObj.district}</td>
                          <td className="p-3">
                            <Badge variant={caseObj.status === "Case Closed" ? "success" : "primary"}>
                              {caseObj.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectCase(caseObj);
                                setIsDetailDrawerOpen(true);
                              }}
                              className="text-[10px] h-7 px-2"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-text-secondary">
                          No active operational investigations match this query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Investigation Lifecycle Timeline dashboard (Flashes steps for selected case) */}
          {selectedCase && (
            <Card className="border border-accent-primary/20">
              <CardHeader className="pb-2 border-none">
                <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                  <Activity className="h-4 w-4 mr-1.5 text-accent-primary" />
                  Lifecycle Progress Tracker: {selectedCase.caseNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Horizontal Progress Timeline */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative md:px-4 py-2 select-none">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;

                    return (
                      <div key={step} className="flex md:flex-col items-center text-left md:text-center space-x-3 md:space-x-0 space-y-0 md:space-y-2 relative z-10 flex-1 w-full">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                            isActive
                              ? "bg-accent-primary border-accent-primary text-text-primary ring-4 ring-accent-primary/25"
                              : isCompleted
                              ? "bg-success/20 border-success text-success"
                              : "bg-background-card border-border-default text-text-secondary"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-[9px] font-semibold tracking-tight md:max-w-[85px] leading-tight ${
                              isActive ? "text-text-primary font-bold" : isCompleted ? "text-text-secondary" : "text-text-secondary/60"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Connecting visual lines on desktop */}
                  <div className="hidden md:block absolute left-10 right-10 top-5 h-0.5 bg-border-subtle -z-10" />
                </div>

                <div className="p-3 bg-background-secondary/20 border border-border-subtle rounded text-[10px] text-text-secondary flex justify-between items-center">
                  <span>Assigned: <strong className="text-text-primary">{selectedCase.assignedOfficer}</strong></span>
                  <span>Days Active: <strong className="text-text-primary">{selectedCase.durationDays} Days</strong></span>
                  <span>Deadline Limit: <strong className="text-text-primary">{selectedCase.deadline}</strong></span>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Side: Operational Alerts & Recommended Actions (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Operational Alerts Feed */}
          <Card>
            <CardHeader className="pb-2 border-none">
              <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                <ShieldAlert className="h-4.5 w-4.5 mr-1.5 text-danger animate-pulse" />
                Operational Alerts Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 select-none">
              {mockOperationalAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-background-secondary/20 border border-border-subtle rounded-md space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-text-primary flex items-center">
                      <AlertTriangle className="h-3.5 w-3.5 text-danger mr-1" />
                      {alert.type}
                    </span>
                    <Badge variant={alert.severity === "High" ? "danger" : "warning"}>{alert.severity}</Badge>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-normal">{alert.description}</p>
                  <div className="text-[10px] text-accent-primary leading-normal pt-1.5 border-t border-border-subtle/50">
                    <span className="font-bold">Directive:</span> {alert.recommendation}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reallocation Panel and recommended actions */}
          <Card>
            <CardHeader className="pb-2 border-none">
              <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                <Zap className="h-4.5 w-4.5 mr-1.5 text-warning" />
                Suggested Command Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 select-none">
              {mockRecommendedActions.map((rec) => (
                <div key={rec.id} className="p-3 bg-background-secondary/20 border border-border-subtle rounded-md space-y-2 text-xs">
                  <span className="font-bold text-text-primary block">{rec.title}</span>
                  <p className="text-[10px] text-text-secondary leading-normal">{rec.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => executeAction(rec.title)}
                    className="w-full text-[9px] h-7 justify-center"
                  >
                    {rec.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* 5. Detail Slide drawer for full case timelines */}
      <Drawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} title={`Dossier Timeline: ${selectedCase?.caseNumber}`}>
        {selectedCase && (
          <div className="space-y-6 text-xs text-text-secondary leading-normal select-none">
            <div className="p-4 bg-background-secondary/20 border border-border-subtle rounded-md space-y-2">
              <span className="font-semibold text-text-primary text-xs block">Operational Overview</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-text-secondary block">Assigned Officer:</span>
                  <span className="text-text-primary font-bold">{selectedCase.assignedOfficer}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">District / Category:</span>
                  <span className="text-text-primary font-bold">{selectedCase.district} ({selectedCase.category})</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Days Spent:</span>
                  <span className="text-text-primary font-bold">{selectedCase.durationDays} Days</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Deadline Date:</span>
                  <span className="text-text-primary font-bold">{selectedCase.deadline}</span>
                </div>
              </div>
            </div>

            {/* Vertical Milestones Timeline */}
            <div className="space-y-4">
              <span className="font-semibold text-text-primary text-[11px] block flex items-center">
                <Clock className="h-4 w-4 mr-1 text-warning" />
                Case Investigation Progress Milestones
              </span>
              <div className="space-y-4 pl-2 border-l border-border-default ml-2">
                {[
                  { title: "FIR Registered", date: "June 01, 2026", desc: "Official incident brief lodged under sector code." },
                  { title: "Investigation Started", date: "June 03, 2026", desc: "Officer assigned and physical sector surveillance cleared." },
                  { title: "Evidence Collection", date: "June 08, 2026", desc: "Phishing registry domain scripts cloned and audited." },
                  { title: "Arrest Completed", date: "June 18, 2026", desc: "Suspect John Doe apprehended at Koramangala border check." },
                  { title: "Charge Sheet Filed", date: "June 25, 2026", desc: "Formal dossier packets filed at Magistrate Court." },
                  { title: "Court Proceedings", date: "July 01, 2026", desc: "Preliminary hearing schedule initialized." },
                ].slice(0, currentStepIndex + 1).map((hist, idx) => (
                  <div key={idx} className="relative pl-4 space-y-0.5">
                    <span className="absolute -left-[18px] top-1.5 h-2 w-2 rounded-full bg-accent-primary border border-background-card" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary">{hist.title}</span>
                      <span className="text-[8px] text-text-secondary font-semibold">{hist.date}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary">{hist.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

    </div>
  );
}
