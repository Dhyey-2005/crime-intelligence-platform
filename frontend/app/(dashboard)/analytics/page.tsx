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
import { analyticsService, DashboardSummaryResponse } from "@/services/analyticsService";
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
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AnalyticsPage() {
  const { user } = useAuthStore();

  // Live PostgreSQL Backend Integration
  const [liveSummary, setLiveSummary] = React.useState<DashboardSummaryResponse | null>(() => analyticsService.getInitialSummary());
  const [isBackendLive, setIsBackendLive] = React.useState(false);
  const [dbCases, setDbCases] = React.useState<AnalyticsCase[]>(() => analyticsService.getInitialCases());
  const [dbDistricts, setDbDistricts] = React.useState<string[]>(districts);
  const [dbPoliceStationsMap, setDbPoliceStationsMap] = React.useState<Record<string, string[]>>(policeStationsMap);
  const [dbCategories, setDbCategories] = React.useState<string[]>(crimeCategories);
  const [dbSubcategoryMap, setDbSubcategoryMap] = React.useState<Record<string, string[]>>(subcategoryMap);
  const [dbStatuses, setDbStatuses] = React.useState<string[]>(["Under Investigation", "Charge Sheet Filed", "Awaiting Trial", "Closed"]);
  const [dbOfficers, setDbOfficers] = React.useState<string[]>(mockOfficers);

  const syncRealTimeData = React.useCallback((isManual = false) => {
    if (isManual) {
      toast.info("Synchronizing real-time telemetry from PostgreSQL ksp_db...");
    }
    analyticsService.getSummary().then((data) => {
      if (data && data.total_cases > 0) {
        setLiveSummary(data);
        setIsBackendLive(true);
      }
    });

    analyticsService.getCases(5000).then((casesData) => {
      if (casesData && casesData.length > 0) {
        setDbCases(casesData);
        if (isManual) toast.success(`Synced ${casesData.length} live case records from database.`);
      }
    });

    analyticsService.getFilterOptions().then((filterData) => {
      if (filterData) {
        if (filterData.districts && filterData.districts.length > 0) {
          setDbDistricts(filterData.districts);
          if (filterData.districts.length > 1) {
            setCompDistrict1((prev) => prev || filterData.districts[0]);
            setCompDistrict2((prev) => prev || filterData.districts[1]);
          }
        }
        if (filterData.police_stations && Object.keys(filterData.police_stations).length > 0) {
          setDbPoliceStationsMap(filterData.police_stations);
          const allStations = Object.values(filterData.police_stations).flat();
          if (allStations.length > 1) {
            setCompStation1((prev) => prev || allStations[0]);
            setCompStation2((prev) => prev || allStations[1]);
          }
        }
        if (filterData.categories && filterData.categories.length > 0) {
          setDbCategories(filterData.categories);
          if (filterData.categories.length > 1) {
            setCompCategory1((prev) => prev || filterData.categories[0]);
            setCompCategory2((prev) => prev || filterData.categories[1]);
          }
        }
        if (filterData.subcategories && Object.keys(filterData.subcategories).length > 0) {
          setDbSubcategoryMap(filterData.subcategories);
        }
        if (filterData.statuses && filterData.statuses.length > 0) {
          setDbStatuses(filterData.statuses);
        }
        if (filterData.officers && filterData.officers.length > 0) {
          setDbOfficers(filterData.officers);
        }
      }
    });
  }, []);

  React.useEffect(() => {
    const cachedCases = analyticsService.getCachedCases();
    if (cachedCases) setDbCases(cachedCases);
    const cachedSummary = analyticsService.getCachedSummary();
    if (cachedSummary) {
      setLiveSummary(cachedSummary);
      setIsBackendLive(true);
    }
    const cachedFilters = analyticsService.getCachedFilterOptions();
    if (cachedFilters) {
      if (cachedFilters.districts?.length > 0) setDbDistricts(cachedFilters.districts);
      if (cachedFilters.police_stations && Object.keys(cachedFilters.police_stations).length > 0) setDbPoliceStationsMap(cachedFilters.police_stations);
      if (cachedFilters.categories?.length > 0) setDbCategories(cachedFilters.categories);
      if (cachedFilters.subcategories && Object.keys(cachedFilters.subcategories).length > 0) setDbSubcategoryMap(cachedFilters.subcategories);
      if (cachedFilters.statuses?.length > 0) setDbStatuses(cachedFilters.statuses);
      if (cachedFilters.officers?.length > 0) setDbOfficers(cachedFilters.officers);
    }

    syncRealTimeData(false);
  }, [syncRealTimeData]);


  // 1. Global Filter States
  const [startMonth, setStartMonth] = React.useState("all"); // From Month
  const [endMonth, setEndMonth] = React.useState("all"); // To Month
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedStation, setSelectedStation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedSubcategory, setSelectedSubcategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [selectedOfficer, setSelectedOfficer] = React.useState("");
  const [selectedSeverity, setSelectedSeverity] = React.useState("");
  const [selectedRisk, setSelectedRisk] = React.useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

  // Comparative states
  const [compDistrict1, setCompDistrict1] = React.useState("Bengaluru Urban");
  const [compDistrict2, setCompDistrict2] = React.useState("Mysuru");
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
    return dbPoliceStationsMap[selectedDistrict] || [];
  }, [selectedDistrict, dbPoliceStationsMap]);

  const availableSubcategories = React.useMemo(() => {
    if (!selectedCategory) return [];
    return dbSubcategoryMap[selectedCategory] || [];
  }, [selectedCategory, dbSubcategoryMap]);

  const availableMonths = React.useMemo(() => {
    const months = new Set<string>();
    dbCases.forEach((c) => {
      if (c.date && c.date.length >= 7) {
        months.add(c.date.substring(0, 7));
      }
    });
    return Array.from(months).sort().reverse();
  }, [dbCases]);

  // Main Filtered Dataset
  const filteredCases = React.useMemo(() => {
    return dbCases.filter((c) => {
      const caseMonth = c.date ? c.date.substring(0, 7) : "";
      if (startMonth !== "all" && caseMonth < startMonth) return false;
      if (endMonth !== "all" && caseMonth > endMonth) return false;
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
    startMonth,
    endMonth,
    selectedDistrict,
    selectedStation,
    selectedCategory,
    selectedSubcategory,
    selectedStatus,
    selectedOfficer,
    selectedSeverity,
    selectedRisk,
    dbCases,
  ]);

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (startMonth !== "all") count++;
    if (endMonth !== "all") count++;
    if (selectedDistrict) count++;
    if (selectedStation) count++;
    if (selectedCategory) count++;
    if (selectedSubcategory) count++;
    if (selectedStatus) count++;
    if (selectedOfficer) count++;
    if (selectedSeverity) count++;
    if (selectedRisk) count++;
    return count;
  }, [
    startMonth,
    endMonth,
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
    setStartMonth("all");
    setEndMonth("all");
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

    // Closed cases in DB
    const closed = filteredCases.filter((c) => 
      (c.status as string).toLowerCase().includes("closed") || 
      (c.status as string).toLowerCase().includes("compounded") ||
      (c.status as string) === "Case Closed" ||
      (c.status as string) === "Closed"
    ).length;
    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 100;

    // Active cases in DB (all non-closed cases, matching Crime Map exactly)
    const active = filteredCases.filter((c) => 
      !(c.status as string).toLowerCase().includes("closed") && 
      !(c.status as string).toLowerCase().includes("compounded") &&
      (c.status as string) !== "Case Closed" &&
      (c.status as string) !== "Closed"
    ).length;

    // Growth Rate (Latest Month vs Previous Month in filteredCases)
    const distinctMonths = Array.from(new Set(filteredCases.map((c) => c.date.substring(0, 7)))).sort().reverse();
    const latestMonth = endMonth !== "all" ? endMonth : (distinctMonths[0] || "");
    const prevMonth = (startMonth !== "all" && startMonth !== latestMonth)
      ? startMonth
      : (distinctMonths[1] || distinctMonths[0] || "");
    const latestCount = filteredCases.filter((c) => c.date.startsWith(latestMonth)).length;
    const prevCount = filteredCases.filter((c) => c.date.startsWith(prevMonth)).length;
    const growth = prevCount > 0 ? Math.round(((latestCount - prevCount) / prevCount) * 100) : 0;

    // Average daily cases (based on 30 days)
    const avgDaily = parseFloat((total / 30).toFixed(1));

    const formatMonthName = (ym: string) => {
      if (!ym) return "Latest";
      const parts = ym.split("-");
      if (parts.length < 2) return ym;
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
      return date.toLocaleString("default", { month: "short", year: "numeric" });
    };
    const latestMonthName = formatMonthName(latestMonth) || "Latest";
    const prevMonthName = formatMonthName(prevMonth) || "Previous";

    return {
      total,
      growth,
      avgDuration,
      resolutionRate,
      active,
      avgDaily,
      latestMonthName,
      prevMonthName,
    };
  }, [filteredCases, startMonth, endMonth]);

  // 3. ECharts options configurations
  // Chart 1: Crime Trend Line (Dynamic Timeline)
  const trendOption = React.useMemo(() => {
    const distinctMonths = Array.from(new Set(filteredCases.map((c) => c.date.substring(0, 7)))).sort().reverse();
    const latestMonth = endMonth !== "all" ? endMonth : (distinctMonths[0] || "2026-06");
    const prevMonth = (startMonth !== "all" && startMonth !== latestMonth)
      ? startMonth
      : (distinctMonths[1] || distinctMonths[0] || "2026-05");

    const countsLatest = Array(31).fill(0);
    const countsPrev = Array(31).fill(0);

    filteredCases.forEach((c) => {
      const ym = c.date.substring(0, 7);
      const day = parseInt(c.date.split("-")[2], 10) - 1;
      if (day >= 0 && day < 31) {
        if (ym === latestMonth) countsLatest[day] += 1;
        if (ym === prevMonth && prevMonth !== latestMonth) countsPrev[day] += 1;
      }
    });

    const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

    const formatMonthName = (ym: string) => {
      if (!ym) return ym;
      const parts = ym.split("-");
      if (parts.length < 2) return ym;
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
      return date.toLocaleString("default", { month: "short", year: "numeric" });
    };
    const latestName = formatMonthName(latestMonth);
    const prevName = formatMonthName(prevMonth);

    const series: any[] = [
      {
        name: `${latestName} Trend`,
        type: "line",
        smooth: 0.35,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 6,
        data: countsLatest,
        itemStyle: { color: "#06b6d4" },
        lineStyle: { width: 3, shadowColor: "rgba(6, 182, 212, 0.4)", shadowBlur: 10 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(6, 182, 212, 0.35)" },
              { offset: 1, color: "rgba(6, 182, 212, 0.0)" },
            ],
          },
        },
      },
    ];

    if (prevMonth !== latestMonth) {
      series.push({
        name: `${prevName} Trend`,
        type: "line",
        smooth: 0.35,
        showSymbol: false,
        symbol: "circle",
        symbolSize: 6,
        data: countsPrev,
        itemStyle: { color: "#a855f7" },
        lineStyle: { width: 2.5, type: "dashed", color: "#a855f7" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(168, 85, 247, 0.18)" },
              { offset: 1, color: "rgba(168, 85, 247, 0.0)" },
            ],
          },
        },
      });
    }

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: "#f8fafc", fontSize: 12 },
        extraCssText: "backdrop-filter: blur(12px); border-radius: 10px; box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.7);",
      },
      legend: {
        textStyle: { color: tokens.colors.text.secondary, fontSize: 10, fontWeight: 500 },
        bottom: 0,
        itemWidth: 14,
        itemHeight: 8,
      },
      grid: { left: "2%", right: "3%", bottom: "12%", top: "12%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: days.map((d) => `Day ${d}`),
        axisLine: { lineStyle: { color: "rgba(255, 255, 255, 0.15)" } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 10, margin: 12 },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Case Count",
        nameTextStyle: { color: tokens.colors.text.secondary, fontSize: 10, padding: [0, 0, 8, 0] },
        splitLine: { lineStyle: { type: "dashed", color: "rgba(255, 255, 255, 0.08)" } },
        axisLabel: { color: tokens.colors.text.secondary, fontSize: 10 },
      },
      series,
    };
  }, [filteredCases, startMonth, endMonth]);

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
        formatter: "{b}: <span style='font-weight:bold;color:#fff;'>{c}</span> ({d}%)",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: "#f8fafc", fontSize: 12 },
        extraCssText: "backdrop-filter: blur(12px); border-radius: 10px; box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.7);",
      },
      legend: {
        orient: "horizontal",
        bottom: 0,
        textStyle: { color: tokens.colors.text.secondary, fontSize: 10, fontWeight: 500 },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
      },
      series: [
        {
          type: "pie",
          radius: ["46%", "72%"],
          center: ["50%", "44%"],
          itemStyle: {
            borderRadius: 6,
            borderColor: "#0f172a",
            borderWidth: 2,
          },
          data: data.length > 0 ? data : [{ name: "No Cases", value: 0 }],
          color: [
            "#06b6d4",
            "#3b82f6",
            "#8b5cf6",
            "#ec4899",
            "#f59e0b",
            "#10b981",
          ],
          label: { show: false },
        },
      ],
    };
  }, [filteredCases]);

  // Chart 3: Comparative Districts Bar Chart
  const comparativeDistrictOption = React.useMemo(() => {
    const c1Cases = filteredCases.filter((c) => c.district === compDistrict1);
    const c2Cases = filteredCases.filter((c) => c.district === compDistrict2);

    const c1Counts: Record<string, number> = {};
    const c2Counts: Record<string, number> = {};
    dbCategories.forEach((cat) => {
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
        data: dbCategories.map((c) => c.split(" ")[0]),
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
  }, [compDistrict1, compDistrict2, filteredCases, dbCategories]);

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
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncRealTimeData(true)}
            leftIcon={<RefreshCw className="h-3.5 w-3.5 text-cyan-400" />}
            className="text-xs font-semibold"
          >
            Live Data Sync
          </Button>
        </div>
      </div>

      {/* 2. Global Filters Card */}
      <Card className="border-border-default/80 bg-background-card/90 backdrop-blur-md shadow-md">
        <CardContent className="p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center">
                <Filter className="h-3.5 w-3.5 text-analytics mr-1.5" />
                Strategic Analytics Filters
              </span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-analytics/20 text-analytics border border-analytics/40 rounded-full">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                leftIcon={<SlidersHorizontal className="h-3 w-3 text-cyan-400" />}
                rightIcon={showAdvancedFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                className="text-[11px] h-7 px-2.5 text-text-secondary hover:text-text-primary border border-border-subtle/60 rounded-md"
              >
                Advanced Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAllFilters}
                  leftIcon={<X className="h-3 w-3" />}
                  className="text-[10px] h-7 px-2 text-danger hover:text-danger-hover hover:bg-danger/10"
                >
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>

          {/* Primary Top Filters Row (5 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">From Month</label>
              <Select
                options={[
                  { value: "all", label: "Any Start Month" },
                  ...availableMonths.map((m) => {
                    const parts = m.split("-");
                    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
                    const label = dateObj.toLocaleString("default", { month: "short", year: "numeric" });
                    return { value: m, label: label || m };
                  }),
                ]}
                value={startMonth}
                onChange={(val) => setStartMonth(val)}
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">To Month</label>
              <Select
                options={[
                  { value: "all", label: "Any End Month" },
                  ...availableMonths.map((m) => {
                    const parts = m.split("-");
                    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
                    const label = dateObj.toLocaleString("default", { month: "short", year: "numeric" });
                    return { value: m, label: label || m };
                  }),
                ]}
                value={endMonth}
                onChange={(val) => setEndMonth(val)}
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">District</label>
              <Select
                options={[
                  { value: "", label: "All Districts" },
                  ...dbDistricts.map((d) => ({ value: d, label: d })),
                ]}
                value={selectedDistrict}
                onChange={(val) => setSelectedDistrict(val)}
              />
            </div>

            <div>
              <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Police Station</label>
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
              <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Crime Category</label>
              <Select
                options={[
                  { value: "", label: "All Categories" },
                  ...dbCategories.map((c) => ({ value: c, label: c })),
                ]}
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
              />
            </div>
          </div>

          {/* Collapsible Advanced Filters Section (5 Columns) */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-border-subtle/60 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Subcategory</label>
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
                <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Case Status</label>
                <Select
                  options={[
                    { value: "", label: "All Statuses" },
                    ...dbStatuses.map((s) => ({ value: s, label: s })),
                  ]}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val)}
                />
              </div>

              <div>
                <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Officer Assigned</label>
                <Select
                  options={[
                    { value: "", label: "All Officers" },
                    ...dbOfficers.map((o) => ({ value: o, label: o })),
                  ]}
                  value={selectedOfficer}
                  onChange={(val) => setSelectedOfficer(val)}
                />
              </div>

              <div>
                <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Severity Level</label>
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
                <label className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">Risk Index</label>
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
          )}
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
                  <StatContainer title={`${metrics.latestMonthName} Growth`} value={`${metrics.growth > 0 ? "+" : ""}${metrics.growth}%`} description={`Growth rate vs ${metrics.prevMonthName}`} icon={<TrendingUp className="h-4 w-4" />} />
                  <StatContainer title="Avg Resolution Time" value={`${metrics.avgDuration} Days`} description="Average days taken to close case" icon={<Clock className="h-4 w-4" />} />
                  <StatContainer title="Resolution Rate" value={`${metrics.resolutionRate}%`} description="Closed vs Active caseload" icon={<Shield className="h-4 w-4" />} />
                  <StatContainer title="Active Investigations" value={metrics.active} description="Total pending court / search" icon={<Layers className="h-4 w-4" />} />
                  <StatContainer title="Avg Daily FIRs" value={metrics.avgDaily} description="Average FIR registrations / day" icon={<Calendar className="h-4 w-4" />} />
                </div>

                {/* Trend Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                        <div>
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-cyan-400" />
                            Case File Trend Analysis ({metrics.latestMonthName} vs {metrics.prevMonthName})
                          </CardTitle>
                          <p className="text-[11px] text-text-secondary mt-1">
                            Daily FIR trajectory: <span className="text-cyan-400 font-medium">{metrics.latestMonthName}</span> (solid) vs <span className="text-purple-400 font-medium">{metrics.prevMonthName}</span> (dashed)
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDrillDown("Trend Case Records", filteredCases)}
                          className="text-[11px] h-7 px-2.5 bg-background-elevated/50 hover:bg-background-hover border-border-subtle shrink-0 self-start sm:self-center"
                          leftIcon={<FileText className="h-3 w-3 text-cyan-400" />}
                        >
                          Drill Down
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="h-80">
                      <Chart option={trendOption} className="h-full" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                        <div>
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-cyan-400" />
                            Crime Category Breakdown
                          </CardTitle>
                          <p className="text-[11px] text-text-secondary mt-1">
                            Proportional distribution across all active intelligence records
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDrillDown("Crime Categories Details", filteredCases)}
                          className="text-[11px] h-7 px-2.5 bg-background-elevated/50 hover:bg-background-hover border-border-subtle shrink-0 self-start sm:self-center"
                          leftIcon={<FileText className="h-3 w-3 text-cyan-400" />}
                        >
                          Drill Down
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="h-80">
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
                        <Select options={dbDistricts.map((d) => ({ value: d, label: d }))} value={compDistrict1} onChange={(val) => setCompDistrict1(val)} />
                        <Select options={dbDistricts.map((d) => ({ value: d, label: d }))} value={compDistrict2} onChange={(val) => setCompDistrict2(val)} />
                      </div>
                    </div>

                    {/* Police Station Selector */}
                    <div className="space-y-2 border-r border-border-subtle pr-4">
                      <span className="font-semibold text-text-primary text-[11px] block">Police Station Comparison</span>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          options={Object.values(dbPoliceStationsMap).flat().map((s) => ({ value: s, label: s }))}
                          value={compStation1}
                          onChange={(val) => setCompStation1(val)}
                        />
                        <Select
                          options={Object.values(dbPoliceStationsMap).flat().map((s) => ({ value: s, label: s }))}
                          value={compStation2}
                          onChange={(val) => setCompStation2(val)}
                        />
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                      <span className="font-semibold text-text-primary text-[11px] block">Crime Category Comparison</span>
                      <div className="grid grid-cols-2 gap-2">
                        <Select options={dbCategories.map((c) => ({ value: c, label: c }))} value={compCategory1} onChange={(val) => setCompCategory1(val)} />
                        <Select options={dbCategories.map((c) => ({ value: c, label: c }))} value={compCategory2} onChange={(val) => setCompCategory2(val)} />
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
                        { name: compStation1, cases: filteredCases.filter((c) => c.policeStation === compStation1) },
                        { name: compStation2, cases: filteredCases.filter((c) => c.policeStation === compStation2) },
                      ].map((station) => {
                        const total = station.cases.length;
                        const active = station.cases.filter((c) => !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded") && (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed").length;
                        const pendingSearch = station.cases.filter((c) => (c.status as string) === "Under Investigation" || (c.status as string).toLowerCase().includes("investigation")).length;
                        const severityHigh = station.cases.filter((c) => c.severity === "High").length;
                        const completion = total > 0 ? Math.round(((total - active) / total) * 100) : 100;

                        return (
                          <div key={station.name} className="p-4 bg-background-secondary/20 border border-border-subtle rounded-md space-y-3">
                            <div className="flex justify-between items-center border-b border-border-subtle pb-1.5">
                              <span className="font-semibold text-text-primary text-xs">{station.name}</span>
                              <Badge variant="primary">{total} Total Cases</Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                              <div>
                                <span className="block text-text-secondary uppercase">Active Cases</span>
                                <span className="text-sm font-bold text-text-primary mt-0.5 block">{active}</span>
                              </div>
                              <div>
                                <span className="block text-text-secondary uppercase">Pending Search</span>
                                <span className="text-sm font-bold text-warning mt-0.5 block">{pendingSearch}</span>
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
                              <th className="p-3 font-semibold text-center">Total FIRs</th>
                              <th className="p-3 font-semibold text-center">Active Caseload</th>
                              <th className="p-3 font-semibold text-center">Pending Search</th>
                              <th className="p-3 font-semibold text-center">Resolution Time</th>
                              <th className="p-3 font-semibold text-center">Arrest Index</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {dbDistricts.map((d) => {
                              const cases = filteredCases.filter((c) => c.district === d);
                              const total = cases.length;
                              const active = cases.filter((c) => !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded") && (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed").length;
                              const pending = cases.filter((c) => (c.status as string) === "Under Investigation" || (c.status as string).toLowerCase().includes("investigation")).length;
                              const avgDuration = total > 0 ? Math.round(cases.reduce((sum, c) => sum + c.durationDays, 0) / total) : 0;
                              const arrestCount = cases.filter((c) => c.arrestCompleted).length;
                              const arrestPct = total > 0 ? Math.round((arrestCount / total) * 100) : 100;

                              return (
                                <tr key={d} className="hover:bg-background-secondary/20 transition-colors">
                                  <td className="p-3 font-semibold text-text-primary">{d}</td>
                                  <td className="p-3 text-center text-text-secondary">{total}</td>
                                  <td className="p-3 text-center font-bold text-text-primary">{active}</td>
                                  <td className="p-3 text-center text-warning">{pending}</td>
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
                        {dbOfficers.map((name) => {
                          const cases = filteredCases.filter((c) => c.officerName === name);
                          const total = cases.length;
                          if (total === 0) return null;
                          const active = cases.filter((c) => !(c.status as string).toLowerCase().includes("closed") && !(c.status as string).toLowerCase().includes("compounded") && (c.status as string) !== "Closed" && (c.status as string) !== "Case Closed").length;
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
