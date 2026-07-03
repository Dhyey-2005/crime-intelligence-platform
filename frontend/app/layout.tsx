import "@/styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

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
    <html lang="en" className={`h-full bg-background-primary text-text-primary ${jakarta.variable}`}>
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
