"use client";

import * as React from "react";
import Link from "next/link";
import {
  mockFIRs,
  mockAIAlerts,
  mockActivityFeed,
  mockOfficerWorkload,
  districts,
  policeStationsMap,
  crimeCategories,
  FIRRecord,
} from "@/constants/mockDashboardData";
import { tokens } from "@/styles/tokens";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Form";
import { Badge, ProgressBar } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import { StatContainer } from "@/components/ui/DataDisplay";
import Chart from "@/components/ui/Chart";
import Button from "@/components/ui/Button";
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  FolderOpen,
  CheckCircle,
  Clock,
  UserCheck,
  TrendingUp,
  MapPin,
  Filter,
  Sparkles,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  BookOpen,
  Activity,
  Zap,
  ChevronRight,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  // 1. Filter States
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedStation, setSelectedStation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [timeRange, setTimeRange] = React.useState("all"); // all, 7days, 30days

  // Reset station when district changes
  React.useEffect(() => {
    setSelectedStation("");
  }, [selectedDistrict]);

  // Stations list based on selected district
  const availableStations = React.useMemo(() => {
    if (!selectedDistrict) return [];
    return policeStationsMap[selectedDistrict] || [];
  }, [selectedDistrict]);

  // Filtered dataset
  const filteredFIRs = React.useMemo(() => {
    return mockFIRs.filter((fir) => {
      // 1. District Filter
      if (selectedDistrict && fir.district !== selectedDistrict) return false;
      // 2. Station Filter
      if (selectedStation && fir.policeStation !== selectedStation) return false;
      // 3. Category Filter
      if (selectedCategory && fir.category !== selectedCategory) return false;
      // 4. Status Filter
      if (selectedStatus && fir.status !== selectedStatus) return false;
      
      // 5. Time Range Filter
      if (timeRange !== "all") {
        const recordDate = new Date(fir.date);
        const limitDate = new Date();
        const days = timeRange === "7days" ? 7 : 30;
        limitDate.setDate(limitDate.getDate() - days);
        // Note: Mock dates are spread over June 2026, so to prevent filtering out all mock data on real current dates, 
        // we'll deterministic-slice June dates relative to the dataset range (June 1 to June 30).
        // For the sake of this mock, we filter KA dates matching KA month days.
        const dayOfMonth = parseInt(fir.date.split("-")[2]);
        if (timeRange === "7days" && dayOfMonth < 23) return false;
        if (timeRange === "30days" && dayOfMonth < 1) return false;
      }
      return true;
    });
  }, [selectedDistrict, selectedStation, selectedCategory, selectedStatus, timeRange]);

  // Reset Filters Handler
  const resetFilters = () => {
    setSelectedDistrict("");
    setSelectedStation("");
    setSelectedCategory("");
    setSelectedStatus("");
    setTimeRange("all");
  };

  // 2. Aggregate KPI Metrics
  const metrics = React.useMemo(() => {
    const total = filteredFIRs.length;
    const active = filteredFIRs.filter((f) => f.status === "Under Investigation" || f.status === "Awaiting Trial").length;
    const closed = filteredFIRs.filter((f) => f.status === "Closed").length;
    const pending = filteredFIRs.filter((f) => f.status === "Under Investigation").length;
    const chargeSheets = filteredFIRs.filter((f) => f.status === "Charge Sheet Filed").length;
    const repeatOffenders = filteredFIRs.filter((f) => f.repeatOffender).length;
    const activeAlerts = filteredFIRs.filter((f) => f.alertSeverity !== "None").length;

    // Count districts with high risk cases
    const highRiskDistrictsSet = new Set(
      filteredFIRs.filter((f) => f.riskLevel === "High").map((f) => f.district)
    );
    const highRiskDistricts = highRiskDistrictsSet.size;

    return {
      total,
      active,
      closed,
      pending,
      chargeSheets,
      highRiskDistricts,
      repeatOffenders,
      activeAlerts,
    };
  }, [filteredFIRs]);

  // 3. District Performance Overview Data
  const districtPerformance = React.useMemo(() => {
    const summary: Record<string, { total: number; pending: number; highRisk: number; closed: number }> = {};
    
    // Initialise all districts to preserve display consistencies
    districts.forEach((d) => {
      summary[d] = { total: 0, pending: 0, highRisk: 0, closed: 0 };
    });

    // Populate from active filtered records
    filteredFIRs.forEach((fir) => {
      if (!summary[fir.district]) {
        summary[fir.district] = { total: 0, pending: 0, highRisk: 0, closed: 0 };
      }
      summary[fir.district].total += 1;
      if (fir.status === "Under Investigation") {
        summary[fir.district].pending += 1;
      }
      if (fir.riskLevel === "High") {
        summary[fir.district].highRisk += 1;
      }
      if (fir.status === "Closed") {
        summary[fir.district].closed += 1;
      }
    });

    return Object.entries(summary).map(([name, data]) => {
      const completion = data.total > 0 ? Math.round(((data.closed + (data.total - data.pending - data.closed)) / data.total) * 100) : 100;
      let riskLevel: "High" | "Medium" | "Low" = "Low";
      if (data.highRisk > 3) riskLevel = "High";
      else if (data.highRisk > 0) riskLevel = "Medium";

      return {
        name,
        total: data.total,
        pending: data.pending,
        riskLevel,
        completion,
        trend: completion > 75 ? "up" : "down",
      };
    });
  }, [filteredFIRs]);

  // 4. ECharts Configurations
  // Chart A: Crime Category Distribution
  const categoryChartOption = React.useMemo(() => {
    const catCounts: Record<string, number> = {};
    filteredFIRs.forEach((f) => {
      catCounts[f.category] = (catCounts[f.category] || 0) + 1;
    });

    const data = Object.entries(catCounts).map(([name, value]) => ({ name, value }));

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
        textStyle: { color: tokens.colors.text.primary, fontSize: 10 },
        backgroundColor: tokens.colors.background.card,
        borderColor: tokens.colors.border.default,
      },
      legend: {
        orient: "horizontal",
        bottom: 0,
        textStyle: { color: tokens.colors.text.secondary, fontSize: 9 },
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: "Crime Category",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            label: { show: false },
          },
          labelLine: { show: false },
          data: data.length > 0 ? data : [{ name: "No Data", value: 0 }],
          color: [
            tokens.colors.accent.primary,
            tokens.colors.analytics,
            tokens.colors.ai,
            tokens.colors.warning,
            tokens.colors.danger,
            tokens.colors.success,
          ],
        },
      ],
    };
  }, [filteredFIRs]);

  // Chart B: Crime Trend over June 2026
  const trendChartOption = React.useMemo(() => {
    const dateCounts: Record<string, number> = {};
    // Seed all June days to avoid spikes
    for (let day = 1; day <= 30; day++) {
      const dayString = day < 10 ? `0${day}` : `${day}`;
      dateCounts[`2026-06-${dayString}`] = 0;
    }

    filteredFIRs.forEach((f) => {
      if (dateCounts[f.date] !== undefined) {
        dateCounts[f.date] += 1;
      }
    });

    const xAxisData = Object.keys(dateCounts).map((date) => date.split("-")[2]); // Get just day of month
    const yAxisData = Object.values(dateCounts);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        textStyle: { color: tokens.colors.text.primary, fontSize: 10 },
        backgroundColor: tokens.colors.background.card,
        borderColor: tokens.colors.border.default,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "10%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
        axisLine: { lineStyle: { color: tokens.colors.border.default } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: tokens.colors.border.subtle } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      series: [
        {
          name: "FIRs Filed",
          type: "line",
          smooth: true,
          data: yAxisData,
          itemStyle: { color: tokens.colors.accent.primary },
          areaStyle: {
            color: {
              type: "linear",
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(37, 99, 235, 0.25)" },
                { offset: 1, color: "rgba(37, 99, 235, 0)" },
              ],
            },
          },
        },
      ],
    };
  }, [filteredFIRs]);

  // Chart C: Monthly Growth grouped bar chart (mocked for June vs May values)
  const growthChartOption = React.useMemo(() => {
    // Counts per category in filtered data
    const catCounts: Record<string, number> = {};
    crimeCategories.forEach((cat) => {
      catCounts[cat] = 0;
    });

    filteredFIRs.forEach((f) => {
      if (catCounts[f.category] !== undefined) {
        catCounts[f.category] += 1;
      }
    });

    const categories = Object.keys(catCounts);
    const juneData = Object.values(catCounts);
    // May data mocked deterministically relative to June to keep consistency
    const mayData = juneData.map((val) => Math.max(Math.round(val * 0.85), 1));

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        textStyle: { color: tokens.colors.text.primary, fontSize: 10 },
        backgroundColor: tokens.colors.background.card,
        borderColor: tokens.colors.border.default,
      },
      legend: {
        bottom: 0,
        textStyle: { color: tokens.colors.text.secondary, fontSize: 9 },
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories.map((c) => c.split(" ")[0]), // Use short names
        axisLine: { lineStyle: { color: tokens.colors.border.default } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: tokens.colors.border.subtle } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      series: [
        {
          name: "May 2026",
          type: "bar",
          data: mayData,
          itemStyle: { color: tokens.colors.border.default },
        },
        {
          name: "June 2026",
          type: "bar",
          data: juneData,
          itemStyle: { color: tokens.colors.analytics },
        },
      ],
    };
  }, [filteredFIRs]);

  // Chart D: Daily Incident Trend relative to risk levels
  const riskChartOption = React.useMemo(() => {
    const riskCounts = { High: 0, Medium: 0, Low: 0 };
    filteredFIRs.forEach((f) => {
      riskCounts[f.riskLevel] += 1;
    });

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} cases",
        textStyle: { color: tokens.colors.text.primary, fontSize: 10 },
        backgroundColor: tokens.colors.background.card,
        borderColor: tokens.colors.border.default,
      },
      series: [
        {
          name: "Risk Level Distribution",
          type: "pie",
          radius: "75%",
          center: ["50%", "50%"],
          roseType: "radius",
          label: {
            show: true,
            fontSize: 9,
            color: tokens.colors.text.secondary,
            formatter: "{b}: {c}",
          },
          data: [
            { value: riskCounts.High, name: "High Risk", itemStyle: { color: tokens.colors.danger } },
            { value: riskCounts.Medium, name: "Medium Risk", itemStyle: { color: tokens.colors.warning } },
            { value: riskCounts.Low, name: "Low Risk", itemStyle: { color: tokens.colors.success } },
          ],
        },
      ],
    };
  }, [filteredFIRs]);

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-page-title">Operational HQ Dashboard</h2>
          <Paragraph className="text-text-secondary">
            Tactical intelligence command center active. Live geospatial &amp; analytical feeds operational.
          </Paragraph>
        </div>
        <div className="flex items-center space-x-2 bg-background-card border border-border-subtle rounded-md px-3 py-1.5 self-start md:self-auto select-none">
          <Badge variant="success" className="animate-pulse mr-1">LIVE SECURE</Badge>
          <Caption className="text-[10px] text-text-secondary">Console Terminal KA-04</Caption>
        </div>
      </div>

      {/* 2. Global Filters Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center">
              <Filter className="h-4 w-4 text-accent-primary mr-1.5" />
              Global Filters Console
            </span>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-[10px] h-7 px-2">
              Clear Console Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Time filter */}
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Incident Timeframe</label>
              <Select
                options={[
                  { value: "all", label: "All June Records" },
                  { value: "7days", label: "Last 7 Days (June 24-30)" },
                  { value: "30days", label: "Last 30 Days (June 1-30)" },
                ]}
                value={timeRange}
                onChange={(val) => setTimeRange(val)}
              />
            </div>

            {/* District filter */}
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">State District</label>
              <Select
                options={[
                  { value: "", label: "All Districts" },
                  ...districts.map((d) => ({ value: d, label: d })),
                ]}
                value={selectedDistrict}
                onChange={(val) => setSelectedDistrict(val)}
              />
            </div>

            {/* Station filter */}
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Police Station</label>
              <Select
                options={[
                  { value: "", label: "All Stations" },
                  ...availableStations.map((s) => ({ value: s, label: s })),
                ]}
                value={selectedStation}
                onChange={(val) => setSelectedStation(val)}
                disabled={!selectedDistrict}
              />
            </div>

            {/* Category filter */}
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

            {/* Status filter */}
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Investigation Status</label>
              <Select
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "Under Investigation", label: "Under Investigation" },
                  { value: "Charge Sheet Filed", label: "Charge Sheet Filed" },
                  { value: "Awaiting Trial", label: "Awaiting Trial" },
                  { value: "Closed", label: "Closed" },
                ]}
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Executive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatContainer
          title="Total FIRs"
          value={metrics.total}
          trend={{ value: "+8.4%", direction: "up" }}
          description="Total incidents filed in timeframe"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatContainer
          title="Active Cases"
          value={metrics.active}
          trend={{ value: "+2.1%", direction: "up" }}
          description="Active pending trial or search"
          icon={<FolderOpen className="h-5 w-5" />}
        />
        <StatContainer
          title="Closed Cases"
          value={metrics.closed}
          trend={{ value: "+14.6%", direction: "up" }}
          description="Investigations completed & archived"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatContainer
          title="Pending Investigations"
          value={metrics.pending}
          trend={{ value: "-4.2%", direction: "down" }}
          description="Cases actively under search"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatContainer
          title="Charge Sheets Filed"
          value={metrics.chargeSheets}
          trend={{ value: "+9.2%", direction: "up" }}
          description="Formal court charge sheets filed"
          icon={<Layers className="h-5 w-5" />}
        />
        <StatContainer
          title="High Risk Districts"
          value={metrics.highRiskDistricts}
          trend={{ value: "Stable", direction: "up" }}
          description="Districts containing 3+ high risk alerts"
          icon={<MapPin className="h-5 w-5" />}
        />
        <StatContainer
          title="Repeat Offenders"
          value={metrics.repeatOffenders}
          trend={{ value: "+4.5%", direction: "up" }}
          description="Suspects with multiple priors"
          icon={<Users className="h-5 w-5" />}
        />
        <StatContainer
          title="Active AI Alerts"
          value={metrics.activeAlerts}
          trend={{ value: "+1", direction: "up" }}
          description="Urgent anomalies generated by AI"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* 4. Charts Section (ECharts Containers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statewide Crime Incidents Trend (June 2026)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <Chart option={trendChartOption} className="h-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crime Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <Chart option={categoryChartOption} className="h-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Crime Growth Comparison (May vs June)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <Chart option={growthChartOption} className="h-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Risk Level Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <Chart option={riskChartOption} className="h-full" />
          </CardContent>
        </Card>
      </div>

      {/* 5. Details Section (AI Panel, Districts, Activity, Workload) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: AI Panel & District performance list (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI Intelligence Panel */}
          <Card className="border border-ai/25 bg-background-card/40">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-ai flex items-center">
                <Sparkles className="h-4.5 w-4.5 mr-1.5 animate-pulse" />
                AI Cognitive Intelligence Panel
              </CardTitle>
              <Badge variant="ai">ACTIVE ANALYSIS</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAIAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-3 bg-background-secondary/30 border border-border-subtle rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary text-[11px] flex items-center">
                      <AlertTriangle className={`h-3.5 w-3.5 mr-1 ${alert.severity === "High" ? "text-danger" : "text-warning"}`} />
                      {alert.title}
                    </span>
                    <div className="flex space-x-1.5">
                      <Badge variant={alert.severity === "High" ? "danger" : "warning"}>{alert.severity} Severity</Badge>
                      <Badge variant="primary">Conf: {alert.confidence}%</Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-normal">{alert.explanation}</p>
                  <div className="text-[10px] p-2 bg-ai/5 border-l-2 border-ai text-ai/90 leading-normal rounded-r">
                    <span className="font-bold">Suggested Directive:</span> {alert.suggestedAction}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* District Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>District Operational Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto rounded-md border border-border-subtle">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                      <th className="p-3 font-semibold text-left">District</th>
                      <th className="p-3 font-semibold text-center">Total Cases</th>
                      <th className="p-3 font-semibold text-center">Pending Case List</th>
                      <th className="p-3 font-semibold text-center">Risk Index</th>
                      <th className="p-3 font-semibold text-center">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {districtPerformance.map((dist) => (
                      <tr key={dist.name} className="hover:bg-background-secondary/20 transition-colors">
                        <td className="p-3 text-text-primary font-semibold">{dist.name}</td>
                        <td className="p-3 text-center text-text-secondary">{dist.total}</td>
                        <td className="p-3 text-center text-text-secondary">{dist.pending}</td>
                        <td className="p-3 text-center">
                          <Badge variant={dist.riskLevel === "High" ? "danger" : dist.riskLevel === "Medium" ? "warning" : "success"}>
                            {dist.riskLevel}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center space-x-2">
                            <ProgressBar value={dist.completion} color={dist.completion > 75 ? "success" : "warning"} className="w-16 h-1.5" />
                            <span className="text-[10px] font-semibold text-text-primary">{dist.completion}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Investigation Overview progress */}
          <Card>
            <CardHeader>
              <CardTitle>Operational Case Allocation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Under Investigation", count: metrics.pending, color: "warning" as const },
                { label: "Charge Sheet Filed", count: metrics.chargeSheets, color: "primary" as const },
                { label: "Awaiting Trial", count: filteredFIRs.filter((f) => f.status === "Awaiting Trial").length, color: "analytics" as const },
                { label: "Closed Cases", count: metrics.closed, color: "success" as const },
              ].map((stage) => {
                const percent = metrics.total > 0 ? Math.round((stage.count / metrics.total) * 100) : 0;
                return (
                  <div key={stage.label} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-semibold text-text-primary">{stage.label}</span>
                      <span className="text-text-secondary">{stage.count} cases ({percent}%)</span>
                    </div>
                    <ProgressBar value={percent} color={stage.color} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Workload, Recent Activity & Quick Actions (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Officer Workload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-4.5 w-4.5 mr-1.5 text-accent-primary" />
                Officer Load Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-background-secondary/20 rounded border border-border-subtle">
                  <span className="block text-[10px] text-text-secondary uppercase">Active Officers</span>
                  <span className="text-xl font-bold text-text-primary">{mockOfficerWorkload.activeOfficers}</span>
                </div>
                <div className="p-3 bg-background-secondary/20 rounded border border-border-subtle">
                  <span className="block text-[10px] text-text-secondary uppercase">Avg Load</span>
                  <span className="text-xl font-bold text-text-primary">{mockOfficerWorkload.averageCaseLoad}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-border-subtle pt-3">
                <div>
                  <span className="text-[9px] text-text-secondary uppercase font-semibold">Highest Load</span>
                  <div className="flex items-center justify-between text-xs mt-0.5">
                    <span className="font-semibold text-text-primary">{mockOfficerWorkload.highestWorkload.name}</span>
                    <Badge variant="danger">{mockOfficerWorkload.highestWorkload.count} cases</Badge>
                  </div>
                  <span className="text-[9px] text-text-secondary block">{mockOfficerWorkload.highestWorkload.district}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[9px] text-text-secondary uppercase font-semibold">Lowest Load</span>
                  <div className="flex items-center justify-between text-xs mt-0.5">
                    <span className="font-semibold text-text-primary">{mockOfficerWorkload.lowestWorkload.name}</span>
                    <Badge variant="success">{mockOfficerWorkload.lowestWorkload.count} case</Badge>
                  </div>
                  <span className="text-[9px] text-text-secondary block">{mockOfficerWorkload.lowestWorkload.district}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-4.5 w-4.5 mr-1.5 text-analytics" />
                Recent Operations Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[310px] overflow-y-auto pr-1">
                {mockActivityFeed.map((act) => (
                  <div key={act.id} className="flex items-start space-x-3 text-[10px] leading-relaxed relative">
                    <div className="flex-shrink-0 mt-0.5">
                      <span
                        className={`h-2 w-2 rounded-full inline-block ${
                          act.type === "FIR"
                            ? "bg-accent-primary"
                            : act.type === "Chargesheet"
                            ? "bg-success"
                            : act.type === "Alert"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-0.5 border-b border-border-subtle pb-2.5">
                      <div className="flex justify-between">
                        <span className="font-semibold text-text-primary">{act.type} Logged</span>
                        <span className="text-text-secondary text-[8px]">{act.timestamp}</span>
                      </div>
                      <p className="text-text-secondary">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-4.5 w-4.5 mr-1.5 text-warning" />
                Platform Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Link href="/map">
                <Button variant="secondary" className="w-full text-[11px] justify-between h-9 px-3">
                  <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-2 text-analytics" /> View Crime GIS Map</span>
                  <ChevronRight className="h-3.5 w-3.5 text-text-secondary" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="secondary" className="w-full text-[11px] justify-between h-9 px-3">
                  <span className="flex items-center"><TrendingUp className="h-3.5 w-3.5 mr-2 text-accent-primary" /> Open Analytics Console</span>
                  <ChevronRight className="h-3.5 w-3.5 text-text-secondary" />
                </Button>
              </Link>
              <Link href="/investigation">
                <Button variant="secondary" className="w-full text-[11px] justify-between h-9 px-3">
                  <span className="flex items-center"><Search className="h-3.5 w-3.5 mr-2 text-warning" /> Search Incident FIRs</span>
                  <ChevronRight className="h-3.5 w-3.5 text-text-secondary" />
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="secondary" className="w-full text-[11px] justify-between h-9 px-3">
                  <span className="flex items-center"><FileText className="h-3.5 w-3.5 mr-2 text-success" /> Generate Dossier Reports</span>
                  <ChevronRight className="h-3.5 w-3.5 text-text-secondary" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
