"use client";

import * as React from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-primary">
      {/* 1. Sidebar Panel */}
      <Sidebar />

      {/* 2. Main Workspace Panel */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Header bar */}
        <TopBar />

        {/* Breadcrumb Trail */}
        <Breadcrumb />

        {/* Dynamic Scrollable Page Viewport */}
        <main className="flex-1 overflow-y-auto bg-background-primary p-card md:p-section">
          {children}
        </main>
      </div>
    </div>
  );
}
