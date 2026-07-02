"use client";

import * as React from "react";
import clsx from "clsx";

// 1. Divider Component
export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}
export const Divider: React.FC<DividerProps> = ({ orientation = "horizontal", className }) => {
  return (
    <hr
      className={clsx(
        "border-0 bg-border-subtle",
        orientation === "horizontal" ? "h-[1px] w-full my-4" : "w-[1px] h-full mx-4 self-stretch",
        className
      )}
      aria-orientation={orientation}
    />
  );
};

// 2. Tooltip Component
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}
export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = "top", className }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      className={clsx("relative inline-block select-none", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={clsx(
            "absolute z-50 px-2 py-1 bg-background-card border border-border-default rounded shadow-md text-[10px] text-text-primary whitespace-nowrap animate-fade-in pointer-events-none",
            {
              "bottom-full left-1/2 -translate-x-1/2 mb-1.5": position === "top",
              "top-full left-1/2 -translate-x-1/2 mt-1.5": position === "bottom",
              "right-full top-1/2 -translate-y-1/2 mr-1.5": position === "left",
              "left-full top-1/2 -translate-y-1/2 ml-1.5": position === "right",
            }
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// 3. Avatar Component
export interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = "md", className }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Initials generator
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center overflow-hidden border border-border-default bg-background-card/85 text-text-primary font-bold uppercase select-none flex-shrink-0",
        {
          "h-7 w-7 text-[10px]": size === "sm",
          "h-10 w-10 text-xs": size === "md",
          "h-14 w-14 text-sm": size === "lg",
        },
        className
      )}
    >
      {src && !imageError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={`${name} Avatar`}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// 4. ScrollArea Container
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
}
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, maxHeight = "300px", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("overflow-y-auto scrollbar-thin scrollbar-thumb-border-default", className)}
        style={{ maxHeight }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

// 5. Layout Containers
export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={clsx("max-w-7xl mx-auto w-full px-container", className)} {...props} />
  );
};

export const SectionWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <section className={clsx("space-y-4 md:space-y-section", className)} {...props} />
  );
};
