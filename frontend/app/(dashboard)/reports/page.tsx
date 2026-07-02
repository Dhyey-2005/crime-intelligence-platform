"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Form";
import { Badge } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, CardTitle as TypoCardTitle, Paragraph, Caption } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Activity,
  CheckCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

interface ReportTemplate {
  id: string;
  title: string;
  category: "Executive" | "Operational" | "Intelligence" | "Officer" | "District" | "Analytics";
  description: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "On-Demand";
  lastGenerated: string;
}

const mockReportTemplates: ReportTemplate[] = [
  { id: "REP-01", title: "Executive Statewide Briefing Dossier", category: "Executive", description: "Consolidated strategic summary of statewide crimes, risk levels, and response indices for DGP Office.", frequency: "Weekly", lastGenerated: "2026-07-01" },
  { id: "REP-02", title: "Monthly Regional Analytics Summary", category: "Analytics", description: "Detailed time-series, comparative growth bars, and crime category distribution reports.", frequency: "Monthly", lastGenerated: "2026-06-30" },
  { id: "REP-03", title: "Active Investigation Backlog Audit", category: "Operational", description: "List of open case files, lifecycle progress steps, and delay warning logs.", frequency: "Daily", lastGenerated: "2026-07-02" },
  { id: "REP-04", title: "Officer Caseload Performance Ledger", category: "Officer", description: "Officer performance efficiency, solved case counts, ratings, and workload utilization indexes.", frequency: "Weekly", lastGenerated: "2026-07-01" },
  { id: "REP-05", title: "District Risk Index Coordinates Report", category: "District", description: "Precinct completion rates, average response minutes, and geographical crime hotspot overlays.", frequency: "Weekly", lastGenerated: "2026-07-01" },
  { id: "REP-06", title: "AI Cognitive Intelligence Briefing", category: "Intelligence", description: "AI alerts, phishing surge logs, vehicle corridor audits, and suggested patrol directives.", frequency: "Daily", lastGenerated: "2026-07-02" },
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("all");

  const filteredReports = React.useMemo(() => {
    return mockReportTemplates.filter((rep) => {
      if (selectedCategory && rep.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedCategory]);

  const handleExport = (reportTitle: string, format: string) => {
    toast.success(`Dossier Export Triggered`, {
      description: `Downloaded "${reportTitle}" as ${format} successfully.`,
    });
  };

  const handlePrint = (reportTitle: string) => {
    toast.info(`Preparing Print layout`, {
      description: `Opening system print options for "${reportTitle}".`,
    });
  };

  return (
    <div className="space-y-6">
      <Toaster theme="dark" closeButton />

      {/* Header */}
      <div>
        <h2 className="text-page-title">Reports & Dossier Generator</h2>
        <Paragraph className="text-text-secondary">
          Access official command documents, strategic summaries, and operational summaries. Export in PDF, Excel, CSV formats.
        </Paragraph>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-text-secondary block mb-1">Report Category</label>
            <Select
              options={[
                { value: "", label: "All Categories" },
                { value: "Executive", label: "Executive Reports" },
                { value: "Analytics", label: "Crime Analytics" },
                { value: "Operational", label: "Operational Command" },
                { value: "Officer", label: "Officer Performance" },
                { value: "District", label: "District Summaries" },
                { value: "Intelligence", label: "AI Intelligence" },
              ]}
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
            />
          </div>

          <div className="flex-1">
            <label className="text-[10px] font-semibold text-text-secondary block mb-1">Timeframe Period</label>
            <Select
              options={[
                { value: "all", label: "All Generated Files" },
                { value: "today", label: "Today's Briefings" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ]}
              value={selectedTimeframe}
              onChange={(val) => setSelectedTimeframe(val)}
            />
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory(""); setSelectedTimeframe("all"); }} className="self-end text-[10px] h-9 px-3">
            Reset Filters
          </Button>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <Badge variant={report.category === "Executive" ? "danger" : report.category === "Intelligence" ? "ai" : "primary"}>
                  {report.category}
                </Badge>
                <CardTitle className="text-sm font-bold text-text-primary block mt-1">{report.title}</CardTitle>
              </div>
              <FileText className="h-6 w-6 text-text-secondary" />
            </CardHeader>
            <CardContent className="space-y-4 pt-0 text-xs">
              <p className="text-[11px] text-text-secondary leading-relaxed">{report.description}</p>
              
              <div className="flex justify-between items-center text-[10px] text-text-secondary border-t border-border-subtle pt-3">
                <span>Frequency: <strong className="text-text-primary">{report.frequency}</strong></span>
                <span>Last Generated: <strong className="text-text-primary">{report.lastGenerated}</strong></span>
              </div>

              {/* Action buttons bar */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border-subtle/50">
                <Button variant="outline" size="sm" onClick={() => handleExport(report.title, "PDF")} leftIcon={<Download className="h-3.5 w-3.5" />} className="text-[10px] h-8 py-0">
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport(report.title, "Excel")} leftIcon={<Download className="h-3.5 w-3.5" />} className="text-[10px] h-8 py-0">
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport(report.title, "CSV")} leftIcon={<Download className="h-3.5 w-3.5" />} className="text-[10px] h-8 py-0">
                  CSV
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePrint(report.title)} leftIcon={<Printer className="h-3.5 w-3.5" />} className="text-[10px] h-8 py-0 ml-auto">
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
