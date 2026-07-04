import { AnalyticsCase, mockAnalyticsCases } from "@/constants/mockAnalyticsData";

export interface DashboardSummaryResponse {
  total_cases: number;
  total_victims: number;
  total_accused: number;
  total_arrests: number;
  total_chargesheeted_cases: number;
  pending_cases: number;
  chargesheet_rate_pct: number;
  arrest_rate_pct: number;
}

export interface DistrictCrimeMetric {
  district_id: number;
  district_name: string;
  total_cases: number;
  heinous_crimes: number;
  crimes_against_women: number;
  cyber_crimes: number;
  chargesheeted_cases: number;
  under_investigation_cases: number;
  clearance_rate_pct: number;
}

export interface MonthlyCrimeTrend {
  incident_year: number;
  incident_month: number;
  month_name: string;
  total_cases: number;
  heinous_crimes: number;
  cyber_crimes: number;
}

export interface TopCrimeCategory {
  crime_head_id: number;
  crime_head_name: string;
  minor_crime_head: string;
  total_cases: number;
  pct_of_total_crimes: number;
  crime_rank: number;
}

export interface OfficerWorkloadMetric {
  employee_id: number;
  kgid: string;
  officer_name: string;
  rank_name: string;
  unit_name: string;
  district_name: string;
  assigned_cases: number;
  pending_investigation: number;
  chargesheeted_cases: number;
  arrests_made: number;
}

export interface FilterOptionsResponse {
  districts: string[];
  police_stations: Record<string, string[]>;
  categories: string[];
  subcategories: Record<string, string[]>;
  statuses: string[];
  officers: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CASES_CACHE_KEY = "ksp_live_cases_cache_v1";
const SUMMARY_CACHE_KEY = "ksp_live_summary_cache_v1";
const FILTER_CACHE_KEY = "ksp_live_filter_cache_v1";

export const analyticsService = {
  // Deterministic defaults for SSR / initial hydration (prevents Next.js Hydration failed errors)
  getInitialCases(): AnalyticsCase[] {
    return mockAnalyticsCases;
  },

  getInitialSummary(): DashboardSummaryResponse | null {
    return null;
  },

  getInitialFilterOptions(): FilterOptionsResponse | null {
    return null;
  },

  // Synchronous client-side cache readers to load real metrics immediately after hydration
  getCachedCases(): AnalyticsCase[] | null {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CASES_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Error reading live cases from localStorage:", e);
      }
    }
    return null;
  },

  getCachedSummary(): DashboardSummaryResponse | null {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(SUMMARY_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed.total_cases === "number") {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Error reading live summary from localStorage:", e);
      }
    }
    return null;
  },

  getCachedFilterOptions(): FilterOptionsResponse | null {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(FILTER_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && Array.isArray(parsed.districts)) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Error reading filter options from localStorage:", e);
      }
    }
    return null;
  },

  async getSummary(): Promise<DashboardSummaryResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/summary`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      if (typeof window !== "undefined" && data && typeof data.total_cases === "number") {
        try {
          localStorage.setItem(SUMMARY_CACHE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
      return data;
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching summary:", error);
      return analyticsService.getInitialSummary();
    }
  },

  async getDistricts(): Promise<DistrictCrimeMetric[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/districts`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch district metrics");
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching districts:", error);
      return [];
    }
  },

  async getMonthlyTrends(year = 2026): Promise<MonthlyCrimeTrend[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/monthly-trends?year=${year}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch monthly trends");
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching monthly trends:", error);
      return [];
    }
  },

  async getTopCrimes(limit = 10): Promise<TopCrimeCategory[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/top-crimes?limit=${limit}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch top crimes");
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching top crimes:", error);
      return [];
    }
  },

  async getOfficerWorkload(limit = 15): Promise<OfficerWorkloadMetric[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/officer-workload?limit=${limit}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch officer workload");
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching officer workload:", error);
      return [];
    }
  },

  async getCases(limit = 5000): Promise<AnalyticsCase[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/cases?limit=${limit}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch cases");
      const data = await res.json();
      if (typeof window !== "undefined" && Array.isArray(data) && data.length > 0) {
        try {
          localStorage.setItem(CASES_CACHE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
      return data;
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching cases:", error);
      return analyticsService.getInitialCases();
    }
  },

  async getFilterOptions(): Promise<FilterOptionsResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/filter-options`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch filter options");
      const data = await res.json();
      if (typeof window !== "undefined" && data && Array.isArray(data.districts)) {
        try {
          localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
      return data;
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching filter options:", error);
      return analyticsService.getInitialFilterOptions();
    }
  },
};
