"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Form";
import { PageHeading, Paragraph, FormLabel } from "@/components/ui/Typography";
import { ShieldAlert } from "lucide-react";

const agencyRoles = [
  { value: "Inspector", label: "Inspector / Detective" },
  { value: "Investigator", label: "Field Investigator" },
  { value: "Analyst", label: "Intelligence Analyst" },
  { value: "Command Staff", label: "Command Staff / Chief" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuthStore();
  
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [role, setRole] = React.useState("Inspector");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      register(name, email, role);
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
          <PageHeading className="text-xl">Register Credentials</PageHeading>
          <Paragraph className="text-xs max-w-[260px]">
            Create a mock user identity and register key operational credentials for the command shell.
          </Paragraph>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger/5 border border-danger/20 text-danger rounded text-[11px] leading-snug">
              {error}
            </div>
          )}

          <div>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <Input
              id="name"
              type="text"
              placeholder="Inspector John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              error={!!error && !name}
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="email">Agency Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@agency.gov"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              error={!!error && !email}
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="role">Operational Role</FormLabel>
            <Select
              id="role"
              options={agencyRoles}
              value={role}
              onChange={(val) => setRole(val)}
              disabled={loading}
              error={!!error && !role}
            />
          </div>

          <div>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={!!error && (!password || password !== confirmPassword)}
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              error={!!error && (!confirmPassword || password !== confirmPassword)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full text-xs font-semibold py-2 mt-2"
            isLoading={loading}
          >
            Create Terminal Identity
          </Button>
        </form>

        {/* Direct to Login */}
        <div className="text-center text-[11px] text-text-secondary">
          Already have credentials?{" "}
          <Link
            href="/login"
            className="text-accent-primary hover:underline font-semibold focus:outline-none"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
