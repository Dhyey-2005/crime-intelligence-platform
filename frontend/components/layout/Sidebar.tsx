"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutStore } from "@/store/layoutStore";
import {
  LayoutDashboard,
  BarChart3,
  Map,
  Network,
  Search,
  Users,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Crime Analytics", icon: BarChart3 },
  { href: "/map", label: "Crime Map", icon: Map },
  { href: "/network", label: "Criminal Network", icon: Network },
  { href: "/investigation", label: "Investigation", icon: Search },
  { href: "/officers", label: "Officer Analytics", icon: Users },
  { href: "/ai", label: "AI Intelligence", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleCollapsed, setMobileOpen } = useLayoutStore();

  const handleLinkClick = () => {
    setMobileOpen(false); // Close sidebar on mobile after clicking
  };

  // Nav list rendering helper
  const renderNavList = () => (
    <ul className="space-y-1.5 px-3 py-4 flex-grow">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium transition-[transform,background-color,color,border-color] duration-150 ease-out focus:outline-none focus:ring-1 focus:ring-accent-primary select-none",
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-transparent text-accent-primary font-semibold border-l-2 border-accent-primary shadow-[inset_4px_0_0_0_#3b82f6]"
                  : "text-text-secondary hover:text-text-primary hover:bg-background-card/80 hover:translate-x-1"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span
                className={clsx(
                  "transition-opacity duration-200",
                  isCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
                )}
              >
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* 1. Desktop Sidebar */}
      <aside
        className={clsx(
          "hidden lg:flex flex-col h-screen bg-background-secondary border-r border-border-subtle transition-all duration-300 flex-shrink-0 select-none",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Brand / Logo */}
        <Link href="/" className={clsx("h-16 flex items-center px-4 border-b border-border-subtle hover:bg-background-card/50 transition-colors", isCollapsed ? "justify-center" : "space-x-3")}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <div className="h-full w-full bg-[#0a0f1d] rounded-[10.5px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient opacity-60" />
              <ShieldCheck className="h-5 w-5 text-cyan-400 stroke-[2.2]" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-black text-text-primary tracking-widest uppercase truncate bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CrimeShield
              </span>
              <span className="text-[9px] font-bold text-accent-primary tracking-widest uppercase truncate">
                Intelligence
              </span>
            </div>
          )}
        </Link>

        {/* Navigation Items */}
        <nav className="flex-grow flex flex-col justify-between overflow-y-auto">
          {renderNavList()}

          {/* Collapse Toggle Button */}
          <div className="p-3 border-t border-border-subtle">
            <button
              onClick={toggleCollapsed}
              className="w-full flex items-center justify-center py-2 text-text-secondary hover:text-text-primary hover:bg-background-card rounded-md focus:outline-none focus:ring-1 focus:ring-accent-primary transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </aside>

      {/* 2. Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-out Drawer */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-64 bg-background-secondary border-r border-border-subtle z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out select-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand / Logo */}
        <Link href="/" className="h-16 flex items-center px-6 border-b border-border-subtle space-x-3 flex-shrink-0 hover:bg-background-card/50 transition-colors">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center flex-shrink-0">
            <div className="h-full w-full bg-[#0a0f1d] rounded-[10.5px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient opacity-60" />
              <ShieldCheck className="h-5 w-5 text-cyan-400 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-black text-text-primary tracking-widest uppercase truncate bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CrimeShield
            </span>
            <span className="text-[9px] font-bold text-accent-primary tracking-widest uppercase truncate">
              Intelligence
            </span>
          </div>
        </Link>

        {/* Mobile Navigation */}
        <nav className="flex-grow overflow-y-auto">{renderNavList()}</nav>
      </aside>
    </>
  );
}
