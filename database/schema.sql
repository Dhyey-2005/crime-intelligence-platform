-- ============================================================================
-- Crime Intelligence Platform - Database Schema
-- Single Source of Truth: Karnataka Police Department FIR System ER Diagram
-- Database Engine: PostgreSQL
-- ============================================================================

-- Drop tables in reverse dependency order if they exist (Idempotency)
DROP TABLE IF EXISTS ChargesheetDetails CASCADE;
DROP TABLE IF EXISTS ActSectionAssociation CASCADE;
DROP TABLE IF EXISTS inv_arrestsurrenderaccused CASCADE;
DROP TABLE IF EXISTS ArrestSurrender CASCADE;
DROP TABLE IF EXISTS Accused CASCADE;
DROP TABLE IF EXISTS Victim CASCADE;
DROP TABLE IF EXISTS ComplainantDetails CASCADE;
DROP TABLE IF EXISTS Inv_OccuranceTime CASCADE;
DROP TABLE IF EXISTS CaseMaster CASCADE;
DROP TABLE IF EXISTS CrimeHeadActSection CASCADE;
DROP TABLE IF EXISTS Section CASCADE;
DROP TABLE IF EXISTS Act CASCADE;
DROP TABLE IF EXISTS CasteMaster CASCADE;
DROP TABLE IF EXISTS ReligionMaster CASCADE;
DROP TABLE IF EXISTS OccupationMaster CASCADE;
DROP TABLE IF EXISTS CaseStatusMaster CASCADE;
DROP TABLE IF EXISTS CrimeSubHead CASCADE;
DROP TABLE IF EXISTS CrimeHead CASCADE;
DROP TABLE IF EXISTS GravityOffence CASCADE;
DROP TABLE IF EXISTS CaseCategory CASCADE;
DROP TABLE IF EXISTS Court CASCADE;
DROP TABLE IF EXISTS Employee CASCADE;
DROP TABLE IF EXISTS Designation CASCADE;
DROP TABLE IF EXISTS Rank CASCADE;
DROP TABLE IF EXISTS Unit CASCADE;
DROP TABLE IF EXISTS UnitType CASCADE;
DROP TABLE IF EXISTS District CASCADE;
DROP TABLE IF EXISTS State CASCADE;

-- ============================================================================
-- 1. MASTER TABLES - ADMINISTRATIVE HIERARCHY
-- ============================================================================

-- Table: State
CREATE TABLE State (
    StateID SERIAL,
    StateName VARCHAR(100) NOT NULL,
    NationalityID INT DEFAULT 1,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_state PRIMARY KEY (StateID),
    CONSTRAINT uq_state_statename UNIQUE (StateName)
);

-- Table: District
CREATE TABLE District (
    DistrictID SERIAL,
    DistrictName VARCHAR(100) NOT NULL,
    StateID INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_district PRIMARY KEY (DistrictID),
    CONSTRAINT fk_district_state FOREIGN KEY (StateID) REFERENCES State(StateID) ON DELETE RESTRICT
);

-- Table: UnitType
CREATE TABLE UnitType (
    UnitTypeID SERIAL,
    UnitTypeName VARCHAR(100) NOT NULL,
    CityDistState VARCHAR(20),
    Hierarchy INT DEFAULT 1,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_unittype PRIMARY KEY (UnitTypeID)
);

-- Table: Unit (Police Stations, Offices, etc.)
CREATE TABLE Unit (
    UnitID SERIAL,
    UnitName VARCHAR(150) NOT NULL,
    TypeID INT NOT NULL,
    ParentUnit INT,
    NationalityID INT DEFAULT 1,
    StateID INT NOT NULL,
    DistrictID INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_unit PRIMARY KEY (UnitID),
    CONSTRAINT fk_unit_unittype FOREIGN KEY (TypeID) REFERENCES UnitType(UnitTypeID) ON DELETE RESTRICT,
    CONSTRAINT fk_unit_parentunit FOREIGN KEY (ParentUnit) REFERENCES Unit(UnitID) ON DELETE RESTRICT,
    CONSTRAINT fk_unit_state FOREIGN KEY (StateID) REFERENCES State(StateID) ON DELETE RESTRICT,
    CONSTRAINT fk_unit_district FOREIGN KEY (DistrictID) REFERENCES District(DistrictID) ON DELETE RESTRICT
);

