"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutStore } from "@/store/layoutStore";
import { Menu, Search, Bell, Sun, X, Sparkles, ShieldAlert, CheckCircle, SearchCode, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/Feedback";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

const routeTitleMap: Record<string, string> = {
  dashboard: "Executive Command Center",
  analytics: "Geospatial & Crime Analytics",
  map: "Tactical GIS Crime Map",
  network: "Criminal Relations Link Analysis",
  investigation: "Active Case Investigation",
  officers: "Officer Performance & Activity",
  ai: "Cognitive Intelligence Assistant",
  reports: "Intelligence & Case Reports",
  settings: "Platform Control Settings",
};

interface NotificationItem {
  id: string;
  type: "ai" | "investigation" | "operational" | "system";
  title: string;
  desc: string;
  isRead: boolean;
  time: string;
}

const initialNotifications: NotificationItem[] = [
  { id: "nt-1", type: "ai", title: "New Phishing Spike Detected", desc: "45% rise in pension credentials fraud in Koramangala.", isRead: false, time: "5m ago" },
  { id: "nt-2", type: "investigation", title: "Arrest Completed", desc: "Suspect John Doe logged in homicide case KA-2026-9014.", isRead: false, time: "1h ago" },
  { id: "nt-3", type: "operational", title: "Inspector Caseload Overload", desc: "Inspector Nayak reaches 90% utilization workload capacity.", isRead: true, time: "2h ago" },
  { id: "nt-4", type: "system", title: "Preferences Changed", desc: "Terminal preferences updated for desai@karnataka.gov.in.", isRead: true, time: "1d ago" },
];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileOpen, toggleMobileOpen } = useLayoutStore();

  const currentSegment = pathname.split("/").filter(Boolean)[0] || "";
  const pageTitle = routeTitleMap[currentSegment] || "Crime Command HQ";

  // 1. Notification Dropdown States
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications);
  const [notifFilter, setNotifFilter] = React.useState<"all" | "unread">("all");

  const unreadCount = React.useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const filteredNotifs = React.useMemo(() => {
    return notifications.filter((n) => {
      if (notifFilter === "unread" && n.isRead) return false;
      return true;
    });
  }, [notifications, notifFilter]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("Notifications marked as read");
  };

  const handleNotifClick = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    toast.info("Marked notification as read");
  };

  // 2. Global Search Experience States
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const mockSearchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const allItems = [
      { type: "Case File", title: "KA-2026-9011: Phishing Fraud", link: "/investigation", desc: "Bengaluru City District • Evidence Collection" },
      { type: "Case File", title: "KA-2026-9014: Homicide Record", link: "/investigation", desc: "Belagavi City District • Arrest Completed" },
      { type: "Suspect Profile", title: "John 'Snake' Doe", link: "/network", desc: "Ramon Gang leader • Proximity matches" },
      { type: "Officer Staff", title: "Inspector K. Patil", link: "/officers", desc: "Rating: 4.8 • 12 Assigned Cases" },
      { type: "Precinct Station", title: "Koramangala Police Station", link: "/officers", desc: "Clearance: 85% • Response time: 8 mins" },
    ];
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Simulate Search loading spinner
  React.useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Close dropdowns on route changes
  React.useEffect(() => {
    setIsNotifOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background-secondary/90 backdrop-blur-md border-b border-border-subtle/80 select-none z-30 relative shadow-sm">
      {/* Left: Mobile Toggle & Brand / Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMobileOpen}
          className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-accent-primary"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex flex-col">
          <Link href="/" className="text-[10px] text-accent-primary font-bold tracking-widest uppercase hover:underline">
            Crime Intelligence Platform
          </Link>
          <h1 className="text-sm font-semibold text-text-primary truncate max-w-[200px] md:max-w-none">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Middle/Right: Actions (Search, Notification, Theme, Profile) */}
      <div className="flex items-center space-x-4">
        
        {/* Search Input Container */}
        <div className="relative hidden md:block">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-text-secondary" />
            </span>
            <input
              type="text"
              placeholder="Search databases (e.g. Doe, 9011)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="w-72 pl-9 pr-8 py-1.5 bg-background-primary/80 border border-border-default rounded-md text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary transition-[border-color,box-shadow] duration-150 ease-out"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-secondary hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Result Overlay Dropdown */}
          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-background-card border border-border-subtle rounded-md shadow-lg overflow-hidden z-40 text-xs">
              <div className="p-2 border-b border-border-subtle bg-background-secondary/40 flex justify-between items-center">
                <span className="font-bold text-[10px] text-text-secondary uppercase">Database Matches</span>
                <button onClick={() => setIsSearchOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="max-h-[260px] overflow-y-auto p-2 space-y-1">
                {isSearching ? (
                  <div className="flex items-center justify-center py-6 space-x-2 text-text-secondary">
                    <SearchCode className="h-4 w-4 animate-pulse text-accent-primary" />
                    <span>Searching records database...</span>
                  </div>
                ) : searchQuery.trim() === "" ? (
                  <div className="text-center py-4 text-text-secondary text-[11px]">
                    Type keywords above to locate active dossiers.
                  </div>
                ) : mockSearchResults.length > 0 ? (
                  mockSearchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        router.push(res.link);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-background-secondary/50 border border-transparent hover:border-border-subtle transition-colors block"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-text-primary">{res.title}</span>
                        <Badge variant="secondary" className="text-[8px] px-1 py-0.5">{res.type}</Badge>
                      </div>
                      <span className="text-[10px] text-text-secondary block mt-0.5">{res.desc}</span>
                    </button>
                  ))
                ) : (
                  // Reusable Empty Search State
                  <div className="flex flex-col items-center justify-center py-6 text-center text-text-secondary select-none">
                    <Inbox className="h-8 w-8 text-text-secondary mb-1.5 opacity-60" />
                    <span className="font-semibold text-text-primary block text-[11px]">No Search Results</span>
                    <span className="text-[9px] max-w-[200px] leading-relaxed block mt-0.5">We couldn&apos;t find matching records for &quot;{searchQuery}&quot;.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* Theme Indicator */}
          <button
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus:ring-1 focus:ring-accent-primary"
            aria-label="Theme mode indicator"
            title="Dark mode active"
          >
            <Sun className="h-4 w-4" />
          </button>

          {/* Interactive Notification Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsSearchOpen(false); }}
              className={`p-1.5 text-text-secondary hover:text-text-primary rounded-md relative focus:outline-none focus:ring-1 focus:ring-accent-primary ${
                isNotifOpen ? "text-text-primary" : ""
              }`}
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-danger rounded-full ring-1 ring-background-secondary" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-background-card border border-border-subtle rounded-md shadow-lg overflow-hidden z-40 text-xs">
                {/* Dropdown Header */}
                <div className="p-3 border-b border-border-subtle bg-background-secondary/40 flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider">Alerts Center</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-danger/10 text-danger border border-danger/25 text-[8px] font-bold rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className="text-[9px] text-accent-primary hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                {/* Filters */}
                <div className="p-2 border-b border-border-subtle bg-background-secondary/20 flex space-x-2">
                  <button
                    onClick={() => setNotifFilter("all")}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${notifFilter === "all" ? "bg-accent-primary text-text-primary" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setNotifFilter("unread")}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${notifFilter === "unread" ? "bg-accent-primary text-text-primary" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    Unread
                  </button>
                </div>

                {/* Notification Items list */}
                <div className="max-h-[280px] overflow-y-auto divide-y divide-border-subtle">
                  {filteredNotifs.length > 0 ? (
                    filteredNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotifClick(notif.id)}
                        className={`p-3 text-left hover:bg-background-secondary/30 transition-colors cursor-pointer relative ${
                          !notif.isRead ? "bg-accent-primary/5 border-l-2 border-accent-primary" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-text-primary pr-2 leading-snug">{notif.title}</span>
                          <span className="text-[8px] text-text-secondary flex-shrink-0 mt-0.5">{notif.time}</span>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-normal mt-1">{notif.desc}</p>
                        
                        {/* Type indicator */}
                        <div className="flex items-center space-x-1.5 mt-2">
                          <Badge variant={notif.type === "ai" ? "ai" : notif.type === "system" ? "secondary" : "primary"} className="text-[7px] py-0 px-1">
                            {notif.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-text-secondary text-[11px]">
                      No notifications to show.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-2 pl-2 border-l border-border-default">
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-background-primary/80 border border-border-default text-xs select-none">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="font-semibold text-[11px] text-text-primary">Terminal Active</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
