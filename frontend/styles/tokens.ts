export const tokens = {
  colors: {
    background: {
      primary: "#06080F",    // Ultra-deep obsidian black-blue
      secondary: "#0B101D",  // Sleek matte dark navy
      card: "#101726",       // Rich elevated dark card navy
    },
    text: {
      primary: "#F8FAFC",    // Crisp bright white-slate
      secondary: "#94A3B8",  // Highly readable cool slate
    },
    accent: {
      primary: "#3B82F6",    // Vibrant electric blue
      glow: "rgba(59, 130, 246, 0.4)",
    },
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    ai: "#A855F7",           // Cognitive violet
    analytics: "#06B6D4",    // Tactical cyan
    border: {
      subtle: "#182234",     // Crisp subtle slate line
      default: "#2A384E",    // Standard border line
      glow: "rgba(59, 130, 246, 0.3)",
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
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.25)",
    hover: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.15)",
    glow: "0 0 25px rgba(59, 130, 246, 0.25)",
  },
  transition: {
    duration: "150ms",
    curve: "cubic-bezier(0.16, 1, 0.3, 1)", // Smooth Apple/Stripe feel
  },
} as const;

export type Tokens = typeof tokens;
