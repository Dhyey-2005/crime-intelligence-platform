-- ============================================================================
-- Crime Intelligence Platform - High-Volume Synthetic Seeder
-- Generates realistic Indian dummy data strictly following the ER diagram
-- Data Volumes: 5,000 Cases, 7,500 Victims, 6,000 Accused, 4,000 Arrests, 3,000 CS
-- ============================================================================

-- Idempotent Cleanup of existing data
TRUNCATE TABLE ChargesheetDetails RESTART IDENTITY CASCADE;
TRUNCATE TABLE ActSectionAssociation RESTART IDENTITY CASCADE;
TRUNCATE TABLE inv_arrestsurrenderaccused RESTART IDENTITY CASCADE;
TRUNCATE TABLE ArrestSurrender RESTART IDENTITY CASCADE;
TRUNCATE TABLE Accused RESTART IDENTITY CASCADE;
TRUNCATE TABLE Victim RESTART IDENTITY CASCADE;
TRUNCATE TABLE ComplainantDetails RESTART IDENTITY CASCADE;
TRUNCATE TABLE Inv_OccuranceTime RESTART IDENTITY CASCADE;
TRUNCATE TABLE CaseMaster RESTART IDENTITY CASCADE;
TRUNCATE TABLE CrimeHeadActSection RESTART IDENTITY CASCADE;
TRUNCATE TABLE Section RESTART IDENTITY CASCADE;
TRUNCATE TABLE Act RESTART IDENTITY CASCADE;
TRUNCATE TABLE CasteMaster RESTART IDENTITY CASCADE;
TRUNCATE TABLE ReligionMaster RESTART IDENTITY CASCADE;
TRUNCATE TABLE OccupationMaster RESTART IDENTITY CASCADE;
TRUNCATE TABLE CaseStatusMaster RESTART IDENTITY CASCADE;
TRUNCATE TABLE CrimeSubHead RESTART IDENTITY CASCADE;
TRUNCATE TABLE CrimeHead RESTART IDENTITY CASCADE;
TRUNCATE TABLE GravityOffence RESTART IDENTITY CASCADE;
TRUNCATE TABLE CaseCategory RESTART IDENTITY CASCADE;
TRUNCATE TABLE Court RESTART IDENTITY CASCADE;
TRUNCATE TABLE Employee RESTART IDENTITY CASCADE;
TRUNCATE TABLE Designation RESTART IDENTITY CASCADE;
TRUNCATE TABLE Rank RESTART IDENTITY CASCADE;
TRUNCATE TABLE Unit RESTART IDENTITY CASCADE;
TRUNCATE TABLE UnitType RESTART IDENTITY CASCADE;
TRUNCATE TABLE District RESTART IDENTITY CASCADE;
TRUNCATE TABLE State RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. MASTER TABLES - ADMINISTRATIVE HIERARCHY
-- ============================================================================

-- 3 States
INSERT INTO State (StateID, StateName, NationalityID, Active) VALUES
(1, 'Karnataka', 1, TRUE),
(2, 'Maharashtra', 1, TRUE),
(3, 'Tamil Nadu', 1, TRUE);

-- 25 Districts (Karnataka & neighboring regions)
INSERT INTO District (DistrictID, DistrictName, StateID, Active) VALUES
(1, 'Bengaluru Urban', 1, TRUE), (2, 'Mysuru', 1, TRUE), (3, 'Belagavi', 1, TRUE),
(4, 'Mangaluru (Dakshina Kannada)', 1, TRUE), (5, 'Hubballi-Dharwad', 1, TRUE),
(6, 'Shivamogga', 1, TRUE), (7, 'Ballari', 1, TRUE), (8, 'Kalaburagi', 1, TRUE),
(9, 'Davanagere', 1, TRUE), (10, 'Vijayapura', 1, TRUE), (11, 'Tumakuru', 1, TRUE),
(12, 'Udupi', 1, TRUE), (13, 'Kolar', 1, TRUE), (14, 'Mandya', 1, TRUE),
(15, 'Hassan', 1, TRUE), (16, 'Chikkamagaluru', 1, TRUE), (17, 'Bagalkote', 1, TRUE),
(18, 'Bidar', 1, TRUE), (19, 'Chitradurga', 1, TRUE), (20, 'Gadag', 1, TRUE),
(21, 'Haveri', 1, TRUE), (22, 'Kodagu', 1, TRUE), (23, 'Koppal', 1, TRUE),
(24, 'Raichur', 1, TRUE), (25, 'Ramanagara', 1, TRUE);

