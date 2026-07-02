export const tokens = {
  colors: {
    background: {
      primary: "#0B1220",
      secondary: "#111827",
      card: "#1F2937",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#9CA3AF",
    },
    accent: {
      primary: "#2563EB",
    },
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    ai: "#8B5CF6",
    analytics: "#06B6D4",
    border: {
      subtle: "#1F2937",
      default: "#374151",
    },
  },
  spacing: {
    container: "1rem",     // 16px
    card: "1.5rem",        // 24px
    section: "2rem",       // 32px
    layout: "3rem",        // 48px
  },
  radius: {
    sm: "0.25rem",         // 4px
    md: "0.375rem",        // 6px
    lg: "0.5rem",          // 8px
    xl: "0.75rem",         // 12px
    xxl: "1rem",           // 16px
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    hover: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  transition: {
    duration: "200ms",
    curve: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export type Tokens = typeof tokens;
