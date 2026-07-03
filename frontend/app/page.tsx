"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Feedback";
import { PageHeading, SectionHeading, Paragraph } from "@/components/ui/Typography";
import { Divider } from "@/components/ui/Utility";
import {
  ShieldCheck,
  Map,
  Network,
  Cpu,
  Lock,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col text-xs text-text-secondary select-none">
      {/* 1. Top Navigation Bar */}
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-border-subtle bg-background-secondary/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <div className="h-full w-full bg-[#0a0f1d] rounded-[10.5px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient opacity-60" />
              <ShieldCheck className="h-5 w-5 text-cyan-400 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-accent-primary uppercase block leading-none">
              Karnataka Police HQ
            </span>
            <span className="text-sm font-extrabold text-text-primary tracking-tight">
              CrimeShield Intelligence
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button size="sm" onClick={handleStart} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Open Dashboard
          </Button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold">
            <Zap className="h-3.5 w-3.5" />
            <span>State Crime Records Bureau • Advanced GIS Command</span>
          </div>
          <PageHeading className="text-3xl md:text-5xl font-black text-text-primary tracking-tight leading-none">
            AI-Driven Crime Intelligence &amp; Investigation Platform
          </PageHeading>
          <Paragraph className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed">
            A centralized, enterprise-grade tactical command console designed for law enforcement leadership. Correlate FIRs, map real-time geospatial hotspots, uncover suspect syndicates, and generate court-admissible chargesheets with automated AI synthesis.
          </Paragraph>
          <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
            <Button size="lg" onClick={handleStart} rightIcon={<ArrowRight className="h-4 w-4" />}>
              Launch Command Console
            </Button>
          </div>
        </div>

        {/* Hero Visual Mockup: Professional Enterprise Uptime & Health Card */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[340px] rounded-2xl bg-gradient-to-b from-background-card to-background-secondary border border-border-default border-t-2 border-t-accent-primary shadow-2xl flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Subtle radial glow background */}
            <div className="absolute inset-0 bg-radial-gradient opacity-60 pointer-events-none" />

            {/* Self-contained concentric rings around the Shield Icon */}
            <div className="relative flex items-center justify-center w-36 h-36 my-2">
              <div className="absolute inset-0 rounded-full border border-accent-primary/15 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-dashed border-accent-primary/25 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="h-16 w-16 rounded-full bg-accent-primary/10 border border-accent-primary flex items-center justify-center text-accent-primary shadow-glow-blue relative z-10">
                <ShieldCheck className="h-8 w-8 animate-pulse text-cyan-400 stroke-[2.2]" />
              </div>
            </div>

            {/* Clean, well-spaced typography below the rings */}
            <div className="mt-6 space-y-2 relative z-10 w-full">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest leading-none">
                Platform Status
              </h3>
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-semibold text-success tracking-wider uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span>Active • Network Secure</span>
                </div>
              </div>
            </div>
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
          <Badge variant="primary">Core Capabilities</Badge>
          <SectionHeading>Executive Intelligence Suite</SectionHeading>
          <Paragraph className="max-w-xl mx-auto">
            Comprehensive investigation modules tailored for precinct leadership and intelligence analysts.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shadow-glow-blue">
              <Map className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Geospatial Crime Mapping</h3>
            <Paragraph className="text-xs text-text-secondary leading-relaxed">
              Visualize predictive density heatmaps across 14 police districts and 42 stations. Filter temporal clusters by crime category to deploy preventive patrols.
            </Paragraph>
          </Card>

          <Card hoverable className="p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-ai/10 border border-ai/20 flex items-center justify-center text-ai shadow-glow-purple">
              <Network className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Syndicate Network Graph</h3>
            <Paragraph className="text-xs text-text-secondary leading-relaxed">
              Map complex relationships between suspects, gang syndicates, aliases, and financial accounts using graph analytics to identify key facilitators.
            </Paragraph>
          </Card>

          <Card hoverable className="p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">AI Copilot Synthesis</h3>
            <Paragraph className="text-xs text-text-secondary leading-relaxed">
              Query cross-jurisdictional databases in natural language. Automatically draft formal legal chargesheets and executive case summary briefs in seconds.
            </Paragraph>
          </Card>
        </div>
      </section>

      <Divider className="my-0" />

      {/* 5. How It Works Section */}
      <section className="py-16 bg-background-secondary/20 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="analytics">Methodology</Badge>
          <SectionHeading>Operational Workflow Pipeline</SectionHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="space-y-3 p-4 bg-background-card/50 rounded-lg border border-border-subtle">
            <div className="flex items-center space-x-2 text-accent-primary font-bold text-sm">
              <span className="h-6 w-6 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs">01</span>
              <span>Ingestion</span>
            </div>
            <Paragraph className="text-xs text-text-secondary">
              Continuous sync with CCTNS records, station FIR registries, and dispatch logs.
            </Paragraph>
          </div>

          <div className="space-y-3 p-4 bg-background-card/50 rounded-lg border border-border-subtle">
            <div className="flex items-center space-x-2 text-accent-primary font-bold text-sm">
              <span className="h-6 w-6 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs">02</span>
              <span>Processing</span>
            </div>
            <Paragraph className="text-xs text-text-secondary">
              Natural language entity extraction maps suspects, locations, and vehicles.
            </Paragraph>
          </div>

          <div className="space-y-3 p-4 bg-background-card/50 rounded-lg border border-border-subtle">
            <div className="flex items-center space-x-2 text-accent-primary font-bold text-sm">
              <span className="h-6 w-6 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs">03</span>
              <span>Analysis</span>
            </div>
            <Paragraph className="text-xs text-text-secondary">
              Graph link prediction and spatial algorithms flag emerging crime hotspots.
            </Paragraph>
          </div>

          <div className="space-y-3 p-4 bg-background-card/50 rounded-lg border border-border-subtle">
            <div className="flex items-center space-x-2 text-accent-primary font-bold text-sm">
              <span className="h-6 w-6 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs">04</span>
              <span>Action</span>
            </div>
            <Paragraph className="text-xs text-text-secondary">
              Commanders assign targeted patrols and export court-ready legal summaries.
            </Paragraph>
          </div>
        </div>
      </section>

      <Divider className="my-0" />

      {/* 6. Benefits Grid Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <SectionHeading>Platform Operational Benefits</SectionHeading>
          <Paragraph className="max-w-md mx-auto">
            Quantifiable improvements in policing efficiency across deployed districts.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg bg-background-card border border-border-subtle space-y-2 hover:border-accent-primary/40 transition-colors">
            <div className="text-2xl font-black text-text-primary tracking-tight">85%</div>
            <div className="text-xs font-semibold text-accent-primary">Faster Case Correlation</div>
            <Paragraph className="text-[11px] text-text-secondary">Automated cross-referencing replaces manual archive searches.</Paragraph>
          </div>

          <div className="p-5 rounded-lg bg-background-card border border-border-subtle space-y-2 hover:border-success/40 transition-colors">
            <div className="text-2xl font-black text-text-primary tracking-tight">3.2x</div>
            <div className="text-xs font-semibold text-success">Patrol Precision</div>
            <Paragraph className="text-[11px] text-text-secondary">GIS heatmaps deploy units to predictive hotspot zones.</Paragraph>
          </div>

          <div className="p-5 rounded-lg bg-background-card border border-border-subtle space-y-2 hover:border-ai/40 transition-colors">
            <div className="text-2xl font-black text-text-primary tracking-tight">100%</div>
            <div className="text-xs font-semibold text-ai">Audit Compliance</div>
            <Paragraph className="text-[11px] text-text-secondary">Immutable logs track every query and evidence access.</Paragraph>
          </div>

          <div className="p-5 rounded-lg bg-background-card border border-border-subtle space-y-2 hover:border-warning/40 transition-colors">
            <div className="text-2xl font-black text-text-primary tracking-tight">&lt; 5m</div>
            <div className="text-xs font-semibold text-warning">Brief Generation</div>
            <Paragraph className="text-[11px] text-text-secondary">Draft chargesheets and executive briefs in minutes.</Paragraph>
          </div>
        </div>
      </section>

      <Divider className="my-0" />

      {/* 7. Call to Action (CTA) */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto w-full text-center space-y-6">
        <div className="h-12 w-12 rounded-full bg-accent-primary/20 border border-accent-primary mx-auto flex items-center justify-center text-accent-primary shadow-glow-blue">
          <Lock className="h-6 w-6" />
        </div>
        <PageHeading className="text-2xl md:text-3xl font-black">
          Ready to deploy the Command Console?
        </PageHeading>
        <Paragraph className="max-w-xl mx-auto">
          Access is restricted to authorized state intelligence analysts and command officers.
        </Paragraph>
        <div className="pt-2">
          <Button size="lg" onClick={handleStart} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Open Command Center Dashboard
          </Button>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto py-8 px-6 md:px-12 border-t border-border-subtle bg-background-secondary/30 text-center md:flex md:items-center md:justify-between text-xs text-text-secondary">
        <div className="flex items-center justify-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400 stroke-[2.2]" />
          <span className="font-bold text-text-primary tracking-wide">CrimeShield Intelligence Platform</span>
          <span>— State Crime Records Bureau</span>
        </div>
        <div className="mt-4 md:mt-0 space-x-6">
          <span>Confidential Command Console</span>
          <span>•</span>
          <span>Restricted Law Enforcement Access Only</span>
        </div>
      </footer>
    </div>
  );
}
