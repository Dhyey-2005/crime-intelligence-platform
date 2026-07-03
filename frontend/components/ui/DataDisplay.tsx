import * as React from "react";
import { ArrowUpRight, ArrowDownRight, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import Button from "./Button";
import clsx from "clsx";

// 1. Table Wrappers
export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-md border border-border-subtle bg-background-card">
      <table ref={ref} className={clsx("w-full text-left border-collapse text-xs", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={clsx("bg-background-secondary border-b border-border-subtle text-table-header", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={clsx("divide-y divide-border-subtle", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={clsx("hover:bg-background-secondary/30 transition-colors", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={clsx("p-3.5 align-middle text-text-secondary font-medium", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

export const TableHeadCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={clsx("p-3.5 align-middle text-text-primary font-semibold tracking-wider text-left", className)} {...props} />
  )
);
TableHeadCell.displayName = "TableHeadCell";

// 2. Empty State
export interface EmptyStateProps {
  title?: string;
  description: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Intelligence Data",
  description,
  icon,
  actionButton,
  className,
}) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border-default bg-background-card/20 select-none", className)}>
      <div className="h-10 w-10 rounded-full bg-background-card flex items-center justify-center text-text-secondary mb-3">
        {icon || <Inbox className="h-5 w-5" />}
      </div>
      <h4 className="text-sm font-semibold text-text-primary mb-1">{title}</h4>
      <p className="text-xs text-text-secondary max-w-[280px] leading-relaxed mb-4">{description}</p>
      {actionButton}
    </div>
  );
};

// 3. Pagination Controls
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className }) => {
  return (
    <div className={clsx("flex items-center justify-between px-4 py-3 bg-background-card border border-border-subtle rounded-md text-xs select-none", className)}>
      <div className="text-text-secondary">
        Page <span className="font-semibold text-text-primary">{currentPage}</span> of{" "}
        <span className="font-semibold text-text-primary">{totalPages}</span>
      </div>
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// 4. Sort Controls
export interface SortControlsProps {
  label: string;
  activeDirection?: "asc" | "desc";
  onSortChange: (direction: "asc" | "desc" | undefined) => void;
  className?: string;
}
export const SortControls: React.FC<SortControlsProps> = ({ label, activeDirection, onSortChange, className }) => {
  const toggleSort = () => {
    if (!activeDirection) onSortChange("asc");
    else if (activeDirection === "asc") onSortChange("desc");
    else onSortChange(undefined);
  };

  return (
    <button
      onClick={toggleSort}
      className={clsx(
        "inline-flex items-center space-x-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary py-1 px-2.5 rounded bg-background-card border border-border-subtle select-none",
        activeDirection && "text-accent-primary border-accent-primary/40",
        className
      )}
    >
      <span>{label}</span>
      <ArrowUpDown className="h-3.5 w-3.5 flex-shrink-0" />
    </button>
  );
};

// 5. Statistic Container (KPI Card)
export interface StatContainerProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  icon?: React.ReactNode;
  className?: string;
}
export const StatContainer: React.FC<StatContainerProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => {
  return (
    <div className={clsx("p-5 bg-gradient-to-br from-background-card via-background-card to-background-secondary/40 border border-border-subtle/80 rounded-lg shadow-sm hover:shadow-md hover:border-accent-primary/40 hover:-translate-y-0.5 transition-[transform,box-shadow,border-color] duration-150 ease-out flex items-start justify-between select-none group", className)}>
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{title}</span>
        <div className="flex items-baseline space-x-2.5">
          <span className="text-2xl font-bold text-text-primary tracking-tight leading-none">{value}</span>
          
          {trend && (
            <span
              className={clsx(
                "inline-flex items-center text-[10px] font-semibold rounded-full px-1.5 py-0.5 border",
                trend.direction === "up"
                  ? "bg-success/5 border-success/20 text-success"
                  : "bg-danger/5 border-danger/20 text-danger"
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5 flex-shrink-0" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5 flex-shrink-0" />
              )}
              {trend.value}
            </span>
          )}
        </div>
        {description && <p className="text-[10px] text-text-secondary leading-tight">{description}</p>}
      </div>

      {icon && (
        <div className="h-10 w-10 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary group-hover:scale-105 group-hover:bg-accent-primary/20 transition-transform duration-150 ease-out">
          {icon}
        </div>
      )}
    </div>
  );
};
