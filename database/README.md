# Crime Intelligence Platform - Database Foundation

A production-grade PostgreSQL database architecture designed as the high-performance foundation for a FastAPI backend and an AI-powered Crime Intelligence Platform. Built strictly according to the **Karnataka Police Department FIR System ER Diagram**, this schema models administrative police hierarchies, personnel assignments, legal statutes, and transactional case management with 100% referential integrity.

---

## 🏛️ Database Architecture & Design Philosophy

The database design adheres strictly to the ER Diagram specification while applying modern PostgreSQL best practices:

- **Strict Type Enforcement**: Mapped SQL Server `BIT` to standard `BOOLEAN` and `DATETIME`/`DATE` to precision `TIMESTAMP`.
- **Idempotency**: All DDL and seeding scripts utilize `DROP ... IF EXISTS CASCADE`, `CREATE ... IF NOT EXISTS`, and `TRUNCATE ... RESTART IDENTITY CASCADE` to allow safe re-execution during CI/CD pipelines and local resets.
- **Audit Preparedness**: Standardized `CreatedAt` and `UpdatedAt` timestamp columns across all administrative and transactional tables.
- **High-Speed Synthetic Seeding**: Uses PostgreSQL mathematical modeling (`generate_series()`, array indexing, and modulo hashing) to seed thousands of realistic records in seconds without bloating repository file sizes.
- **Optimized Analytical Queries**: Complete B-Tree indexing on all foreign keys and frequently filtered columns (`CrimeNo`, `CaseNo`, dates, locations, personnel), complemented by 7 specialized executive and operational SQL views.

---

## 🔗 Entity Relationship Structure

The 28 tables in the schema are organized into four dependency layers to ensure clean foreign key resolution during instantiation:

### 1. Administrative Hierarchy (Layer 1)
- **`State`**: Represents states (`StateID` PK).
- **`District`**: Districts linked to states via `StateID` FK.
- **`UnitType`**: Categories of police establishments (Police Station, Circle Office, SP Office).
- **`Unit`**: Police stations and administrative offices linked to `UnitType`, `State`, and `District` with self-referencing `ParentUnit` hierarchy.

### 2. Personnel & Judicial Structure (Layer 2)
- **`Rank`**: Police hierarchy ranks (DGP down to Police Constable) with authority levels.
- **`Designation`**: Operational roles (SHO, Investigating Officer, Duty Officer).
- **`Employee`**: Police personnel records linked to `District`, `Unit`, `Rank`, and `Designation`, uniquely identified by Karnataka Government ID (`KGID`).
- **`Court`**: Judicial courts linked to `District` and `State`.

### 3. Crime Classification & Legal Reference (Layer 3)
- **`CaseCategory`**: FIR types (FIR, UDR, Zero FIR, Petty Case).
- **`GravityOffence`**: Gravity classification (Heinous, Non-Heinous, Sensational).
- **`CrimeHead` & `CrimeSubHead`**: Hierarchical major and minor crime classifications.
- **`CaseStatusMaster`**: Lifecycle statuses (Under Investigation, Charge Sheeted, Closed).
- **`OccupationMaster`, `ReligionMaster`, `CasteMaster`**: Demographics lookup tables for complainants and persons involved.
- **`Act` & `Section`**: Statutory statutes (IPC, BNS, NDPS, IT Act) and specific legal sections.
- **`CrimeHeadActSection`**: Junction mapping crime heads to default statutory acts and sections.

### 4. Core Case Management & Transactions (Layer 4)
- **`CaseMaster`**: The central FIR registry linking reporting officers, police stations, crime classifications, statuses, and trial courts.
- **`Inv_OccuranceTime`**: 1-to-1 extension of `CaseMaster` capturing precise incident start/end timestamps, information receipt times, and GPS coordinates (`latitude`, `longitude`).
- **`ComplainantDetails`**: Complainant demographic records linked to FIRs.
- **`Victim` & `Accused`**: Victims and accused persons linked to cases.
- **`ArrestSurrender`**: Arrest and surrender events linking accused persons to investigating officers (`IOID`), police stations, and production courts.
- **`inv_arrestsurrenderaccused`**: Many-to-many junction table resolving multiple accused persons per arrest event.
- **`ActSectionAssociation`**: Junction linking FIRs (`CaseMasterID`) to invoked legal acts and sections.
- **`ChargesheetDetails`**: Final investigation reports submitted to courts by police officers.

---

## 📁 Folder Structure

```text
database/
├── schema.sql           # Authoritative DDL creating all 28 tables with constraints
├── seed.sql             # High-volume seeder (5,000 cases, 7,500 victims, 6,000 accused)
├── indexes.sql          # Performance indexing script for FKs and search columns
├── views.sql            # 7 analytical SQL views for AI intelligence & dashboards
└── README.md            # Architecture and execution documentation
```

---

## 🚀 Execution Order & Setup Instructions

To build and populate the database cleanly without foreign key dependency errors, execute the scripts strictly in the following sequence:

### Step 1: Schema Definition
Creates all master and transactional tables with primary keys, foreign keys, and unique constraints in dependency order.
```bash
psql -U postgres -d ksp_db -f database/schema.sql
```

### Step 2: Synthetic Data Seeding
Populates master lookup tables, 300 police personnel, 5,000 cases, 7,500 victims, 6,000 accused, 4,000 arrest records, and 3,000 chargesheets.
```bash
psql -U postgres -d ksp_db -f database/seed.sql
```

### Step 3: Performance Indexing
Creates indexes on all 35+ foreign keys and high-frequency filter columns (`CrimeNo`, dates, officer IDs).
```bash
psql -U postgres -d ksp_db -f database/indexes.sql
```

### Step 4: Analytical Views
Instantiates 7 operational and executive views (`vw_dashboard_summary`, `vw_officer_workload`, `vw_repeat_offenders`, etc.).
```bash
psql -U postgres -d ksp_db -f database/views.sql
```

---

## 📊 Analytical Views Summary

| View Name | Primary Purpose | Key Metrics / Columns |
| :--- | :--- | :--- |
| **`vw_dashboard_summary`** | Executive KPI summary | Total cases, victims, accused, arrest rate %, chargesheet rate % |
| **`vw_crime_by_district`** | Geographic crime distribution | District case counts, heinous crimes, women safety, clearance rate % |
| **`vw_crime_by_month`** | Time-series trend analysis | Monthly registration trends, cyber crime growth, year-over-year comparison |
| **`vw_top_crimes`** | Crime frequency ranking | Major/minor crime heads ranked by percentage of total crime |
| **`vw_pending_cases`** | Operational investigation tracking | Active cases, aging (days pending), assigned SHO/IO details |
| **`vw_repeat_offenders`** | Recidivism & intelligence tracking | Accused involved in >1 FIR, linked crime numbers, arrest history |
| **`vw_officer_workload`** | Personnel productivity metrics | Cases registered as SHO, active pending cases, arrests as IO, chargesheets |

---

## 🐍 FastAPI & SQLAlchemy Integration

When connecting this PostgreSQL database to your FastAPI backend using SQLAlchemy or SQLModel, use the following URL format with URL-encoded credentials:

```python
from urllib.parse import quote_plus
from sqlalchemy import create_engine

DB_USER = "postgres"
DB_PASSWORD = quote_plus("your_password_here")
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "ksp_db"

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_size=20, max_overflow=10)
```