-- 10 Unit Types
INSERT INTO UnitType (UnitTypeID, UnitTypeName, CityDistState, Hierarchy) VALUES
(1, 'Police Station', 'City', 5), (2, 'Circle Office', 'District', 4),
(3, 'SP Office', 'District', 3), (4, 'DIG Range', 'State', 2),
(5, 'IG Zone', 'State', 2), (6, 'DGP Headquarters', 'State', 1),
(7, 'Traffic Police Station', 'City', 5), (8, 'Women Police Station', 'District', 5),
(9, 'Cyber Crime Police Station (CEN)', 'District', 5), (10, 'Coastal Security PS', 'District', 5);

-- 100 Police Units (4 per District)
INSERT INTO Unit (UnitID, UnitName, TypeID, ParentUnit, StateID, DistrictID, Active)
SELECT 
    i AS UnitID,
    CASE (i % 4)
        WHEN 0 THEN d.DistrictName || ' Town Police Station'
        WHEN 1 THEN d.DistrictName || ' Rural Police Station'
        WHEN 2 THEN d.DistrictName || ' Cyber Crime (CEN) PS'
        ELSE d.DistrictName || ' Women Police Station'
    END AS UnitName,
    CASE (i % 4) WHEN 0 THEN 1 WHEN 1 THEN 1 WHEN 2 THEN 9 ELSE 8 END AS TypeID,
    NULL AS ParentUnit,
    1 AS StateID,
    ((i - 1) % 25) + 1 AS DistrictID,
    TRUE AS Active
FROM generate_series(1, 100) AS i
JOIN District d ON d.DistrictID = ((i - 1) % 25) + 1;

-- ============================================================================
-- 2. MASTER TABLES - PERSONNEL & HIERARCHY
-- ============================================================================

-- 15 Police Ranks
INSERT INTO Rank (RankID, RankName, Hierarchy) VALUES
(1, 'Director General of Police (DGP)', 1), (2, 'Additional DGP (ADGP)', 2),
(3, 'Inspector General of Police (IGP)', 3), (4, 'Deputy IGP (DIG)', 4),
(5, 'Superintendent of Police (SP)', 5), (6, 'Additional SP', 6),
(7, 'Deputy Superintendent of Police (DySP)', 7), (8, 'Police Inspector (PI)', 8),
(9, 'Sub-Inspector of Police (PSI)', 9), (10, 'Assistant Sub-Inspector (ASI)', 10),
(11, 'Head Constable (HC)', 11), (12, 'Police Constable (PC)', 12),
(13, 'Women Police Constable (WPC)', 12), (14, 'Armed Police Constable (APC)', 12),
(15, 'Traffic Police Constable (TPC)', 12);

-- 20 Designations
INSERT INTO Designation (DesignationID, DesignationName, SortOrder) VALUES
(1, 'Station House Officer (SHO)', 1), (2, 'Investigating Officer (IO)', 2),
(3, 'Duty Officer', 3), (4, 'Station Writer', 4), (5, 'Court Officer', 5),
(6, 'Reader to SP', 6), (7, 'Intelligence Officer', 7), (8, 'Cyber Crime Analyst', 8),
(9, 'Traffic Inspector', 9), (10, 'Law & Order Coordinator', 10),
(11, 'Crime Branch Inspector', 11), (12, 'Special Branch Officer', 12),
(13, 'Technical Support Officer', 13), (14, 'Forensics Liaison', 14),
(15, 'Warrant & Summons Officer', 15), (16, 'Record Room Keeper', 16),
(17, 'Malkhana (Property) Officer', 17), (18, 'Public Relations Officer', 18),
(19, 'Nodal Officer - Women Safety', 19), (20, 'Patrol Commander', 20);

