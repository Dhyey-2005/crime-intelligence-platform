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
  ShieldAlert,
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
                "flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-accent-primary select-none",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary border-l-2 border-accent-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-background-card"
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
        <div className={clsx("h-16 flex items-center px-4 border-b border-border-subtle", isCollapsed ? "justify-center" : "space-x-3")}>
          <div className="h-8 w-8 rounded bg-accent-primary flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="h-5 w-5 text-text-primary" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-bold text-text-primary tracking-wider uppercase truncate">
              CrimeShield
            </span>
          )}
        </div>

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
        <div className="h-16 flex items-center px-6 border-b border-border-subtle space-x-3 flex-shrink-0">
          <div className="h-8 w-8 rounded bg-accent-primary flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-text-primary" />
          </div>
          <span className="text-sm font-bold text-text-primary tracking-wider uppercase">
            CrimeShield
          </span>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-grow overflow-y-auto">{renderNavList()}</nav>
      </aside>
    </>
  );
}
