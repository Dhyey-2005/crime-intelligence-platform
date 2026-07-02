# AI-Driven Crime Intelligence & Investigation Platform
## Frontend Implementation Guide

**Document Version:** 1.0.0

**Status:** Active

**Implementation Type:** Frontend Only

---

# 1. Purpose

This document serves as the single source of truth for the frontend implementation of the AI-Driven Crime Intelligence & Investigation Platform.

The purpose of this document is to define a structured, phase-based implementation workflow that the Agentic IDE must follow throughout frontend development.

Every implementation decision, file creation, modification, and UI component must follow the rules and implementation order defined in this document.

The Agentic IDE must strictly follow this document and must not skip, merge, reorder, or automatically continue phases unless explicitly instructed by the user.

---

# 2. Project Overview

The project aims to build a modern AI-powered Crime Intelligence Command Center for law enforcement agencies.

The platform transforms traditional crime records into an interactive intelligence platform capable of providing:

- Executive crime dashboards
- Interactive geospatial crime visualization
- Criminal relationship intelligence
- Officer analytics
- Investigation monitoring
- AI-generated insights
- Predictive crime intelligence
- Natural language crime assistant

The frontend should resemble an enterprise-grade government intelligence platform instead of a conventional admin dashboard.

The overall user experience must prioritize:

- Professional appearance
- High usability
- Clear information hierarchy
- Excellent responsiveness
- Modern interaction design
- Maintainable component architecture

---

# 3. Scope

## Included

This document covers only frontend implementation.

This includes:

- Project initialization
- Frontend architecture
- Folder organization
- Theme implementation
- Design system
- Shared UI components
- Layout
- Navigation
- Dashboard pages
- Analytics pages
- Interactive maps
- Criminal network visualization
- AI interface
- Reports interface
- Responsive design
- Frontend testing
- Frontend optimization

---

## Explicitly Excluded

The following are NOT part of this implementation guide.

The Agentic IDE must ignore these areas completely.

- Backend development
- Database implementation
- PostgreSQL schema
- FastAPI
- Authentication APIs
- AI model development
- Machine Learning
- NLP implementation
- API integration
- Deployment
- DevOps
- Docker
- Zoho Catalyst deployment
- Performance benchmarking of backend
- Security implementation beyond frontend best practices

If any backend-related task becomes necessary, the Agentic IDE must stop and wait for user approval instead of implementing it.

---

# 4. Primary Objective

The objective is to develop a production-quality frontend that satisfies all of the following requirements.

- Enterprise-grade appearance
- Modern UI/UX
- Clean architecture
- Fully responsive
- Component driven
- Easily maintainable
- Beginner-friendly codebase
- High readability
- Reusable UI components
- Scalable folder structure
- Future-ready for backend integration

The frontend must always prioritize maintainability over unnecessary complexity.

Readable and modular code is preferred over clever or overly optimized code.

# 5. Global Development Rules

The following rules are mandatory throughout the entire frontend implementation.

The Agentic IDE must strictly follow every rule defined below.

These rules take precedence over implementation convenience.

---

## 5.1 Existing Project Preservation

The current project already contains an existing folder structure.

The Agentic IDE must treat the existing project as the source of truth.

The Agentic IDE must NOT:

- Rename existing folders.
- Rename existing files.
- Delete existing files.
- Move existing files to different directories.
- Replace working implementations with newly generated code.
- Perform unnecessary refactoring.
- Reorganize the project structure.
- Modify working code purely for stylistic improvements.

Existing working code should only be modified when absolutely necessary.

If an existing implementation already satisfies the current phase requirements, it must be reused instead of rewritten.

Any modification affecting existing functionality should remain as small and isolated as possible.

---

## 5.2 Folder Structure Compliance

The project folder structure has already been created.

The Agentic IDE must strictly follow the existing project structure.

New folders or files may only be created when:

- They are genuinely required.
- No appropriate existing location is available.
- The addition improves project organization.

The Agentic IDE must not create duplicate folders serving the same purpose.

If uncertainty exists regarding placement of a new file, the Agentic IDE must prefer the existing architecture rather than introducing new top-level directories.

---

## 5.3 Incremental Development

Frontend implementation must be performed incrementally.

Only the current implementation phase should be worked on.

The Agentic IDE must never implement future phases automatically.

Upon completion of a phase:

- Stop implementation.
- Verify exit criteria.
- Provide a concise completion summary.
- Wait for explicit user approval.

Implementation must never continue automatically.

---

## 5.4 Repository & Git Management

The project repository is already tracked using Git.

The Agentic IDE must preserve a clean repository throughout development.

Before creating or generating files, verify that the repository ignores generated artifacts appropriately.

The Agentic IDE must ensure that development-generated files are excluded from version control.

Examples include, but are not limited to:

- node_modules/
- .next/
- dist/
- build/
- out/
- coverage/
- .turbo/
- .cache/
- *.log
- .env
- .env.*
- .DS_Store
- Thumbs.db
- IDE-specific files
- Temporary files
- Package manager caches
- Generated runtime artifacts

Sensitive information must never be committed.

Examples include:

- API Keys
- Access Tokens
- Authentication Secrets
- Environment Variables
- Local Databases
- Private Credentials

The Agentic IDE must never expose or commit sensitive information.

If additional generated directories appear during development, update the existing .gitignore only when necessary.

Existing .gitignore rules must never be removed without explicit user approval.

---

## 5.5 Git Safety Rules

The Agentic IDE must never:

- Commit changes automatically.
- Push changes automatically.
- Rewrite Git history.
- Perform force pushes.
- Delete Git branches.
- Execute destructive Git commands.

Git operations remain under user control.

The Agentic IDE may only suggest Git actions.

Execution requires explicit user approval.

---

## 5.6 Code Quality Standards

All frontend code must prioritize:

- Readability
- Simplicity
- Maintainability
- Reusability
- Scalability

Readable code is preferred over clever code.

Components should remain focused on a single responsibility.

Avoid unnecessary abstraction.

Avoid deeply nested logic.

Prefer descriptive naming conventions.

Avoid duplicated implementations whenever possible.

---

## 5.7 Beginner-Friendly Code

The codebase should remain understandable for developers with basic React knowledge.

Implementation should favor:

- Small reusable components
- Clear folder organization
- Simple component composition
- Descriptive naming
- Straightforward logic

Avoid introducing advanced patterns unless they provide significant long-term value.

The project should remain easy to maintain after the hackathon.

---

## 5.8 Frontend-Only Responsibility

The Agentic IDE must remain strictly within frontend boundaries.

Backend implementation is outside the scope of this document.

If frontend implementation requires unavailable backend functionality:

- Create reusable mock data.
- Create mock service layers.
- Simulate API responses.
- Clearly isolate future backend integration points.

Backend implementation must not begin automatically.

---

## 5.9 Phase Approval Policy

Completion of a phase does not authorize continuation.

The Agentic IDE must always:

1. Verify exit criteria.
2. Summarize completed work.
3. Report any pending issues.
4. Wait for user approval.

Only after approval may the next phase begin.

This rule applies throughout the entire implementation lifecycle.

---

## 5.10 Browser Execution Policy

The Agentic IDE must NOT automatically launch or open any browser during implementation.

This includes, but is not limited to:

- Opening localhost automatically
- Opening preview windows
- Opening browser tabs
- Launching Chrome, Edge, Firefox or any browser
- Automatically running frontend preview commands solely for visual verification

Browser launches consume unnecessary AI resources and interrupt the implementation workflow.

Frontend verification should rely on:

- Build validation
- Linting
- Type checking
- Compilation success
- Existing project diagnostics

A browser may only be opened when explicitly requested by the user.

If browser verification is required, ask for user approval before launching any preview.

---

## 5.11 Progress Reporting Policy

After completing every sub-step within every implementation phase, the Agentic IDE must print the following concise progress report.

Format:

What was done:
<One simple sentence describing the completed work.>

Status:
Completed Successfully / Completed with Warnings / Failed

Immediate Next Step:
<One simple sentence describing the next sub-step.>

The progress report must remain concise.

Avoid lengthy explanations.

Avoid repeating previous summaries.

This progress report is mandatory after every sub-step throughout the implementation lifecycle.

Example:

What was done:
Verified existing folder structure.

Status:
Completed Successfully

Immediate Next Step:
Validate frontend dependencies.

---

# 6. Implementation Contract

The following implementation contract is mandatory for the entire frontend development lifecycle.

These rules apply to every phase defined in this document.

If any implementation decision conflicts with these rules, these rules take precedence.

---

## 6.1 Requirement Compliance

The Agentic IDE must strictly implement only the requirements defined for the current phase.

Do not assume future requirements.

Do not implement additional functionality beyond the approved scope.

If uncertainty exists, stop implementation and request clarification.

---

## 6.2 Phase Isolation

Each implementation phase is completely isolated.

The Agentic IDE must never:

- Begin future phases early.
- Merge multiple phases together.
- Skip implementation steps.
- Skip validation.
- Skip approval gates.

Only the currently approved phase may be implemented.

---

## 6.3 Existing Code Protection

Existing working code is considered stable.

The Agentic IDE must preserve it.

Existing files should only be modified when:

- Required by the current phase.
- Required for compatibility.
- Required to fix implementation conflicts.

Working code must never be rewritten solely for stylistic improvements.

---

## 6.4 Minimum Necessary Changes

Every implementation should modify the smallest possible number of files.

Prefer extending existing components over replacing them.

Avoid large-scale modifications.

Avoid unnecessary refactoring.

---

## 6.5 Component Reuse Policy

Before creating a new component, verify whether an existing component already satisfies the requirement.

Prefer:

Reuse

↓

Extension

↓

New Component

Creating duplicate UI components is prohibited.

---

## 6.6 Single Responsibility Principle

Every component should perform one responsibility.

Avoid components that attempt to solve multiple unrelated problems.

Smaller reusable components are preferred.

---

## 6.7 Consistent Design System

Every newly created UI element must follow the approved design system.

Hardcoded values should be avoided.

Use centralized:

- Colors
- Typography
- Shadows
- Radius
- Spacing
- Animation

Visual consistency is mandatory.

---

## 6.8 Responsiveness

Every UI component must remain usable on:

- Desktop
- Laptop
- Tablet
- Mobile

Responsiveness must be considered during implementation.

It must never become a post-development task.

---

## 6.9 Accessibility

The frontend must follow basic accessibility best practices.

Verify:

- Semantic HTML
- Keyboard navigation
- Focus visibility
- Proper labels
- Readable contrast

Accessibility should be built incrementally.

---

## 6.10 Performance

Avoid unnecessary rendering.

Avoid unnecessary state.

Avoid deeply nested components.

Prefer lightweight implementations.

Performance should remain a consideration throughout development.

---

## 6.11 Code Readability

The project is intended to remain understandable by developers with basic React knowledge.

Implementation should prioritize:

- Simple logic
- Descriptive naming
- Small functions
- Modular architecture

Readability is preferred over clever implementation.

---

## 6.12 Mock Data Policy

Until backend integration begins:

- Use reusable mock data.
- Use reusable mock service functions.
- Keep backend interfaces isolated.

Business logic should remain independent from mock implementations.

---

## 6.13 Reporting

After every completed phase the Agentic IDE must provide:

- Files created
- Files modified
- Summary of work completed
- Validation results
- Remaining work
- Known limitations

Keep reports concise.

---

## 6.14 Failure Handling

If an implementation issue occurs:

- Stop immediately.
- Explain the issue.
- Explain why it occurred.
- Suggest possible solutions.
- Wait for user approval.

Never silently ignore errors.

Never fabricate successful implementation.

---

## 6.15 Completion Policy

A phase must never be reported as complete unless:

- Every implementation step has been completed.
- Every validation checklist item passes.
- Every exit criterion is satisfied.
- No known blocking issues remain.

If any requirement remains incomplete, clearly report the phase as incomplete.

---

## 6.16 Approval Policy

Completion does not imply approval.

After every phase the Agentic IDE must stop.