-- 300 Employees (Realistic Indian police personnel)
INSERT INTO Employee (EmployeeID, DistrictID, UnitID, RankID, DesignationID, KGID, FirstName, EmployeeDOB, GenderID, BloodGroupID, PhysicallyChallenged, AppointmentDate)
SELECT
    i AS EmployeeID,
    ((i - 1) % 25) + 1 AS DistrictID,
    ((i - 1) % 100) + 1 AS UnitID,
    ((i - 1) % 15) + 1 AS RankID,
    ((i - 1) % 20) + 1 AS DesignationID,
    'KGID' || lpad(i::text, 4, '0') AS KGID,
    (ARRAY['Rajesh', 'Suresh', 'Ananya', 'Ramesh', 'Pooja', 'Sunil', 'Kavya', 'Vijay', 'Deepika', 'Manjunath', 'Praveen', 'Lakshmi', 'Ganesh', 'Meera', 'Basavaraj', 'Shruthi', 'Santosh', 'Divya', 'Anil', 'Nandini'])[1 + (i % 20)] || ' ' ||
    (ARRAY['Kumar', 'Patil', 'Sharma', 'Gowda', 'Rao', 'Kulkarni', 'Reddy', 'Nair', 'Shetty', 'Deshmukh', 'Bhat', 'Joshi', 'Chauhan', 'Verma', 'Gupta', 'Iyer', 'Menon', 'Hegde', 'Mishra', 'Singh'])[1 + ((i * 3) % 20)] AS FirstName,
    TIMESTAMP '1975-01-01' + ((i * 40)::text || ' days')::interval AS EmployeeDOB,
    1 + (i % 2) AS GenderID,
    1 + (i % 8) AS BloodGroupID,
    FALSE AS PhysicallyChallenged,
    TIMESTAMP '2010-01-01' + ((i * 15)::text || ' days')::interval AS AppointmentDate
FROM generate_series(1, 300) AS i;

-- 50 Courts (2 per District)
INSERT INTO Court (CourtID, CourtName, DistrictID, StateID, Active)
SELECT
    i AS CourtID,
    CASE (i % 2)
        WHEN 0 THEN 'Principal District & Sessions Court, ' || d.DistrictName
        ELSE 'Chief Judicial Magistrate (CJM) Court, ' || d.DistrictName
    END AS CourtName,
    ((i - 1) % 25) + 1 AS DistrictID,
    1 AS StateID,
    TRUE AS Active
FROM generate_series(1, 50) AS i
JOIN District d ON d.DistrictID = ((i - 1) % 25) + 1;

-- ============================================================================
-- 3. MASTER TABLES - CRIME CLASSIFICATION & LEGAL REFERENCE
-- ============================================================================

-- 10 Case Categories
INSERT INTO CaseCategory (CaseCategoryID, LookupValue) VALUES
(1, 'FIR (First Information Report)'), (2, 'UDR (Unnatural Death Report)'),
(3, 'Zero FIR'), (4, 'Petty Case'), (5, 'NCR (Non-Cognizable Report)'),
(6, 'Crime Against Women'), (7, 'Cyber Crime'), (8, 'Economic Offence'),
(9, 'Narcotics & Drugs'), (10, 'Special Local Law (SLL)');

-- 5 Gravity Levels
INSERT INTO GravityOffence (GravityOffenceID, LookupValue) VALUES
(1, 'Heinous Offence'), (2, 'Non-Heinous Offence'), (3, 'Sensational Case'),
(4, 'Special Report Case'), (5, 'Normal Offence');

-- 30 Crime Heads
INSERT INTO CrimeHead (CrimeHeadID, CrimeGroupName, Active) VALUES
(1, 'Murder', TRUE), (2, 'Attempt to Murder', TRUE), (3, 'Dacoity', TRUE),
(4, 'Robbery', TRUE), (5, 'Burglary (Day/Night)', TRUE), (6, 'Theft', TRUE),
(7, 'Rioting & Unlawful Assembly', TRUE), (8, 'Kidnapping & Abduction', TRUE),
(9, 'Cheating & Forgery', TRUE), (10, 'Cyber Crime & IT Act', TRUE),
(11, 'Dowry Harassment & Death', TRUE), (12, 'Grievous Hurt & Assault', TRUE),
(13, 'Extortion & Blackmail', TRUE), (14, 'Arson & Mischief by Fire', TRUE),
(15, 'Rape & Sexual Assault', TRUE), (16, 'Fatal Traffic Accident', TRUE),
(17, 'Non-Fatal Traffic Accident', TRUE), (18, 'NDPS (Narcotics & Drugs)', TRUE),
(19, 'Excise Act Violation', TRUE), (20, 'Arms Act Violation', TRUE),
(21, 'Gambling & Betting Act', TRUE), (22, 'Immoral Traffic (Prevention) Act', TRUE),
(23, 'POCSO Act Offences', TRUE), (24, 'Corruption & Bribery', TRUE),
(25, 'Economic & Financial Frauds', TRUE), (26, 'Counterfeiting Currency', TRUE),
(27, 'Human Trafficking', TRUE), (28, 'Atrocities Against SC/ST', TRUE),
(29, 'Cruelty by Husband or Relatives', TRUE), (30, 'Miscellaneous Offences', TRUE);

