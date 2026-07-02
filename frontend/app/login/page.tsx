"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";
import { Input, Checkbox } from "@/components/ui/Form";
import { PageHeading, Paragraph, FormLabel } from "@/components/ui/Typography";
import { ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    // If already logged in, skip login page
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    
    // Simulate slight loading latency
    setTimeout(() => {
      login(email);
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-container select-none">
      <div className="w-full max-w-sm bg-background-card border border-border-subtle rounded-lg shadow-lg p-6 space-y-6">
        {/* Brand Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-10 w-10 rounded bg-accent-primary flex items-center justify-center text-text-primary mb-2 shadow-sm">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <PageHeading className="text-xl">CrimeShield Command</PageHeading>
          <Paragraph className="text-xs max-w-[260px]">
            Authorized personnel only. Please verify your credentials to access the intelligence terminal.
          </Paragraph>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/5 border border-danger/20 text-danger rounded text-[11px] leading-snug">
              {error}
            </div>
          )}

          <div>
            <FormLabel htmlFor="email">Agency Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@agency.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              error={!!error}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <FormLabel htmlFor="password" className="mb-0">Password</FormLabel>
              <Link
                href="#"
                className="text-[10px] text-accent-primary hover:underline focus:outline-none"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={!!error}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className="text-[11px] text-text-secondary select-none">Remember this terminal</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full text-xs font-semibold py-2"
            isLoading={loading}
          >
            Authenticate Session
          </Button>
        </form>

        {/* Registration redirect */}
        <div className="text-center text-[11px] text-text-secondary">
          Request new terminal access?{" "}
          <Link
            href="/register"
            className="text-accent-primary hover:underline font-semibold focus:outline-none"
          >
            Register Credentials
          </Link>
        </div>
      </div>
    </div>
  );
}