Implementation of the next phase may only begin after explicit user approval.

Automatic continuation is prohibited.

---

## 6.17 Professional Development Standard

The resulting frontend should resemble production-quality enterprise software.

Implementation decisions should always prioritize:

- Maintainability
- Scalability
- Readability
- Reusability
- User Experience
- Long-term project sustainability

Hackathon deadlines must never justify poor software architecture.
---
# 7. Quality Assurance Gates (QAG)

Every implementation phase defined in this document must successfully pass all Quality Assurance Gates before it can be considered complete.

Passing an Exit Criteria alone is not sufficient.

The Agentic IDE must validate every Quality Assurance Gate at the end of each phase.

If any gate fails, the phase must remain in an **Incomplete** state until the issue has been resolved.

---

# QAG-1 — Build Integrity

The project must remain buildable throughout the implementation.

Validation includes:

- Project compiles successfully.
- No TypeScript errors.
- No build failures.
- No runtime crashes caused by the implemented changes.
- Existing functionality continues working.

If the project fails to build, the phase automatically fails.

---

# QAG-2 — Architecture Integrity

The project architecture must remain consistent.

Validate:

- Existing folder structure preserved.
- Existing architecture respected.
- No duplicate folders created.
- No unnecessary restructuring performed.
- Existing reusable architecture maintained.

The implementation must integrate into the current architecture instead of replacing it.

---

# QAG-3 — Code Quality

Every implementation must satisfy the following quality standards.

Verify:

- No duplicated logic.
- No duplicated components.
- Meaningful variable names.
- Small reusable functions.
- Small reusable components.
- Clear file organization.
- Readable implementation.
- Consistent naming conventions.

Avoid unnecessary complexity.

---

# QAG-4 — Design Consistency

The implemented UI must follow the approved design system.

Verify:

- Typography is consistent.
- Colors use centralized tokens.
- Spacing is consistent.
- Shadows follow the design system.
- Border radius follows the design system.
- Icons remain consistent.

No hardcoded visual styles should appear unless absolutely necessary.

---

# QAG-5 — Responsiveness

Every implemented interface must remain usable across supported devices.

Validate:

- Desktop
- Laptop
- Tablet
- Mobile

Verify:

- No horizontal scrolling.
- Navigation remains usable.
- Components resize correctly.
- Layout adapts appropriately.

---

# QAG-6 — Accessibility

Basic accessibility standards must be maintained.

Verify:

- Semantic HTML.
- Keyboard navigation.
- Focus indicators.
- Accessible labels.
- Appropriate color contrast.

Accessibility should never be postponed.

---

# QAG-7 — Repository Integrity

The repository must remain clean after every phase.

Verify:

- Generated artifacts ignored.
- node_modules not tracked.
- Build output ignored.
- Cache directories ignored.
- Environment files ignored.
- No sensitive files staged.

The Agentic IDE must never commit generated files.

---

# QAG-8 — Existing Code Protection

Existing stable functionality must remain unaffected.

Verify:

- Existing pages still function.
- Existing components still compile.
- Existing layouts remain operational.
- Existing routes continue working.

No regressions should be introduced.

---

# QAG-9 — Scope Compliance

The implementation must remain within the approved scope.

Verify:

- No future phase implementation.
- No backend implementation.
- No AI implementation.
- No deployment work.
- No unrelated improvements.

Only the approved phase should be completed.

---

# QAG-10 — Documentation

Before requesting approval, provide a concise implementation report containing:

- Files created.
- Files modified.
- Components created.
- Dependencies added.
- Known limitations.
- Remaining work.

Keep the report concise.

---

# Phase Completion Rule

A phase may only be marked as **Completed** when:

- Every implementation step has been completed.
- Every Validation Checklist item passes.
- Every Exit Criterion is satisfied.
- Every Quality Assurance Gate passes.
- No blocking issues remain.

If any requirement above is not satisfied, the phase must remain **Incomplete**.

---

# User Approval Rule

After successfully passing all Quality Assurance Gates, the Agentic IDE must:

1. Stop implementation.
2. Present the implementation report.
3. Present the Quality Assurance report.
4. Wait for explicit user approval.

The next phase may only begin after approval has been received.
---

# Phase 0 — Frontend Foundation

## Objective

Establish a stable, scalable, and production-ready frontend foundation before implementing any application features.

This phase is responsible only for preparing the project architecture.

No business logic, dashboard pages, analytics, AI components, maps, or application-specific features should be implemented during this phase.

The objective is to create a clean foundation that every subsequent phase can build upon without requiring architectural changes.

---

# Prerequisites

Before beginning this phase, verify that:

- The project repository already exists.
- Git tracking is already configured.
- The existing folder structure is available.
- The current project builds successfully.
- Existing code compiles without errors.
- The user has approved Phase 0 implementation.

If any prerequisite is not satisfied, stop and request user approval before proceeding.

---

# Implementation Strategy

The Agentic IDE must complete this phase in the exact order specified below.

Do not skip steps.

Do not merge steps.

Complete and validate each step before moving to the next.

---

## Step 0.1 — Project Inspection

Inspect the existing frontend project.

Identify:

- Framework version
- Package manager
- Existing folder structure
- Existing UI libraries
- Existing styling approach
- Existing reusable components
- Existing layouts
- Existing routing structure

The purpose of this step is understanding the current project.

No implementation should occur.

---

## Step 0.2 — Architecture Validation

Validate that the existing architecture supports future implementation.

Verify:

- Folder organization
- Component organization
- Asset organization
- Public assets
- Styling location
- Utility location
- Service location
- Type definitions
- Constants
- Hooks

If improvements are required, make only minimal additions.

Do not restructure the project.

---

## Step 0.3 — Dependency Validation

Inspect required frontend dependencies.

Examples include:

- Tailwind CSS
- TypeScript
- shadcn/ui
- Lucide React
- Framer Motion
- Zustand
- Axios
- TanStack Query
- TanStack Table
- React Leaflet
- Apache ECharts
- Cytoscape.js
- Sonner

Install only missing dependencies.

Do not reinstall already configured packages.

Avoid duplicate packages providing identical functionality.

---

## Step 0.4 — Repository Validation

Inspect repository configuration.

Verify:

- .gitignore
- package.json
- tsconfig
- eslint
- prettier (if available)

Ensure generated directories remain ignored.

Do not modify repository settings unnecessarily.

---

## Step 0.5 — Design Foundation Preparation

Prepare the frontend for a unified design system.

Verify locations for:

- Theme
- Global styles
- Colors
- Typography
- Shared spacing
- Border radius
- Shadows
- Icons

Do not begin implementing the design system yet.

Only prepare the project for the next phase.

---

## Step 0.6 — Documentation

Provide a concise summary including:

- Existing architecture
- Dependencies installed
- Dependencies reused
- Files created
- Files modified
- Repository status
- Any assumptions made

Keep this summary brief.

---

# Deliverables

By the end of Phase 0 the project should contain:

- Verified project architecture
- Verified folder structure
- Verified dependency setup
- Clean repository configuration
- Ready-to-use frontend foundation

No application features should exist yet.

---

# Validation Checklist

Before completing this phase verify:

- Existing project still builds successfully.
- No existing functionality is broken.
- No unnecessary files were created.
- Existing folder structure remains intact.
- Required frontend libraries are available.
- Repository remains clean.
- Generated files remain ignored by Git.

Every item above must pass before Phase 0 can be considered complete.

---

# Exit Criteria

Phase 0 is complete only when:

- Project architecture has been validated.
- Existing project structure has been preserved.
- Required dependencies are available.
- Repository configuration is verified.
- Frontend foundation is ready.
- No business features have been implemented.

---

# Out of Scope for phase 0

The following must NOT be implemented during this phase:

- Dashboard
- Sidebar
- Navbar
- Theme implementation
- UI Components
- Charts
- Maps
- AI Assistant
- Analytics
- Network Graph
- Reports
- Authentication
- Backend Integration
- API Calls
- Mock Data

If any implementation reaches these areas, stop immediately.

---

# AI Credit Optimization

To minimize unnecessary AI usage:

- Inspect only files relevant to the current step.
- Avoid scanning the entire project repeatedly.
- Reuse existing implementations whenever possible.
- Avoid regenerating existing configuration files.
- Modify only files that require changes.
- Keep explanations concise.
- Summarize completed work in fewer than 5 bullet points.
- Do not proceed to Phase 1 automatically.

---

# Approval Gate

After completing Phase 0:

1. Verify every validation checklist item.
2. Verify every exit criterion.
3. Provide a concise implementation summary.
4. Report any issues encountered.
5. Wait for explicit user approval.

The Agentic IDE must not begin Phase 1 until approval is received.

# Phase 1 — Design System

## Objective

Establish a unified design system that will be reused throughout the entire frontend.

This phase defines the visual identity of the application.

Every page, component, layout, chart, table, modal, form, and visualization implemented in later phases must follow the design system established here.

This phase should not implement application pages.

It should only establish reusable visual foundations.

---

# Design Philosophy

The frontend should resemble an enterprise Crime Intelligence Command Center.

The design language should communicate:

- Security
- Intelligence
- Professionalism
- Modern Government Software
- High Information Density
- Clear Data Hierarchy

Avoid designs that resemble:

- Bootstrap dashboards
- Student projects
- Generic admin templates
- Colorful SaaS products

The interface should instead resemble professional intelligence software.

---

# Visual Theme

Theme

Dark Mode Only

Primary Style

Modern Intelligence Command Center

Design Inspiration

- Government Intelligence Platforms
- Cyber Security Operation Centers
- Mission Control Dashboards
- Enterprise Analytics Platforms

---

# Color System

Implement a centralized color system.

Do not hardcode colors inside components.

Colors must be reusable through the design system.

Primary Background

#0B1220

Secondary Background

#111827

Card Background

#1F2937

Primary Accent

#2563EB

Success

#10B981

Warning

#F59E0B

Danger

#EF4444

AI Intelligence

#8B5CF6

Analytics

#06B6D4

Primary Text

#F9FAFB

Secondary Text

#9CA3AF

Borders

Subtle.

Low contrast.

Professional.

---

# Typography

Use one font family consistently.

Recommended

Inter

Create typography rules for:

- Page Title
- Section Title
- Card Title
- Body
- Caption
- Labels
- Table Headers

Typography must remain consistent throughout the application.

---

# Spacing System

Create reusable spacing values.

Avoid arbitrary spacing.

Use a consistent spacing scale.

Margins

Padding

Gap

Section spacing

Card spacing

Container spacing

All future components must reuse these values.

---

# Border Radius

Create reusable radius tokens.

Recommended

Small

Medium

Large

Extra Large

Avoid inconsistent border radius values.

---

# Shadow System

Create reusable shadows.

Examples

Small

Medium

Large

Interactive

Hover

Avoid manually creating shadows inside components.

---

# Icon System

Use a single icon library.

Recommended

Lucide React

Icons should remain visually consistent throughout the application.

---

# Motion Guidelines

Animations should be minimal.

Use:

- Fade
- Slide
- Hover
- Smooth transitions

Avoid:

- Excessive motion
- Flashy effects
- Rotations
- Bounce animations

Animations should enhance usability rather than attract attention.

---

# Design Tokens

Create reusable tokens for:

- Colors
- Typography
- Radius
- Shadows
- Spacing
- Animation Duration
- Transition Curves

Future components should consume these tokens instead of defining values independently.

---

# Files Expected

Examples include:

- Theme configuration
- Global styles
- Design tokens
- Typography configuration

Reuse existing files whenever possible.

Avoid creating duplicate configuration files.

---

# Deliverables

At the completion of this phase the project should contain:

- Centralized color palette
- Typography system
- Spacing system
- Radius system
- Shadow system
- Motion guidelines
- Global styling foundation

No application pages should be implemented.

---

# Validation Checklist

Verify:

- Colors are centralized.
- Typography is centralized.
- Spacing is reusable.
- Shadows are reusable.
- Radius values are reusable.
- Global styles compile successfully.
- Existing project still builds correctly.

