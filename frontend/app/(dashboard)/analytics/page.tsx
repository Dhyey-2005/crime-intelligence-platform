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

    const data = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

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
        type: "scroll",
        orient: "vertical",
        right: "2%",
        top: "6%",
        bottom: "6%",
        width: "48%",
        textStyle: { color: tokens.colors.text.secondary, fontSize: 11, fontWeight: 500 },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 12,
        formatter: (name: string) => {
          const item = data.find((d) => d.name === name);
          const val = item ? item.value : 0;
          return `${name} (${val})`;
        },
      },
      series: [
        {
          type: "pie",
          radius: ["55%", "80%"],
          center: ["25%", "50%"],
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
            "#6366f1",
            "#14b8a6",
            "#f43f5e",
            "#84cc16",
            "#64748b",
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
        data: dbCategories.map((c) => (c.length > 14 ? c.slice(0, 14) + "…" : c)),
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
      const vAge = Number(c.victimAge) || 0;
      if (vAge < 18) ageBrackets["<18"].victim += 1;
      else if (vAge <= 35) ageBrackets["18-35"].victim += 1;
      else if (vAge <= 50) ageBrackets["36-50"].victim += 1;
      else ageBrackets["50+"].victim += 1;

      // Accused
      const aAge = Number(c.accusedAge) || 0;
      if (aAge < 18) ageBrackets["<18"].accused += 1;
      else if (aAge <= 35) ageBrackets["18-35"].accused += 1;
      else if (aAge <= 50) ageBrackets["36-50"].accused += 1;
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

  // 4a. Investigations & Demographics dynamic aggregations from active live database
  const investigationsData = React.useMemo(() => {
    const statusCounts: Record<string, number> = {};
    let arrestCount = 0;
    let totalDuration = 0;

    filteredCases.forEach((c) => {
      const s = (c.status || "Unknown Status").toString();
      statusCounts[s] = (statusCounts[s] || 0) + 1;
      if (c.arrestCompleted) arrestCount += 1;
      totalDuration += (c.durationDays || 0);
    });

    const total = filteredCases.length;
    return {
      statusList: Object.entries(statusCounts).sort((a, b) => b[1] - a[1]),
      arrestPct: total > 0 ? Math.round((arrestCount / total) * 100) : 0,
      avgDuration: total > 0 ? Math.round(totalDuration / total) : 0,
    };
  }, [filteredCases]);

  const demographicsData = React.useMemo(() => {
    const victimGenders: Record<string, number> = {};
    const accusedGenders: Record<string, number> = {};
    
    filteredCases.forEach((c) => {
      const vg = (c.victimGender || "Unknown").toString();
      const ag = (c.accusedGender || "Unknown").toString();
      victimGenders[vg] = (victimGenders[vg] || 0) + 1;
      accusedGenders[ag] = (accusedGenders[ag] || 0) + 1;
    });

    return {
      victimGenders: Object.entries(victimGenders).sort((a, b) => b[1] - a[1]),
      accusedGenders: Object.entries(accusedGenders).sort((a, b) => b[1] - a[1]),
    };
  }, [filteredCases]);

  // 4b. Operational Performance dynamic aggregations from active live database
  const districtPerformanceData = React.useMemo(() => {
    const distMap: Record<string, { total: number; active: number; pending: number; totalDuration: number; arrestCount: number }> = {};
    filteredCases.forEach((c) => {
      const d = c.district || "Unknown District";
      if (!distMap[d]) {
        distMap[d] = { total: 0, active: 0, pending: 0, totalDuration: 0, arrestCount: 0 };
      }
      distMap[d].total += 1;
      const statusLower = (c.status || "").toString().toLowerCase();
      const isClosed = statusLower.includes("closed") || statusLower.includes("compounded");
      if (!isClosed) distMap[d].active += 1;
      if (c.status === "Under Investigation" || statusLower.includes("investigation")) distMap[d].pending += 1;
      distMap[d].totalDuration += (c.durationDays || 0);
      if (c.arrestCompleted) distMap[d].arrestCount += 1;
    });

    return Object.entries(distMap)
      .map(([district, stats]) => ({
        district,
        total: stats.total,
        active: stats.active,
        pending: stats.pending,
        avgDuration: stats.total > 0 ? Math.round(stats.totalDuration / stats.total) : 0,
        arrestPct: stats.total > 0 ? Math.round((stats.arrestCount / stats.total) * 100) : 100,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredCases]);

  const officerWorkloadData = React.useMemo(() => {
    const officerMap: Record<string, { total: number; active: number }> = {};
    filteredCases.forEach((c) => {
      const name = c.officerName || "Unassigned Officer";
      if (!officerMap[name]) {
        officerMap[name] = { total: 0, active: 0 };
      }
      officerMap[name].total += 1;
      const statusLower = (c.status || "").toString().toLowerCase();
      const isClosed = statusLower.includes("closed") || statusLower.includes("compounded");
      if (!isClosed) officerMap[name].active += 1;
    });

    return Object.entries(officerMap)
      .map(([name, stats]) => {
        const loadPct = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
        return {
          name,
          total: stats.total,
          active: stats.active,
          loadPct,
        };
      })
      .sort((a, b) => b.active - a.active);
  }, [filteredCases]);

  // 5. Drill-Down Panel states (using modal Drawer)
  const [drillDownData, setDrillDownData] = React.useState<{ title: string; cases: AnalyticsCase[] } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drillSearch, setDrillSearch] = React.useState("");
  const [drillLimit, setDrillLimit] = React.useState(30);

  const openDrillDown = (title: string, casesList: AnalyticsCase[]) => {
    setDrillDownData({ title, cases: casesList });
    setDrillSearch("");
    setDrillLimit(30);
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
      const query = searchQuery.toLowerCase().trim();
      return (c.firNumber || "").toString().toLowerCase().includes(query);
    });

    // Sorting
    result.sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";

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

  const totalPages = Math.max(Math.ceil(explorerCases.length / itemsPerPage), 1);

  // Paginated List with out-of-bounds protection
  const paginatedCases = React.useMemo(() => {
    const validPage = Math.min(currentPage, totalPages);
    const startIndex = (validPage - 1) * itemsPerPage;
    return explorerCases.slice(startIndex, startIndex + itemsPerPage);
  }, [explorerCases, currentPage, totalPages]);

  const handleSort = (field: keyof AnalyticsCase) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Real export functionality for active filtered Data Explorer subset
  const triggerExport = (format: "PDF" | "Excel" | "CSV") => {
    if (explorerCases.length === 0) {
      toast.error("No matching records available to export!");
      return;
    }

    const dateStr = new Date().toISOString().split("T")[0];

    if (format === "CSV") {
      const headers = ["FIR Number", "Date", "District", "Police Station", "Category", "Subcategory", "Status", "Severity", "Risk Level", "Officer", "Duration (Days)"];
      const rows = explorerCases.map((c) => [
        `"${(c.firNumber || "").toString().replace(/"/g, '""')}"`,
        `"${(c.date || "").toString().replace(/"/g, '""')}"`,
        `"${(c.district || "").toString().replace(/"/g, '""')}"`,
        `"${(c.policeStation || "").toString().replace(/"/g, '""')}"`,
        `"${(c.category || "").toString().replace(/"/g, '""')}"`,
        `"${(c.subcategory || "").toString().replace(/"/g, '""')}"`,
        `"${(c.status || "").toString().replace(/"/g, '""')}"`,
        `"${(c.severity || "").toString().replace(/"/g, '""')}"`,
        `"${(c.riskLevel || "").toString().replace(/"/g, '""')}"`,
        `"${(c.officerName || "").toString().replace(/"/g, '""')}"`,
        c.durationDays || 0,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KA_Crime_Report_${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("CSV Dossier downloaded successfully!", {
        description: `Exported ${explorerCases.length} records to KA_Crime_Report_${dateStr}.csv`,
      });
    } else if (format === "Excel") {
      let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><style>th { background: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; text-align: left; } td { border: 1px solid #cbd5e1; padding: 6px; }</style></head><body><table><thead><tr><th>FIR Number</th><th>Date</th><th>District</th><th>Police Station</th><th>Category</th><th>Subcategory</th><th>Status</th><th>Severity</th><th>Officer</th><th>Duration (Days)</th></tr></thead><tbody>`;
      explorerCases.forEach((c) => {
        tableHtml += `<tr><td style="mso-number-format:'\@'">${c.firNumber || ""}</td><td>${c.date || ""}</td><td>${c.district || ""}</td><td>${c.policeStation || ""}</td><td>${c.category || ""}</td><td>${c.subcategory || ""}</td><td>${c.status || ""}</td><td>${c.severity || ""}</td><td>${c.officerName || ""}</td><td>${c.durationDays || 0}</td></tr>`;
      });
      tableHtml += `</tbody></table></body></html>`;
      const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KA_Crime_Report_${dateStr}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Excel Spreadsheet downloaded successfully!", {
        description: `Exported ${explorerCases.length} records to KA_Crime_Report_${dateStr}.xls`,
      });
    } else if (format === "PDF") {
      const printWin = window.open("", "_blank");
      if (!printWin) {
        toast.error("Popup blocked! Please allow popups to download the PDF report.");
        return;
      }
      let html = `<!DOCTYPE html><html><head><title>Karnataka State Police - Intelligence Dossier</title><style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 30px; }
        .header { border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .title { font-size: 24px; font-weight: bold; color: #1e3a8a; }
        .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
        .meta { font-size: 12px; color: #475569; text-align: right; }
        .summary-box { background: #f1f5f9; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; border-left: 4px solid #3b82f6; }
        table { border-collapse: collapse; width: 100%; font-size: 11px; margin-top: 10px; }
        th { background: #1e3a8a; color: #ffffff; text-align: left; padding: 8px; border: 1px solid #cbd5e1; font-weight: 600; }
        td { padding: 8px; border: 1px solid #cbd5e1; color: #334155; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        @media print { body { margin: 0; } .no-print { display: none; } }
      </style></head><body>
      <div class="header">
        <div>
          <div class="title">KARNATAKA STATE POLICE</div>
          <div class="subtitle">CrimeShield Intelligence & Strategic Telemetry Dossier</div>
        </div>
        <div class="meta">
          <div><strong>Generated Date:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Total Records:</strong> ${explorerCases.length} Cases</div>
        </div>
      </div>
      <div class="summary-box">
        <strong>Filter Summary:</strong> Exporting current Data Explorer active intelligence subset. 
        Includes data filtered by active search parameters and regional selections.
      </div>
      <table>
        <thead>
          <tr>
            <th>FIR Number</th>
            <th>Date</th>
            <th>District</th>
            <th>Police Station</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Officer</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>`;

      explorerCases.forEach((c) => {
        html += `<tr>
          <td style="font-weight: bold;">${c.firNumber || "N/A"}</td>
          <td>${c.date || "N/A"}</td>
          <td>${c.district || "N/A"}</td>
          <td>${c.policeStation || "N/A"}</td>
          <td>${c.category || "N/A"}</td>
          <td>${c.subcategory || "N/A"}</td>
          <td>${c.status || "N/A"}</td>
          <td>${c.severity || "N/A"}</td>
          <td>${c.officerName || "N/A"}</td>
          <td>${c.durationDays || 0} Days</td>
        </tr>`;
      });

      html += `</tbody></table>
      <div class="footer">
        CONFIDENTIAL - LAW ENFORCEMENT INTELLIGENCE ONLY - GENERATED BY CRIMESHIELD PLATFORM
      </div>
      <script>
        window.onload = () => { window.print(); };
      </script>
      </body></html>`;

      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();

      toast.success("PDF Dossier generated successfully!", {
        description: "Print/Save as PDF window opened for active dataset.",
      });
    }
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
                    <CardContent className="h-[380px]">
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

                    {/* Police Station Selector scoped to selected district */}
                    <div className="space-y-2 border-r border-border-subtle pr-4">
                      <span className="font-semibold text-text-primary text-[11px] block">Police Station Comparison</span>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          options={(dbPoliceStationsMap[compDistrict1] || Object.values(dbPoliceStationsMap).flat()).map((s) => ({ value: s, label: s }))}
                          value={compStation1}
                          onChange={(val) => setCompStation1(val)}
                        />
                        <Select
                          options={(dbPoliceStationsMap[compDistrict2] || Object.values(dbPoliceStationsMap).flat()).map((s) => ({ value: s, label: s }))}
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

                {/* Comparative Charts & Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* District vs District Chart */}
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
                        const active = station.cases.filter((c) => {
                          const s = (c.status || "").toString().toLowerCase();
                          return !s.includes("closed") && !s.includes("compounded");
                        }).length;
                        const pendingSearch = station.cases.filter((c) => {
                          const s = (c.status || "").toString();
                          return s === "Under Investigation" || s.toLowerCase().includes("investigation");
                        }).length;
                        const severityHigh = station.cases.filter((c) => c.severity === "High").length;
                        const completion = total > 0 ? Math.round(((total - active) / total) * 100) : 100;

                        return (
                          <div key={station.name || "station"} className="p-4 bg-background-secondary/20 border border-border-subtle rounded-md space-y-3">
                            <div className="flex justify-between items-center border-b border-border-subtle pb-1.5">
                              <span className="font-semibold text-text-primary text-xs">{station.name || "Select Station"}</span>
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

                  {/* Comparative Categories Head-to-Head Card (Full Width 2 cols on lg) */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Crime Category Head-to-Head Telemetry Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[
                        { name: compCategory1, cases: filteredCases.filter((c) => c.category === compCategory1) },
                        { name: compCategory2, cases: filteredCases.filter((c) => c.category === compCategory2) },
                      ].map((catItem) => {
                        const total = catItem.cases.length;
                        const active = catItem.cases.filter((c) => {
                          const s = (c.status || "").toString().toLowerCase();
                          return !s.includes("closed") && !s.includes("compounded");
                        }).length;
                        const arrestCount = catItem.cases.filter((c) => c.arrestCompleted).length;
                        const arrestRate = total > 0 ? Math.round((arrestCount / total) * 100) : 0;
                        const avgDuration = total > 0 ? Math.round(catItem.cases.reduce((sum, c) => sum + (c.durationDays || 0), 0) / total) : 0;
                        let topDistrict = "N/A";
                        if (total > 0) {
                          const distCounts: Record<string, number> = {};
                          catItem.cases.forEach((c) => {
                            const d = c.district || "Unknown";
                            distCounts[d] = (distCounts[d] || 0) + 1;
                          });
                          topDistrict = Object.entries(distCounts).sort((a, b) => b[1] - a[1])[0][0];
                        }

                        return (
                          <div key={catItem.name || "cat"} className="p-4 bg-background-secondary/20 border border-border-subtle rounded-md space-y-4">
                            <div className="flex justify-between items-center border-b border-border-subtle pb-2">
                              <span className="font-semibold text-text-primary text-sm">{catItem.name || "Select Category"}</span>
                              <Badge variant="ai">{total} Total Cases</Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                              <div className="p-2 bg-background-secondary/10 rounded">
                                <span className="block text-[10px] text-text-secondary uppercase font-semibold">Active Load</span>
                                <span className="text-sm font-bold text-warning mt-0.5 block">{active} Cases</span>
                              </div>
                              <div className="p-2 bg-background-secondary/10 rounded">
                                <span className="block text-[10px] text-text-secondary uppercase font-semibold">Arrest Rate</span>
                                <span className="text-sm font-bold text-success mt-0.5 block">{arrestRate}%</span>
                              </div>
                              <div className="p-2 bg-background-secondary/10 rounded">
                                <span className="block text-[10px] text-text-secondary uppercase font-semibold">Avg Resolution</span>
                                <span className="text-sm font-bold text-text-primary mt-0.5 block">{avgDuration} Days</span>
                              </div>
                              <div className="p-2 bg-background-secondary/10 rounded">
                                <span className="block text-[10px] text-text-secondary uppercase font-semibold">Top Hotspot</span>
                                <span className="text-sm font-bold text-cyan-400 mt-0.5 block truncate" title={topDistrict}>{topDistrict}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-text-secondary">
                                <span>Investigation Resolution Ratio</span>
                                <span>{total > 0 ? Math.round(((total - active) / total) * 100) : 100}%</span>
                              </div>
                              <ProgressBar value={total > 0 ? Math.round(((total - active) / total) * 100) : 100} color="analytics" className="h-1.5" />
                            </div>
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
                {/* Top Row: Investigation Status & Telemetry from Live Database */}
                <Card>
                  <CardHeader>
                    <CardTitle>Live Investigation Status Breakdown & Telemetry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {investigationsData.statusList.map(([status, count]) => {
                        return (
                          <div key={status} className="p-3 bg-background-secondary/20 border border-border-subtle rounded-md space-y-1">
                            <span className="text-[10px] font-semibold text-text-secondary block line-clamp-2" title={status}>{status}</span>
                            <span className="text-lg font-bold text-text-primary block">{count} Cases</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Row: Demographics from Live Database */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Demographics Age Chart (7 cols) */}
                  <Card className="lg:col-span-7">
                    <CardHeader>
                      <CardTitle>Demographic Age Distribution (Accused vs Victim)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <Chart option={demographicsAgeOption} className="h-full" />
                    </CardContent>
                  </Card>

                  {/* Gender Demographics (5 cols) */}
                  <Card className="lg:col-span-5">
                    <CardHeader>
                      <CardTitle>Dossier Gender Demographics Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
                      {/* Victim Gender */}
                      <div className="space-y-3">
                        <span className="font-semibold text-text-primary text-[11px] block">Victim Gender Distribution</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                          {demographicsData.victimGenders.map(([gen, count]) => {
                            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                            return (
                              <div key={gen} className="p-2.5 bg-background-secondary/20 border border-border-subtle rounded">
                                <span className="block text-text-secondary text-[10px] font-semibold">{gen}</span>
                                <span className="text-base font-bold text-text-primary mt-0.5 block">{count}</span>
                                <Caption className="text-[9px] text-text-secondary mt-0.5 block">({pct}%)</Caption>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Accused Gender */}
                      <div className="space-y-3 border-t border-border-subtle pt-4">
                        <span className="font-semibold text-text-primary text-[11px] block">Accused Gender Distribution</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                          {demographicsData.accusedGenders.map(([gen, count]) => {
                            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                            return (
                              <div key={gen} className="p-2.5 bg-background-secondary/20 border border-border-subtle rounded">
                                <span className="block text-text-secondary text-[10px] font-semibold">{gen}</span>
                                <span className="text-base font-bold text-text-primary mt-0.5 block">{count}</span>
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
                      <div className="w-full overflow-x-auto rounded-md border border-border-subtle max-h-[480px] overflow-y-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead className="sticky top-0 bg-background-secondary z-10">
                            <tr className="border-b border-border-subtle text-text-primary">
                              <th className="p-3 font-semibold text-left">District</th>
                              <th className="p-3 font-semibold text-center">Total FIRs</th>
                              <th className="p-3 font-semibold text-center">Active Caseload</th>
                              <th className="p-3 font-semibold text-center">Pending Search</th>
                              <th className="p-3 font-semibold text-center">Resolution Time</th>
                              
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {districtPerformanceData.length > 0 ? (
                              districtPerformanceData.map((item) => (
                                <tr key={item.district} className="hover:bg-background-secondary/20 transition-colors">
                                  <td className="p-3 font-semibold text-text-primary">{item.district}</td>
                                  <td className="p-3 text-center text-text-secondary">{item.total}</td>
                                  <td className="p-3 text-center font-bold text-text-primary">{item.active}</td>
                                  <td className="p-3 text-center text-warning">{item.pending}</td>
                                  <td className="p-3 text-center text-text-secondary">{item.avgDuration} Days</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-text-secondary">
                                  No operational district data available for selected filter horizon.
                                </td>
                              </tr>
                            )}
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
                      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                        {officerWorkloadData.length > 0 ? (
                          officerWorkloadData.map((item) => (
                            <div key={item.name} className="p-3 bg-background-secondary/20 border border-border-subtle rounded-md space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-text-primary">{item.name}</span>
                                <Badge variant={item.loadPct > 70 ? "danger" : item.loadPct > 40 ? "warning" : "success"}>
                                  {item.active} Active / {item.total} Total
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] text-text-secondary">
                                  <span>Active Caseload Ratio</span>
                                  <span>{item.loadPct}%</span>
                                </div>
                                <ProgressBar value={item.loadPct} color={item.loadPct > 70 ? "danger" : item.loadPct > 40 ? "warning" : "success"} className="h-1.5" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-text-secondary text-xs">
                            No officer caseload data found for active filter criteria.
                          </div>
                        )}
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
                            placeholder="Search by FIR Number..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-80 sm:w-96 pl-9"
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
                            paginatedCases.map((c, index) => (
                              <tr key={`${c.firNumber || c.id}-${index}-${JSON.stringify(visibleColumns)}`} className="hover:bg-background-secondary/20 transition-colors">
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
                        Showing <span className="font-semibold text-text-primary">{explorerCases.length > 0 ? (Math.min(currentPage, totalPages) - 1) * itemsPerPage + 1 : 0}</span> to{" "}
                        <span className="font-semibold text-text-primary">{Math.min(explorerCases.length, Math.min(currentPage, totalPages) * itemsPerPage)}</span> of{" "}
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
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drillDownData?.title || "Dossier Drill Down"}
        className="!max-w-2xl sm:!max-w-3xl lg:!max-w-4xl"
      >
        {drillDownData && (() => {
          const filteredDrillCases = drillDownData.cases.filter((c) => {
            if (!drillSearch.trim()) return true;
            const q = drillSearch.toLowerCase();
            return (
              (c.firNumber && c.firNumber.toLowerCase().includes(q)) ||
              (c.policeStation && c.policeStation.toLowerCase().includes(q)) ||
              (c.district && c.district.toLowerCase().includes(q)) ||
              (c.officerName && c.officerName.toLowerCase().includes(q)) ||
              (c.category && c.category.toLowerCase().includes(q)) ||
              (c.status && c.status.toLowerCase().includes(q))
            );
          });
          const totalDuration = drillDownData.cases.reduce((s, c) => s + (c.durationDays || 0), 0);
          const avgDuration = drillDownData.cases.length > 0 ? Math.round(totalDuration / drillDownData.cases.length) : 0;
          const arrestCount = drillDownData.cases.filter((c) => c.arrestCompleted).length;
          const arrestRate = drillDownData.cases.length > 0 ? Math.round((arrestCount / drillDownData.cases.length) * 100) : 0;
          const highSevCount = drillDownData.cases.filter((c) => c.severity === "High").length;

          return (
            <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
              {/* Telemetry Overview Banner */}
              <div className="p-5 bg-background-secondary/30 border border-border-subtle rounded-xl space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-border-subtle/60 pb-3">
                  <span className="font-bold text-text-primary text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    Drill-Down Intelligence Summary
                  </span>
                  <Badge variant="ai" className="px-2.5 py-0.5 text-xs">{drillDownData.cases.length} Total Records</Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-background-card/90 border border-border-subtle/60 rounded-lg shadow-sm">
                    <span className="text-[11px] text-text-secondary uppercase block font-semibold">Inspected Load</span>
                    <span className="text-lg font-bold text-text-primary block mt-1">{drillDownData.cases.length} Dossiers</span>
                  </div>
                  <div className="p-3 bg-background-card/90 border border-border-subtle/60 rounded-lg shadow-sm">
                    <span className="text-[11px] text-text-secondary uppercase block font-semibold">High Severity</span>
                    <span className="text-lg font-bold text-danger block mt-1">{highSevCount} Cases</span>
                  </div>
                  <div className="p-3 bg-background-card/90 border border-border-subtle/60 rounded-lg shadow-sm">
                    <span className="text-[11px] text-text-secondary uppercase block font-semibold">Arrest Index</span>
                    <span className="text-lg font-bold text-success block mt-1">{arrestRate}% Completed</span>
                  </div>
                  <div className="p-3 bg-background-card/90 border border-border-subtle/60 rounded-lg shadow-sm">
                    <span className="text-[11px] text-text-secondary uppercase block font-semibold">Avg Resolution</span>
                    <span className="text-lg font-bold text-cyan-400 block mt-1">{avgDuration} Days</span>
                  </div>
                </div>
              </div>

              {/* Quick Filter Search Bar inside Drawer */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Filter drill-down records by FIR, station, officer, or status..."
                  value={drillSearch}
                  onChange={(e) => {
                    setDrillSearch(e.target.value);
                    setDrillLimit(30);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-background-secondary/30 border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary/70 text-xs focus:outline-none focus:border-accent font-mono shadow-sm transition-colors"
                />
              </div>

              {/* List of cases in drilldown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="font-semibold text-text-primary text-xs">
                    Showing {Math.min(filteredDrillCases.length, drillLimit)} of {filteredDrillCases.length} Dossier Entries
                    {filteredDrillCases.length !== drillDownData.cases.length && ` (Filtered from ${drillDownData.cases.length} Total)`}
                  </span>
                  {drillSearch && (
                    <button
                      onClick={() => {
                        setDrillSearch("");
                        setDrillLimit(30);
                      }}
                      className="text-xs text-cyan-400 hover:underline font-medium"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredDrillCases.slice(0, drillLimit).length > 0 ? (
                    filteredDrillCases.slice(0, drillLimit).map((c) => {
                      const isHigh = c.severity === "High";
                      return (
                        <div
                          key={c.id || c.firNumber}
                          className={`p-4 bg-background-card/95 border border-border-subtle rounded-xl shadow-md hover:border-border-strong transition-all space-y-4 ${
                            isHigh ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-500"
                          }`}
                        >
                          {/* Dossier Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle/60 pb-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-mono font-bold text-base text-cyan-400 tracking-tight">{c.firNumber}</span>
                              <Badge variant={isHigh ? "danger" : "warning"} className="px-2 py-0.5 text-[11px]">
                                {c.severity} Severity
                              </Badge>
                            </div>
                            <span className="text-xs text-text-secondary font-mono">Filed: {c.date || "N/A"}</span>
                          </div>

                          {/* Metadata Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="bg-background-secondary/25 p-3 rounded-lg border border-border-subtle/40">
                              <span className="text-text-secondary text-[10px] uppercase block font-semibold mb-1">Jurisdiction</span>
                              <span className="text-text-primary font-semibold block truncate" title={`${c.district} - ${c.policeStation}`}>
                                {c.district} ({c.policeStation})
                              </span>
                            </div>
                            <div className="bg-background-secondary/25 p-3 rounded-lg border border-border-subtle/40">
                              <span className="text-text-secondary text-[10px] uppercase block font-semibold mb-1">Classification</span>
                              <span className="text-text-primary font-semibold block truncate" title={`${c.category} - ${c.subcategory}`}>
                                {c.category} ({c.subcategory})
                              </span>
                            </div>
                            <div className="bg-background-secondary/25 p-3 rounded-lg border border-border-subtle/40">
                              <span className="text-text-secondary text-[10px] uppercase block font-semibold mb-1">Investigator & Status</span>
                              <div className="flex items-center justify-between mt-0.5 gap-2">
                                <span className="text-text-primary font-semibold truncate" title={c.officerName}>{c.officerName}</span>
                                <Badge variant={c.arrestCompleted ? "success" : "warning"} className="text-[9px] px-2 py-0.5 shrink-0">
                                  {c.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Victim vs Accused Profiles */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-subtle/50 text-xs">
                            <div className="p-3 bg-background-secondary/15 rounded-lg border border-border-subtle/40 flex items-center justify-between">
                              <span className="font-semibold text-text-secondary uppercase text-[10px] tracking-wider">Victim Profile:</span>
                              <span className="font-semibold text-text-primary">
                                {c.victimGender || "Unknown"}, {c.victimAge || 0} Yrs Old
                              </span>
                            </div>
                            <div className="p-3 bg-background-secondary/15 rounded-lg border border-border-subtle/40 flex items-center justify-between">
                              <span className="font-semibold text-text-secondary uppercase text-[10px] tracking-wider">Accused Profile:</span>
                              <span className="font-semibold text-text-primary">
                                {c.accusedGender || "Unknown"}, {c.accusedAge || 0} Yrs Old
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-10 text-center text-text-secondary bg-background-card/50 border border-border-subtle rounded-xl">
                      No dossier records matching your search filter &quot;{drillSearch}&quot;.
                    </div>
                  )}
                  {filteredDrillCases.length > drillLimit && (
                    <div className="pt-4 pb-6 text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setDrillLimit((prev) => prev + 30)}
                        className="px-6 py-2.5 shadow-md flex items-center gap-2 mx-auto text-xs font-semibold"
                      >
                        <span>Load Next 30 Dossiers</span>
                        <Badge variant="secondary" className="text-[10px] bg-black/30 text-white">
                          {filteredDrillCases.length - drillLimit} Remaining
                        </Badge>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
}