-- ============================================================================
-- 2. MASTER TABLES - PERSONNEL & HIERARCHY
-- ============================================================================

-- Table: Rank
CREATE TABLE Rank (
    RankID SERIAL,
    RankName VARCHAR(100) NOT NULL,
    Hierarchy INT NOT NULL DEFAULT 1,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_rank PRIMARY KEY (RankID),
    CONSTRAINT uq_rank_rankname UNIQUE (RankName)
);

-- Table: Designation
CREATE TABLE Designation (
    DesignationID SERIAL,
    DesignationName VARCHAR(100) NOT NULL,
    SortOrder INT DEFAULT 1,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_designation PRIMARY KEY (DesignationID),
    CONSTRAINT uq_designation_designationname UNIQUE (DesignationName)
);

-- Table: Employee
CREATE TABLE Employee (
    EmployeeID SERIAL,
    DistrictID INT NOT NULL,
    UnitID INT NOT NULL,
    RankID INT NOT NULL,
    DesignationID INT NOT NULL,
    KGID VARCHAR(50) NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    EmployeeDOB TIMESTAMP,
    GenderID INT DEFAULT 1,
    BloodGroupID INT DEFAULT 1,
    PhysicallyChallenged BOOLEAN NOT NULL DEFAULT FALSE,
    AppointmentDate TIMESTAMP,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_employee PRIMARY KEY (EmployeeID),
    CONSTRAINT uq_employee_kgid UNIQUE (KGID),
    CONSTRAINT fk_employee_district FOREIGN KEY (DistrictID) REFERENCES District(DistrictID) ON DELETE RESTRICT,
    CONSTRAINT fk_employee_unit FOREIGN KEY (UnitID) REFERENCES Unit(UnitID) ON DELETE RESTRICT,
    CONSTRAINT fk_employee_rank FOREIGN KEY (RankID) REFERENCES Rank(RankID) ON DELETE RESTRICT,
    CONSTRAINT fk_employee_designation FOREIGN KEY (DesignationID) REFERENCES Designation(DesignationID) ON DELETE RESTRICT
);

-- Table: Court
CREATE TABLE Court (
    CourtID SERIAL,
    CourtName VARCHAR(150) NOT NULL,
    DistrictID INT NOT NULL,
    StateID INT NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_court PRIMARY KEY (CourtID),
    CONSTRAINT fk_court_district FOREIGN KEY (DistrictID) REFERENCES District(DistrictID) ON DELETE RESTRICT,
    CONSTRAINT fk_court_state FOREIGN KEY (StateID) REFERENCES State(StateID) ON DELETE RESTRICT
);

-- ============================================================================
-- 3. MASTER TABLES - CRIME CLASSIFICATION & LEGAL REFERENCE
-- ============================================================================

-- Table: CaseCategory
CREATE TABLE CaseCategory (
    CaseCategoryID SERIAL,
    LookupValue VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_casecategory PRIMARY KEY (CaseCategoryID),
    CONSTRAINT uq_casecategory_lookupvalue UNIQUE (LookupValue)
);

-- Table: GravityOffence
CREATE TABLE GravityOffence (
    GravityOffenceID SERIAL,
    LookupValue VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_gravityoffence PRIMARY KEY (GravityOffenceID),
    CONSTRAINT uq_gravityoffence_lookupvalue UNIQUE (LookupValue)
);