---

# Exit Criteria

Phase 1 is complete only when:

- Design tokens exist.
- Global styling is configured.
- No component contains duplicated visual constants.
- The design language is ready for reuse.

---

# Out of Scope

Do NOT implement:

- Sidebar
- Navbar
- Dashboard
- Login
- Landing Page
- Charts
- Tables
- AI Components
- Reports
- Maps

This phase creates the visual foundation only.

---

# AI Credit Optimization

Before ending this phase:

- Modify only styling-related files.
- Avoid generating components.
- Reuse existing configuration wherever possible.
- Keep summaries concise.
- Do not inspect unrelated folders.
- Wait for user approval.

---

# Approval Gate

After completion:

- Verify exit criteria.
- Summarize modified files.
- Summarize created files.
- Confirm project builds successfully.
- Wait for user approval before beginning Phase 2.

# Phase 2 — Application Shell (Layout & Navigation)

## Objective

Build the application's reusable shell that will serve as the foundation for every page in the system.

The application shell establishes the navigation experience, page layout, routing structure, and overall application framework.

This phase must not implement any business-specific content.

Only the application's reusable structure should be created.

---

# Design Goal

The application should immediately feel like a professional Crime Intelligence Command Center.

The user should experience:

- Clear navigation
- Consistent page structure
- Fast accessibility
- Modern enterprise layout
- High usability
- Responsive behaviour

The layout should remain identical across all future pages.

---

# Implementation Order

The following steps must be completed sequentially.

Do not skip any step.

---

## Step 2.1 — Routing Validation

Inspect the existing routing structure.

Verify:

- App Router structure
- Route groups (if used)
- Layout hierarchy
- Global layout
- Error pages
- Loading pages

Reuse the existing routing architecture whenever possible.

Do not restructure routing unnecessarily.

---

## Step 2.2 — Root Application Layout

Implement the reusable application shell.

The shell should define:

- Sidebar container
- Top navigation container
- Main content container
- Responsive content area

This layout should become the parent for all authenticated pages.

---

## Step 2.3 — Sidebar Navigation

Create a reusable sidebar.

Navigation items:

- Dashboard
- Crime Analytics
- Crime Map
- Criminal Network
- Investigation
- Officer Analytics
- AI Intelligence
- Reports
- Settings

Sidebar Requirements

- Collapsible
- Active route highlighting
- Icon support
- Smooth transition
- Keyboard accessible
- Responsive

Desktop

Persistent sidebar.

Tablet

Collapsible sidebar.

Mobile

Drawer navigation.

---

## Step 2.4 — Top Navigation Bar

Create a reusable top navigation.

Include:

- Application title
- Global search placeholder
- Notification button
- Theme indicator (future use)
- User profile placeholder
- Current page title

Do not implement authentication logic.

Static placeholders are acceptable.

---

## Step 2.5 — Breadcrumb Navigation

Create reusable breadcrumbs.

Every future page should support breadcrumb navigation.

Breadcrumbs should automatically adapt to routing hierarchy whenever possible.

---

## Step 2.6 — Responsive Behaviour

Verify layout behaviour for:

Desktop

Tablet

Mobile

No horizontal scrolling should occur.

Navigation should remain accessible on all devices.

---

## Step 2.7 — Accessibility

Verify:

- Keyboard navigation
- Focus states
- Semantic HTML
- Accessible navigation landmarks

---

# Expected Appearance

The interface should resemble a professional enterprise intelligence platform.

Characteristics:

- Clean spacing
- Dark professional theme
- Minimal distractions
- High readability
- Consistent navigation
- Information-first layout

Avoid decorative elements that reduce usability.

---

# Files Expected

Examples include:

- Root Layout
- Sidebar
- Navbar
- Breadcrumb
- Navigation configuration
- Layout wrappers

Reuse existing files whenever possible.

---

# Deliverables

By the completion of this phase the application should provide:

- Root layout
- Sidebar
- Navbar
- Responsive navigation
- Breadcrumb support
- Shared page layout

Business pages should still remain empty.

---

# Validation Checklist

Verify:

- Sidebar functions correctly.
- Navigation works.
- Responsive behaviour is correct.
- Layout remains reusable.
- Existing functionality is preserved.
- No duplicated layout logic exists.

---

# Exit Criteria

Phase 2 is complete only when:

- Application shell exists.
- Navigation is reusable.
- Layout is responsive.
- Sidebar is functional.
- Navbar is functional.
- Breadcrumbs are available.
- Existing project remains stable.

---

# Out of Scope

Do NOT implement:

- Dashboard content
- Charts
- Tables
- Cards
- Landing Page
- Login
- Analytics
- Maps
- AI Assistant
- Reports
- Business Logic

Only reusable application structure should exist.

---

# AI Credit Optimization

To minimize AI usage:

- Reuse existing layouts whenever possible.
- Modify only layout-related files.
- Avoid generating business pages.
- Avoid inspecting unrelated directories.
- Keep implementation summaries brief.
- Stop immediately after layout completion.

---

# Approval Gate

After completion:

1. Verify all validation checklist items.
2. Verify exit criteria.
3. Provide modified files.
4. Provide created files.
5. Confirm project builds successfully.
6. Wait for user approval.

Do not proceed to Phase 3 automatically.

---

# Phase 3 — Shared UI Component Library

## Objective

Build a reusable UI component library that serves as the foundation for every future page in the application.

Only generic UI components should be created during this phase.

Business-specific components must not be implemented.

The objective is to establish a consistent component system that can be reused throughout the project without duplication.

---

# Design Philosophy

Every reusable component should:

- Be visually consistent.
- Be highly reusable.
- Support future scalability.
- Remain independent from business logic.
- Follow the approved design system.

Components should solve generic UI problems.

They should never contain crime-specific logic.

---

# Component Categories

Implementation must follow the order below.

Do not skip categories.

---

## Step 3.1 — Button Components

Create reusable button variants.

Examples include:

- Primary
- Secondary
- Outline
- Ghost
- Destructive
- Icon Button
- Loading Button

Requirements

- Consistent sizing
- Disabled state
- Loading state
- Hover state
- Focus state
- Keyboard accessible

---

## Step 3.2 — Typography Components

Create reusable typography primitives.

Examples

- Page Heading
- Section Heading
- Card Title
- Paragraph
- Caption
- Label
- Helper Text

Avoid manually styling text throughout the project.

---

## Step 3.3 — Card Components

Create generic card containers.

Examples

- Basic Card
- Elevated Card
- Interactive Card
- Glass Card (if required)

Cards should not contain business-specific layouts.

---

## Step 3.4 — Form Components

Create reusable:

- Text Input
- Password Input
- Search Input
- Textarea
- Checkbox
- Radio
- Switch
- Select
- Multi Select
- Date Picker Placeholder
- Form Label
- Form Helper
- Validation Message

Business validation should not be implemented.

---

## Step 3.5 — Feedback Components

Create reusable:

- Badge
- Chip
- Alert
- Toast Wrapper
- Status Indicator
- Progress Bar
- Spinner
- Skeleton Loader

---

## Step 3.6 — Modal Components

Create reusable:

- Modal
- Confirmation Dialog
- Drawer
- Side Panel

These components should remain generic.

---

## Step 3.7 — Data Display Components

Create reusable:

- Table Wrapper
- Empty State
- Pagination
- Search Bar
- Filter Container
- Sort Controls
- Statistic Container

Do not populate with business data.

---

## Step 3.8 — Navigation Components

Create reusable:

- Tabs
- Accordion
- Breadcrumb
- Dropdown
- Context Menu

---

## Step 3.9 — Utility Components

Create reusable:

- Divider
- Tooltip
- Avatar
- Icon Wrapper
- Scroll Area
- Container
- Section Wrapper

---

## Step 3.10 — Component Documentation

Verify each reusable component:

- Has clear responsibility.
- Has descriptive props.
- Supports reuse.
- Uses centralized styling.
- Contains no duplicated logic.

---

# Component Rules

Every component must:

- Accept reusable props.
- Avoid hardcoded content.
- Avoid business terminology.
- Avoid page-specific layouts.
- Follow accessibility guidelines.
- Follow responsive guidelines.

---

# Naming Convention

Use descriptive component names.

Examples

Button

Card

Input

Modal

Badge

Table

Container

Avoid ambiguous names.

---

# Expected Appearance

Components should visually match the approved design system.

Characteristics

- Modern
- Minimal
- Enterprise
- Professional
- Consistent

Visual consistency is more important than visual complexity.

---

# Deliverables

At the completion of this phase the project should contain:

- Reusable UI primitives
- Shared form components
- Shared feedback components
- Shared layout helpers
- Shared navigation components
- Shared utility components

Business-specific components should not exist.

---

# Validation Checklist

Verify:

- Components compile successfully.
- Components are reusable.
- No duplicated components exist.
- No business logic exists.
- Styling is centralized.
- Existing functionality remains stable.

---

# Exit Criteria

Phase 3 is complete only when:

- Shared UI library exists.
- Components are reusable.
- Components are responsive.
- Components follow the design system.
- No business-specific components exist.

---

# Out of Scope

Do NOT implement:

- KPI Cards
- Dashboard Widgets
- Crime Cards
- Officer Cards
- Investigation Cards
- Analytics Cards
- Charts
- Tables with data
- Business Forms
- Login Screen
- Landing Page

These belong to later phases.

---

# AI Credit Optimization

To reduce AI usage:

- Generate only reusable primitives.
- Avoid creating example pages.
- Reuse existing UI components whenever possible.
- Keep implementations generic.
- Do not create mock business components.
- Stop after the reusable library is complete.

---

# Approval Gate

After completion:

1. Verify validation checklist.
2. Verify exit criteria.
3. Summarize created components.
4. Summarize modified files.
5. Confirm successful build.
6. Wait for user approval.

Do not begin Phase 4 automatically.

---

# Phase 4 — Landing Page & Authentication UI

## Objective

Build the public-facing entry point of the application and the authentication user interface.

This phase represents the user's first interaction with the platform.

The objective is to create a professional landing experience that communicates the purpose of the platform before allowing users to authenticate.

Authentication pages should remain frontend-only and must use mock data until backend integration.

---

# User Journey

The expected user flow is:

Landing Page

↓

About Platform

↓

Features Overview

↓

Call-To-Action

↓

Login / Register

↓

Dashboard (Placeholder)

The user should understand the platform before being asked to authenticate.

---

# Design Goal

The landing page should immediately communicate:

- Government-grade software
- AI-powered intelligence platform
- Modern technology
- Professionalism
- Trust
- Security

Avoid marketing-heavy or startup-style landing pages.

The interface should resemble enterprise software used by government agencies.

---

# Implementation Order

Complete every step sequentially.

Do not skip steps.

---

## Step 4.1 — Landing Page Structure

Create the overall landing page layout.

Sections should include:

- Hero Section
- Platform Overview
- Key Capabilities
- Platform Workflow
- Benefits
- Call-To-Action
- Footer

Navigation should remain simple.

---

## Step 4.2 — Hero Section

The Hero Section should communicate:

- Project Name
- Short Description
- Primary CTA
- Secondary CTA
- Professional Illustration Placeholder

Primary Actions:

- Sign In
- Get Started

Avoid excessive text.

---

## Step 4.3 — Platform Overview

Briefly explain:

- What the platform is.
- Why it exists.
- Problems it solves.
- Who uses it.

Use concise content.

---

## Step 4.4 — Key Features Section

Highlight major capabilities.

Examples:

- Crime Analytics
- Interactive Crime Map
- Criminal Network Analysis
- Officer Analytics
- Investigation Tracking
- AI Intelligence
- Predictive Crime Risk
- Reports

Each feature should be represented as a reusable feature card.

---

## Step 4.5 — Workflow Section

Illustrate the overall platform workflow.

Example:

Crime Data

↓

Analytics

↓

AI Intelligence

↓

Decision Support

↓

Actionable Insights

Use reusable timeline or flow components.

---