-- 80 Crime SubHeads (Mapped to 30 Crime Heads)
INSERT INTO CrimeSubHead (CrimeSubHeadID, CrimeHeadID, CrimeHeadName, SeqID)
SELECT
    i AS CrimeSubHeadID,
    ((i - 1) % 30) + 1 AS CrimeHeadID,
    ch.CrimeGroupName || ' - SubType ' || (((i - 1) / 30) + 1)::text AS CrimeHeadName,
    i AS SeqID
FROM generate_series(1, 80) AS i
JOIN CrimeHead ch ON ch.CrimeHeadID = ((i - 1) % 30) + 1;

-- 15 Case Statuses
INSERT INTO CaseStatusMaster (CaseStatusID, CaseStatusName) VALUES
(1, 'Under Investigation'), (2, 'Charge Sheeted'), (3, 'Un-Detected (A False Case)'),
(4, 'Un-Detected (B True Case)'), (5, 'Closed / Compounded'), (6, 'Stayed by Hon. Court'),
(7, 'Quashed by High Court'), (8, 'Transferred to CBI / CID'), (9, 'Abated due to Death of Accused'),
(10, 'Pending Trial in Court'), (11, 'Convicted by Court'), (12, 'Acquitted by Court'),
(13, 'Dormant / Inactive File'), (14, 'Reopened for Further Investigation'), (15, 'Final Report Submitted');

-- 15 Occupations
INSERT INTO OccupationMaster (OccupationID, OccupationName) VALUES
(1, 'Business / Merchant'), (2, 'Agriculture / Farmer'), (3, 'Government Employee'),
(4, 'Private Sector Professional'), (5, 'Student'), (6, 'Daily Wage Worker'),
(7, 'Medical Doctor'), (8, 'Software Engineer'), (9, 'Advocate / Lawyer'),
(10, 'Taxi / Auto Driver'), (11, 'Homemaker'), (12, 'School / College Teacher'),
(13, 'Retail Trader'), (14, 'Retired Pensioner'), (15, 'Unemployed');

-- 10 Religions
INSERT INTO ReligionMaster (ReligionID, ReligionName) VALUES
(1, 'Hindu'), (2, 'Muslim'), (3, 'Christian'), (4, 'Jain'), (5, 'Sikh'),
(6, 'Buddhist'), (7, 'Parsi'), (8, 'Jewish'), (9, 'Animist / Tribal'), (10, 'Other / Not Specified');

-- 20 Castes
INSERT INTO CasteMaster (caste_master_id, caste_master_name) VALUES
(1, 'General / Unreserved'), (2, 'OBC - Category I'), (3, 'OBC - Category IIA'),
(4, 'OBC - Category IIB'), (5, 'OBC - Category IIIA'), (6, 'OBC - Category IIIB'),
(7, 'Scheduled Caste (SC)'), (8, 'Scheduled Tribe (ST)'), (9, 'Lingayat'),
(10, 'Vokkaliga'), (11, 'Brahmin'), (12, 'Kuruba'), (13, 'Valmiki'),
(14, 'Reddy'), (15, 'Maratha'), (16, 'Billava'), (17, 'Bunts'),
(18, 'Devanga'), (19, 'Nayaka'), (20, 'Ediga');

