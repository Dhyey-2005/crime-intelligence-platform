from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from models.analytics import (
    DashboardSummaryResponse,
    DistrictCrimeMetric,
    MonthlyCrimeTrend,
    TopCrimeCategory,
    OfficerWorkloadMetric,
    CaseRecordResponse,
    FilterOptionsResponse,
)
from services.analytics_service import CrimeAnalyticsService

router = APIRouter(prefix="/api/v1/analytics", tags=["Crime Analytics & GIS Intelligence"])


@router.get("/summary", response_model=DashboardSummaryResponse, summary="Executive Dashboard KPI Summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Retrieve executive high-level KPI metrics (total cases, victims, accused, arrest and chargesheet clearance rates)
    from PostgreSQL view `vw_dashboard_summary`.
    """
    return CrimeAnalyticsService.get_dashboard_summary(db)


@router.get("/districts", response_model=List[DistrictCrimeMetric], summary="Crime Metrics by Police District")
def get_district_metrics(db: Session = Depends(get_db)):
    """
    Retrieve crime volume breakdown (Heinous vs Non-Heinous vs Sensational) and resolution rates
    across all police districts from PostgreSQL view `vw_crime_by_district`.
    """
    return CrimeAnalyticsService.get_district_metrics(db)


@router.get("/monthly-trends", response_model=List[MonthlyCrimeTrend], summary="Monthly Crime Volume Trends")
def get_monthly_trends(
    year: int = Query(2026, description="Target year for crime trend analysis"),
    db: Session = Depends(get_db)
):
    """
    Retrieve month-over-month crime volume and chargesheet filing trends from PostgreSQL view `vw_crime_by_month`.
    """
    return CrimeAnalyticsService.get_monthly_trends(db, year=year)


@router.get("/top-crimes", response_model=List[TopCrimeCategory], summary="Top Crime Classifications")
def get_top_crimes(
    limit: int = Query(10, ge=1, le=50, description="Number of top crime categories to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve the most frequent crime classification heads and their resolution statistics
    from PostgreSQL view `vw_top_crimes`.
    """
    return CrimeAnalyticsService.get_top_crimes(db, limit=limit)


@router.get("/officer-workload", response_model=List[OfficerWorkloadMetric], summary="Investigating Officer Workload & Clearance Rates")
def get_officer_workload(
    limit: int = Query(15, ge=1, le=100, description="Number of officers to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve investigating officer case assignment load, pending investigations, and clearance percentage
    from PostgreSQL view `vw_officer_workload`.
    """
    return CrimeAnalyticsService.get_officer_workload(db, limit=limit)


@router.get("/cases", response_model=List[CaseRecordResponse], summary="Detailed FIR Case Logs")
def get_cases(
    limit: int = Query(3000, ge=1, le=5000, description="Number of case records to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve individual FIR case records joined across district, police station, crime head, and investigating officer.
    """
    return CrimeAnalyticsService.get_cases(db, limit=limit)


@router.get("/filter-options", response_model=FilterOptionsResponse, summary="Available Database Filter Options")
def get_filter_options(db: Session = Depends(get_db)):
    """
    Retrieve distinct lists of districts, stations, categories, subcategories, statuses, and officers directly from the database.
    """
    return CrimeAnalyticsService.get_filter_options(db)