## Step 4.6 — Call-To-Action

Encourage users to proceed.

Actions:

- Sign In
- Register

Do not implement authentication logic.

Only navigation.

---

## Step 4.7 — Footer

Include:

- Platform Name
- Version Placeholder
- Copyright
- Useful Links Placeholder

Keep the footer minimal.

---

## Step 4.8 — Login Page

Create a professional login interface.

Include:

- Logo
- Welcome Message
- Email
- Password
- Remember Me
- Forgot Password Placeholder
- Login Button

Use reusable form components created earlier.

---

## Step 4.9 — Registration Page

Create a registration interface.

Fields:

- Full Name
- Email
- Password
- Confirm Password
- Role Placeholder
- Register Button

Use frontend validation only.

---

## Step 4.10 — Mock Authentication

Authentication should remain frontend-only.

Use reusable mock authentication.

Do not implement:

- JWT
- Backend
- Database
- API Calls

Use placeholder navigation.

---

# Expected Appearance

Landing Page

Professional

Minimal

Dark Theme

High-quality spacing

Large typography

Clear hierarchy

Authentication Pages

Centered layout

Minimal distractions

Strong focus on usability

---

# Reusable Components

This phase should reuse:

- Button
- Card
- Input
- Typography
- Badge
- Section Container
- Navigation

Avoid creating duplicate components.

---

# Deliverables

Upon completion the project should contain:

- Landing Page
- Login Page
- Register Page
- Footer
- Hero Section
- Feature Cards
- Workflow Section
- Mock Authentication

---

# Validation Checklist

Verify:

- Landing page renders correctly.
- Navigation works.
- Login UI works.
- Registration UI works.
- Responsive behaviour verified.
- Components are reused.
- Existing project remains stable.

---

# Exit Criteria

Phase 4 is complete only when:

- Landing Page completed.
- Login UI completed.
- Registration UI completed.
- Responsive behaviour verified.
- No backend implementation exists.

---

# Out of Scope

Do NOT implement:

- Backend Authentication
- JWT
- Database
- Dashboard
- Analytics
- Crime Map
- AI Components
- Reports
- Business Logic

---

# AI Credit Optimization

To minimize AI usage:

- Reuse components created in previous phases.
- Keep mock authentication simple.
- Avoid backend assumptions.
- Modify only authentication-related files.
- Stop immediately after validation.

---

# Approval Gate

Before proceeding:

1. Verify Validation Checklist.
2. Verify Exit Criteria.
3. Summarize created pages.
4. Summarize modified files.
5. Confirm successful build.
6. Wait for explicit user approval.

Do not proceed to Phase 5 automatically.

--

# Phase 5 — Executive Dashboard (Crime Intelligence Command Center)

## Objective

Develop the Executive Dashboard that serves as the primary command center of the Crime Intelligence Platform.

This dashboard must provide an immediate overview of the statewide crime situation through highly visual, interactive, and actionable insights.

The dashboard should prioritize situational awareness rather than data exploration.

Users should be able to understand the current crime landscape within a few seconds of opening the application.

This dashboard represents the operational headquarters of the entire platform.

---

# Primary Users

The Executive Dashboard is designed primarily for:

- SCRB Officers
- DGP Office
- Commissioner
- Superintendent of Police
- Senior Investigation Officers

The dashboard should support strategic decision making rather than operational data entry.

---

# User Stories

### User Story 1

As an SCRB Officer,

I want to immediately understand the current statewide crime situation,

So that I can identify districts requiring immediate attention.

---

### User Story 2

As a Superintendent,

I want to monitor investigation progress,

So that I can allocate officers efficiently.

---

### User Story 3

As a Senior Officer,

I want AI-generated alerts,

So that I can respond proactively instead of reactively.

---

### User Story 4

As a Decision Maker,

I want district-wise performance summaries,

So that I can compare resource utilization.

---

### User Story 5

As an Investigation Supervisor,

I want to quickly identify pending investigations,

So that delays can be reduced.

---

# Dashboard Philosophy

The dashboard should answer these questions immediately.

- How many total cases exist?
- What changed today?
- Which district requires attention?
- Which crime category increased?
- Which officers require support?
- Which investigations are delayed?
- What are the highest priority AI alerts?
- Where should resources be deployed?

Every dashboard component should answer one of these questions.

---

# Dashboard Layout

The layout should follow a clean enterprise structure.

Top Section

↓

Executive KPI Cards

↓

AI Intelligence Panel

↓

Crime Trend Analytics

↓

District Overview

↓

Investigation Overview

↓

Recent Activity

↓

Quick Actions

The dashboard should maintain a clear visual hierarchy.

---

# Implementation Order

Complete every step sequentially.

---

## Step 5.1 — Executive KPI Section

Implement executive summary cards.

Cards should include:

- Total FIRs
- Active Cases
- Closed Cases
- Pending Investigations
- Charge Sheets Filed
- High Risk Districts
- Repeat Offenders
- Active Alerts

Each KPI card should contain:

- Icon
- Value
- Trend Indicator
- Percentage Change
- Short Description

Cards must support future drill-down functionality.

---

## Step 5.2 — AI Intelligence Panel

Create a dedicated AI Intelligence panel.

Display:

- High Priority Alert
- Medium Priority Alert
- Emerging Crime Pattern
- AI Recommendation

Each alert should display:

- Severity
- Confidence Score
- Short Explanation
- Suggested Action

Frontend only.

Use mock data.

---

## Step 5.3 — Crime Trend Overview

Create reusable chart containers for:

- Crime Trend
- Monthly Crime Growth
- Crime Category Distribution
- Daily Incident Trend

Charts should remain interactive.

Use placeholder data.

---

## Step 5.4 — District Performance Overview

Display district summary cards.

Each card should include:

- District Name
- Total Cases
- Pending Cases
- Risk Level
- Investigation Completion
- Crime Trend Indicator

Cards should support future navigation.

---

## Step 5.5 — Investigation Overview

Create an investigation summary panel.

Display:

- Under Investigation
- Charge Sheet Filed
- Awaiting Trial
- Closed Cases

Represent progress visually.

---

## Step 5.6 — Officer Workload Preview

Create a lightweight officer summary.

Display:

- Active Officers
- Average Case Load
- Highest Workload
- Lowest Workload

Detailed analytics belong to a later phase.

---

## Step 5.7 — Recent Activity Feed

Display chronological updates.

Examples:

- New FIR Registered
- Investigation Updated
- Chargesheet Submitted
- High Priority Alert Generated

Mock data only.

---

## Step 5.8 — Quick Actions

Provide shortcuts for:

- View Crime Map
- Open Analytics
- Search FIR
- View Alerts
- Generate Report

Actions may navigate to placeholder pages.

---

## Step 5.9 — Global Dashboard Filters

Create reusable dashboard filters.

Examples:

- Date Range
- District
- Police Station
- Crime Category
- Investigation Status

Filters should update mock data only.

Backend integration will occur later.

---

# Expected Appearance

The Executive Dashboard should resemble a national intelligence command center.

Characteristics:

- High information density
- Excellent readability
- Minimal clutter
- Strong visual hierarchy
- Professional spacing
- Enterprise styling
- Responsive layout

The dashboard should feel operational rather than decorative.

---

# Reusable Components

This phase must reuse:

- KPI Cards
- Chart Containers
- Alert Cards
- Section Containers
- Buttons
- Badges
- Tables
- Filters
- Empty States
- Loading States

Avoid creating duplicate UI.

---

# Mock Data Policy

Use realistic synthetic data.

Data should remain internally consistent.

Avoid random values.

Examples:

- FIR Count
- District Rankings
- Officer Statistics
- Crime Trends
- Alert Severity
- Investigation Counts

Mock data should resemble realistic police intelligence data.

---

# Deliverables

At the completion of this phase the application should include:

- Executive Dashboard
- KPI Cards
- AI Intelligence Panel
- Crime Trend Charts
- District Summary
- Investigation Summary
- Officer Preview
- Activity Feed
- Dashboard Filters
- Quick Actions

---

# Validation Checklist

Verify:

- Dashboard renders correctly.
- Responsive behaviour verified.
- Charts display correctly.
- KPI cards are reusable.
- Components follow design system.
- Mock data remains consistent.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 5 is complete only when:

- Executive Dashboard is fully implemented.
- All dashboard sections are functional.
- Layout is responsive.
- Components are reusable.
- Mock data powers every section.
- No backend integration exists.

---

# Out of Scope

Do NOT implement:

- Interactive Crime Map
- Criminal Network Graph
- AI Chat Assistant
- Officer Detail Page
- Investigation Detail Page
- Reports
- Backend APIs
- Database Integration

These belong to later phases.

---

# AI Credit Optimization

Before requesting approval:

- Reuse previously created components.
- Avoid regenerating layout code.
- Modify only dashboard-related files.
- Keep mock data centralized.
- Do not inspect unrelated directories.
- Summarize changes in fewer than 10 points.
- Stop after dashboard validation.

---

# Approval Gate

Before proceeding to Phase 6:

1. Verify all Validation Checklist items.
2. Verify all Exit Criteria.
3. Verify all Quality Assurance Gates.
4. Summarize created pages.
5. Summarize created reusable components.
6. Summarize modified files.
7. Confirm successful build.
8. Wait for explicit user approval.

The Agentic IDE must not proceed to Phase 6 automatically.

---

# Phase 6 — Intelligence Analytics Workspace

## Objective

Develop a comprehensive Intelligence Analytics Workspace that enables investigators, analysts, and senior police officials to explore crime data through interactive visualizations, advanced filtering, comparative analysis, and drill-down capabilities.

Unlike the Executive Dashboard, which provides a high-level operational overview, the Intelligence Analytics Workspace is designed for detailed investigation, exploration, and strategic analysis.

This page should help users discover patterns, relationships, anomalies, and trends hidden within the crime dataset.

The implementation must remain frontend-only and utilize realistic mock data until backend integration begins.

---

# Primary Users

The Intelligence Analytics Workspace is primarily intended for:

- State Crime Records Bureau (SCRB) Analysts
- Crime Intelligence Officers
- Senior Investigation Officers
- District Superintendents
- Police Commissioners
- Policy & Strategic Planning Teams

---

# User Stories

### User Story 1

As an Intelligence Analyst,

I want to compare crime statistics across multiple districts,

So that I can identify emerging regional patterns.

---

### User Story 2

As a Superintendent,

I want to analyze investigation performance,

So that I can identify operational bottlenecks.

---

### User Story 3

As a Strategic Planner,

I want to study long-term crime trends,

So that future policing strategies can be planned.

---

### User Story 4

As an Investigation Officer,

I want to filter crime data using multiple parameters,

So that I can investigate specific situations quickly.

---

### User Story 5

As a Decision Maker,

I want AI-ready visualizations,

So that future AI insights integrate naturally into the analytics workspace.

---

# Analytics Philosophy

This page should answer questions such as:

- Which crimes are increasing?
- Which districts require additional policing?
- Which police stations are overloaded?
- Which investigation stages experience delays?
- Which crime categories are changing over time?
- What seasonal or temporal patterns exist?
- Which demographic groups are most affected?
- Which operational metrics require immediate attention?

Every visualization should answer a meaningful operational question.

---

# Workspace Layout

The Intelligence Analytics Workspace should follow this hierarchy.

Global Analytics Filters

↓

Executive Analytics Summary

↓

Trend Analysis

↓

Comparative Analysis

↓

Investigation Analytics

↓

Demographic Analysis

↓

Operational Metrics

↓

Data Explorer

↓

Export Tools

The interface should remain clean and highly interactive.

---

# Implementation Order

Complete every step sequentially.

---

## Step 6.1 — Global Analytics Filters

Create reusable analytics filters.

Examples include:

- Date Range
- District
- Police Station
- Crime Category
- Crime Subcategory
- Investigation Status
- Officer
- Severity
- Risk Level

All filters should interact with mock data only.

---

## Step 6.2 — Analytics Summary Cards

Create reusable analytics summary cards.

