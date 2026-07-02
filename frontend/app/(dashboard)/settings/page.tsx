"use client";

import * as React from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select, Switch } from "@/components/ui/Form";
import { Badge } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption, FormLabel } from "@/components/ui/Typography";
import { Tabs } from "@/components/ui/Navigation";
import Button from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Utility";
import {
  User,
  Settings,
  Bell,
  Eye,
  Languages,
  Sliders,
  Lock,
  Accessibility,
  Save,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();

  // 1. Settings states
  const [language, setLanguage] = React.useState("en");
  const [dashboardPref, setDashboardPref] = React.useState("executive");
  const [mapDefaultLayer, setMapDefaultLayer] = React.useState("dark");

  // Notifications Toggles
  const [aiAlerts, setAiAlerts] = React.useState(true);
  const [investigationAlerts, setInvestigationAlerts] = React.useState(true);
  const [operationalAlerts, setOperationalAlerts] = React.useState(true);
  const [systemAlerts, setSystemAlerts] = React.useState(false);

  // Accessibility Toggles
  const [screenReader, setScreenReader] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);

  // Save handler
  const handleSaveSettings = () => {
    toast.success("Preferences Saved", {
      description: "Application configuration updated locally successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Toaster theme="dark" closeButton />

      {/* Header */}
      <div>
        <h2 className="text-page-title">Settings & User Profile</h2>
        <Paragraph className="text-text-secondary">
          Manage your operational credentials, notification preferences, dashboard themes, and local command settings.
        </Paragraph>
      </div>

      {/* Tabs Layout */}
      <Tabs
        items={[
          // Tab 1: User Profile
          {
            id: "profile",
            label: "User Profile",
            icon: <User className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Operational Terminal Credentials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar & Basic details row */}
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-border-subtle">
                      <Avatar
                        name={user?.name || "Inspector Desai"}
                        size="lg"
                        src={user?.email === "admin@agency.gov" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256" : undefined}
                      />
                      <div className="text-center sm:text-left space-y-1">
                        <h3 className="text-base font-bold text-text-primary">{user?.name || "Inspector Desai"}</h3>
                        <Caption className="text-text-secondary uppercase tracking-wider block">Designation: {user?.role || "Command Analyst"}</Caption>
                        <Badge variant="primary" className="mt-1">Operational Role: {user?.role || "Inspector"}</Badge>
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-text-secondary leading-relaxed">
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase font-bold block">Agency Email</span>
                          <span className="text-text-primary font-medium">{user?.email || "desai@karnataka.gov.in"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase font-bold block">Department / Branch</span>
                          <span className="text-text-primary font-medium">State Crime Records Bureau (SCRB)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase font-bold block">Assigned Precinct Command</span>
                          <span className="text-text-primary font-medium">Karnataka Police HQ, Bengaluru</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase font-bold block">Security Clearance</span>
                          <span className="text-text-primary font-bold text-danger">Level-3 (Restricted Personnel)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase font-bold block">Last Terminal Login</span>
                          <span className="text-text-primary font-medium">{new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase font-bold block">Contact Information</span>
                          <span className="text-text-primary font-medium">+91 94480 22334 (HQ Desk)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          // Tab 2: Application Preferences
          {
            id: "preferences",
            label: "Terminal Preferences",
            icon: <Sliders className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Console Configuration Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Language selection */}
                      <div>
                        <FormLabel htmlFor="lang-select">System Language</FormLabel>
                        <Select
                          id="lang-select"
                          options={[
                            { value: "en", label: "English (US / IN)" },
                            { value: "kn", label: "Kannada (ಕನ್ನಡ)" },
                            { value: "hi", label: "Hindi (हिन्दी)" },
                          ]}
                          value={language}
                          onChange={(val) => setLanguage(val)}
                        />
                      </div>

                      {/* Default Dashboard */}
                      <div>
                        <FormLabel htmlFor="dash-select">Default Dashboard View</FormLabel>
                        <Select
                          id="dash-select"
                          options={[
                            { value: "executive", label: "Executive Dashboard" },
                            { value: "operational", label: "Operational Command" },
                            { value: "analytics", label: "Analytics Workspace" },
                          ]}
                          value={dashboardPref}
                          onChange={(val) => setDashboardPref(val)}
                        />
                      </div>

                      {/* Map Preferences */}
                      <div>
                        <FormLabel htmlFor="map-select">Default GIS Map Layer</FormLabel>
                        <Select
                          id="map-select"
                          options={[
                            { value: "dark", label: "CARTODB Dark (Dark Theme)" },
                            { value: "topo", label: "OpenStreetMap Standard" },
                            { value: "satellite", label: "Satellite Hybrid (Placeholder)" },
                          ]}
                          value={mapDefaultLayer}
                          onChange={(val) => setMapDefaultLayer(val)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border-subtle">
                      <Button onClick={handleSaveSettings} leftIcon={<Save className="h-4 w-4" />}>
                        Save Terminal Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          // Tab 3: Notifications
          {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI & Operational Notification Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3.5 max-w-xl text-xs text-text-secondary select-none">
                      <label className="flex items-center justify-between p-3 bg-background-secondary/20 border border-border-subtle rounded cursor-pointer hover:bg-background-secondary/40">
                        <div>
                          <span className="font-semibold text-text-primary block">AI Intelligence Alerts</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5 font-normal">Spikes, emerging hotspots, network links anomalies.</span>
                        </div>
                        <Switch checked={aiAlerts} onChange={(e) => setAiAlerts(e.target.checked)} />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-background-secondary/20 border border-border-subtle rounded cursor-pointer hover:bg-background-secondary/40">
                        <div>
                          <span className="font-semibold text-text-primary block">Investigation Progress Alerts</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5 font-normal">Status updates, milestones, chargesheet submissions.</span>
                        </div>
                        <Switch checked={investigationAlerts} onChange={(e) => setInvestigationAlerts(e.target.checked)} />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-background-secondary/20 border border-border-subtle rounded cursor-pointer hover:bg-background-secondary/40">
                        <div>
                          <span className="font-semibold text-text-primary block">Command Center Warnings</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5 font-normal">Officer overload warnings, vehicle capacities, backlogs.</span>
                        </div>
                        <Switch checked={operationalAlerts} onChange={(e) => setOperationalAlerts(e.target.checked)} />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-background-secondary/20 border border-border-subtle rounded cursor-pointer hover:bg-background-secondary/40">
                        <div>
                          <span className="font-semibold text-text-primary block">System & Security Logs</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5 font-normal">Logins, settings changes, clearance audit reports.</span>
                        </div>
                        <Switch checked={systemAlerts} onChange={(e) => setSystemAlerts(e.target.checked)} />
                      </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border-subtle">
                      <Button onClick={handleSaveSettings} leftIcon={<Save className="h-4 w-4" />}>
                        Save Notification Rules
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          // Tab 4: Accessibility
          {
            id: "accessibility",
            label: "Accessibility",
            icon: <Accessibility className="h-4 w-4" />,
            content: (
              <div className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility & Visual Auditing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3.5 max-w-xl text-xs text-text-secondary select-none">
                      <label className="flex items-center justify-between p-3 bg-background-secondary/20 border border-border-subtle rounded cursor-pointer hover:bg-background-secondary/40">
                        <div>
                          <span className="font-semibold text-text-primary block">Screen Reader Compatibility</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5 font-normal">Optimizes ARIA landmarks and tag structures for verbal narration.</span>
                        </div>
                        <Switch checked={screenReader} onChange={(e) => setScreenReader(e.target.checked)} />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-background-secondary/20 border border-border-subtle rounded cursor-pointer hover:bg-background-secondary/40">
                        <div>
                          <span className="font-semibold text-text-primary block">High Contrast HUD Colors</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5 font-normal">Increases text contrast margins for low-light monitors.</span>
                        </div>
                        <Switch checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
                      </label>

                      {/* Privacy Placeholder notice */}
                      <div className="p-3.5 bg-background-secondary border border-border-subtle rounded text-[10px] leading-relaxed space-y-1">
                        <span className="font-bold text-text-primary block flex items-center">
                          <Lock className="h-4 w-4 text-warning mr-1" /> Privacy Directive Notice
                        </span>
                        <span>This console compiles with statewide data secrecy acts. Log histories are monitored by the state cyber division. Preferences modified above apply only to this terminal session.</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border-subtle">
                      <Button onClick={handleSaveSettings} leftIcon={<Save className="h-4 w-4" />}>
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
        ]}
      />

    </div>
  );
}
