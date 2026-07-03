from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, AliasChoices


class DashboardSummaryResponse(BaseModel):
    total_cases: int = Field(default=0, validation_alias=AliasChoices("totalcases", "TotalCases", "total_cases"))
    total_victims: int = Field(default=0, validation_alias=AliasChoices("totalvictims", "TotalVictims", "total_victims"))
    total_accused: int = Field(default=0, validation_alias=AliasChoices("totalaccused", "TotalAccused", "total_accused"))
    total_arrests: int = Field(default=0, validation_alias=AliasChoices("totalarrests", "TotalArrests", "total_arrests"))
    total_chargesheeted_cases: int = Field(default=0, validation_alias=AliasChoices("totalchargesheetedcases", "TotalChargesheetedCases", "total_chargesheeted_cases"))
    pending_cases: int = Field(default=0, validation_alias=AliasChoices("pendingcases", "PendingCases", "pending_cases"))
    chargesheet_rate_pct: float = Field(default=0.0, validation_alias=AliasChoices("chargesheetratepct", "ChargesheetRatePct", "chargesheet_rate_pct"))
    arrest_rate_pct: float = Field(default=0.0, validation_alias=AliasChoices("arrestratepct", "ArrestRatePct", "arrest_rate_pct"))

    class Config:
        populate_by_name = True


class DistrictCrimeMetric(BaseModel):
    district_id: int = Field(validation_alias=AliasChoices("districtid", "DistrictID", "district_id"))
    district_name: str = Field(validation_alias=AliasChoices("districtname", "DistrictName", "district_name"))
    total_cases: int = Field(default=0, validation_alias=AliasChoices("totalcases", "TotalCases", "total_cases"))
    heinous_crimes: int = Field(default=0, validation_alias=AliasChoices("heinouscrimes", "HeinousCrimes", "heinous_crimes"))
    crimes_against_women: int = Field(default=0, validation_alias=AliasChoices("crimesagainstwomen", "CrimesAgainstWomen", "crimes_against_women"))
    cyber_crimes: int = Field(default=0, validation_alias=AliasChoices("cybercrimes", "CyberCrimes", "cyber_crimes"))
    chargesheeted_cases: int = Field(default=0, validation_alias=AliasChoices("chargesheetedcases", "ChargesheetedCases", "chargesheeted_cases"))
    under_investigation_cases: int = Field(default=0, validation_alias=AliasChoices("underinvestigationcases", "UnderInvestigationCases", "under_investigation_cases"))
    clearance_rate_pct: float = Field(default=0.0, validation_alias=AliasChoices("clearanceratepct", "ClearanceRatePct", "clearance_rate_pct"))

    class Config:
        populate_by_name = True


class MonthlyCrimeTrend(BaseModel):
    incident_year: int = Field(validation_alias=AliasChoices("crimeyear", "IncidentYear", "incident_year"))
    incident_month: int = Field(validation_alias=AliasChoices("crimemonth", "IncidentMonth", "incident_month"))
    month_name: str = Field(default="", validation_alias=AliasChoices("yearmonthstr", "MonthName", "month_name"))
    total_cases: int = Field(default=0, validation_alias=AliasChoices("totalcasesregistered", "TotalCases", "total_cases"))
    heinous_crimes: int = Field(default=0, validation_alias=AliasChoices("heinouscases", "HeinousCrimes", "heinous_crimes"))
    cyber_crimes: int = Field(default=0, validation_alias=AliasChoices("cybercases", "ChargesheetedCases", "cyber_crimes"))

    class Config:
        populate_by_name = True


class TopCrimeCategory(BaseModel):
    crime_head_id: int = Field(validation_alias=AliasChoices("crimeheadid", "CrimeHeadID", "crime_head_id"))
    crime_head_name: str = Field(validation_alias=AliasChoices("majorcrimehead", "CrimeHeadName", "crime_head_name"))
    minor_crime_head: str = Field(default="", validation_alias=AliasChoices("minorcrimehead", "GravityName", "minor_crime_head"))
    total_cases: int = Field(default=0, validation_alias=AliasChoices("casecount", "TotalCases", "total_cases"))
    pct_of_total_crimes: float = Field(default=0.0, validation_alias=AliasChoices("pctoftotalcrime", "PctOfTotalCrimes", "pct_of_total_crimes"))
    crime_rank: int = Field(default=1, validation_alias=AliasChoices("crimerank", "ChargesheetRatePct", "crime_rank"))

    class Config:
        populate_by_name = True


