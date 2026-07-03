import { AnalyticsCase } from "@/constants/mockAnalyticsData";

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

export const analyticsService = {
  async getSummary(): Promise<DashboardSummaryResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/summary`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching summary:", error);
      return null;
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
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching cases:", error);
      return [];
    }
  },

  async getFilterOptions(): Promise<FilterOptionsResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/analytics/filter-options`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch filter options");
      return await res.json();
    } catch (error) {
      console.warn("FastAPI backend offline or error fetching filter options:", error);
      return null;
    }
  },
};
