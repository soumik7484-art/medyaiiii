import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileSetupPage() {
  const { isAuthenticated, isInitializing, userName, setUserName } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      void navigate({ to: "/" });
    } else if (userName) {
      void navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isInitializing, userName, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setUserName(trimmed);
    toast.success("Welcome to MedyAI!");
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-card border border-border rounded-2xl card-shadow p-8 sm:p-10 w-full max-w-md text-center space-y-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 fill-white"
              aria-hidden="true"
            >
              <path d="M12 2a1 1 0 011 1v7h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H4a1 1 0 010-2h7V3a1 1 0 011-1z" />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to MedyAI!
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            What should we call you?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Your name</Label>
            <Input
              id="display-name"
              data-ocid="setup.input"
              placeholder="e.g. Alex, Dr. Smith..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="h-11 rounded-xl"
              autoFocus
            />
            {error && (
              <p
                data-ocid="setup.error_state"
                className="text-destructive text-xs mt-1"
              >
                {error}
              </p>
            )}
          </div>

          <Button
            data-ocid="setup.submit_button"
            type="submit"
            className="w-full h-11 rounded-xl font-semibold text-base"
          >
            Get Started
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
