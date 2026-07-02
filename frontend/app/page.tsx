"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, Paragraph, Caption } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Utility";
import {
  ShieldAlert,
  BarChart3,
  Map,
  Network,
  Cpu,
  FileText,
  Users,
  Search,
  Lock,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleStart = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col text-xs text-text-secondary select-none">
      
      {/* 1. Header Navigation Bar */}
      <header className="h-16 border-b border-border-subtle bg-background-secondary/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 select-none">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded bg-accent-primary flex items-center justify-center text-text-primary">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-sm font-bold text-text-primary tracking-wider uppercase">
            CrimeShield
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:underline"
          >
            Sign In
          </Link>
          <Button size="sm" onClick={handleStart}>
            Get Started
          </Button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <Badge variant="primary" className="mb-2">
            Intelligence Command Center v1.0
          </Badge>
          <PageHeading className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-text-primary">
            AI-Driven Crime Intelligence & Investigation Platform
          </PageHeading>
          <Paragraph className="text-sm text-text-secondary leading-relaxed max-w-xl">
            Transform traditional crime records into a powerful intelligence network. Our military-grade platform empowers law enforcement with real-time geospatial tracking, relationship analysis, and cognitive AI decision support.
          </Paragraph>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" onClick={handleStart} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Launch Command Console
            </Button>
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Register Credentials
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-gradient-to-br from-accent-primary/20 via-background-card to-background-secondary border border-border-default shadow-xl flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Styled HUD radar graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] animate-pulse" />
            <div className="absolute h-48 w-48 rounded-full border border-accent-primary/10 flex items-center justify-center animate-spin duration-10000">
              <div className="absolute h-36 w-36 rounded-full border border-dashed border-accent-primary/10" />
            </div>
            <div className="h-16 w-16 rounded-full bg-accent-primary/10 border border-accent-primary flex items-center justify-center text-accent-primary relative shadow-md">
              <ShieldAlert className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-text-primary mt-4 uppercase tracking-widest leading-none">
              Platform Status
            </h3>
            <span className="text-[10px] text-success font-semibold tracking-wider uppercase mt-1">
              Active Network Secure
            </span>
          </div>
        </div>
      </section>

      <Divider className="my-0" />

      {/* 3. Platform Overview */}
      <section className="py-16 bg-background-secondary/20 px-6 md:px-12 max-w-7xl mx-auto w-full text-center space-y-6">
        <Badge variant="secondary">Directives</Badge>
        <SectionHeading className="max-w-2xl mx-auto">
          Tactical Operations Mission Overview
        </SectionHeading>
        <Paragraph className="text-xs text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Traditional crime tracking systems isolate data, slowing investigation speeds. CrimeShield consolidates department case histories, geographical GIS coordinate sheets, and suspect networks to deliver unified intelligence, shortening resolution times from months to hours.
        </Paragraph>
      </section>

      <Divider className="my-0" />

      {/* 4. Key Features Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="analytics">Capabilities</Badge>
          <SectionHeading>Advanced Intelligence Modules</SectionHeading>
          <Paragraph className="text-xs text-text-secondary max-w-md mx-auto">
            A comprehensive suite of intelligence tools designed for investigative accuracy.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Geospatial GIS Map */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-none">
              <CardTitle className="text-xs">Crime Mapping</CardTitle>
              <div className="h-7 w-7 rounded bg-analytics/10 flex items-center justify-center text-analytics">
                <Map className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Paragraph className="text-[11px] leading-relaxed">
                Plot incident coordinates in real-time. Identify local hot-spots, sector patrol distributions, and geographical crime correlations instantly.
              </Paragraph>
            </CardContent>
          </Card>

          {/* Card 2: Link Analysis */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-none">
              <CardTitle className="text-xs">Relationship Networks</CardTitle>
              <div className="h-7 w-7 rounded bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                <Network className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Paragraph className="text-[11px] leading-relaxed">
                Perform suspect relationship link analysis. Connect crime incidents, aliases, known coordinates, and co-conspirators in an interactive visual network.
              </Paragraph>
            </CardContent>
          </Card>

          {/* Card 3: AI Intelligence */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-none">
              <CardTitle className="text-xs">AI Assistant</CardTitle>
              <div className="h-7 w-7 rounded bg-ai/10 flex items-center justify-center text-ai">
                <Cpu className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Paragraph className="text-[11px] leading-relaxed">
                Query records using natural language. Query case briefs, cross-reference evidence arrays, and generate clean intelligence summaries via cognitive AI layers.
              </Paragraph>
            </CardContent>
          </Card>

          {/* Card 4: Officer Tracking */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-none">
              <CardTitle className="text-xs">Officer Analytics</CardTitle>
              <div className="h-7 w-7 rounded bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Paragraph className="text-[11px] leading-relaxed">
                Track department resource allocations. Assess squad performance, load balancing, patrol efficiencies, and active case distributions.
              </Paragraph>
            </CardContent>
          </Card>

          {/* Card 5: Case Search */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-none">
              <CardTitle className="text-xs">Active Investigations</CardTitle>
              <div className="h-7 w-7 rounded bg-warning/10 flex items-center justify-center text-warning">
                <Search className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Paragraph className="text-[11px] leading-relaxed">
                Manage case folders and directories. Monitor case logs, timelines, evidence attachments, and witness lists in a centralized portal.
              </Paragraph>
            </CardContent>
          </Card>

          {/* Card 6: Official Reports */}
          <Card hoverable>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-none">
              <CardTitle className="text-xs">Case Reports</CardTitle>
              <div className="h-7 w-7 rounded bg-success/10 flex items-center justify-center text-success">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Paragraph className="text-[11px] leading-relaxed">
                Compile and export official intelligence dossiers. Generate court-admissible records packets and sector reports at the click of a button.
              </Paragraph>
            </CardContent>
          </Card>
        </div>
      </section>

      <Divider className="my-0" />

      {/* 5. Platform Workflow Section */}
      <section className="py-16 bg-background-secondary/10 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="ai">Process</Badge>
          <SectionHeading>Operational Workflow Pipeline</SectionHeading>
          <Paragraph className="text-xs text-text-secondary max-w-sm mx-auto">
            From raw data collection to actionable decision intelligence.
          </Paragraph>
        </div>

        {/* Workflow Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
          {[
            { step: "01", name: "Data Aggregation", desc: "Ingest crime records and geographical logs." },
            { step: "02", name: "Link Extraction", desc: "Parse text records for relationship links." },
            { step: "03", name: "GIS Visualization", desc: "Map hotspot clusters onto tactical screens." },
            { step: "04", name: "AI Consultation", desc: "Run natural language queries for context." },
            { step: "05", name: "Tactical Actions", desc: "Allocate squad assets and close cases." },
          ].map((item, index) => (
            <div key={item.step} className="relative flex flex-col p-5 bg-background-card border border-border-subtle rounded-lg space-y-2 shadow-sm">
              <div className="text-xl font-black text-accent-primary/20 leading-none">
                {item.step}
              </div>
              <h4 className="font-semibold text-text-primary text-xs leading-tight">
                {item.name}
              </h4>
              <p className="text-[10px] text-text-secondary leading-normal">
                {item.desc}
              </p>
              {index < 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-border-default">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider className="my-0" />

      {/* 6. Benefits List Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="success">Efficacy</Badge>
          <SectionHeading>Platform Operational Benefits</SectionHeading>
          <Paragraph className="text-xs text-text-secondary max-w-sm mx-auto">
            Designed to meet the security and performance requirements of modern agencies.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Lock, color: "text-accent-primary bg-accent-primary/10", title: "Federal Grade Security", desc: "Data access layers are secured at every checkpoint. Comprehensive audit tracking monitors access logs for security clearance compliance." },
            { icon: Zap, color: "text-warning bg-warning/10", title: "Lightning Fast Link Speeds", desc: "High-speed graph queries allow retrieving complex connection arrays in milliseconds. Navigate massive suspect logs smoothly." },
            { icon: CheckCircle2, color: "text-success bg-success/10", title: "Verified Actionable Accuracy", desc: "Mock model layers and structured visual timelines allow analysts to verify information before generating court dossiers." },
          ].map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center space-y-3 p-4 bg-background-secondary/10 rounded-lg border border-border-subtle">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${b.color} shadow-sm`}>
                <b.icon className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-text-primary text-xs leading-tight">{b.title}</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Call-To-Action Wrapper */}
      <section className="py-16 bg-background-card border-t border-b border-border-subtle select-none">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Ready to deploy the Command Console?
          </h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Enter the authorized console to manage crime maps, suspect networks, officer databases, and case files.
          </p>
          <Button size="lg" onClick={handleStart} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Authenticate Terminal Access
          </Button>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-12 bg-background-secondary border-t border-border-subtle px-6 md:px-12 select-none flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 rounded bg-accent-primary flex items-center justify-center text-text-primary">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-text-primary tracking-wider uppercase">
              CrimeShield Console
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] text-text-secondary">
            <span>Platform: v1.0.0</span>
            <span>Secure Network Active</span>
            <span>&copy; 2026 CrimeShield HQ. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