-- Table: CrimeHead
CREATE TABLE CrimeHead (
    CrimeHeadID SERIAL,
    CrimeGroupName VARCHAR(150) NOT NULL,
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_crimehead PRIMARY KEY (CrimeHeadID),
    CONSTRAINT uq_crimehead_crimegroupname UNIQUE (CrimeGroupName)
);

-- Table: CrimeSubHead
CREATE TABLE CrimeSubHead (
    CrimeSubHeadID SERIAL,
    CrimeHeadID INT NOT NULL,
    CrimeHeadName VARCHAR(150) NOT NULL,
    SeqID INT DEFAULT 1,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_crimesubhead PRIMARY KEY (CrimeSubHeadID),
    CONSTRAINT fk_crimesubhead_crimehead FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID) ON DELETE RESTRICT
);

-- Table: CaseStatusMaster
CREATE TABLE CaseStatusMaster (
    CaseStatusID SERIAL,
    CaseStatusName VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_casestatusmaster PRIMARY KEY (CaseStatusID),
    CONSTRAINT uq_casestatusmaster_casestatusname UNIQUE (CaseStatusName)
);

-- Table: OccupationMaster
CREATE TABLE OccupationMaster (
    OccupationID SERIAL,
    OccupationName VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_occupationmaster PRIMARY KEY (OccupationID),
    CONSTRAINT uq_occupationmaster_occupationname UNIQUE (OccupationName)
);

-- Table: ReligionMaster
CREATE TABLE ReligionMaster (
    ReligionID SERIAL,
    ReligionName VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_religionmaster PRIMARY KEY (ReligionID),
    CONSTRAINT uq_religionmaster_religionname UNIQUE (ReligionName)
);

-- Table: CasteMaster
CREATE TABLE CasteMaster (
    caste_master_id SERIAL,
    caste_master_name VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_castemaster PRIMARY KEY (caste_master_id),
    CONSTRAINT uq_castemaster_castename UNIQUE (caste_master_name)
);

-- Table: Act
CREATE TABLE Act (
    ActCode VARCHAR(20),
    ActDescription VARCHAR(255) NOT NULL,
    ShortName VARCHAR(100),
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_act PRIMARY KEY (ActCode)
);

-- Table: Section
CREATE TABLE Section (
    SectionID SERIAL,
    ActCode VARCHAR(20) NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    SectionDescription VARCHAR(500),
    Active BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_section PRIMARY KEY (SectionID),
    CONSTRAINT uq_section_act_section UNIQUE (ActCode, SectionCode),
    CONSTRAINT fk_section_act FOREIGN KEY (ActCode) REFERENCES Act(ActCode) ON DELETE RESTRICT
);

-- Table: CrimeHeadActSection
CREATE TABLE CrimeHeadActSection (
    CrimeHeadActSectionID SERIAL,
    CrimeHeadID INT NOT NULL,
    ActCode VARCHAR(20) NOT NULL,
    SectionCode VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_crimeheadactsection PRIMARY KEY (CrimeHeadActSectionID),
    CONSTRAINT fk_crimeheadactsection_crimehead FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID) ON DELETE RESTRICT,
    CONSTRAINT fk_crimeheadactsection_act FOREIGN KEY (ActCode) REFERENCES Act(ActCode) ON DELETE RESTRICT
);

-- ============================================================================
-- 4. TRANSACTIONAL TABLES - CORE CASE MANAGEMENT
-- ============================================================================