class OfficerWorkloadMetric(BaseModel):
    employee_id: int = Field(validation_alias=AliasChoices("employeeid", "EmployeeID", "employee_id"))
    kgid: str = Field(validation_alias=AliasChoices("kgid", "KGID"))
    officer_name: str = Field(validation_alias=AliasChoices("officername", "OfficerName", "officer_name"))
    rank_name: str = Field(validation_alias=AliasChoices("rankname", "RankName", "rank_name"))
    unit_name: str = Field(default="", validation_alias=AliasChoices("policestationname", "UnitName", "unit_name"))
    district_name: str = Field(default="", validation_alias=AliasChoices("districtname", "DistrictName", "district_name"))
    assigned_cases: int = Field(default=0, validation_alias=AliasChoices("casesregisteredassho", "AssignedCases", "assigned_cases"))
    pending_investigation: int = Field(default=0, validation_alias=AliasChoices("activependingcases", "PendingInvestigation", "pending_investigation"))
    chargesheeted_cases: int = Field(default=0, validation_alias=AliasChoices("chargesheetsfiled", "ChargesheetedCases", "chargesheeted_cases"))
    arrests_made: int = Field(default=0, validation_alias=AliasChoices("arrestsmadeasio", "ClearanceRatePct", "arrests_made"))

    class Config:
        populate_by_name = True


class CaseRecordResponse(BaseModel):
    id: int = Field(validation_alias=AliasChoices("id", "casemasterid"))
    firNumber: str = Field(validation_alias=AliasChoices("firnumber", "firNumber", "crimeno"))
    date: str = Field(validation_alias=AliasChoices("date", "crimeregistereddate"))
    district: str = Field(default="Unknown District", validation_alias=AliasChoices("district", "districtname"))
    policeStation: str = Field(default="Unknown Station", validation_alias=AliasChoices("policestation", "policeStation", "unitname"))
    category: str = Field(default="General Crime", validation_alias=AliasChoices("category", "crimegroupname"))
    subcategory: str = Field(default="Other", validation_alias=AliasChoices("subcategory", "crimeheadname"))
    status: str = Field(default="Under Investigation", validation_alias=AliasChoices("status", "casestatusname"))
    severity: str = Field(default="Medium", validation_alias=AliasChoices("severity", "lookupvalue"))
    riskLevel: str = Field(default="Medium", validation_alias=AliasChoices("risklevel", "riskLevel"))
    repeatOffender: bool = Field(default=False, validation_alias=AliasChoices("repeatoffender", "repeatOffender"))
    victimAge: int = Field(default=35, validation_alias=AliasChoices("victimage", "victimAge"))
    victimGender: str = Field(default="Male", validation_alias=AliasChoices("victimgender", "victimGender"))
    accusedAge: int = Field(default=28, validation_alias=AliasChoices("accusedage", "accusedAge"))
    accusedGender: str = Field(default="Male", validation_alias=AliasChoices("accusedgender", "accusedGender"))
    officerName: str = Field(default="Unassigned", validation_alias=AliasChoices("officername", "officerName", "firstname"))
    durationDays: int = Field(default=15, validation_alias=AliasChoices("durationdays", "durationDays"))
    arrestCompleted: bool = Field(default=True, validation_alias=AliasChoices("arrestcompleted", "arrestCompleted"))
    hourOfDay: int = Field(default=14, validation_alias=AliasChoices("hourofday", "hourOfDay"))

    class Config:
        populate_by_name = True


class FilterOptionsResponse(BaseModel):
    districts: List[str] = Field(default_factory=list)
    police_stations: Dict[str, List[str]] = Field(default_factory=dict)
    categories: List[str] = Field(default_factory=list)
    subcategories: Dict[str, List[str]] = Field(default_factory=dict)
    statuses: List[str] = Field(default_factory=list)
    officers: List[str] = Field(default_factory=list)

    class Config:
        populate_by_name = True
