import * as React from "react";
import { AlertCircle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import Button from "./Button";
import clsx from "clsx";

// 1. Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ai" | "analytics";
}
export const Badge: React.FC<BadgeProps> = ({ className, variant = "primary", ...props }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide select-none",
        {
          "bg-accent-primary/10 text-accent-primary border border-accent-primary/20": variant === "primary",
          "bg-background-card text-text-secondary border border-border-default": variant === "secondary",
          "bg-success/10 text-success border border-success/20": variant === "success",
          "bg-warning/10 text-warning border border-warning/20": variant === "warning",
          "bg-danger/10 text-danger border border-danger/20": variant === "danger",
          "bg-ai/10 text-ai border border-ai/20": variant === "ai",
          "bg-analytics/10 text-analytics border border-analytics/20": variant === "analytics",
        },
        className
      )}
      {...props}
    />
  );
};

// 2. Chip Component
export interface ChipProps {
  label: string;
  onDelete?: () => void;
  className?: string;
  avatar?: React.ReactNode;
}
export const Chip: React.FC<ChipProps> = ({ label, onDelete, className, avatar }) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center space-x-1.5 px-2.5 py-1 bg-background-card border border-border-default rounded-full text-xs text-text-secondary select-none",
        className
      )}
    >
      {avatar && <div className="flex-shrink-0">{avatar}</div>}
      <span className="truncate max-w-[120px]">{label}</span>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="hover:text-text-primary rounded-full focus:outline-none focus:ring-1 focus:ring-accent-primary p-0.5"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

// 3. Alert Component
export interface AlertProps {
  variant?: "success" | "warning" | "danger" | "info";
  title: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}
export const Alert: React.FC<AlertProps> = ({ variant = "info", title, description, className, onClose }) => {
  const Icon = {
    success: CheckCircle2,
    warning: AlertCircle,
    danger: XCircle,
    info: Info,
  }[variant];

  return (
    <div
      role="alert"
      className={clsx(
        "p-4 rounded-md border flex space-x-3 text-xs shadow-sm transition-opacity duration-300",
        {
          "bg-success/5 border-success/20 text-success": variant === "success",
          "bg-warning/5 border-warning/20 text-warning": variant === "warning",
          "bg-danger/5 border-danger/20 text-danger": variant === "danger",
          "bg-analytics/5 border-analytics/20 text-analytics": variant === "info",
        },
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-text-primary leading-tight">{title}</h4>
        {description && <p className="text-text-secondary leading-normal">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-start text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// 4. Status Indicator (Active/Warning/Danger Dot)
export interface StatusIndicatorProps {
  status: "online" | "warning" | "critical" | "offline";
  label?: string;
  className?: string;
}
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className }) => {
  return (
    <div className={clsx("inline-flex items-center space-x-2 select-none", className)}>
      <span className="relative flex h-2.5 w-2.5">
        {status !== "offline" && (
          <span
            className={clsx(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              {
                "bg-success": status === "online",
                "bg-warning": status === "warning",
                "bg-danger": status === "critical",
              }
            )}
          />
        )}
        <span
          className={clsx("relative inline-flex rounded-full h-2.5 w-2.5", {
            "bg-success": status === "online",
            "bg-warning": status === "warning",
            "bg-danger": status === "critical",
            "bg-text-secondary/40": status === "offline",
          })}
        />
      </span>
      {label && <span className="text-xs text-text-secondary leading-none">{label}</span>}
    </div>
  );
};

// 5. Progress Bar
export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: "primary" | "success" | "warning" | "danger" | "ai" | "analytics";
  className?: string;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = "primary", className }) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={clsx("w-full h-2 bg-background-card rounded-full overflow-hidden border border-border-subtle", className)}>
      <div
        className={clsx("h-full transition-all duration-default timing-default rounded-full", {
          "bg-accent-primary": color === "primary",
          "bg-success": color === "success",
          "bg-warning": color === "warning",
          "bg-danger": color === "danger",
          "bg-ai": color === "ai",
          "bg-analytics": color === "analytics",
        })}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

// 6. Spinner
export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return (
    <svg
      className={clsx(
        "animate-spin text-accent-primary",
        {
          "h-4 w-4": size === "sm",
          "h-8 w-8": size === "md",
          "h-12 w-12": size === "lg",
        },
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// 7. Skeleton
export interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  className?: string;
}
export const Skeleton: React.FC<SkeletonProps> = ({ variant = "rectangular", className }) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-background-card/60",
        {
          "h-4 w-full rounded-md": variant === "text",
          "rounded-full h-10 w-10 flex-shrink-0": variant === "circular",
          "rounded-md": variant === "rectangular",
        },
        className
      )}
      aria-hidden="true"
    />
  );
};

// 8. Error State
export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Unexpected Data Error",
  description,
  onRetry,
  className,
}) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-8 text-center rounded-lg border border-danger/20 bg-danger/5 select-none", className)}>
      <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-3">
        <XCircle className="h-5 w-5" />
      </div>
      <h4 className="text-sm font-semibold text-text-primary mb-1">{title}</h4>
      <p className="text-xs text-text-secondary max-w-[280px] leading-relaxed mb-4">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};

