import * as React from "react";
import clsx from "clsx";

interface BaseTypographyProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function PageHeading({ className, children, id, ...props }: BaseTypographyProps & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 id={id} className={clsx("text-page-title", className)} {...props}>
      {children}
    </h2>
  );
}

export function SectionHeading({ className, children, id, ...props }: BaseTypographyProps & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 id={id} className={clsx("text-section-title", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardTitle({ className, children, id, ...props }: BaseTypographyProps & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 id={id} className={clsx("text-card-title", className)} {...props}>
      {children}
    </h4>
  );
}

export function Paragraph({ className, children, ...props }: BaseTypographyProps & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx("text-body", className)} {...props}>
      {children}
    </p>
  );
}

export function Caption({ className, children, ...props }: BaseTypographyProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={clsx("text-caption", className)} {...props}>
      {children}
    </span>
  );
}

export function FormLabel({ className, children, htmlFor, ...props }: BaseTypographyProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label htmlFor={htmlFor} className={clsx("text-label block mb-1.5 font-semibold text-text-secondary select-none", className)} {...props}>
      {children}
    </label>
  );
}

export function HelperText({ className, children, error = false, ...props }: BaseTypographyProps & { error?: boolean } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "text-caption block mt-1",
        error ? "text-danger" : "text-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
