"use client";

import * as React from "react";
import {
  mockOfficersPerformance,
  mockStationsPerformance,
  mockResourceAllocation,
  mockRecommendedActions,
  OfficerPerformance,
  StationPerformance,
} from "@/constants/mockOperationalData";
import { districts } from "@/constants/mockAnalyticsData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Form";
import { Badge, ProgressBar } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import { StatContainer } from "@/components/ui/DataDisplay";
import Button from "@/components/ui/Button";
import {
  Users,
  Compass,
  Layers,
  Clock,
  Shield,
  Zap,
  Activity,
  Star,
  ShieldCheck,
  TrendingUp,
  MapPin,
  HelpCircle,
  Truck,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function OfficersPage() {
  // 1. Core States
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedAvailability, setSelectedAvailability] = React.useState("");
  const [officerSortField, setOfficerSortField] = React.useState<keyof OfficerPerformance>("assignedCases");
  const [officerSortDir, setOfficerSortDir] = React.useState<"asc" | "desc">("desc");

  // Filtered Officers
  const filteredOfficers = React.useMemo(() => {
    return mockOfficersPerformance.filter((off) => {
      if (selectedAvailability && off.availability !== selectedAvailability) return false;
      return true;
    });
  }, [selectedAvailability]);

  // Sorted Officers Performance
  const sortedOfficers = React.useMemo(() => {
    const list = [...filteredOfficers];
    list.sort((a, b) => {
      const aVal = a[officerSortField];
      const bVal = b[officerSortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return officerSortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return officerSortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return list;
  }, [filteredOfficers, officerSortField, officerSortDir]);

  const handleOfficerSort = (field: keyof OfficerPerformance) => {
    if (officerSortField === field) {
      setOfficerSortDir(officerSortDir === "asc" ? "desc" : "asc");
    } else {
      setOfficerSortField(field);
      setOfficerSortDir("desc");
    }
  };

  const handleOfficerAction = (offName: string, actionType: string) => {
    toast.info(`Executing Officer Action: ${actionType}`, {
      description: `Dispatched directive sheet for ${offName}.`,
    });
  };

  // Derived KPIs
  const officerKPIs = React.useMemo(() => {
    const totalAssigned = mockOfficersPerformance.reduce((sum, o) => sum + o.assignedCases, 0);
    const avgLoad = parseFloat((totalAssigned / mockOfficersPerformance.length).toFixed(1));
    const activeField = mockOfficersPerformance.filter((o) => o.availability === "On Field").length;
    return { avgLoad, activeField };
  }, []);

  return (
    <div className="space-y-6">
      <Toaster theme="dark" closeButton />

      {/* 1. Page Header */}
      <div>
        <h2 className="text-page-title">Officer Workload & Leaderboard</h2>
        <Paragraph className="text-text-secondary">
          Track individual officer case assignments, rating indexes, police station workloads, and resources capacity logs.
        </Paragraph>
      </div>

      {/* 2. Operational KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatContainer title="Active Officers Deployed" value={mockResourceAllocation.officersActive} trend={{ value: "110/142 Active", direction: "up" }} description="Staff units actively on duty" icon={<Users className="h-5 w-5 text-accent-primary" />} />
        <StatContainer title="Average Caseload" value={`${officerKPIs.avgLoad} Cases`} trend={{ value: "Optimal load: 5", direction: "up" }} description="Average case count per officer" icon={<Layers className="h-5 w-5 text-analytics" />} />
        <StatContainer title="Field Patrol Active" value={officerKPIs.activeField} trend={{ value: "Available: 4", direction: "up" }} description="Officers currently patrolling field sectors" icon={<Compass className="h-5 w-5 text-warning" />} />
        <StatContainer title="Staff Utilization Index" value="85%" trend={{ value: "+2.1%", direction: "up" }} description="Total department load utilization" icon={<TrendingUp className="h-5 w-5 text-success" />} />
      </div>

      {/* 3. Main Operational Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Leaderboard & Stations (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Officer Leaderboard & Workload Dashboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Officer Caseload & Performance Leaderboard</CardTitle>
              <div className="max-w-[150px]">
                <Select
                  options={[
                    { value: "", label: "All Availability" },
                    { value: "Available", label: "Available Only" },
                    { value: "On Field", label: "On Field Only" },
                    { value: "On Leave", label: "On Leave" },
                  ]}
                  value={selectedAvailability}
                  onChange={(val) => setSelectedAvailability(val)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-background-card">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                      <th onClick={() => handleOfficerSort("name")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Officer Name</th>
                      <th onClick={() => handleOfficerSort("assignedCases")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50 text-center">Assigned</th>
                      <th onClick={() => handleOfficerSort("solvedCases")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50 text-center">Solved</th>
                      <th onClick={() => handleOfficerSort("pendingCases")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50 text-center">Pending</th>
                      <th onClick={() => handleOfficerSort("rating")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50 text-center">Rating</th>
                      <th onClick={() => handleOfficerSort("workload")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50 text-center">Workload</th>
                      <th className="p-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-text-secondary">
                    {sortedOfficers.map((off) => (
                      <tr key={off.name} className="hover:bg-background-secondary/20 transition-colors">
                        <td className="p-3 font-semibold text-text-primary">{off.name}</td>
                        <td className="p-3 text-center text-text-primary">{off.assignedCases}</td>
                        <td className="p-3 text-center text-text-primary">{off.solvedCases}</td>
                        <td className="p-3 text-center text-text-secondary">{off.pendingCases}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-3 w-3 text-warning fill-warning" />
                            <span className="font-semibold text-text-primary">{off.rating}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center space-x-2">
                            <ProgressBar value={off.workload} color={off.workload > 80 ? "danger" : off.workload > 60 ? "warning" : "success"} className="w-12 h-1" />
                            <span className="text-[10px] font-semibold text-text-primary">{off.workload}%</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant={off.availability === "Available" ? "success" : off.availability === "On Field" ? "primary" : "secondary"}>
                            {off.availability}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Police Station Performance list */}
          <Card>
            <CardHeader>
              <CardTitle>Precinct / Police Station Performance Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-background-card">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                      <th className="p-3 font-semibold">Precinct Name</th>
                      <th className="p-3 font-semibold text-center">Clearance Rate</th>
                      <th className="p-3 font-semibold text-center">Pending Case load</th>
                      <th className="p-3 font-semibold text-center">Staff On-Call</th>
                      <th className="p-3 font-semibold text-center">Avg Response</th>
                      <th className="p-3 font-semibold text-center">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-text-secondary">
                    {mockStationsPerformance.map((station) => (
                      <tr key={station.name} className="hover:bg-background-secondary/20 transition-colors">
                        <td className="p-3 font-semibold text-text-primary">{station.name}</td>
                        <td className="p-3 text-center text-text-primary">{station.clearanceRate}%</td>
                        <td className="p-3 text-center text-text-secondary">{station.pendingCases}</td>
                        <td className="p-3 text-center text-text-secondary">{station.officerAvailability} officers</td>
                        <td className="p-3 text-center font-bold text-accent-primary">{station.responseTime} Min</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center space-x-2">
                            <ProgressBar value={station.completionRate} color={station.completionRate > 80 ? "success" : "warning"} className="w-14 h-1.5" />
                            <span className="text-[10px] font-semibold text-text-primary">{station.completionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Side: Resource Allocation progress bars (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Reusable Resource Allocation Panel */}
          <Card>
            <CardHeader className="pb-2 border-none">
              <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                <ShieldCheck className="h-4.5 w-4.5 mr-1.5 text-accent-primary" />
                Resource Allocation capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4 select-none text-xs">
              
              {/* Officers availability */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="font-semibold text-text-primary flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-accent-primary" /> Personnel Utilization
                  </span>
                  <span className="text-text-secondary">{mockResourceAllocation.officersActive} / {mockResourceAllocation.officersTotal} Active</span>
                </div>
                <ProgressBar value={Math.round((mockResourceAllocation.officersActive / mockResourceAllocation.officersTotal) * 100)} color="primary" className="h-2" />
              </div>

              {/* Patrol Vehicles availability */}
              <div className="space-y-1.5 border-t border-border-subtle pt-3">
                <div className="flex justify-between text-[10px]">
                  <span className="font-semibold text-text-primary flex items-center">
                    <Truck className="h-3.5 w-3.5 mr-1 text-warning" /> Vehicle Fleet Utilization
                  </span>
                  <span className="text-text-secondary">{mockResourceAllocation.vehiclesActive} / {mockResourceAllocation.vehiclesTotal} Active</span>
                </div>
                <ProgressBar value={Math.round((mockResourceAllocation.vehiclesActive / mockResourceAllocation.vehiclesTotal) * 100)} color="warning" className="h-2" />
              </div>

              {/* District Capacities */}
              <div className="space-y-2 border-t border-border-subtle pt-3">
                <span className="text-[9px] text-text-secondary uppercase font-bold block">District Command Capacities</span>
                {Object.entries(mockResourceAllocation.districtCapacity).map(([dist, cap]) => (
                  <div key={dist} className="space-y-1">
                    <div className="flex justify-between text-[9px] text-text-secondary">
                      <span>{dist}</span>
                      <span>{cap}%</span>
                    </div>
                    <ProgressBar value={cap} color={cap > 75 ? "danger" : "primary"} className="h-1" />
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

          {/* Quick command actions */}
          <Card>
            <CardHeader className="pb-2 border-none">
              <CardTitle className="text-xs uppercase tracking-wider text-text-primary flex items-center">
                <Zap className="h-4.5 w-4.5 mr-1.5 text-warning" />
                Suggested Command Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 select-none">
              {mockRecommendedActions.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 bg-background-secondary/20 border border-border-subtle rounded-md space-y-2 text-xs">
                  <span className="font-bold text-text-primary block">{rec.title}</span>
                  <p className="text-[10px] text-text-secondary leading-normal">{rec.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toast.success(`Action Dispatched`, {
                        description: `Operational re-routing ordered for "${rec.title}".`,
                      });
                    }}
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

    </div>
  );
}
