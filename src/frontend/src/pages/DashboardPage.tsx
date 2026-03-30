import { Button } from "@/components/ui/button";
import {
  FileImage,
  Heart,
  LogOut,
  MessageCircle,
  ScanEye,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AdviceTab } from "../components/AdviceTab";
import { PrescriptionTab } from "../components/PrescriptionTab";
import { SymptomTab } from "../components/SymptomTab";
import { useAuth } from "../contexts/AuthContext";

type Tab = "prescription" | "symptom" | "advice";

const tabs: {
  id: Tab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "prescription",
    label: "Prescription Reader",
    shortLabel: "Rx",
    icon: <FileImage className="w-4 h-4" />,
    description:
      "Upload a photo of a handwritten prescription for AI-powered medicine identification.",
  },
  {
    id: "symptom",
    label: "Symptom Analyzer",
    shortLabel: "Scan",
    icon: <ScanEye className="w-4 h-4" />,
    description:
      "Upload an image of a scar, wound, or visible condition for AI visual analysis.",
  },
  {
    id: "advice",
    label: "Medical Advice",
    shortLabel: "Advice",
    icon: <MessageCircle className="w-4 h-4" />,
    description:
      "Describe your symptoms and get safe, general health advice instantly.",
  },
];

export default function DashboardPage() {
  const { userName, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("prescription");
  const prevTab = useRef<Tab>(activeTab);

  useEffect(() => {
    if (prevTab.current !== activeTab) {
      window.speechSynthesis?.cancel();
      prevTab.current = activeTab;
    }
  });

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
  }

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className="bg-card border-b border-border sticky top-0 z-50"
        style={{ boxShadow: "0 1px 3px rgba(16,24,40,0.07)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white"
                aria-hidden="true"
              >
                <path d="M12 2a1 1 0 011 1v7h7a1 1 0 010 2h-7v7a1 1 0 01-2 0v-7H4a1 1 0 010-2h7V3a1 1 0 011-1z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-foreground text-lg leading-none">
                MedyAI
              </span>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5 hidden sm:block">
                Your personal health companion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-medium text-foreground">{userName}</span>
            </div>
            <Button
              data-ocid="dashboard.delete_button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl h-9 px-3 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-card border-b border-border py-8 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Analyze prescriptions, scan symptoms, or ask your AI health
            assistant — powered by AI.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Desktop tab layout */}
        <div className="hidden lg:block">
          <div className="flex border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={`${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors relative
                  ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <span className={activeTab === tab.id ? "text-primary" : ""}>
                  {tab.icon}
                </span>
                {tab.label}
                {activeTab === tab.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-sm"
                    style={{ background: "oklch(0.64 0.090 193)" }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="bg-card border border-border rounded-2xl card-shadow p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary">{currentTab.icon}</span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {currentTab.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentTab.description}
                    </p>
                  </div>
                </div>
                <div className="max-w-2xl">
                  {activeTab === "prescription" && <PrescriptionTab />}
                  {activeTab === "symptom" && <SymptomTab />}
                  {activeTab === "advice" && <AdviceTab />}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden space-y-4">
          <div className="bg-card border border-border rounded-xl p-1.5 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={`${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 rounded-lg py-2.5 px-2 transition-all text-xs font-semibold
                  ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.shortLabel}</span>
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden">
            <div className="px-4 py-4 border-b border-border bg-accent/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary">{currentTab.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {currentTab.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentTab.description}
                  </p>
                </div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="p-5"
              >
                {activeTab === "prescription" && <PrescriptionTab />}
                {activeTab === "symptom" && <SymptomTab />}
                {activeTab === "advice" && <AdviceTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Important notice */}
        <div
          className="mt-8 bg-card border border-border rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          style={{ boxShadow: "0 2px 8px rgba(16,24,40,0.05)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "oklch(0.64 0.090 193 / 0.12)" }}
          >
            <Heart
              className="w-5 h-5"
              style={{ color: "oklch(0.64 0.090 193)" }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Important Notice
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              MedyAI provides general information only. Always consult a
              qualified healthcare professional for medical decisions. Do not
              use this app for emergencies — call emergency services
              immediately.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Heart
              className="w-3.5 h-3.5"
              style={{ color: "oklch(0.64 0.090 193)" }}
            />
            <span>
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </span>
          </div>
          <span>Not a substitute for professional medical advice</span>
        </div>
      </footer>
    </div>
  );
}
