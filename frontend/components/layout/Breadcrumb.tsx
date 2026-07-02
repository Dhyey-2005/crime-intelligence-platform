"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Crime Analytics",
  map: "Crime Map",
  network: "Criminal Network",
  investigation: "Investigation",
  officers: "Officer Analytics",
  ai: "AI Intelligence",
  reports: "Reports",
  settings: "Settings",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 py-3 px-6 bg-background-secondary border-b border-border-subtle select-none">
      <Link
        href="/dashboard"
        className="flex items-center text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary rounded-sm"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <div key={href} className="flex items-center space-x-2">
            <ChevronRight className="h-3.5 w-3.5 text-text-secondary flex-shrink-0" aria-hidden="true" />
            {isLast ? (
              <span className="text-text-primary font-medium text-xs truncate max-w-[200px]" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-text-secondary hover:text-text-primary transition-colors text-xs truncate max-w-[200px] focus:outline-none focus:ring-1 focus:ring-accent-primary rounded-sm"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