-- 20 Legal Acts
INSERT INTO Act (ActCode, ActDescription, ShortName, Active) VALUES
('IPC1860', 'Indian Penal Code, 1860', 'IPC', TRUE),
('BNS2023', 'Bharatiya Nyaya Sanhita, 2023', 'BNS', TRUE),
('NDPS1985', 'Narcotic Drugs and Psychotropic Substances Act, 1985', 'NDPS Act', TRUE),
('IT2000', 'Information Technology Act, 2000', 'IT Act', TRUE),
('ARMS1959', 'The Arms Act, 1959', 'Arms Act', TRUE),
('POCSO2012', 'Protection of Children from Sexual Offences Act, 2012', 'POCSO Act', TRUE),
('KPA1963', 'Karnataka Police Act, 1963', 'KP Act', TRUE),
('SCST1989', 'Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989', 'SC/ST Act', TRUE),
('MVA1988', 'Motor Vehicles Act, 1988', 'MV Act', TRUE),
('PCA1988', 'Prevention of Corruption Act, 1988', 'PC Act', TRUE),
('DPA1961', 'Dowry Prohibition Act, 1961', 'DP Act', TRUE),
('ITPA1956', 'Immoral Traffic (Prevention) Act, 1956', 'ITP Act', TRUE),
('KEA1965', 'Karnataka Excise Act, 1965', 'Excise Act', TRUE),
('ESA1908', 'Explosive Substances Act, 1908', 'ES Act', TRUE),
('UAPA1967', 'Unlawful Activities (Prevention) Act, 1967', 'UAPA', TRUE),
('WLA1972', 'Wild Life (Protection) Act, 1972', 'WL Act', TRUE),
('CPA1957', 'The Copyright Act, 1957', 'Copyright Act', TRUE),
('TMA1999', 'The Trade Marks Act, 1999', 'Trade Marks Act', TRUE),
('ECA1955', 'Essential Commodities Act, 1955', 'EC Act', TRUE),
('PWDV2005', 'Protection of Women from Domestic Violence Act, 2005', 'DV Act', TRUE);

-- 200 Legal Sections (10 sections per Act)
INSERT INTO Section (SectionID, ActCode, SectionCode, SectionDescription, Active)
SELECT
    i AS SectionID,
    a.ActCode,
    CASE (i % 10)
        WHEN 0 THEN 'Sec-103 (Punishment for murder/offence)'
        WHEN 1 THEN 'Sec-302 (Murder charges)'
        WHEN 2 THEN 'Sec-307 (Attempt to murder)'
        WHEN 3 THEN 'Sec-379 (Theft penalty)'
        WHEN 4 THEN 'Sec-420 (Cheating and dishonesty)'
        WHEN 5 THEN 'Sec-395 (Punishment for dacoity)'
        WHEN 6 THEN 'Sec-392 (Punishment for robbery)'
        WHEN 7 THEN 'Sec-457 (Lurking house-trespass)'
        WHEN 8 THEN 'Sec-384 (Punishment for extortion)'
        ELSE 'Sec-323 (Voluntarily causing hurt)'
    END || ' [' || i::text || ']',
    'Full official statutory description for section index ' || i::text,
    TRUE AS Active
FROM generate_series(1, 200) AS i
JOIN Act a ON a.ActCode = (
    ARRAY['IPC1860','BNS2023','NDPS1985','IT2000','ARMS1959','POCSO2012','KPA1963','SCST1989','MVA1988','PCA1988','DPA1961','ITPA1956','KEA1965','ESA1908','UAPA1967','WLA1972','CPA1957','TMA1999','ECA1955','PWDV2005']
)[((i - 1) / 10) + 1];

-- 30 CrimeHeadActSection associations
INSERT INTO CrimeHeadActSection (CrimeHeadActSectionID, CrimeHeadID, ActCode, SectionCode)
SELECT
    i AS CrimeHeadActSectionID,
    i AS CrimeHeadID,
    'IPC1860' AS ActCode,
    'Sec-302 (Murder charges) [2]' AS SectionCode
FROM generate_series(1, 30) AS i;

-- ============================================================================
-- 4. TRANSACTIONAL TABLES - CORE CASE MANAGEMENT (HALF VOLUME: 5,000 CASES)
-- ============================================================================

-- 5,000 Cases in CaseMaster
INSERT INTO CaseMaster (CaseMasterID, CrimeNo, CaseNo, CrimeRegisteredDate, PolicePersonID, PoliceStationID, CaseCategoryID, GravityOffenceID, CrimeMajorHeadID, CrimeMinorHeadID, CaseStatusID, CourtID)
SELECT
    i AS CaseMasterID,
    -- Structured CrimeNo: 1-digit Category + 4-digit District + 4-digit PS + 4-digit Year + 5-digit Serial
    ((i % 9) + 1)::text || lpad((((i - 1) % 25) + 1)::text, 4, '0') || lpad((((i - 1) % 100) + 1)::text, 4, '0') || (2020 + (i % 6))::text || lpad(i::text, 5, '0') AS CrimeNo,
    (2020 + (i % 6))::text || lpad(i::text, 5, '0') AS CaseNo,
    TIMESTAMP '2020-01-01 08:30:00' + ((i * 11)::text || ' hours')::interval AS CrimeRegisteredDate,
    ((i - 1) % 300) + 1 AS PolicePersonID,
    ((i - 1) % 100) + 1 AS PoliceStationID,
    ((i - 1) % 10) + 1 AS CaseCategoryID,
    ((i - 1) % 5) + 1 AS GravityOffenceID,
    ((i - 1) % 30) + 1 AS CrimeMajorHeadID,
    ((i - 1) % 80) + 1 AS CrimeMinorHeadID,
    ((i - 1) % 15) + 1 AS CaseStatusID,
    ((i - 1) % 50) + 1 AS CourtID
