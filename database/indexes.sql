-- ============================================================================
-- Crime Intelligence Platform - Database Performance Indexes
-- Creates indexes on all Foreign Keys and Frequently Searched Columns
-- Database Engine: PostgreSQL
-- ============================================================================

-- ============================================================================
-- 1. FOREIGN KEY INDEXES (Hierarchical & Master Tables)
-- ============================================================================

-- Table: District
CREATE INDEX IF NOT EXISTS idx_district_stateid ON District(StateID);

-- Table: Unit
CREATE INDEX IF NOT EXISTS idx_unit_typeid ON Unit(TypeID);
CREATE INDEX IF NOT EXISTS idx_unit_parentunit ON Unit(ParentUnit);
CREATE INDEX IF NOT EXISTS idx_unit_stateid ON Unit(StateID);
CREATE INDEX IF NOT EXISTS idx_unit_districtid ON Unit(DistrictID);

-- Table: Employee
CREATE INDEX IF NOT EXISTS idx_employee_districtid ON Employee(DistrictID);
CREATE INDEX IF NOT EXISTS idx_employee_unitid ON Employee(UnitID);
CREATE INDEX IF NOT EXISTS idx_employee_rankid ON Employee(RankID);
CREATE INDEX IF NOT EXISTS idx_employee_designationid ON Employee(DesignationID);

-- Table: Court
CREATE INDEX IF NOT EXISTS idx_court_districtid ON Court(DistrictID);
CREATE INDEX IF NOT EXISTS idx_court_stateid ON Court(StateID);

-- Table: CrimeSubHead
CREATE INDEX IF NOT EXISTS idx_crimesubhead_crimeheadid ON CrimeSubHead(CrimeHeadID);

-- Table: Section
CREATE INDEX IF NOT EXISTS idx_section_actcode ON Section(ActCode);

-- Table: CrimeHeadActSection
CREATE INDEX IF NOT EXISTS idx_crimeheadactsection_crimeheadid ON CrimeHeadActSection(CrimeHeadID);
CREATE INDEX IF NOT EXISTS idx_crimeheadactsection_actcode ON CrimeHeadActSection(ActCode);

-- ============================================================================
-- 2. FOREIGN KEY INDEXES & SEARCH INDEXES (CaseMaster - Core FIR Table)
-- ============================================================================

-- Foreign Key Indexes on CaseMaster
CREATE INDEX IF NOT EXISTS idx_casemaster_policepersonid ON CaseMaster(PolicePersonID);
CREATE INDEX IF NOT EXISTS idx_casemaster_policestationid ON CaseMaster(PoliceStationID);
CREATE INDEX IF NOT EXISTS idx_casemaster_casecategoryid ON CaseMaster(CaseCategoryID);
CREATE INDEX IF NOT EXISTS idx_casemaster_gravityoffenceid ON CaseMaster(GravityOffenceID);
CREATE INDEX IF NOT EXISTS idx_casemaster_crimemajorheadid ON CaseMaster(CrimeMajorHeadID);
CREATE INDEX IF NOT EXISTS idx_casemaster_crimeminorheadid ON CaseMaster(CrimeMinorHeadID);
CREATE INDEX IF NOT EXISTS idx_casemaster_casestatusid ON CaseMaster(CaseStatusID);
CREATE INDEX IF NOT EXISTS idx_casemaster_courtid ON CaseMaster(CourtID);

-- Frequently Searched Columns on CaseMaster
CREATE INDEX IF NOT EXISTS idx_casemaster_crimeno ON CaseMaster(CrimeNo);
CREATE INDEX IF NOT EXISTS idx_casemaster_caseno ON CaseMaster(CaseNo);
CREATE INDEX IF NOT EXISTS idx_casemaster_crimeregistereddate ON CaseMaster(CrimeRegisteredDate);
CREATE INDEX IF NOT EXISTS idx_casemaster_status_station ON CaseMaster(CaseStatusID, PoliceStationID);
CREATE INDEX IF NOT EXISTS idx_casemaster_regdate_station ON CaseMaster(CrimeRegisteredDate, PoliceStationID);

