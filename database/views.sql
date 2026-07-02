-- ============================================================================
-- Crime Intelligence Platform - Analytical Views
-- Tailored for AI Intelligence Engine & FastAPI Dashboards
-- Database Engine: PostgreSQL
-- ============================================================================

-- Drop views if they exist (Idempotency)
DROP VIEW IF EXISTS vw_officer_workload CASCADE;
DROP VIEW IF EXISTS vw_repeat_offenders CASCADE;
DROP VIEW IF EXISTS vw_pending_cases CASCADE;
DROP VIEW IF EXISTS vw_top_crimes CASCADE;
DROP VIEW IF EXISTS vw_crime_by_month CASCADE;
DROP VIEW IF EXISTS vw_crime_by_district CASCADE;
DROP VIEW IF EXISTS vw_dashboard_summary CASCADE;

-- ============================================================================
-- 1. VIEW: vw_dashboard_summary
-- High-Level KPI Summary for Executive Dashboard
-- ============================================================================
CREATE VIEW vw_dashboard_summary AS
WITH Stats AS (
    SELECT
        (SELECT COUNT(*) FROM CaseMaster) AS TotalCases,
        (SELECT COUNT(*) FROM Victim) AS TotalVictims,
        (SELECT COUNT(*) FROM Accused) AS TotalAccused,
        (SELECT COUNT(*) FROM ArrestSurrender) AS TotalArrests,
        (SELECT COUNT(DISTINCT CaseMasterID) FROM ChargesheetDetails) AS TotalChargesheetedCases,
        (SELECT COUNT(*) FROM CaseMaster WHERE CaseStatusID IN (1, 10, 14)) AS PendingCases
)
SELECT
    TotalCases,
    TotalVictims,
    TotalAccused,
    TotalArrests,
    TotalChargesheetedCases,
    PendingCases,
    ROUND((TotalChargesheetedCases::numeric / NULLIF(TotalCases, 0)) * 100, 2) AS ChargesheetRatePct,
    ROUND((TotalArrests::numeric / NULLIF(TotalAccused, 0)) * 100, 2) AS ArrestRatePct
FROM Stats;

-- ============================================================================
-- 2. VIEW: vw_crime_by_district
-- Aggregated Crime Metrics & Clearance Rates per District
-- ============================================================================
CREATE VIEW vw_crime_by_district AS
SELECT
    d.DistrictID,
    d.DistrictName,
    COUNT(cm.CaseMasterID) AS TotalCases,
    COUNT(CASE WHEN go.LookupValue = 'Heinous Offence' THEN 1 END) AS HeinousCrimes,
    COUNT(CASE WHEN cc.LookupValue = 'Crime Against Women' THEN 1 END) AS CrimesAgainstWomen,
    COUNT(CASE WHEN cc.LookupValue = 'Cyber Crime' THEN 1 END) AS CyberCrimes,
    COUNT(CASE WHEN csm.CaseStatusName = 'Charge Sheeted' THEN 1 END) AS ChargeSheetedCases,
    COUNT(CASE WHEN csm.CaseStatusName = 'Under Investigation' THEN 1 END) AS UnderInvestigationCases,
    ROUND((COUNT(CASE WHEN csm.CaseStatusName = 'Charge Sheeted' THEN 1 END)::numeric / NULLIF(COUNT(cm.CaseMasterID), 0)) * 100, 2) AS ClearanceRatePct
FROM District d
LEFT JOIN Unit u ON u.DistrictID = d.DistrictID
LEFT JOIN CaseMaster cm ON cm.PoliceStationID = u.UnitID
LEFT JOIN GravityOffence go ON go.GravityOffenceID = cm.GravityOffenceID
LEFT JOIN CaseCategory cc ON cc.CaseCategoryID = cm.CaseCategoryID
LEFT JOIN CaseStatusMaster csm ON csm.CaseStatusID = cm.CaseStatusID
GROUP BY d.DistrictID, d.DistrictName
ORDER BY TotalCases DESC;

-- ============================================================================
-- 3. VIEW: vw_crime_by_month
-- Time-Series Trend Analysis of Crime Registration
-- ============================================================================
CREATE VIEW vw_crime_by_month AS
SELECT
    EXTRACT(YEAR FROM CrimeRegisteredDate)::int AS CrimeYear,
    EXTRACT(MONTH FROM CrimeRegisteredDate)::int AS CrimeMonth,
    TO_CHAR(CrimeRegisteredDate, 'YYYY-MM') AS YearMonthStr,
    COUNT(*) AS TotalCasesRegistered,
    COUNT(CASE WHEN go.LookupValue = 'Heinous Offence' THEN 1 END) AS HeinousCases,
    COUNT(CASE WHEN cc.LookupValue = 'Cyber Crime' THEN 1 END) AS CyberCases
FROM CaseMaster cm
JOIN GravityOffence go ON go.GravityOffenceID = cm.GravityOffenceID
JOIN CaseCategory cc ON cc.CaseCategoryID = cm.CaseCategoryID
GROUP BY EXTRACT(YEAR FROM CrimeRegisteredDate), EXTRACT(MONTH FROM CrimeRegisteredDate), TO_CHAR(CrimeRegisteredDate, 'YYYY-MM')
ORDER BY YearMonthStr DESC;