FROM generate_series(1, 5000) AS i;

-- 5,000 Inv_OccuranceTime records (1-to-1 with CaseMaster)
INSERT INTO Inv_OccuranceTime (InvOccuranceTimeID, CaseMasterID, IncidentFromDate, IncidentToDate, InfoReceivedPSDate, latitude, longitude, BriefFacts)
SELECT
    i AS InvOccuranceTimeID,
    i AS CaseMasterID,
    TIMESTAMP '2020-01-01 06:00:00' + ((i * 11)::text || ' hours')::interval AS IncidentFromDate,
    TIMESTAMP '2020-01-01 07:30:00' + ((i * 11)::text || ' hours')::interval AS IncidentToDate,
    TIMESTAMP '2020-01-01 08:15:00' + ((i * 11)::text || ' hours')::interval AS InfoReceivedPSDate,
    12.9716 + ((i % 1000) * 0.001) AS latitude,
    77.5946 + ((i % 1000) * 0.001) AS longitude,
    'Detailed preliminary brief facts for Case No ' || i::text || '. Incident occurred near location landmark under jurisdiction of reporting police station.' AS BriefFacts
FROM generate_series(1, 5000) AS i;

-- 5,000 Complainants
INSERT INTO ComplainantDetails (ComplainantID, CaseMasterID, ComplainantName, AgeYear, OccupationID, ReligionID, CasteID, GenderID)
SELECT
    i AS ComplainantID,
    i AS CaseMasterID,
    (ARRAY['Vikram', 'Aditya', 'Siddharth', 'Prashanth', 'Kiran', 'Nithin', 'Arjun', 'Rohan', 'Sneha', 'Priya', 'Kavya', 'Anita', 'Sunita', 'Radha', 'Pooja', 'Rahul', 'Amit', 'Sanjay', 'Manoj', 'Naveen'])[1 + (i % 20)] || ' ' ||
    (ARRAY['Sharma', 'Patil', 'Kumar', 'Gowda', 'Rao', 'Kulkarni', 'Reddy', 'Nair', 'Shetty', 'Deshmukh', 'Bhat', 'Joshi', 'Chauhan', 'Verma', 'Gupta', 'Iyer', 'Menon', 'Hegde', 'Mishra', 'Singh'])[1 + ((i * 3) % 20)] AS ComplainantName,
    21 + (i % 55) AS AgeYear,
    ((i - 1) % 15) + 1 AS OccupationID,
    ((i - 1) % 10) + 1 AS ReligionID,
    ((i - 1) % 20) + 1 AS CasteID,
    1 + (i % 2) AS GenderID
FROM generate_series(1, 5000) AS i;

-- 7,500 Victims (1.5 victims per case average)
INSERT INTO Victim (VictimMasterID, CaseMasterID, VictimName, AgeYear, GenderID, VictimPolice)
SELECT
    i AS VictimMasterID,
    ((i - 1) % 5000) + 1 AS CaseMasterID,
    (ARRAY['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Reyansh', 'Arjun', 'Rohan', 'Karthik', 'Rahul', 'Amit', 'Ananya', 'Diya', 'Saanvi', 'Priya', 'Sneha', 'Pooja', 'Deepika', 'Kavya', 'Lakshmi', 'Meera'])[1 + (i % 20)] || ' ' ||
    (ARRAY['Sharma', 'Patil', 'Kumar', 'Singh', 'Rao', 'Gowda', 'Kulkarni', 'Deshmukh', 'Nair', 'Reddy', 'Iyer', 'Menon', 'Joshi', 'Chauhan', 'Verma', 'Gupta', 'Mehta', 'Bhat', 'Shetty', 'Hegde'])[1 + ((i * 7) % 20)] AS VictimName,
    18 + (i % 60) AS AgeYear,
    1 + (i % 3) AS GenderID,
    CASE WHEN (i % 50) = 0 THEN '1' ELSE '0' END AS VictimPolice
