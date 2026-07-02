import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-md transition-all duration-default timing-default focus:outline-none focus:ring-1 focus:ring-accent-primary select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
          {
            // Variant classes
            "bg-accent-primary text-text-primary hover:bg-blue-700 shadow-sm": variant === "primary",
            "bg-background-card text-text-primary border border-border-default hover:bg-background-secondary": variant === "secondary",
            "bg-transparent text-text-primary border border-border-default hover:bg-background-card": variant === "outline",
            "bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-card": variant === "ghost",
            "bg-danger text-text-primary hover:bg-red-700 shadow-sm": variant === "destructive",
            
            // Size classes
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2 text-xs": size === "md",
            "px-5 py-2.5 text-sm": size === "lg",
            "h-8 w-8 p-0 rounded-full": size === "icon",
          },
          className
        )}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
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
        )}

        {/* Left Icon (only if not loading) */}
        {!isLoading && leftIcon && <span className="mr-1.5 flex-shrink-0">{leftIcon}</span>}

        {/* Children content */}
        {size === "icon" ? children : <span>{children}</span>}

        {/* Right Icon */}
        {!isLoading && rightIcon && <span className="ml-1.5 flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
