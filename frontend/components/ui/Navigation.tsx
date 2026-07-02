"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import clsx from "clsx";

// 1. Reusable Tabs Component
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}
export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
}
export const Tabs: React.FC<TabsProps> = ({ items, defaultTabId, className }) => {
  const [activeId, setActiveId] = React.useState(defaultTabId || items[0]?.id);

  return (
    <div className={clsx("space-y-4 text-xs select-none", className)}>
      {/* Tab headers */}
      <div className="flex border-b border-border-subtle overflow-x-auto space-x-1.5">
        {items.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={clsx(
                "inline-flex items-center space-x-1.5 px-3 py-2 border-b-2 font-medium text-xs transition-colors duration-150 focus:outline-none",
                isActive
                  ? "border-accent-primary text-accent-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
              role="tab"
              aria-selected={isActive}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel" className="animate-fade-in text-text-secondary">
        {items.find((t) => t.id === activeId)?.content}
      </div>
    </div>
  );
};

// 2. Accordion Component
export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-border-subtle bg-background-card/50 rounded-md overflow-hidden text-xs select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-background-card hover:bg-background-secondary/35 transition-colors font-medium text-text-primary text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-text-secondary" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-border-subtle text-text-secondary leading-relaxed bg-background-card/20 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export interface AccordionProps {
  items: { title: string; content: React.ReactNode; defaultOpen?: boolean }[];
  className?: string;
}
export const Accordion: React.FC<AccordionProps> = ({ items, className }) => {
  return (
    <div className={clsx("space-y-1.5", className)}>
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} defaultOpen={item.defaultOpen}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

// 3. Dropdown Menu Component
export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className={clsx("relative inline-block text-xs select-none", className)}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute right-0 z-50 mt-1 min-w-[140px] bg-background-card border border-border-default rounded-md shadow-lg p-1.5 space-y-0.5 animate-fade-in"
        >
          {children}
        </div>
      )}
    </div>
  );
};

// 4. Context Menu (Right Click Trigger)
export interface ContextMenuProps {
  children: React.ReactNode;
  menuContent: React.ReactNode;
  className?: string;
}
export const ContextMenu: React.FC<ContextMenuProps> = ({ children, menuContent, className }) => {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className={clsx("relative", className)}>
      {children}
      {visible && (
        <div
          ref={menuRef}
          onClick={() => setVisible(false)}
          className="fixed z-50 min-w-[130px] bg-background-card border border-border-default rounded-md shadow-lg p-1.5 space-y-0.5 text-xs text-text-primary animate-fade-in"
          style={{ top: position.y, left: position.x }}
        >
          {menuContent}
        </div>
      )}
    </div>
  );
};