-- ============================================================================
-- 3. FOREIGN KEY INDEXES & SEARCH INDEXES (Incident Timing & Location)
-- ============================================================================

-- Table: Inv_OccuranceTime
CREATE INDEX IF NOT EXISTS idx_inv_occurancetime_casemasterid ON Inv_OccuranceTime(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_inv_occurancetime_fromdate ON Inv_OccuranceTime(IncidentFromDate);
CREATE INDEX IF NOT EXISTS idx_inv_occurancetime_lat_lon ON Inv_OccuranceTime(latitude, longitude);

-- ============================================================================
-- 4. FOREIGN KEY INDEXES & SEARCH INDEXES (Persons Involved)
-- ============================================================================

-- Table: ComplainantDetails
CREATE INDEX IF NOT EXISTS idx_complainantdetails_casemasterid ON ComplainantDetails(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_complainantdetails_occupationid ON ComplainantDetails(OccupationID);
CREATE INDEX IF NOT EXISTS idx_complainantdetails_religionid ON ComplainantDetails(ReligionID);
CREATE INDEX IF NOT EXISTS idx_complainantdetails_casteid ON ComplainantDetails(CasteID);
CREATE INDEX IF NOT EXISTS idx_complainantdetails_name ON ComplainantDetails(ComplainantName);

-- Table: Victim
CREATE INDEX IF NOT EXISTS idx_victim_casemasterid ON Victim(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_victim_name ON Victim(VictimName);
CREATE INDEX IF NOT EXISTS idx_victim_age_gender ON Victim(AgeYear, GenderID);

-- Table: Accused
CREATE INDEX IF NOT EXISTS idx_accused_casemasterid ON Accused(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_accused_name ON Accused(AccusedName);
CREATE INDEX IF NOT EXISTS idx_accused_personid ON Accused(PersonID);

-- ============================================================================
-- 5. FOREIGN KEY INDEXES & SEARCH INDEXES (Arrests & Chargesheets)
-- ============================================================================

-- Table: ArrestSurrender
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_casemasterid ON ArrestSurrender(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_stateid ON ArrestSurrender(ArrestSurrenderStateId);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_districtid ON ArrestSurrender(ArrestSurrenderDistrictId);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_policestationid ON ArrestSurrender(PoliceStationID);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_ioid ON ArrestSurrender(IOID);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_courtid ON ArrestSurrender(CourtID);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_accusedmasterid ON ArrestSurrender(AccusedMasterID);
CREATE INDEX IF NOT EXISTS idx_arrestsurrender_date ON ArrestSurrender(ArrestSurrenderDate);

-- Table: inv_arrestsurrenderaccused (Junction Table)
CREATE INDEX IF NOT EXISTS idx_junction_arrestsurrenderid ON inv_arrestsurrenderaccused(ArrestSurrenderID);
CREATE INDEX IF NOT EXISTS idx_junction_accusedmasterid ON inv_arrestsurrenderaccused(AccusedMasterID);

-- Table: ActSectionAssociation
CREATE INDEX IF NOT EXISTS idx_actsection_casemasterid ON ActSectionAssociation(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_actsection_actid ON ActSectionAssociation(ActID);
CREATE INDEX IF NOT EXISTS idx_actsection_sectionid ON ActSectionAssociation(SectionID);
CREATE INDEX IF NOT EXISTS idx_actsection_act_section ON ActSectionAssociation(ActID, SectionID);

-- Table: ChargesheetDetails
CREATE INDEX IF NOT EXISTS idx_chargesheet_casemasterid ON ChargesheetDetails(CaseMasterID);
CREATE INDEX IF NOT EXISTS idx_chargesheet_policepersonid ON ChargesheetDetails(PolicePersonID);
CREATE INDEX IF NOT EXISTS idx_chargesheet_csdate ON ChargesheetDetails(csdate);
CREATE INDEX IF NOT EXISTS idx_chargesheet_cstype ON ChargesheetDetails(cstype);

-- ============================================================================
-- End of Indexing Script
-- ============================================================================
