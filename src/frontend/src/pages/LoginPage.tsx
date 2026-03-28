import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Loader2,
  MessageSquare,
  Pill,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const features = [
  {
    icon: <Pill className="w-5 h-5" />,
    title: "Prescription Reader",
    desc: "Decode handwritten prescriptions instantly",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Symptom Analyzer",
    desc: "AI-powered visual symptom assessment",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Medical Advice",
    desc: "Personalized general health guidance",
    color: "bg-indigo-500/10 text-indigo-600",
  },
];

export default function LoginPage() {
  const {
    login,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginError,
    userName,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;
    if (isAuthenticated) {
      if (userName) {
        void navigate({ to: "/dashboard" });
      } else {
        void navigate({ to: "/setup" });
      }
    }
  }, [isAuthenticated, isInitializing, userName, navigate]);

  useEffect(() => {
    if (loginError) {
      toast.error(loginError.message || "Login failed. Please try again.");
    }
  }, [loginError]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="lg:w-1/2 bg-gradient-to-br from-primary to-[oklch(0.64_0.09_193)] flex flex-col justify-between p-10 lg:p-14 text-white"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-white"
              aria-hidden="true"
            >
              <path d="M12 2a1 1 0 011 1v7h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H4a1 1 0 010-2h7V3a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">MedyAI</span>
        </div>

        {/* Hero text */}
        <div className="space-y-4 mt-10 lg:mt-0">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Your AI-powered
            <br />
            Medical Assistant
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-md">
            Get instant insights from prescriptions, symptoms, and health
            questions — all in one secure place.
          </p>
        </div>

        {/* Feature cards */}
        <div className="hidden lg:flex flex-col gap-3 mt-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-white/65 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel — login */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-14 bg-background"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white"
                aria-hidden="true"
              >
                <path d="M12 2a1 1 0 011 1v7h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H4a1 1 0 010-2h7V3a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">MedyAI</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access your medical assistant
            </p>
          </div>

          {/* Mobile feature list */}
          <div className="flex lg:hidden flex-col gap-2">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${f.color}`}
                >
                  {f.icon}
                </div>
                <p className="text-sm text-foreground font-medium">{f.title}</p>
              </div>
            ))}
          </div>

          {/* Login button */}
          <div className="space-y-4">
            <Button
              data-ocid="login.primary_button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="w-full h-12 text-base font-semibold rounded-xl"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              🔒 Secure, passwordless login — no account or password needed.
              <br />
              Powered by Internet Computer cryptographic identity.
            </p>
          </div>

          {/* Error state */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              data-ocid="login.error_state"
              className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{loginError.message}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