Examples:

- Total Cases
- Growth Percentage
- Average Investigation Time
- Crime Resolution Rate
- Active Investigations
- Average Daily FIRs

Cards should include:

- Metric
- Trend
- Percentage Change
- Icon

---

## Step 6.3 — Trend Analysis Section

Implement interactive trend visualizations.

Examples:

- Monthly Crime Trend
- Weekly Crime Trend
- Daily Incident Trend
- Hourly Crime Distribution
- Year-over-Year Comparison

Charts should support:

- Hover
- Legend
- Tooltips
- Responsive resizing

---

## Step 6.4 — Comparative Analysis

Allow users to compare datasets.

Examples:

- District vs District
- Police Station vs Police Station
- Crime Category vs Crime Category
- Current Year vs Previous Year

Use side-by-side visualizations.

---

## Step 6.5 — Crime Distribution Analysis

Implement visualizations showing:

- Crime by Category
- Crime by District
- Crime by Police Station
- Crime by Investigation Status
- Crime by Severity
- Crime by Time of Day

Mock data only.

---

## Step 6.6 — Investigation Analytics

Display investigation-related metrics.

Examples:

- Pending Cases
- Closed Cases
- Charge Sheet Filed
- Arrest Completed
- Average Investigation Duration
- Investigation Backlog

Represent these using reusable chart containers.

---

## Step 6.7 — Demographic Analysis

Create demographic visualizations.

Examples:

- Victim Age Distribution
- Victim Gender Distribution
- Accused Age Distribution
- Accused Gender Distribution

Prepare reusable containers for future backend integration.

---

## Step 6.8 — Operational Performance

Display operational metrics.

Examples:

- District Performance
- Police Station Performance
- Officer Case Load
- Investigation Completion Rate

Detailed officer analytics belong to Phase 9.

---

## Step 6.9 — Drill-Down Panels

Support drill-down interaction.

Clicking a chart should reveal:

- Detailed breakdown
- Related statistics
- Expanded table
- Additional filters

Mock interactions are acceptable.

---

## Step 6.10 — Data Explorer

Create an interactive analytics table.

Features:

- Search
- Filter
- Sort
- Pagination
- Column Visibility
- Export Placeholder

Mock dataset only.

---

## Step 6.11 — Export Tools

Provide UI for exporting analytics.

Examples:

- PDF
- Excel
- CSV

Implementation remains frontend-only.

---

# Expected Appearance

The Intelligence Analytics Workspace should resemble enterprise intelligence software.

Characteristics:

- High information density
- Clean layout
- Interactive charts
- Responsive filters
- Professional spacing
- Minimal visual clutter
- Excellent readability

Users should feel like they are operating an intelligence analysis platform.

---

# Reusable Components

Reuse:

- Chart Containers
- Filter Components
- Tables
- Cards
- Buttons
- Empty States
- Skeleton Loaders
- Section Wrappers
- Pagination
- Search Components

Avoid creating duplicate UI.

---

# Mock Data Policy

Mock data must remain:

- Realistic
- Internally consistent
- District-aware
- Time-series capable
- Suitable for charts
- Suitable for comparisons

Avoid randomly generated values.

---

# Deliverables

By completion, the workspace should include:

- Analytics Workspace
- Global Filters
- Trend Analysis
- Comparative Analysis
- Crime Distribution
- Investigation Analytics
- Demographic Analysis
- Operational Metrics
- Drill-Down Panels
- Data Explorer
- Export Interface

---

# Validation Checklist

Verify:

- All analytics sections render correctly.
- Charts are responsive.
- Filters update mock data.
- Tables function correctly.
- Drill-down interactions work.
- Components follow the design system.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 6 is complete only when:

- Analytics Workspace is fully implemented.
- Interactive charts are functional.
- Filters work correctly.
- Tables are reusable.
- Mock data powers all analytics.
- Responsive behavior is verified.
- No backend integration exists.

---

# Out of Scope

Do NOT implement:

- Interactive Crime Map
- Criminal Network Graph
- AI Assistant
- AI Predictions
- Officer Detail Dashboard
- Investigation Timeline
- Backend APIs
- Database Integration

These belong to later phases.

---

# AI Credit Optimization

Before requesting approval:

- Reuse existing chart containers.
- Reuse filters created in earlier phases.
- Keep mock datasets centralized.
- Avoid regenerating existing components.
- Modify only analytics-related files.
- Summarize implementation in fewer than 10 points.
- Stop after validation.

---

# Approval Gate

Before proceeding to Phase 7:

1. Verify Validation Checklist.
2. Verify Exit Criteria.
3. Verify all Quality Assurance Gates.
4. Summarize created pages.
5. Summarize created reusable components.
6. Summarize modified files.
7. Confirm successful build.
8. Wait for explicit user approval.

The Agentic IDE must not proceed to Phase 7 automatically.

---

# Phase 7 — Crime Intelligence Geographic Command Center

## Objective

Develop an interactive Geographic Intelligence Command Center that enables law enforcement officials to monitor, analyze, and investigate crime patterns across Karnataka using geospatial visualization.

The map should function as a strategic intelligence platform rather than a simple location viewer.

Users should be able to identify crime hotspots, monitor district performance, explore police station activity, replay historical crime evolution, and understand geographical crime distribution through an interactive interface.

This phase remains frontend-only and utilizes realistic mock geospatial datasets.

---

# Primary Users

The Geographic Command Center is designed for:

- State Crime Records Bureau (SCRB)
- Director General of Police (DGP)
- Commissioners
- District Superintendents
- Intelligence Officers
- Strategic Planning Teams

---

# User Stories

### User Story 1

As a State Crime Analyst,

I want to visualize statewide crime patterns on a map,

So that I can immediately identify high-risk districts.

---

### User Story 2

As a Superintendent,

I want to drill down into individual districts,

So that I can understand local crime distribution.

---

### User Story 3

As an Intelligence Officer,

I want to replay crime evolution over time,

So that I can observe emerging hotspots.

---

### User Story 4

As a Decision Maker,

I want to overlay multiple intelligence layers,

So that operational planning becomes easier.

---

### User Story 5

As a Police Commander,

I want to quickly identify districts requiring immediate attention,

So that resources can be deployed proactively.

---

# Geographic Intelligence Philosophy

The map should answer questions such as:

- Where are crimes increasing?
- Which districts are becoming high risk?
- Which police stations experience the highest workload?
- Which crime categories dominate each district?
- How has crime evolved over time?
- Which regions require additional patrol deployment?
- Where are investigation delays concentrated?

Every interaction should support operational decision making.

---

# Workspace Layout

The page should follow this hierarchy.

Global Map Filters

↓

Interactive Karnataka Map

↓

Layer Controls

↓

District Intelligence Panel

↓

Police Station Summary

↓

Crime Timeline

↓

Recent Geographic Alerts

↓

Quick Geographic Actions

The map should occupy the majority of available screen space.

---

# Implementation Order

Complete every step sequentially.

---

## Step 7.1 — Karnataka Base Map

Implement an interactive Karnataka map.

Requirements:

- Responsive
- Zoom
- Pan
- District boundaries
- Smooth interactions

Do not use static images.

Use an interactive mapping library.

---

## Step 7.2 — District Layer

Display all Karnataka districts.

Each district should visually represent its crime status.

Color scale example:

- Green → Low Risk
- Yellow → Moderate Risk
- Orange → Elevated Risk
- Red → High Risk

District colors should be driven by centralized mock data.

---

## Step 7.3 — Police Station Layer

Display police station markers.

Marker interactions:

- Hover
- Click
- Tooltip
- Popup

Popup information may include:

- Police Station Name
- Total FIRs
- Active Cases
- Pending Investigations
- Risk Score

Mock data only.

---

## Step 7.4 — Crime Hotspot Layer

Create a reusable hotspot visualization.

Display:

- Heatmap
- High-density clusters
- Severity intensity

Hotspots should visually adapt according to mock data.

Avoid random hotspot placement.

---

## Step 7.5 — Layer Control Panel

Allow users to toggle visualization layers.

Examples:

- District Boundaries
- Police Stations
- Crime Hotspots
- Severity Layer
- Investigation Layer
- Resource Layer
- AI Alerts (Placeholder)

Layers should update the map without page refresh.

---

## Step 7.6 — Global Map Filters

Provide reusable filters.

Examples:

- Date Range
- District
- Police Station
- Crime Category
- Crime Severity
- Investigation Status

Mock filtering only.

---

## Step 7.7 — District Intelligence Panel

Selecting a district should open an intelligence panel.

Display:

- District Name
- Crime Summary
- Total FIRs
- Active Cases
- Pending Investigations
- Officer Count
- High Priority Crimes
- Crime Trend
- Risk Indicator

The panel should remain reusable.

---

## Step 7.8 — Police Station Intelligence

Selecting a police station should reveal:

- Station Information
- FIR Count
- Investigation Status
- Officer Availability
- Active Alerts

Frontend only.

---

## Step 7.9 — Crime Timeline

Implement a timeline slider.

Allow users to replay mock crime evolution.

Examples:

January

↓

February

↓

March

↓

April

District coloring and hotspots should update according to selected timeline values.

---

## Step 7.10 — Geographic Alerts

Display location-based alerts.

Examples:

- Crime Spike
- Investigation Delay
- Emerging Hotspot
- High Priority District

Display:

- Severity
- Confidence Placeholder
- Recommendation Placeholder

---

## Step 7.11 — Quick Geographic Actions

Provide quick actions.

Examples:

- Open District Analytics
- Open Investigation
- View Officer Summary
- Generate Geographic Report
- Reset Filters

Navigation may remain placeholder.

---

## Step 7.12 — Fullscreen Intelligence Mode

Allow the map to expand into fullscreen.

Requirements:

- Preserve filters
- Preserve selected district
- Preserve active layers

This mode should maximize situational awareness.

---

# Expected Appearance

The Geographic Intelligence Command Center should resemble a professional GIS operations platform.

Characteristics:

- Fullscreen map experience
- Minimal distractions
- High readability
- Clean overlays
- Interactive side panels
- Smooth transitions
- Professional color hierarchy

The interface should feel like software used inside a government command center.

---

# Reusable Components

Reuse:

- Filter Components
- Cards
- Side Panels
- Tooltips
- Drawers
- Buttons
- Badges
- Search Components
- Empty States
- Skeleton Loaders

Avoid duplicate UI implementations.

---

# Mock Data Policy

Mock geographic data should include:

- Karnataka districts
- Police stations
- Crime coordinates
- Heatmap values
- District risk scores
- Crime categories
- Timeline snapshots

The dataset must remain internally consistent.

Avoid random coordinates.

---

# Deliverables

At completion the application should include:

- Interactive Karnataka Map
- District Layer
- Police Station Layer
- Crime Hotspot Layer
- Layer Controls
- District Intelligence Panel
- Police Station Panel
- Timeline Slider
- Geographic Alerts
- Fullscreen Intelligence Mode

---

# Validation Checklist

Verify:

- Map renders correctly.
- District interactions function.
- Police station interactions function.
- Layer controls work.
- Timeline updates map state.
- Side panels display correctly.
- Responsive behavior verified.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 7 is complete only when:

- Interactive Karnataka map is fully operational.
- District drill-down works.
- Police station drill-down works.
- Layer controls function correctly.
- Timeline replay functions.
- Geographic alerts display correctly.
- Fullscreen mode operates correctly.
- No backend integration exists.

---

# Out of Scope

Do NOT implement:

- Criminal Network Graph
- AI Assistant
- Officer Dashboard
- Reports
- Predictive AI
- Backend APIs
- Database Integration

These belong to later phases.

---

# AI Credit Optimization

Before requesting approval:

- Reuse existing cards and panels.
- Reuse filter components.
- Centralize geographic mock data.
- Avoid regenerating existing layouts.
- Modify only map-related files.
- Keep implementation summaries under 10 points.
- Stop immediately after validation.

---

# Approval Gate

Before proceeding to Phase 8:

1. Verify Validation Checklist.
2. Verify Exit Criteria.
3. Verify all Quality Assurance Gates.
4. Summarize created pages.
5. Summarize reusable components.
6. Summarize modified files.
7. Confirm successful build.
8. Wait for explicit user approval.

The Agentic IDE must not proceed to Phase 8 automatically.

---

# Phase 8 — Criminal Intelligence & Link Analysis Center

## Objective

Develop an interactive Criminal Intelligence & Link Analysis Center that enables investigators and intelligence officers to discover relationships between suspects, victims, cases, police stations, locations, vehicles, weapons, and other investigative entities through an interactive network visualization.

The objective is to transform isolated records into connected intelligence by revealing hidden associations, repeat offenders, organized crime structures, and investigation relationships.

The implementation must remain frontend-only and use realistic synthetic data until backend integration begins.

---

# Primary Users

The Criminal Intelligence Center is intended for:

- Crime Intelligence Officers
- Investigation Officers
- SCRB Analysts
- Special Investigation Teams
- Organized Crime Units
- Senior Police Officials

---

# User Stories

### User Story 1

As an Investigation Officer,

I want to visualize relationships between suspects and cases,

So that I can identify repeat offenders quickly.

---

### User Story 2

As a Crime Analyst,

I want to identify hidden criminal associations,

So that organized crime groups become visible.

---

### User Story 3

As a Superintendent,

I want to understand criminal activity across districts,

So that intelligence sharing becomes easier.

---

### User Story 4

As an Intelligence Officer,

I want to explore criminal relationships interactively,

So that investigations become more efficient.

---

### User Story 5

As a Senior Decision Maker,

I want visual criminal intelligence rather than spreadsheets,

So that patterns become immediately understandable.

---

# Intelligence Philosophy

This page should answer questions such as:

- Who are the repeat offenders?
- Which suspects are connected?
- Which locations appear repeatedly?
- Which cases share common entities?
- Which gangs operate together?
- Which vehicles are linked to multiple FIRs?
- Which mobile numbers appear across investigations?
- Which weapons are repeatedly used?
- Which districts share criminal activity?

Every visualization should reveal hidden intelligence.

---

# Workspace Layout

The page should follow this hierarchy.

Global Intelligence Filters

↓

Network Overview Cards

↓

Interactive Criminal Network Graph

↓

Relationship Explorer

↓

Entity Intelligence Panel

↓

Relationship Timeline

↓

Associated Case Summary

↓

Investigation Recommendations

↓

Quick Intelligence Actions

The network graph should remain the primary focus of the page.

---

# Implementation Order

Complete every step sequentially.

---

## Step 8.1 — Network Overview

Create intelligence summary cards.

Examples:

- Total Criminals
- Repeat Offenders
- Active Networks
- Connected Cases
- Organized Groups
- Cross-District Links

Cards should support future drill-down functionality.

---

## Step 8.2 — Interactive Network Graph

Implement an interactive graph visualization.

The graph should support:

- Zoom
- Pan
- Node Selection
- Hover
- Drag
- Smooth Layout
- Responsive Rendering

Use Cytoscape.js.

The graph must remain fully interactive.

---

## Step 8.3 — Entity Types

Represent different intelligence entities using distinct node styles.

Examples include:

- Suspect
- Victim
- Case
- Police Station
- District
- Crime Scene
- Vehicle
- Weapon
- Mobile Number
- Gang
- Investigation Officer

Every entity type should have a unique visual identity.

---

## Step 8.4 — Relationship Types

Display relationships between entities.

Examples:

- Involved In
- Reported By
- Investigated By
- Arrested In
- Associated With
- Same Vehicle
- Same Weapon
- Same Location
- Same Gang
- Same Mobile Number

Relationships should remain visually distinguishable.

---

## Step 8.5 — Global Intelligence Filters

Provide reusable filters.

Examples:

- District
- Police Station
- Crime Category
- Crime Severity
- Date Range
- Investigation Status
- Entity Type
- Relationship Type

Mock filtering only.

---

## Step 8.6 — Entity Intelligence Panel

Selecting a node should open an intelligence panel.

Display:

- Entity Name
- Entity Type
- Risk Indicator
- Linked Cases
- Related Entities
- Investigation Status
- Known Associations
- Historical Activity

Frontend only.

---

## Step 8.7 — Relationship Explorer

Selecting an edge should reveal:

- Relationship Type
- Connected Entities
- Linked Cases
- Investigation Notes Placeholder
- Timeline Placeholder

---

## Step 8.8 — Relationship Timeline

Display chronological relationship history.

Example:

2023

↓

First FIR

↓

2024

↓

Repeat Offence

↓

2025

↓

Gang Association

↓

2026

↓

Active Investigation

Mock timeline only.

---

## Step 8.9 — Associated Case Summary

Display all related investigations.

Examples:

- FIR Number
- Crime Category
- Investigation Status
- District
- Assigned Officer

Support expandable mock data.

---

## Step 8.10 — Risk Intelligence

Display visual intelligence indicators.

Examples:

- Repeat Offender
- Organized Crime Member
- Cross-District Activity
- High Risk Individual
- Investigation Priority

Risk indicators remain frontend-only.

---

## Step 8.11 — Investigation Recommendations

Display recommendation cards.

Examples:

- Review Linked Cases
- Investigate Shared Vehicle
- Compare FIR Patterns
- Monitor Associated Network
- Escalate Investigation

These remain UI placeholders.

---

## Step 8.12 — Quick Intelligence Actions

Provide shortcuts.

Examples:

- Open Investigation
- View Crime Map
- Open Analytics
- Generate Intelligence Report
- Expand Network

Navigation may remain placeholder.

---

# Expected Appearance

The Criminal Intelligence Center should resemble professional intelligence software.

Characteristics:

- Large interactive graph
- Minimal distractions
- Dark intelligence theme
- High readability
- Interactive side panels
- Smooth graph animations
- Clear relationship visualization

The interface should resemble modern intelligence analysis platforms rather than social network graphs.

---

# Reusable Components

Reuse:

- Cards
- Drawers
- Side Panels
- Filters
- Buttons
- Badges
- Search Components
- Empty States
- Skeleton Loaders

Avoid duplicate implementations.

---

# Mock Data Policy

Synthetic network data should include:

- Criminals
- Victims
- Cases
- FIR Links
- Police Stations
- Vehicles
- Weapons
- Gangs
- Mobile Numbers
- Cross-District Relationships

Relationships should remain logically consistent.

Avoid random network generation.

---

# Deliverables

Upon completion the project should include:

- Interactive Criminal Network Graph
- Intelligence Summary Cards
- Entity Intelligence Panel
- Relationship Explorer
- Relationship Timeline
- Associated Case Summary
- Risk Indicators
- Investigation Recommendations
- Intelligence Filters
- Quick Actions

---

# Validation Checklist

Verify:

- Network graph renders correctly.
- Zoom and pan function correctly.
- Node interactions work.
- Edge interactions work.
- Side panels display correctly.
- Filters function with mock data.
- Responsive behavior verified.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 8 is complete only when:

- Interactive network graph functions correctly.
- Entity drill-down works.
- Relationship exploration works.
- Intelligence panels display correctly.
- Mock network data is consistent.
- Responsive behavior verified.
- No backend integration exists.

---

# Out of Scope

Do NOT implement:

- AI Chat Assistant
- AI Predictions
- Officer Dashboard
- Investigation Timeline Page
- Reports
- Backend APIs
- Machine Learning
- Database Integration

These belong to later phases.

---

# AI Credit Optimization

Before requesting approval:

- Reuse existing panels and cards.
- Reuse filter components.
- Keep network mock data centralized.
- Avoid regenerating existing layouts.
- Modify only intelligence-related files.
- Keep implementation summaries under 10 points.
- Stop immediately after validation.

---

# Approval Gate

Before proceeding to Phase 9:

1. Verify Validation Checklist.
2. Verify Exit Criteria.
3. Verify all Quality Assurance Gates.
4. Summarize created pages.
5. Summarize reusable components.
6. Summarize modified files.
7. Confirm successful build.
8. Wait for explicit user approval.

The Agentic IDE must not proceed to Phase 9 automatically.

---

# Phase 9 — Operational Command Center

## Objective

Develop an Operational Command Center that enables police leadership to monitor investigations, officer performance, operational efficiency, resource allocation, and case progress through a unified operational workspace.

Unlike previous phases that focus on understanding crime, this phase focuses on managing ongoing police operations and supporting strategic resource allocation.

The implementation must remain frontend-only and utilize realistic synthetic datasets until backend integration becomes available.

---

# Primary Users

The Operational Command Center is intended for:

- Director General of Police (DGP)
- Commissioners
- District Superintendents
- Investigation Supervisors
- Police Station Heads
- SCRB Operational Analysts

---

# User Stories

### User Story 1

As a Superintendent,

I want to monitor investigation progress,

So that delayed investigations can be identified quickly.

---

### User Story 2

As a Police Commander,

I want to understand officer workload,

So that manpower can be distributed efficiently.

---

### User Story 3

As an Investigation Supervisor,

I want to identify pending investigations,

So that operational bottlenecks can be reduced.

---

### User Story 4

As a Senior Officer,

I want to monitor police station performance,

So that corrective actions can be taken.

---

### User Story 5

As a Decision Maker,

I want operational recommendations,

So that resources can be deployed proactively.

---

# Operational Philosophy

The Operational Command Center should answer questions such as:

- Which investigations require immediate attention?
- Which officers are overloaded?
- Which police stations require additional manpower?
- Which districts have investigation delays?
- Which officers demonstrate the highest performance?
- Which investigations are approaching deadlines?
- Where should operational resources be reassigned?
- Which investigations have remained inactive?

Every visualization should support operational decision making.

---

# Workspace Layout

The page should follow this hierarchy.

Global Operational Filters

↓

Operational KPI Cards

↓

Investigation Progress Dashboard

↓

Officer Workload Dashboard

↓

Police Station Performance

↓

Case Assignment Board

↓

Operational Alerts

↓

Investigation Timeline

↓

Recommended Actions

↓

Quick Operational Actions

---

# Implementation Order

Complete every step sequentially.

---

## Step 9.1 — Operational KPI Cards

Create operational summary cards.

Examples:

- Active Investigations
- Pending Cases
- Closed Cases
- Average Investigation Time
- Active Officers
- Investigation Completion Rate
- Officer Utilization
- Investigation Backlog

Each KPI card should include:

- Metric
- Trend
- Percentage Change
- Status Indicator

---

## Step 9.2 — Investigation Progress Dashboard

Create investigation tracking widgets.

Examples:

- FIR Registered
- Investigation Started
- Evidence Collection
- Arrest Completed
- Charge Sheet Filed
- Court Proceedings
- Case Closed

Represent progress visually using reusable timeline components.

---

## Step 9.3 — Officer Workload Dashboard

Display officer workload.

Examples:

- Assigned Cases
- Completed Cases
- Pending Cases
- Average Investigation Time
- Officer Availability
- Current Workload
- Performance Score

Mock data only.

---

## Step 9.4 — Officer Leaderboard

Create an officer performance leaderboard.

Display:

- Officer Name
- Assigned Cases
- Solved Cases
- Pending Cases
- Performance Rating
- Investigation Efficiency

Frontend only.

---

## Step 9.5 — Police Station Performance

Display operational metrics for police stations.

Examples:

- Investigation Completion Rate
- Pending Cases
- Officer Availability
- Average Response Time
- Case Clearance Rate

Support future drill-down functionality.

---

## Step 9.6 — Case Assignment Board

Create a reusable case assignment interface.

Display:

- Case Number
- Assigned Officer
- Priority
- Status
- District
- Deadline

Support sorting and filtering.

Mock interactions only.

---

## Step 9.7 — Investigation Timeline

Create an interactive investigation timeline.

Examples:

FIR Registered

↓

Evidence Collection

↓

Suspect Identified

↓

Arrest

↓

Charge Sheet

↓

Court

↓

Closed