-- Table: CaseMaster (Core FIR table)
CREATE TABLE CaseMaster (
    CaseMasterID SERIAL,
    CrimeNo VARCHAR(50) NOT NULL,
    CaseNo VARCHAR(50) NOT NULL,
    CrimeRegisteredDate TIMESTAMP NOT NULL,
    PolicePersonID INT NOT NULL,
    PoliceStationID INT NOT NULL,
    CaseCategoryID INT NOT NULL,
    GravityOffenceID INT NOT NULL,
    CrimeMajorHeadID INT NOT NULL,
    CrimeMinorHeadID INT NOT NULL,
    CaseStatusID INT NOT NULL,
    CourtID INT,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_casemaster PRIMARY KEY (CaseMasterID),
    CONSTRAINT uq_casemaster_crimeno UNIQUE (CrimeNo),
    CONSTRAINT fk_casemaster_policeperson FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_policestation FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_casecategory FOREIGN KEY (CaseCategoryID) REFERENCES CaseCategory(CaseCategoryID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_gravityoffence FOREIGN KEY (GravityOffenceID) REFERENCES GravityOffence(GravityOffenceID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_crimemajorhead FOREIGN KEY (CrimeMajorHeadID) REFERENCES CrimeHead(CrimeHeadID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_crimeminorhead FOREIGN KEY (CrimeMinorHeadID) REFERENCES CrimeSubHead(CrimeSubHeadID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_casestatus FOREIGN KEY (CaseStatusID) REFERENCES CaseStatusMaster(CaseStatusID) ON DELETE RESTRICT,
    CONSTRAINT fk_casemaster_court FOREIGN KEY (CourtID) REFERENCES Court(CourtID) ON DELETE SET NULL
);

-- Table: Inv_OccuranceTime (1-to-1 extension of CaseMaster for incident timing & location)
CREATE TABLE Inv_OccuranceTime (
    InvOccuranceTimeID SERIAL,
    CaseMasterID INT NOT NULL,
    IncidentFromDate TIMESTAMP NOT NULL,
    IncidentToDate TIMESTAMP,
    InfoReceivedPSDate TIMESTAMP NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    BriefFacts TEXT,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_inv_occurancetime PRIMARY KEY (InvOccuranceTimeID),
    CONSTRAINT uq_inv_occurancetime_casemaster UNIQUE (CaseMasterID),
    CONSTRAINT fk_inv_occurancetime_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE
);

-- Table: ComplainantDetails
CREATE TABLE ComplainantDetails (
    ComplainantID SERIAL,
    CaseMasterID INT NOT NULL,
    ComplainantName VARCHAR(150) NOT NULL,
    AgeYear INT CHECK (AgeYear >= 0 AND AgeYear <= 120),
    OccupationID INT,
    ReligionID INT,
    CasteID INT,
    GenderID INT DEFAULT 1,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_complainantdetails PRIMARY KEY (ComplainantID),
    CONSTRAINT fk_complainantdetails_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE,
    CONSTRAINT fk_complainantdetails_occupation FOREIGN KEY (OccupationID) REFERENCES OccupationMaster(OccupationID) ON DELETE SET NULL,
    CONSTRAINT fk_complainantdetails_religion FOREIGN KEY (ReligionID) REFERENCES ReligionMaster(ReligionID) ON DELETE SET NULL,
    CONSTRAINT fk_complainantdetails_caste FOREIGN KEY (CasteID) REFERENCES CasteMaster(caste_master_id) ON DELETE SET NULL
);

-- Table: Victim
CREATE TABLE Victim (
    VictimMasterID SERIAL,
    CaseMasterID INT NOT NULL,
    VictimName VARCHAR(150) NOT NULL,
    AgeYear INT CHECK (AgeYear >= 0 AND AgeYear <= 120),
    GenderID INT DEFAULT 1,
    VictimPolice VARCHAR(5) DEFAULT '0',
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_victim PRIMARY KEY (VictimMasterID),
    CONSTRAINT fk_victim_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE
);

-- Table: Accused
CREATE TABLE Accused (
    AccusedMasterID SERIAL,
    CaseMasterID INT NOT NULL,
    AccusedName VARCHAR(150) NOT NULL,
    AgeYear INT CHECK (AgeYear >= 0 AND AgeYear <= 120),
    GenderID INT DEFAULT 1,
    PersonID VARCHAR(20),
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_accused PRIMARY KEY (AccusedMasterID),
    CONSTRAINT fk_accused_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE
);

-- Table: ArrestSurrender
CREATE TABLE ArrestSurrender (
    ArrestSurrenderID SERIAL,
    CaseMasterID INT NOT NULL,
    ArrestSurrenderTypeID INT NOT NULL DEFAULT 1,
    ArrestSurrenderDate TIMESTAMP NOT NULL,
    ArrestSurrenderStateId INT NOT NULL,
    ArrestSurrenderDistrictId INT NOT NULL,
    PoliceStationID INT NOT NULL,
    IOID INT NOT NULL,
    CourtID INT,
    AccusedMasterID INT,
    IsAccused BOOLEAN NOT NULL DEFAULT TRUE,
    IsComplainantAccused BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_arrestsurrender PRIMARY KEY (ArrestSurrenderID),
    CONSTRAINT fk_arrestsurrender_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE,
    CONSTRAINT fk_arrestsurrender_state FOREIGN KEY (ArrestSurrenderStateId) REFERENCES State(StateID) ON DELETE RESTRICT,
    CONSTRAINT fk_arrestsurrender_district FOREIGN KEY (ArrestSurrenderDistrictId) REFERENCES District(DistrictID) ON DELETE RESTRICT,
    CONSTRAINT fk_arrestsurrender_policestation FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID) ON DELETE RESTRICT,
    CONSTRAINT fk_arrestsurrender_io FOREIGN KEY (IOID) REFERENCES Employee(EmployeeID) ON DELETE RESTRICT,
    CONSTRAINT fk_arrestsurrender_court FOREIGN KEY (CourtID) REFERENCES Court(CourtID) ON DELETE SET NULL,
    CONSTRAINT fk_arrestsurrender_accused FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID) ON DELETE SET NULL
);

-- Table: inv_arrestsurrenderaccused (Junction table linking ArrestSurrender and Accused)
CREATE TABLE inv_arrestsurrenderaccused (
    JunctionID SERIAL,
    ArrestSurrenderID INT NOT NULL,
    AccusedMasterID INT NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_inv_arrestsurrenderaccused PRIMARY KEY (JunctionID),
    CONSTRAINT uq_inv_arrestsurrenderaccused UNIQUE (ArrestSurrenderID, AccusedMasterID),
    CONSTRAINT fk_junction_arrestsurrender FOREIGN KEY (ArrestSurrenderID) REFERENCES ArrestSurrender(ArrestSurrenderID) ON DELETE CASCADE,
    CONSTRAINT fk_junction_accused FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID) ON DELETE CASCADE
);

-- Table: ActSectionAssociation
CREATE TABLE ActSectionAssociation (
    AssociationID SERIAL,
    CaseMasterID INT NOT NULL,
    ActID VARCHAR(20) NOT NULL,
    SectionID INT NOT NULL,
    ActOrderID INT DEFAULT 1,
    SectionOrderID INT DEFAULT 1,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_actsectionassociation PRIMARY KEY (AssociationID),
    CONSTRAINT fk_actsection_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE,
    CONSTRAINT fk_actsection_act FOREIGN KEY (ActID) REFERENCES Act(ActCode) ON DELETE RESTRICT,
    CONSTRAINT fk_actsection_section FOREIGN KEY (SectionID) REFERENCES Section(SectionID) ON DELETE RESTRICT
);

-- Table: ChargesheetDetails
CREATE TABLE ChargesheetDetails (
    CSID SERIAL,
    CaseMasterID INT NOT NULL,
    csdate TIMESTAMP NOT NULL,
    cstype CHAR(1) NOT NULL CHECK (cstype IN ('A', 'B', 'C')),
    PolicePersonID INT NOT NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_chargesheetdetails PRIMARY KEY (CSID),
    CONSTRAINT fk_chargesheet_casemaster FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID) ON DELETE CASCADE,
    CONSTRAINT fk_chargesheet_policeperson FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID) ON DELETE RESTRICT
);

-- ============================================================================
-- End of Schema Definition
-- ============================================================================
