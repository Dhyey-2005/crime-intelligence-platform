"use client";

import * as React from "react";
import { useAuthStore } from "@/store/authStore";
import {
  mockAnalyticsCases,
  subcategoryMap,
  mockOfficers,
  districts,
  policeStationsMap,
  crimeCategories,
  AnalyticsCase,
} from "@/constants/mockAnalyticsData";
import { tokens } from "@/styles/tokens";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, Input, Checkbox } from "@/components/ui/Form";
import { Badge, ProgressBar, Spinner } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption, FormLabel } from "@/components/ui/Typography";
import { StatContainer } from "@/components/ui/DataDisplay";
import Chart from "@/components/ui/Chart";
import Button from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Navigation";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Filter,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Shield,
  Users,
  Search,
  Download,
  Eye,
  EyeOff,
  User,
  ArrowUpDown,
  BookOpen,
  PieChart,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AnalyticsPage() {
  const { user } = useAuthStore();

  // 1. Global Filter States
  const [selectedMonth, setSelectedMonth] = React.useState("all"); // all, 05, 06
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedStation, setSelectedStation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedSubcategory, setSelectedSubcategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [selectedOfficer, setSelectedOfficer] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState("");
  const [selectedRisk, setSelectedRisk] = React.useState("");

  // Comparative states
  const [compDistrict1, setCompDistrict1] = React.useState("Bengaluru City");
  const [compDistrict2, setCompDistrict2] = React.useState("Mysuru City");
  const [compStation1, setCompStation1] = React.useState("Koramangala PS");
  const [compStation2, setCompStation2] = React.useState("Devaraja PS");
  const [compCategory1, setCompCategory1] = React.useState("Cybercrime");
  const [compCategory2, setCompCategory2] = React.useState("Theft & Burglary");

  // Reset station/subcat on parent change
  React.useEffect(() => {
    setSelectedStation("");
  }, [selectedDistrict]);

  React.useEffect(() => {
    setSelectedSubcategory("");
  }, [selectedCategory]);

  const availableStations = React.useMemo(() => {
    if (!selectedDistrict) return [];
    return policeStationsMap[selectedDistrict] || [];
  }, [selectedDistrict]);

  const availableSubcategories = React.useMemo(() => {
    if (!selectedCategory) return [];
    return subcategoryMap[selectedCategory] || [];
  }, [selectedCategory]);

  // Main Filtered Dataset
  const filteredCases = React.useMemo(() => {
    return mockAnalyticsCases.filter((c) => {
      if (selectedMonth !== "all" && c.date.split("-")[1] !== selectedMonth) return false;
      if (selectedDistrict && c.district !== selectedDistrict) return false;
      if (selectedStation && c.policeStation !== selectedStation) return false;
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (selectedSubcategory && c.subcategory !== selectedSubcategory) return false;
      if (selectedStatus && c.status !== selectedStatus) return false;
      if (selectedOfficer && c.officerName !== selectedOfficer) return false;
      if (selectedSeverity && c.severity !== selectedSeverity) return false;
      if (selectedRisk && c.riskLevel !== selectedRisk) return false;
      return true;
    });
  }, [
    selectedMonth,
    selectedDistrict,
    selectedStation,
    selectedCategory,
    selectedSubcategory,
    selectedStatus,
    selectedOfficer,
    selectedSeverity,
    selectedRisk,
  ]);

  const resetAllFilters = () => {
    setSelectedMonth("all");
    setSelectedDistrict("");
    setSelectedStation("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedStatus("");
    setSelectedOfficer("");
    setSelectedSeverity("");
    setSelectedRisk("");
  };

  // 2. Summary Metrics Calculations
  const metrics = React.useMemo(() => {
    const total = filteredCases.length;
    
    // Average duration
    const avgDuration = total > 0
      ? Math.round(filteredCases.reduce((sum, c) => sum + c.durationDays, 0) / total)
      : 0;

    // Resolution rate (closed cases)
    const closed = filteredCases.filter((c) => c.status === "Closed").length;
    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 100;

    // Active cases
    const active = filteredCases.filter((c) => c.status === "Under Investigation" || c.status === "Awaiting Trial").length;

    // Growth Rate (June vs May Cases)
    const mayCases = filteredCases.filter((c) => c.date.split("-")[1] === "05").length;
    const juneCases = filteredCases.filter((c) => c.date.split("-")[1] === "06").length;
    const growth = mayCases > 0 ? Math.round(((juneCases - mayCases) / mayCases) * 100) : 0;

    // Average daily cases (based on 30 days)
    const avgDaily = parseFloat((total / 30).toFixed(1));

    return {
      total,
      growth,
      avgDuration,
      resolutionRate,
      active,
      avgDaily,
    };
  }, [filteredCases]);

  // 3. ECharts options configurations
  // Chart 1: Crime Trend Line (May vs June timeline)
  const trendOption = React.useMemo(() => {
    const mayCounts = Array(30).fill(0);
    const juneCounts = Array(30).fill(0);

    filteredCases.forEach((c) => {
      const parts = c.date.split("-");
      const month = parts[1];
      const day = parseInt(parts[2]) - 1;
      if (day >= 0 && day < 30) {
        if (month === "05") mayCounts[day] += 1;
        if (month === "06") juneCounts[day] += 1;
      }
    });

    const days = Array.from({ length: 30 }, (_, i) => `${i + 1}`);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        textStyle: { color: tokens.colors.text.primary, fontSize: 10 },
        backgroundColor: tokens.colors.background.card,
        borderColor: tokens.colors.border.default,
      },
      legend: {
        textStyle: { color: tokens.colors.text.secondary, fontSize: 9 },
        bottom: 0,
      },
      grid: { left: "3%", right: "4%", bottom: "12%", top: "8%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: days,
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
          name: "May 2026 Trend",
          type: "line",
          smooth: true,
          data: mayCounts,
          itemStyle: { color: tokens.colors.text.secondary },
        },
        {
          name: "June 2026 Trend",
          type: "line",
          smooth: true,
          data: juneCounts,
          itemStyle: { color: tokens.colors.accent.primary },
        },
      ],
    };
  }, [filteredCases]);

  // Chart 2: Crime by Category Pie Chart
  const categoryOption = React.useMemo(() => {
    const counts: Record<string, number> = {};
    filteredCases.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

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
        textStyle: { color: tokens.colors.text.secondary, fontSize: 8 },
        itemWidth: 8,
        itemHeight: 8,
      },
      series: [
        {
          type: "pie",
          radius: "60%",
          center: ["50%", "45%"],
          data: data.length > 0 ? data : [{ name: "No Cases", value: 0 }],
          color: [
            tokens.colors.accent.primary,
            tokens.colors.analytics,
            tokens.colors.ai,
            tokens.colors.warning,
            tokens.colors.danger,
            tokens.colors.success,
          ],
          label: { show: false },
        },
      ],
    };
  }, [filteredCases]);

  // Chart 3: Comparative Districts Bar Chart
  const comparativeDistrictOption = React.useMemo(() => {
    const c1Cases = mockAnalyticsCases.filter((c) => c.district === compDistrict1);
    const c2Cases = mockAnalyticsCases.filter((c) => c.district === compDistrict2);

    const c1Counts: Record<string, number> = {};
    const c2Counts: Record<string, number> = {};
    crimeCategories.forEach((cat) => {
      c1Counts[cat] = 0;
      c2Counts[cat] = 0;
    });

    c1Cases.forEach((c) => {
      if (c1Counts[c.category] !== undefined) c1Counts[c.category] += 1;
    });
    c2Cases.forEach((c) => {
      if (c2Counts[c.category] !== undefined) c2Counts[c.category] += 1;
    });

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
      },
      grid: { left: "3%", right: "4%", bottom: "15%", top: "8%", containLabel: true },
      xAxis: {
        type: "category",
        data: crimeCategories.map((c) => c.split(" ")[0]),
        axisLine: { lineStyle: { color: tokens.colors.border.default } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: tokens.colors.border.subtle } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      series: [
        { name: compDistrict1, type: "bar", data: Object.values(c1Counts), itemStyle: { color: tokens.colors.accent.primary } },
        { name: compDistrict2, type: "bar", data: Object.values(c2Counts), itemStyle: { color: tokens.colors.ai } },
      ],
    };
  }, [compDistrict1, compDistrict2]);

  // Chart 4: Demographics - Accused vs Victim Age distribution
  const demographicsAgeOption = React.useMemo(() => {
    const ageBrackets = {
      "<18": { victim: 0, accused: 0 },
      "18-35": { victim: 0, accused: 0 },
      "36-50": { victim: 0, accused: 0 },
      "50+": { victim: 0, accused: 0 },
    };

    filteredCases.forEach((c) => {
      // Victims
      if (c.victimAge < 18) ageBrackets["<18"].victim += 1;
      else if (c.victimAge <= 35) ageBrackets["18-35"].victim += 1;
      else if (c.victimAge <= 50) ageBrackets["36-50"].victim += 1;
      else ageBrackets["50+"].victim += 1;

      // Accused
      if (c.accusedAge < 18) ageBrackets["<18"].accused += 1;
      else if (c.accusedAge <= 35) ageBrackets["18-35"].accused += 1;
      else if (c.accusedAge <= 50) ageBrackets["36-50"].accused += 1;
      else ageBrackets["50+"].accused += 1;
    });

    const categories = Object.keys(ageBrackets);
    const victimData = Object.values(ageBrackets).map((b) => b.victim);
    const accusedData = Object.values(ageBrackets).map((b) => b.accused);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        textStyle: { color: tokens.colors.text.primary, fontSize: 10 },
        backgroundColor: tokens.colors.background.card,
        borderColor: tokens.colors.border.default,
      },
      legend: { bottom: 0, textStyle: { color: tokens.colors.text.secondary, fontSize: 9 } },
      grid: { left: "3%", right: "4%", bottom: "15%", top: "8%", containLabel: true },
      xAxis: {
        type: "category",
        data: categories,
        axisLine: { lineStyle: { color: tokens.colors.border.default } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: tokens.colors.border.subtle } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 8 },
      },
      series: [
        { name: "Victims", type: "bar", data: victimData, itemStyle: { color: tokens.colors.analytics } },
        { name: "Accused", type: "bar", data: accusedData, itemStyle: { color: tokens.colors.warning } },
      ],
    };
  }, [filteredCases]);

  // 5. Drill-Down Panel states (using modal Drawer)
  const [drillDownData, setDrillDownData] = React.useState<{ title: string; cases: AnalyticsCase[] } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const openDrillDown = (title: string, casesList: AnalyticsCase[]) => {
    setDrillDownData({ title, cases: casesList });
    setIsDrawerOpen(true);
  };

  // 6. Interactive Data Explorer states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<keyof AnalyticsCase>("date");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = React.useState({
    firNumber: true,
    date: true,
    district: true,
    category: true,
    status: true,
    officer: true,
    duration: true,
  });

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  // Search & Filter & Sort implementation
  const explorerCases = React.useMemo(() => {
    let result = filteredCases.filter((c) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        c.firNumber.toLowerCase().includes(query) ||
        c.district.toLowerCase().includes(query) ||
        c.policeStation.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.subcategory.toLowerCase().includes(query) ||
        c.officerName.toLowerCase().includes(query)
      );
    });

    // Sorting
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [filteredCases, searchQuery, sortField, sortDirection]);

  // Paginated List
  const paginatedCases = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return explorerCases.slice(startIndex, startIndex + itemsPerPage);
  }, [explorerCases, currentPage]);

  const totalPages = Math.max(Math.ceil(explorerCases.length / itemsPerPage), 1);

  const handleSort = (field: keyof AnalyticsCase) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Export mock files alerts
  const triggerExport = (format: "PDF" | "Excel" | "CSV") => {
    toast.success(`Intelligence dossier generated in ${format} format successfully!`, {
      description: `Downloaded file: KA_Crime_Report_${new Date().toISOString().split("T")[0]}.${format.toLowerCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <Toaster theme="dark" closeButton />

      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-page-title">Intelligence Analytics Console</h2>
          <Paragraph className="text-text-secondary">
            Strategic analysis, regional comparisons, and demographics data exploration center.
          </Paragraph>
        </div>
      </div>

      {/* 2. Global Filters Card */}
      <Card>
        <CardContent className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center">
              <Filter className="h-4 w-4 text-analytics mr-1.5" />
              Strategic Analytics Filters
            </span>
            <Button variant="ghost" size="sm" onClick={resetAllFilters} className="text-[10px] h-7 px-2">
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2">
            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Timeframe</label>
              <Select
                options={[
                  { value: "all", label: "All Cases" },
                  { value: "05", label: "May 2026" },
                  { value: "06", label: "June 2026" },
                ]}
                value={selectedMonth}
                onChange={(val) => setSelectedMonth(val)}
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">District</label>
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
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Police Station</label>
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

            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Category</label>
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
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Subcategory</label>
              <Select
                options={[
                  { value: "", label: "All Subcats" },
                  ...availableSubcategories.map((sc) => ({ value: sc, label: sc })),
                ]}
                value={selectedSubcategory}
                onChange={(val) => setSelectedSubcategory(val)}
                disabled={!selectedCategory}
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Case Status</label>
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

            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Officer</label>
              <Select
                options={[
                  { value: "", label: "All Officers" },
                  ...mockOfficers.map((o) => ({ value: o, label: o })),
                ]}
                value={selectedOfficer}
                onChange={(val) => setSelectedOfficer(val)}
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Severity</label>
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
              <label className="text-[9px] font-semibold text-text-secondary block mb-1">Risk Index</label>
              <Select
                options={[
                  { value: "", label: "All Risk Levels" },
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" },
                ]}
                value={selectedRisk}
                onChange={(val) => setSelectedRisk(val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Workspace Content Tabs */}
      <Tabs
        items={[
          // Tab 1: Strategic Overview
          {
            id: "strategic",
            label: "Strategic Overview",
            icon: <PieChart className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                {/* Summary Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  <StatContainer title="Total Cases" value={metrics.total} description="Total active filtered logs" icon={<FileText className="h-4 w-4" />} />
                  <StatContainer title="June Growth" value={`${metrics.growth > 0 ? "+" : ""}${metrics.growth}%`} description="Growth rate compared to May" icon={<TrendingUp className="h-4 w-4" />} />
                  <StatContainer title="Avg Resolution Time" value={`${metrics.avgDuration} Days`} description="Average days taken to close case" icon={<Clock className="h-4 w-4" />} />
                  <StatContainer title="Resolution Rate" value={`${metrics.resolutionRate}%`} description="Closed vs Active caseload" icon={<Shield className="h-4 w-4" />} />
                  <StatContainer title="Active Investigations" value={metrics.active} description="Total pending court / search" icon={<Layers className="h-4 w-4" />} />
                  <StatContainer title="Avg Daily FIRs" value={metrics.avgDaily} description="Average FIR registrations / day" icon={<Calendar className="h-4 w-4" />} />
                </div>

                {/* Trend Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Case File Trend Analysis (June vs May)</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => openDrillDown("Trend Case Records", filteredCases)} className="text-[10px] h-7 px-2">Drill Down</Button>
                    </CardHeader>
                    <CardContent className="h-72">
                      <Chart option={trendOption} className="h-full" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Crime Category Breakdown</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => openDrillDown("Crime Categories Details", filteredCases)} className="text-[10px] h-7 px-2">Drill Down</Button>
                    </CardHeader>
                    <CardContent className="h-72">
                      <Chart option={categoryOption} className="h-full" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          // Tab 2: Comparative Analysis
          {
            id: "comparative",
            label: "Comparative Analysis",
            icon: <ArrowUpDown className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                {/* Selectors card */}
                <Card>
                  <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* District Selector */}
                    <div className="space-y-2 border-r border-border-subtle pr-4">
                      <span className="font-semibold text-text-primary text-[11px] block">Regional Comparison</span>
                      <div className="grid grid-cols-2 gap-2">
                        <Select options={districts.map((d) => ({ value: d, label: d }))} value={compDistrict1} onChange={(val) => setCompDistrict1(val)} />
                        <Select options={districts.map((d) => ({ value: d, label: d }))} value={compDistrict2} onChange={(val) => setCompDistrict2(val)} />
                      </div>
                    </div>

                    {/* Police Station Selector */}
                    <div className="space-y-2 border-r border-border-subtle pr-4">
                      <span className="font-semibold text-text-primary text-[11px] block">Police Station Comparison</span>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          options={Object.values(policeStationsMap).flat().map((s) => ({ value: s, label: s }))}
                          value={compStation1}
                          onChange={(val) => setCompStation1(val)}
                        />
                        <Select
                          options={Object.values(policeStationsMap).flat().map((s) => ({ value: s, label: s }))}
                          value={compStation2}
                          onChange={(val) => setCompStation2(val)}
                        />
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                      <span className="font-semibold text-text-primary text-[11px] block">Crime Category Comparison</span>
                      <div className="grid grid-cols-2 gap-2">
                        <Select options={crimeCategories.map((c) => ({ value: c, label: c }))} value={compCategory1} onChange={(val) => setCompCategory1(val)} />
                        <Select options={crimeCategories.map((c) => ({ value: c, label: c }))} value={compCategory2} onChange={(val) => setCompCategory2(val)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparative Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>District vs District (Category Load)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <Chart option={comparativeDistrictOption} className="h-full" />
                    </CardContent>
                  </Card>

                  {/* Comparative Stations Data List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Police Station Activity Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { name: compStation1, cases: mockAnalyticsCases.filter((c) => c.policeStation === compStation1) },
                        { name: compStation2, cases: mockAnalyticsCases.filter((c) => c.policeStation === compStation2) },
                      ].map((station) => {
                        const total = station.cases.length;
                        const pending = station.cases.filter((c) => c.status === "Under Investigation").length;
                        const severityHigh = station.cases.filter((c) => c.severity === "High").length;
                        const completion = total > 0 ? Math.round(((total - pending) / total) * 100) : 100;

                        return (
                          <div key={station.name} className="p-4 bg-background-secondary/20 border border-border-subtle rounded-md space-y-3">
                            <div className="flex justify-between items-center border-b border-border-subtle pb-1.5">
                              <span className="font-semibold text-text-primary text-xs">{station.name}</span>
                              <Badge variant="primary">{total} Total Cases</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                              <div>
                                <span className="block text-text-secondary uppercase">Pending Search</span>
                                <span className="text-sm font-bold text-text-primary mt-0.5 block">{pending}</span>
                              </div>
                              <div>
                                <span className="block text-text-secondary uppercase">High Severity</span>
                                <span className="text-sm font-bold text-danger mt-0.5 block">{severityHigh}</span>
                              </div>
                              <div>
                                <span className="block text-text-secondary uppercase">Completion Rate</span>
                                <span className="text-sm font-bold text-success mt-0.5 block">{completion}%</span>
                              </div>
                            </div>
                            <ProgressBar value={completion} color={completion > 75 ? "success" : "warning"} className="h-1.5" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          // Tab 3: Investigation & Demographics
          {
            id: "demographics",
            label: "Investigations & Demographics",
            icon: <Users className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Demographics Age Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Demographic Age distribution (Accused vs Victim)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <Chart option={demographicsAgeOption} className="h-full" />
                    </CardContent>
                  </Card>

                  {/* Gender lists */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Dossier Gender Demographics Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Victim Gender */}
                      <div className="space-y-3">
                        <span className="font-semibold text-text-primary text-[11px] block">Victim Gender Distribution</span>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          {["Male", "Female", "Other"].map((gen) => {
                            const count = filteredCases.filter((c) => c.victimGender === gen).length;
                            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                            return (
                              <div key={gen} className="p-3 bg-background-secondary/20 border border-border-subtle rounded">
                                <span className="block text-text-secondary text-[10px] font-semibold">{gen}</span>
                                <span className="text-lg font-bold text-text-primary mt-1 block">{count}</span>
                                <Caption className="text-[9px] text-text-secondary mt-0.5 block">({pct}%)</Caption>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Accused Gender */}
                      <div className="space-y-3 border-t border-border-subtle pt-4">
                        <span className="font-semibold text-text-primary text-[11px] block">Accused Gender Distribution</span>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          {["Male", "Female"].map((gen) => {
                            const count = filteredCases.filter((c) => c.accusedGender === gen).length;
                            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                            return (
                              <div key={gen} className="p-3 bg-background-secondary/20 border border-border-subtle rounded">
                                <span className="block text-text-secondary text-[10px] font-semibold">{gen}</span>
                                <span className="text-lg font-bold text-text-primary mt-1 block">{count}</span>
                                <Caption className="text-[9px] text-text-secondary mt-0.5 block">({pct}%)</Caption>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          // Tab 4: Operational Performance
          {
            id: "operational",
            label: "Operational Performance",
            icon: <Shield className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Side: District rankings (lg:col-span-7) */}
                  <Card className="lg:col-span-7">
                    <CardHeader>
                      <CardTitle>District Performance Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full overflow-x-auto rounded-md border border-border-subtle">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                              <th className="p-3 font-semibold text-left">District</th>
                              <th className="p-3 font-semibold text-center">Load</th>
                              <th className="p-3 font-semibold text-center">Pending</th>
                              <th className="p-3 font-semibold text-center">Resolution Time</th>
                              <th className="p-3 font-semibold text-center">Arrest Index</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {districts.map((d) => {
                              const cases = filteredCases.filter((c) => c.district === d);
                              const total = cases.length;
                              const pending = cases.filter((c) => c.status === "Under Investigation").length;
                              const avgDuration = total > 0 ? Math.round(cases.reduce((sum, c) => sum + c.durationDays, 0) / total) : 0;
                              const arrestCount = cases.filter((c) => c.arrestCompleted).length;
                              const arrestPct = total > 0 ? Math.round((arrestCount / total) * 100) : 100;

                              return (
                                <tr key={d} className="hover:bg-background-secondary/20 transition-colors">
                                  <td className="p-3 font-semibold text-text-primary">{d}</td>
                                  <td className="p-3 text-center text-text-secondary">{total}</td>
                                  <td className="p-3 text-center text-text-secondary">{pending}</td>
                                  <td className="p-3 text-center text-text-secondary">{avgDuration} Days</td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center space-x-1.5">
                                      <ProgressBar value={arrestPct} color={arrestPct > 70 ? "success" : "warning"} className="w-12 h-1" />
                                      <span className="text-[10px] font-semibold text-text-primary">{arrestPct}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Side: Officer caseload (lg:col-span-5) */}
                  <Card className="lg:col-span-5">
                    <CardHeader>
                      <CardTitle>Officer Caseload Monitor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {mockOfficers.map((name) => {
                          const cases = mockAnalyticsCases.filter((c) => c.officerName === name);
                          const active = cases.filter((c) => c.status === "Under Investigation").length;
                          const total = cases.length;
                          const loadPct = Math.min(Math.round((active / 10) * 100), 100);

                          return (
                            <div key={name} className="p-3 bg-background-secondary/20 border border-border-subtle rounded-md space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-text-primary">{name}</span>
                                <Badge variant={active > 5 ? "danger" : active > 3 ? "warning" : "success"}>
                                  {active} Active / {total} Total
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] text-text-secondary">
                                  <span>Load Capacity</span>
                                  <span>{loadPct}%</span>
                                </div>
                                <ProgressBar value={loadPct} color={active > 5 ? "danger" : active > 3 ? "warning" : "success"} className="h-1.5" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          // Tab 5: Data Explorer
          {
            id: "explorer",
            label: "Data Explorer",
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Controls Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Search & Column Visibility */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="h-4 w-4 text-text-secondary" />
                          </span>
                          <Input
                            type="search"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-64 pl-9"
                          />
                        </div>

                        {/* Column visibility list */}
                        <div className="flex flex-wrap gap-2.5 items-center pl-2 border-l border-border-default">
                          <span className="text-[10px] font-bold text-text-secondary uppercase">Columns:</span>
                          {(Object.keys(visibleColumns) as Array<keyof typeof visibleColumns>).map((col) => (
                            <label key={col} className="inline-flex items-center space-x-1.5 cursor-pointer text-[10px] text-text-secondary select-none hover:text-text-primary">
                              <Checkbox
                                checked={visibleColumns[col]}
                                onChange={() => toggleColumn(col)}
                              />
                              <span className="capitalize">{col.replace("fir", "FIR")}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Export buttons */}
                      <div className="flex space-x-2 self-end md:self-auto">
                        <Button variant="outline" size="sm" onClick={() => triggerExport("CSV")} leftIcon={<Download className="h-3.5 w-3.5" />}>
                          CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => triggerExport("Excel")} leftIcon={<Download className="h-3.5 w-3.5" />}>
                          Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => triggerExport("PDF")} leftIcon={<Download className="h-3.5 w-3.5" />}>
                          PDF
                        </Button>
                      </div>
                    </div>

                    {/* Table Viewport */}
                    <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-background-card">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-background-secondary border-b border-border-subtle text-text-primary">
                            {visibleColumns.firNumber && <th onClick={() => handleSort("firNumber")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">FIR Number</th>}
                            {visibleColumns.date && <th onClick={() => handleSort("date")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Date</th>}
                            {visibleColumns.district && <th onClick={() => handleSort("district")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">District</th>}
                            {visibleColumns.category && <th onClick={() => handleSort("category")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Category</th>}
                            {visibleColumns.status && <th onClick={() => handleSort("status")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Status</th>}
                            {visibleColumns.officer && <th onClick={() => handleSort("officerName")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Officer</th>}
                            {visibleColumns.duration && <th onClick={() => handleSort("durationDays")} className="p-3 font-semibold cursor-pointer hover:bg-background-secondary/50">Duration</th>}
                            <th className="p-3 font-semibold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle text-text-secondary">
                          {paginatedCases.length > 0 ? (
                            paginatedCases.map((c) => (
                              <tr key={c.id} className="hover:bg-background-secondary/20 transition-colors">
                                {visibleColumns.firNumber && <td className="p-3 font-semibold text-text-primary">{c.firNumber}</td>}
                                {visibleColumns.date && <td className="p-3">{c.date}</td>}
                                {visibleColumns.district && (
                                  <td className="p-3">
                                    <div className="flex flex-col">
                                      <span className="text-text-primary font-medium">{c.district}</span>
                                      <span className="text-[9px] text-text-secondary">{c.policeStation}</span>
                                    </div>
                                  </td>
                                )}
                                {visibleColumns.category && (
                                  <td className="p-3">
                                    <div className="flex flex-col">
                                      <span className="text-text-primary font-medium">{c.category}</span>
                                      <span className="text-[9px] text-text-secondary">{c.subcategory}</span>
                                    </div>
                                  </td>
                                )}
                                {visibleColumns.status && (
                                  <td className="p-3">
                                    <Badge
                                      variant={
                                        c.status === "Closed"
                                          ? "success"
                                          : c.status === "Under Investigation"
                                          ? "warning"
                                          : c.status === "Awaiting Trial"
                                          ? "primary"
                                          : "secondary"
                                      }
                                    >
                                      {c.status}
                                    </Badge>
                                  </td>
                                )}
                                {visibleColumns.officer && <td className="p-3">{c.officerName}</td>}
                                {visibleColumns.duration && <td className="p-3">{c.durationDays} Days</td>}
                                <td className="p-3 text-center">
                                  <Button variant="ghost" size="sm" onClick={() => openDrillDown(`FIR Details: ${c.firNumber}`, [c])} className="text-[10px] h-7 px-2">
                                    Analyze
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-text-secondary">
                                No matching case intelligence found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-[11px]">
                      <div className="text-text-secondary">
                        Showing <span className="font-semibold text-text-primary">{Math.min(explorerCases.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{" "}
                        <span className="font-semibold text-text-primary">{Math.min(explorerCases.length, currentPage * itemsPerPage)}</span> of{" "}
                        <span className="font-semibold text-text-primary">{explorerCases.length}</span> records
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
                          Prev
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* 4. Drill-Down Panel (Dynamic Drawer) */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drillDownData?.title || "Dossier Drill Down"}>
        {drillDownData && (
          <div className="space-y-6 text-xs text-text-secondary leading-normal select-none">
            
            {/* General Case metrics */}
            <div className="p-4 bg-background-secondary/20 border border-border-subtle rounded-md space-y-3">
              <span className="font-semibold text-text-primary text-xs block">Drill-Down Summary</span>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-background-card rounded">
                  <span className="text-[10px] block">Cases Inspected</span>
                  <span className="text-lg font-bold text-text-primary block mt-0.5">{drillDownData.cases.length}</span>
                </div>
                <div className="p-2 bg-background-card rounded">
                  <span className="text-[10px] block">Avg Duration</span>
                  <span className="text-lg font-bold text-text-primary block mt-0.5">
                    {drillDownData.cases.length > 0
                      ? Math.round(drillDownData.cases.reduce((s, c) => s + c.durationDays, 0) / drillDownData.cases.length)
                      : 0}{" "}
                    Days
                  </span>
                </div>
              </div>
            </div>

            {/* List of cases in drilldown */}
            <div className="space-y-4">
              <span className="font-semibold text-text-primary text-[11px] block">Individual Dossier Entries</span>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {drillDownData.cases.map((c) => (
                  <div key={c.id} className="p-3 bg-background-card border border-border-subtle rounded space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary">{c.firNumber}</span>
                      <Badge variant={c.severity === "High" ? "danger" : "warning"}>{c.severity} Severity</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-text-secondary block">Date Filed:</span>
                        <span className="text-text-primary font-medium">{c.date}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">District / Station:</span>
                        <span className="text-text-primary font-medium">{c.district} ({c.policeStation})</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Category / Subcat:</span>
                        <span className="text-text-primary font-medium">{c.category} ({c.subcategory})</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Investigation Officer:</span>
                        <span className="text-text-primary font-medium">{c.officerName}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Status:</span>
                        <span className="text-text-primary font-medium">{c.status}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary block">Arrest status:</span>
                        <Badge variant={c.arrestCompleted ? "success" : "secondary"}>
                          {c.arrestCompleted ? "Arrest Completed" : "Search Active"}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-t border-border-subtle pt-2 text-[9px] space-y-1">
                      <div>
                        <span className="text-text-secondary">Victim details:</span>{" "}
                        <span className="text-text-primary font-semibold">{c.victimGender}, {c.victimAge} Years</span>
                      </div>
                      <div>
                        <span className="text-text-secondary">Accused details:</span>{" "}
                        <span className="text-text-primary font-semibold">{c.accusedGender}, {c.accusedAge} Years</span>
                      </div>
                    </div>
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