Display visual progress indicators.

---

## Step 9.8 — Operational Alerts

Display operational alerts.

Examples:

- Investigation Delay
- Officer Overload
- High Priority Case
- Missed Deadline
- Resource Shortage

Display:

- Severity
- Recommendation
- Related Investigation

Mock data only.

---

## Step 9.9 — Resource Allocation Panel

Display operational resource information.

Examples:

- Officer Availability
- Vehicle Availability
- Investigation Capacity
- District Capacity
- Station Capacity

Represent capacity visually.

---

## Step 9.10 — Recommended Actions

Display actionable recommendations.

Examples:

- Reassign Officer
- Prioritize Investigation
- Increase Patrol
- Allocate Additional Officers
- Escalate Investigation
- Review Investigation Timeline

Frontend placeholder only.

---

## Step 9.11 — Quick Operational Actions

Provide operational shortcuts.

Examples:

- View Investigation
- View Officer
- Open Crime Map
- Generate Operational Report
- Assign Officer

Navigation may remain placeholder.

---

# Expected Appearance

The Operational Command Center should resemble professional command-and-control software.

Characteristics:

- Operational focus
- Clear timelines
- Minimal distractions
- Professional dashboards
- High information density
- Enterprise-grade UI
- Fast navigation

The interface should emphasize operational decision making rather than analytics.

---

# Reusable Components

Reuse:

- Timeline Components
- Cards
- Tables
- Filters
- Progress Indicators
- Drawers
- Badges
- Alerts
- Buttons
- Search Components

Avoid duplicate implementations.

---

# Mock Data Policy

Synthetic operational data should include:

- Officers
- Investigations
- Case Assignments
- Police Stations
- Districts
- Timelines
- Operational Metrics
- Resource Availability
- Performance Statistics

Data should remain internally consistent.

Avoid random operational values.

---

# Deliverables

Upon completion the project should include:

- Operational Dashboard
- Investigation Progress Dashboard
- Officer Workload Dashboard
- Officer Leaderboard
- Police Station Performance
- Case Assignment Board
- Investigation Timeline
- Operational Alerts
- Resource Allocation Panel
- Recommended Actions
- Quick Operational Actions

---

# Validation Checklist

Verify:

- Operational dashboard renders correctly.
- Timelines function correctly.
- Tables display properly.
- Filters work with mock data.
- Progress indicators render correctly.
- Responsive behavior verified.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 9 is complete only when:

- Operational dashboard functions correctly.
- Investigation tracking works.
- Officer workload displays correctly.
- Police station metrics render correctly.
- Operational alerts function.
- Timeline components work.
- Responsive behavior verified.
- No backend integration exists.

---

# Out of Scope

Do NOT implement:

- AI Assistant
- Predictive Analytics
- AI Risk Scoring
- Report Generation Logic
- Backend APIs
- Database Integration
- Authentication Logic

These belong to later phases.

---

# AI Credit Optimization

Before requesting approval:

- Reuse existing timeline components.
- Reuse existing cards and tables.
- Centralize operational mock data.
- Modify only operational dashboard files.
- Avoid regenerating reusable components.
- Summarize implementation in fewer than 10 points.
- Stop immediately after validation.

---

# Approval Gate

Before proceeding to Phase 10:

1. Verify Validation Checklist.
2. Verify Exit Criteria.
3. Verify all Quality Assurance Gates.
4. Summarize created pages.
5. Summarize reusable components.
6. Summarize modified files.
7. Confirm successful build.
8. Wait for explicit user approval.

The Agentic IDE must not proceed to Phase 10 automatically.

---

# Phase 10 — AI Crime Intelligence Copilot

## Objective

Develop an AI-powered Crime Intelligence Copilot that acts as a strategic assistant for investigators, intelligence officers, and senior police leadership.

The Copilot should transform traditional dashboard interactions into natural language conversations capable of answering operational questions, generating intelligence summaries, recommending investigative actions, and providing explainable AI insights.

The frontend implementation must remain independent from backend AI services and should use realistic mock conversations, placeholder AI responses, and reusable interfaces until backend integration begins.

The objective is to demonstrate how Artificial Intelligence enhances policing rather than simply providing another chatbot.

---

# Primary Users

The AI Copilot is designed for:

- Director General of Police (DGP)
- SCRB Analysts
- Intelligence Officers
- Investigation Officers
- Commissioners
- District Superintendents

---

# User Stories

### User Story 1

As an Intelligence Officer,

I want to ask crime-related questions in natural language,

So that I can retrieve intelligence without manually searching dashboards.

---

### User Story 2

As a Superintendent,

I want AI-generated recommendations,

So that I can allocate resources proactively.

---

### User Story 3

As a Senior Officer,

I want AI to explain crime trends,

So that I understand why predictions are being made.

---

### User Story 4

As an Investigator,

I want AI to summarize investigations,

So that I can review cases faster.

---

### User Story 5

As a Decision Maker,

I want one intelligent assistant connected to every module,

So that operational decisions become easier.

---

# Copilot Philosophy

The AI Copilot should answer questions such as:

- Which district requires immediate attention?
- Why is Bengaluru classified as high risk?
- Show repeat offenders in Mysuru.
- Compare cybercrime trends over the last six months.
- Which investigations require escalation?
- Recommend patrol deployment.
- Summarize today's intelligence.
- Which officers are overloaded?
- Explain recent crime growth.
- Show connected criminal networks.

The Copilot should always provide reasoning rather than short answers.

---

# Workspace Layout

The page should follow this hierarchy.

AI Conversation Header

↓

Conversation Panel

↓

Suggested Prompts

↓

AI Intelligence Cards

↓

Executive Summary

↓

Recommendation Panel

↓

Linked Visualizations

↓

Conversation History

↓

Quick AI Actions

The interface should feel like an enterprise AI workspace.

---

# Implementation Order

Complete every step sequentially.

---

## Step 10.1 — Copilot Welcome Screen

Create a professional AI landing screen.

Display:

- AI Copilot Name
- Short Description
- Suggested Questions
- Recent Conversations
- Quick Intelligence Actions

The page should encourage interaction.

---

## Step 10.2 — Conversation Interface

Develop the primary AI conversation interface.

Features:

- Conversation history
- User prompts
- AI responses
- Typing indicator
- Timestamp
- Message grouping
- Scrollable history

Mock conversations only.

---

## Step 10.3 — Suggested Intelligence Prompts

Provide predefined prompts.

Examples:

- Show crime hotspots.
- Compare districts.
- Explain crime growth.
- Identify repeat offenders.
- Recommend patrol allocation.
- Generate intelligence briefing.
- Summarize investigations.
- Show operational risks.
- Predict crime trends.
- Detect anomalies.

Clicking a prompt should populate the conversation.

---

## Step 10.4 — AI Intelligence Summary

Display AI-generated executive summaries.

Examples:

- Today's Intelligence
- Weekly Overview
- District Summary
- Crime Growth Summary
- Investigation Summary

Mock summaries only.

---

## Step 10.5 — Explainable AI Panel

Display explanation cards.

Each AI response should include:

- Reasoning
- Supporting Metrics
- Confidence Indicator
- Explanation
- Recommendation

The interface should always explain "why."

---

## Step 10.6 — AI Recommendation Center

Display operational recommendations.

Examples:

- Increase Patrol
- Deploy Investigation Team
- Monitor Repeat Offender
- Review Pending Investigation
- Strengthen Cyber Patrol
- Allocate Additional Officers

Recommendations remain placeholders.

---

## Step 10.7 — Linked Intelligence Panels

Mock AI responses should reference:

- Dashboard
- Analytics
- Crime Map
- Criminal Network
- Operational Dashboard

Display clickable placeholders that demonstrate future navigation.

---

## Step 10.8 — AI Alert Center

Display AI-generated alerts.

Examples:

- Crime Spike
- Emerging Pattern
- High Risk District
- Investigation Delay
- Organized Activity
- Officer Overload

Each alert should display:

- Severity
- Confidence
- Explanation
- Suggested Action

---

## Step 10.9 — Executive Briefing Generator

Create an executive briefing interface.

Display mock reports including:

- Key Highlights
- Emerging Threats
- Resource Recommendations
- Operational Priorities
- Investigation Updates

Frontend only.

---

## Step 10.10 — Similar Case Finder

Mock AI should demonstrate:

- Similar FIRs
- Similar Crime Patterns
- Related Investigations
- Linked Criminals

No backend implementation.

---

## Step 10.11 — AI Prediction Preview

Display prediction cards.

Examples:

- Crime Risk Forecast
- Hotspot Forecast
- Investigation Delay Prediction
- Resource Demand Forecast

Predictions remain illustrative.

---

## Step 10.12 — Conversation History

Display reusable conversation history.

Support:

- Search
- Filter
- Date Grouping

Mock conversations only.

---

## Step 10.13 — Quick AI Actions

Provide shortcuts.

Examples:

- Open Dashboard
- View Crime Map
- Open Criminal Network
- View Analytics
- Generate Report

Navigation may remain placeholder.

---

# Expected Appearance

The AI Copilot should resemble an enterprise intelligence assistant.

Characteristics:

- Clean workspace
- Minimal distractions
- Professional conversation interface
- Clear AI reasoning
- Information-rich responses
- Consistent visual hierarchy
- Modern enterprise styling

Avoid consumer chatbot designs.

---

# Reusable Components

Reuse:

- Cards
- Drawers
- Timeline Components
- Alert Components
- Search Components
- Buttons
- Badges
- Empty States
- Skeleton Loaders
- Filter Components

Avoid duplicate implementations.

---

# Mock AI Policy

Mock AI responses should remain:

- Operational
- Professional
- Explainable
- Logically consistent
- Context-aware
- Connected to existing frontend modules

Avoid generic chatbot responses.

Every response should resemble an intelligence briefing.

---

# Deliverables

Upon completion the project should include:

- AI Copilot Workspace
- Conversation Interface
- Suggested Prompts
- AI Intelligence Summary
- Explainable AI Panel
- Recommendation Center
- Linked Intelligence Panels
- AI Alert Center
- Executive Briefing Generator
- Similar Case Finder
- Prediction Preview
- Conversation History
- Quick AI Actions

---

# Validation Checklist

Verify:

- Conversation interface renders correctly.
- Suggested prompts function.
- Mock AI responses display correctly.
- Explainable AI panels render correctly.
- Recommendation cards display.
- Conversation history works.
- Responsive behavior verified.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 10 is complete only when:

- AI Copilot interface is fully implemented.
- Mock conversations function correctly.
- Explainable AI panels render correctly.
- Recommendation center is complete.
- Executive briefing UI exists.
- Prediction preview exists.
- Responsive behavior verified.
- No backend AI integration exists.

---

# Out of Scope

Do NOT implement:

- Real LLM integration
- Backend AI services
- NLP models
- Vector databases
- RAG pipelines
- Authentication logic
- Database integration
- Report export logic

These belong to backend implementation.

---

# AI Credit Optimization

Before requesting approval:

- Reuse existing cards, drawers, alerts, and timeline components.
- Centralize all mock AI conversations.
- Avoid generating duplicate conversation components.
- Modify only AI-related frontend files.
- Keep implementation summaries under 10 points.
- Stop immediately after validation.

---

# Approval Gate

Before proceeding to Phase 11:

1. Verify Validation Checklist.
2. Verify Exit Criteria.
3. Verify all Quality Assurance Gates.
4. Summarize created pages.
5. Summarize reusable components.
6. Summarize modified files.
7. Confirm successful build.
8. Wait for explicit user approval.

The Agentic IDE must not proceed to Phase 11 automatically.

---

# Phase 11 — Production Readiness & User Experience Polish

## Objective

Finalize the frontend by transforming every implemented feature into a polished, production-ready user experience.

This phase focuses on consistency, usability, responsiveness, accessibility, reporting interfaces, user settings, and final quality assurance.

No new intelligence features should be introduced during this phase.

Instead, the objective is to refine, standardize, optimize, and validate every part of the frontend.

