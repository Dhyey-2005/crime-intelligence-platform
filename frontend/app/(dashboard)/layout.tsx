"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Spinner } from "@/components/ui/Feedback";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, router]);

  if (checking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background-primary">
        <Spinner size="lg" />
      </div>
    );
  }

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