-- ============================================================================
-- 4. VIEW: vw_top_crimes
-- Ranking of Crime Major & Minor Heads by Frequency
-- ============================================================================
CREATE VIEW vw_top_crimes AS
WITH TotalCrimeCount AS (
    SELECT COUNT(*) AS GrandTotal FROM CaseMaster
)
SELECT
    ch.CrimeHeadID,
    ch.CrimeGroupName AS MajorCrimeHead,
    csh.CrimeSubHeadID,
    csh.CrimeHeadName AS MinorCrimeHead,
    COUNT(cm.CaseMasterID) AS CaseCount,
    ROUND((COUNT(cm.CaseMasterID)::numeric / NULLIF((SELECT GrandTotal FROM TotalCrimeCount), 0)) * 100, 2) AS PctOfTotalCrime,
    RANK() OVER (ORDER BY COUNT(cm.CaseMasterID) DESC) AS CrimeRank
FROM CrimeSubHead csh
JOIN CrimeHead ch ON ch.CrimeHeadID = csh.CrimeHeadID
LEFT JOIN CaseMaster cm ON cm.CrimeMinorHeadID = csh.CrimeSubHeadID
GROUP BY ch.CrimeHeadID, ch.CrimeGroupName, csh.CrimeSubHeadID, csh.CrimeHeadName
ORDER BY CaseCount DESC;

-- ============================================================================
-- 5. VIEW: vw_pending_cases
-- Detailed Operational View of Active Cases & Aging
-- ============================================================================
CREATE VIEW vw_pending_cases AS
SELECT
    cm.CaseMasterID,
    cm.CrimeNo,
    cm.CaseNo,
    cm.CrimeRegisteredDate,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - cm.CrimeRegisteredDate)::int AS DaysPending,
    csm.CaseStatusName AS CurrentStatus,
    u.UnitName AS PoliceStationName,
    d.DistrictName,
    e.KGID AS OfficerKGID,
    e.FirstName AS InvestigatingOfficer,
    r.RankName AS OfficerRank,
    ch.CrimeGroupName AS MajorCrimeHead,
    go.LookupValue AS GravityLevel
FROM CaseMaster cm
JOIN CaseStatusMaster csm ON csm.CaseStatusID = cm.CaseStatusID
JOIN Unit u ON u.UnitID = cm.PoliceStationID
JOIN District d ON d.DistrictID = u.DistrictID
JOIN Employee e ON e.EmployeeID = cm.PolicePersonID
JOIN Rank r ON r.RankID = e.RankID
JOIN CrimeHead ch ON ch.CrimeHeadID = cm.CrimeMajorHeadID
JOIN GravityOffence go ON go.GravityOffenceID = cm.GravityOffenceID
WHERE csm.CaseStatusName IN ('Under Investigation', 'Reopened for Further Investigation', 'Pending Trial in Court')
ORDER BY cm.CrimeRegisteredDate ASC;

-- ============================================================================
-- 6. VIEW: vw_repeat_offenders
-- Recidivism & Criminal History Identification
-- ============================================================================
CREATE VIEW vw_repeat_offenders AS
SELECT
    a.AccusedName,
    a.PersonID,
    COUNT(DISTINCT a.CaseMasterID) AS TotalCasesInvolved,
    STRING_AGG(DISTINCT cm.CrimeNo, ', ' ORDER BY cm.CrimeNo) AS AssociatedCrimeNos,
    MIN(cm.CrimeRegisteredDate) AS EarliestOffenceDate,
    MAX(cm.CrimeRegisteredDate) AS LatestOffenceDate,
    COUNT(DISTINCT ar.ArrestSurrenderID) AS TotalArrestEvents
FROM Accused a
JOIN CaseMaster cm ON cm.CaseMasterID = a.CaseMasterID
LEFT JOIN inv_arrestsurrenderaccused j ON j.AccusedMasterID = a.AccusedMasterID
LEFT JOIN ArrestSurrender ar ON ar.ArrestSurrenderID = j.ArrestSurrenderID
GROUP BY a.AccusedName, a.PersonID
HAVING COUNT(DISTINCT a.CaseMasterID) > 1
ORDER BY TotalCasesInvolved DESC, LatestOffenceDate DESC;

-- ============================================================================
-- 7. VIEW: vw_officer_workload
-- Productivity & Case Load Analytics per Police Personnel
-- ============================================================================
CREATE VIEW vw_officer_workload AS
SELECT
    e.EmployeeID,
    e.KGID,
    e.FirstName AS OfficerName,
    r.RankName,
    desig.DesignationName,
    u.UnitName AS PoliceStationName,
    d.DistrictName,
    COUNT(DISTINCT cm_reg.CaseMasterID) AS CasesRegisteredAsSHO,
    COUNT(DISTINCT cm_pend.CaseMasterID) AS ActivePendingCases,
    COUNT(DISTINCT ar.ArrestSurrenderID) AS ArrestsMadeAsIO,
    COUNT(DISTINCT cs.CSID) AS ChargesheetsFiled
FROM Employee e
JOIN Rank r ON r.RankID = e.RankID
JOIN Designation desig ON desig.DesignationID = e.DesignationID
JOIN Unit u ON u.UnitID = e.UnitID
JOIN District d ON d.DistrictID = e.DistrictID
LEFT JOIN CaseMaster cm_reg ON cm_reg.PolicePersonID = e.EmployeeID
LEFT JOIN CaseMaster cm_pend ON cm_pend.PolicePersonID = e.EmployeeID AND cm_pend.CaseStatusID IN (1, 14)
LEFT JOIN ArrestSurrender ar ON ar.IOID = e.EmployeeID
LEFT JOIN ChargesheetDetails cs ON cs.PolicePersonID = e.EmployeeID
GROUP BY e.EmployeeID, e.KGID, e.FirstName, r.RankName, desig.DesignationName, u.UnitName, d.DistrictName
ORDER BY ActivePendingCases DESC, CasesRegisteredAsSHO DESC;

-- ============================================================================
-- End of Views Script
-- ============================================================================