This phase represents the official completion of frontend development.

---

# Primary Users

This phase benefits every platform user.

Including:

- SCRB Officers
- Investigation Officers
- Police Commissioners
- Superintendents
- Intelligence Analysts
- System Administrators

---

# User Stories

### User Story 1

As a platform user,

I want a polished interface,

So that the system feels reliable and professional.

---

### User Story 2

As an executive,

I want downloadable reports,

So that intelligence can be shared with stakeholders.

---

### User Story 3

As an officer,

I want personalized settings,

So that I can customize my workspace.

---

### User Story 4

As a mobile user,

I want the application to remain usable,

So that operational work can continue anywhere.

---

### User Story 5

As a project reviewer,

I want a polished application,

So that the platform demonstrates production readiness.

---

# Production Philosophy

Every implemented page should satisfy:

- Professional appearance
- Consistent spacing
- Consistent typography
- Smooth interactions
- Fast navigation
- Responsive behavior
- Accessibility
- Visual consistency
- Predictable interactions

The application should feel complete.

---

# Implementation Order

Complete every step sequentially.

---

## Step 11.1 — Reports Center

Create a professional Reports interface.

Include:

- Executive Report
- Crime Analytics Report
- Investigation Report
- Officer Performance Report
- District Report
- AI Intelligence Summary
- Operational Report

Provide export placeholders:

- PDF
- Excel
- CSV
- Print

Frontend only.

---

## Step 11.2 — User Profile

Create a reusable user profile page.

Include:

- Avatar Placeholder
- Name
- Email
- Department
- Designation
- Role
- Contact Information
- Last Login

Mock data only.

---

## Step 11.3 — Settings Center

Create application settings.

Examples:

General

Notifications

Appearance

Accessibility

Language

Dashboard Preferences

Map Preferences

Privacy Placeholder

Do not implement backend persistence.

---

## Step 11.4 — Notification Center

Create a reusable notification interface.

Display:

- AI Alerts
- Investigation Alerts
- Operational Alerts
- System Notifications

Support:

- Read
- Unread
- Filter

Mock data only.

---

## Step 11.5 — Search Experience

Review global search.

Verify:

- Search consistency
- Search placeholder behavior
- Empty search results
- Loading behavior

Maintain consistent UX.

---

## Step 11.6 — Empty States

Review every page.

Create professional empty states.

Examples:

No Data

No Alerts

No Reports

No Search Results

No Conversations

Every empty state should guide the user.

---

## Step 11.7 — Loading States

Create consistent loading experiences.

Examples:

Skeletons

Progress Indicators

Loading Cards

Loading Tables

Loading Charts

Loading Maps

Reuse existing loading components.

---

## Step 11.8 — Error States

Create reusable error interfaces.

Examples:

Network Error

Page Error

Data Error

Retry Placeholder

Unexpected Error

Maintain visual consistency.

---

## Step 11.9 — Responsive Audit

Audit every implemented page.

Verify:

Desktop

Laptop

Tablet

Mobile

Correct any responsive inconsistencies.

Avoid horizontal scrolling.

---

## Step 11.10 — Accessibility Audit

Review:

Semantic HTML

Keyboard Navigation

Focus States

ARIA Labels

Contrast

Interactive Elements

Improve accessibility where necessary.

---

## Step 11.11 — Design Consistency Audit

Review:

Spacing

Typography

Colors

Buttons

Cards

Forms

Tables

Charts

Navigation

Ensure every page follows the approved design system.

---

## Step 11.12 — Animation Audit

Review all interactions.

Verify:

Hover

Transitions

Loading

Drawer

Modal

Navigation

Animations should remain subtle and professional.

---

## Step 11.13 — Performance Review

Review frontend performance.

Examples:

Remove duplicate renders

Remove unnecessary components

Reuse existing state

Optimize images

Lazy load heavy visualizations where appropriate

Avoid premature optimization.

---

## Step 11.14 — Component Audit

Review the reusable component library.

Verify:

No duplicates

Consistent naming

Consistent props

No unused components

Reusable architecture maintained

---

## Step 11.15 — Final Frontend QA

Review the complete application.

Verify:

Landing Page

Authentication

Dashboard

Analytics

Crime Map

Criminal Network

Operational Center

AI Copilot

Reports

Settings

All pages should behave consistently.

---

# Expected Appearance

The finished application should resemble enterprise intelligence software.

Characteristics:

- Professional
- Modern
- Clean
- Responsive
- Consistent
- Accessible
- Fast
- Production Ready

The project should feel like a deployable government application.

---

# Reusable Components

Reuse every previously created component.

Avoid introducing new component patterns unless absolutely necessary.

---

# Deliverables

At completion the frontend should include:

- Reports Center
- User Profile
- Settings
- Notification Center
- Empty States
- Loading States
- Error States
- Responsive Improvements
- Accessibility Improvements
- Design Audit
- Animation Audit
- Performance Review
- Component Audit
- Final QA Report

---

# Validation Checklist

Verify:

- Every page builds successfully.
- Responsive behavior verified.
- Accessibility verified.
- Empty states implemented.
- Loading states implemented.
- Error states implemented.
- Reports UI completed.
- Settings completed.
- User profile completed.
- Notifications completed.
- Existing functionality remains unaffected.

---

# Exit Criteria

Phase 11 is complete only when:

- Every planned frontend page exists.
- Every reusable component follows the design system.
- Reports interface is complete.
- User settings are complete.
- Responsive behavior passes all supported devices.
- Accessibility review completed.
- Loading, empty, and error states implemented.
- Final QA completed.
- No known frontend blockers remain.

---

# Out of Scope

Do NOT implement:

- Backend APIs
- Authentication Logic
- AI Model Integration
- PostgreSQL
- FastAPI
- Database Queries
- Report Generation Backend
- Deployment

Frontend implementation ends here.

---

# AI Credit Optimization

Before requesting final approval:

- Reuse all existing components.
- Avoid unnecessary refactoring.
- Modify only files requiring final polish.
- Do not regenerate completed pages.
- Summarize the implementation in fewer than 10 points.
- Stop immediately after the final QA report.

---

# Final Frontend Approval Gate

Before declaring the frontend complete:

1. Verify every Validation Checklist item.
2. Verify every Exit Criterion.
3. Verify every Quality Assurance Gate.
4. Confirm every planned frontend phase has been completed.
5. Summarize created pages.
6. Summarize reusable components.
7. Summarize modified files.
8. Confirm the project builds successfully.
9. Confirm no known frontend issues remain.
10. Wait for explicit user approval before beginning any backend integration.

The Agentic IDE must not continue beyond this document unless explicitly instructed by the user.

---

# Definition of Done (DoD)

The frontend implementation shall only be considered complete when **all** of the following conditions are satisfied.

Completion of individual phases alone does not constitute completion of the frontend.

The Agentic IDE must verify every requirement below before declaring the project complete.

---

## Functional Completion

Verify that the following frontend modules have been successfully implemented.

- Landing Page
- Authentication UI
- Executive Dashboard
- Intelligence Analytics Workspace
- Crime Intelligence Geographic Command Center
- Criminal Intelligence & Link Analysis Center
- Operational Command Center
- AI Crime Intelligence Copilot
- Reports Center
- User Profile
- Settings Center
- Notification Center

No planned frontend module should remain incomplete.

---

## Component Completion

Verify that reusable UI components exist for:

- Buttons
- Inputs
- Cards
- Tables
- Forms
- Drawers
- Dialogs
- Alerts
- Badges
- Navigation
- Filters
- Search
- Empty States
- Loading States
- Error States

No duplicated reusable component should exist.

---

## Design System Completion

Verify:

- Colors are centralized.
- Typography is centralized.
- Spacing follows the design system.
- Shadows are reusable.
- Radius values are reusable.
- Icons remain consistent.
- Animation guidelines are respected.

No hardcoded design inconsistencies should remain.

---

## Responsiveness

Verify successful testing for:

- Desktop
- Laptop
- Tablet
- Mobile

There should be:

- No horizontal scrolling
- No broken layouts
- No inaccessible navigation
- No unusable controls

---

## Accessibility

Verify:

- Semantic HTML
- Keyboard navigation
- Focus indicators
- Accessible labels
- Sufficient color contrast
- Consistent navigation order

Accessibility improvements should be present throughout the application.

---

## Repository Integrity

Verify:

- Repository remains clean.
- Generated artifacts remain ignored.
- Sensitive files remain untracked.
- .gitignore remains valid.
- No build artifacts are committed.
- No cache directories are tracked.
- No environment files are tracked.

Git history must remain under user control.

---

## Code Quality

Verify:

- No duplicated components.
- No duplicated logic.
- No unnecessary complexity.
- Components remain reusable.
- Code remains beginner-friendly.
- Naming conventions remain consistent.

Maintainability must be preserved.

---

## Performance

Verify:

- No unnecessary renders.
- No unnecessary dependencies.
- Large visualizations are optimized.
- Components remain lightweight.
- Existing performance has not degraded.

---

## Documentation

Verify:

- Phase summaries completed.
- Validation reports completed.
- Quality Assurance Gates passed.
- Implementation reports completed.
- Known limitations documented.

---

## Quality Assurance

Every Quality Assurance Gate defined within this document must successfully pass.

No Quality Assurance Gate may remain in a failed state.

---

# Frontend Completion Certificate

The Agentic IDE must complete the following verification before handing the project back to the user.

---

## Project Summary

Report:

- Total frontend phases completed
- Total pages implemented
- Total reusable components created
- Total layouts implemented
- Total mock datasets created
- Total configuration files modified

---

## Build Status

Confirm:

- Project builds successfully.
- No TypeScript errors remain.
- No compilation errors remain.
- No runtime errors introduced.

---

## Repository Status

Confirm:

- Repository is clean.
- Generated files remain ignored.
- Sensitive files remain untracked.
- Existing Git structure preserved.

---

## Quality Status

Confirm:

- Validation Checklist passed.
- Exit Criteria passed.
- Quality Assurance Gates passed.
- Design consistency verified.
- Responsive behavior verified.
- Accessibility verified.

---

## Remaining Limitations

Clearly list any remaining frontend limitations.

If none exist, explicitly report:

"No known frontend limitations."

---

## Backend Readiness

Confirm whether the frontend is ready for backend integration.

Possible values:

- Ready
- Partially Ready
- Not Ready

Provide a brief explanation if the frontend is not fully ready.

---

## Final Declaration

The Agentic IDE must not declare frontend completion unless every requirement defined in this document has been satisfied.

If any item remains incomplete, clearly report the project as:

"Frontend Implementation In Progress"

rather than:

"Frontend Complete"

Accuracy is preferred over premature completion.

---

# Post-Implementation Rules

After the frontend has been approved by the user, the Agentic IDE must follow the rules below.

---

## No Unrequested Refactoring

Do not refactor working code unless explicitly requested.

Avoid stylistic modifications after project completion.

---

## Preserve Existing Architecture

Do not reorganize folders or files.

Do not rename reusable components.

Do not replace existing implementations unnecessarily.

---

## Change Isolation

Future modifications should affect only the requested feature.

Avoid unrelated changes.

Minimize modification scope.

---

## Backward Compatibility

Any future enhancement must preserve existing frontend behavior unless the user explicitly requests otherwise.

---

## Repository Protection

Do not modify:

- .gitignore
- package configuration
- build configuration
- project structure

unless explicitly instructed.

---

## Approval Requirement

After the frontend is declared complete, the Agentic IDE must wait for explicit user instructions before:

- Backend integration
- AI integration
- API implementation
- Authentication integration
- Database connectivity
- Deployment
- Performance optimization beyond the approved frontend scope

No additional work may begin automatically.

---

# End of Document

This document serves as the authoritative specification for the frontend implementation of the AI-Driven Crime Intelligence & Investigation Platform.

The Agentic IDE shall treat this document as the primary implementation reference throughout frontend development.

No implementation should deviate from the requirements, rules, quality standards, or approval workflow defined herein without explicit user authorization.