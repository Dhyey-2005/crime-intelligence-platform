import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CrimeShield Intelligence Command Center",
  description: "AI-Driven Crime Intelligence & Investigation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-background-primary text-text-primary">
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