FROM generate_series(1, 7500) AS i;

-- 6,000 Accused (1.2 accused per case average)
INSERT INTO Accused (AccusedMasterID, CaseMasterID, AccusedName, AgeYear, GenderID, PersonID)
SELECT
    i AS AccusedMasterID,
    ((i - 1) % 5000) + 1 AS CaseMasterID,
    (ARRAY['Ranga', 'Babu', 'Shankar', 'Ganesh', 'Prakash', 'Mahesh', 'Ravi', 'Kumar', 'Suresh', 'Dinesh', 'Jagadish', 'Venkatesh', 'Ramakrishna', 'Subramanya', 'Nagaraj', 'Santosh', 'Anand', 'Prabhu', 'Lokesh', 'Raghu'])[1 + (i % 20)] || ' ' ||
    (ARRAY['Naidu', 'Gowda', 'Patil', 'Reddy', 'Shetty', 'Rao', 'Kulkarni', 'Deshmukh', 'Bhat', 'Joshi', 'Chauhan', 'Verma', 'Gupta', 'Iyer', 'Menon', 'Hegde', 'Mishra', 'Singh', 'Sharma', 'Kumar'])[1 + ((i * 11) % 20)] AS AccusedName,
    19 + (i % 50) AS AgeYear,
    1 + (i % 2) AS GenderID,
    'A' || (((i - 1) % 5) + 1)::text AS PersonID
FROM generate_series(1, 6000) AS i;

-- 4,000 Arrest Records
INSERT INTO ArrestSurrender (ArrestSurrenderID, CaseMasterID, ArrestSurrenderTypeID, ArrestSurrenderDate, ArrestSurrenderStateId, ArrestSurrenderDistrictId, PoliceStationID, IOID, CourtID, AccusedMasterID, IsAccused, IsComplainantAccused)
SELECT
    i AS ArrestSurrenderID,
    i AS CaseMasterID,
    CASE WHEN (i % 10) = 0 THEN 2 ELSE 1 END AS ArrestSurrenderTypeID,
    TIMESTAMP '2020-01-02 10:00:00' + ((i * 11)::text || ' hours')::interval AS ArrestSurrenderDate,
    1 AS ArrestSurrenderStateId,
    ((i - 1) % 25) + 1 AS ArrestSurrenderDistrictId,
    ((i - 1) % 100) + 1 AS PoliceStationID,
    ((i - 1) % 300) + 1 AS IOID,
    ((i - 1) % 50) + 1 AS CourtID,
    i AS AccusedMasterID,
    TRUE AS IsAccused,
    FALSE AS IsComplainantAccused
FROM generate_series(1, 4000) AS i;

-- 4,000 inv_arrestsurrenderaccused junction links (1-to-1 mapping for simplicity)
INSERT INTO inv_arrestsurrenderaccused (JunctionID, ArrestSurrenderID, AccusedMasterID)
SELECT
    i AS JunctionID,
    i AS ArrestSurrenderID,
    i AS AccusedMasterID
FROM generate_series(1, 4000) AS i;

-- 10,000 ActSectionAssociation records (2 legal sections per case)
INSERT INTO ActSectionAssociation (AssociationID, CaseMasterID, ActID, SectionID, ActOrderID, SectionOrderID)
SELECT
    i AS AssociationID,
    ((i - 1) % 5000) + 1 AS CaseMasterID,
    CASE WHEN (i % 2) = 0 THEN 'IPC1860' ELSE 'BNS2023' END AS ActID,
    ((i - 1) % 200) + 1 AS SectionID,
    1 + (i % 2) AS ActOrderID,
    1 + (i % 2) AS SectionOrderID
FROM generate_series(1, 10000) AS i;

-- 3,000 Chargesheets
INSERT INTO ChargesheetDetails (CSID, CaseMasterID, csdate, cstype, PolicePersonID)
SELECT
    i AS CSID,
    i AS CaseMasterID,
    TIMESTAMP '2020-02-01 11:00:00' + ((i * 11)::text || ' hours')::interval AS csdate,
    CASE (i % 10) WHEN 0 THEN 'B' WHEN 1 THEN 'C' ELSE 'A' END AS cstype,
    ((i - 1) % 300) + 1 AS PolicePersonID
FROM generate_series(1, 3000) AS i;

-- ============================================================================
-- End of Synthetic Data Seeding Script
-- ============================================================================
