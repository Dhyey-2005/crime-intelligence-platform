# CrimeShield Frontend Console

Welcome to the **CrimeShield Tactical Command & Crime Intelligence Workspace**. This frontend application serves as the state-of-the-art visual command interface designed for senior police officials, tactical investigators, and intelligence analysts.

---

## 🚀 Key Modules Built

The workspace is structured into several tactical screens:

1. **Operational HQ Dashboard:** A comprehensive tactical overview presenting State KPIs (FIR counts, Active cases, Risk indicators), live alert feeds, and district completion status lists.
2. **Geographic Command Center:** An interactive GIS mapping workspace centered around a Karnataka base map (using Leaflet), allowing district polygon selection and police station popup audits.
3. **Link Analysis Center:** A criminal relationship explorer powered by Cytoscape.js, helping analysts track direct associations, phone logs, vehicles, and gangs in an interactive network canvas.
4. **Intelligence Analytics Workspace:** A multidimensional filters dashboard with charts tracking crime trends, category distributions, and crime growth.
5. **AI Sentinel Copilot Workspace:** A natural-language AI assistant console with search tools, date-grouped conversation history, and explainable intelligence directive selectors.
6. **Operational Command:** Case-tracking timeline workflows, officer leaderboards, and rating grids.

---

## 🛠️ Technology Stack

* **Core Framework:** Next.js 14 (App Router) & TypeScript
* **Styling & Theme:** TailwindCSS (Deep Obsidian `#07090e`, Card `#121824`, Cobalt `#3b82f6` accent)
* **GIS Engine:** React-Leaflet
* **Network Graph Engine:** Cytoscape.js
* **Data Visualizations:** Apache ECharts (via `echarts-for-react`)
* **State Management:** Zustand
* **Notifications:** Sonner Toast System

---

## 🎨 Layout & Design Guidelines

* **Visual Hierarchy:** All pages follow the standard 3-row layout flow (Header → Context/History → Canvas/Primary Grid → Support panels).
* **Minimalist Aesthetics:** Cards use subtle semi-transparent borders (`border-border-subtle/50`) without heavy drop-shadows or outlines.
* **Responsive Breakpoints:**
  * Support modules lay out as 4 equal columns on desktop (`xl`).
  * Wrap into 2x2 grids on laptops/tablets (`md`).
  * Stack as 1 column on mobile.

---

## 💻 Getting Started

To launch the local development server:

```bash
cd frontend
npm install
npm run dev
```

To run the production build:

```bash
npm run build
npm run start
```
