import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useGetMedicalAdvice } from "../hooks/useQueries";
import { DisclaimerBox } from "./PrescriptionTab";
import { VoiceButton } from "./VoiceButton";

export function AdviceTab() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const mutation = useGetMedicalAdvice();

  const handleSubmit = () => {
    if (!input.trim()) {
      setError("Please describe your symptoms or question first.");
      return;
    }
    setError("");
    mutation.mutate(input.trim());
  };

  const result = mutation.data;

  const voiceText = result
    ? `Medical Advice. Possible Reasons: ${result.possibleReasons}. General Advice: ${result.generalAdvice}. Home Care Tips: ${result.homeCareTips.join(". ")}. ${result.disclaimer}`
    : "";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="symptoms-input"
        >
          Describe your symptoms or ask a question
        </label>
        <Textarea
          id="symptoms-input"
          data-ocid="advice.textarea"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Describe your symptoms, e.g. I have a headache and fever..."
          className="min-h-[120px] resize-none bg-card border-border focus:border-primary transition-colors text-sm"
        />
      </div>

      {error && (
        <div
          data-ocid="advice.error_state"
          className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        data-ocid="advice.submit_button"
        className="w-full gap-2"
        onClick={handleSubmit}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Getting advice...
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" />
            Get Advice
          </>
        )}
      </Button>

      {mutation.isPending && (
        <div data-ocid="advice.loading_state" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Generating personalized advice...</span>
            <span className="animate-pulse-ring">Processing</span>
          </div>
          <div className="h-1.5 bg-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress" />
          </div>
        </div>
      )}

      {mutation.isError && (
        <div
          data-ocid="advice.error_state"
          className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {mutation.error?.message ?? "Failed to get advice. Please try again."}
        </div>
      )}

      {result && (
        <div
          data-ocid="advice.success_state"
          className="animate-fade-slide space-y-4"
        >
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 card-shadow">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-foreground">Medical Advice</h3>
            </div>

            <AdviceSection
              label="🤔 Possible Reasons"
              content={result.possibleReasons}
            />
            <AdviceSection
              label="💊 General Advice"
              content={result.generalAdvice}
            />
            <div className="bg-accent/30 rounded-lg px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                🏠 Home Care Tips
              </p>
              <ul className="space-y-1.5">
                {result.homeCareTips.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DisclaimerBox text="This is general advice, not a medical diagnosis." />

          <VoiceButton text={voiceText} />
        </div>
      )}
    </div>
  );
}

function AdviceSection({ label, content }: { label: string; content: string }) {
  return (
    <div className="bg-accent/30 rounded-lg px-4 py-3 space-y-1">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-foreground leading-relaxed">{content}</p>
    </div>
  );
}
