import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useAnalyzeSymptomImage } from "../hooks/useQueries";
import { DisclaimerBox } from "./PrescriptionTab";
import { UploadZone } from "./UploadZone";
import { VoiceButton } from "./VoiceButton";

export function SymptomTab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const mutation = useAnalyzeSymptomImage();

  const handleFileSelected = useCallback((f: File) => {
    setFile(f);
    setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleClear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setDescription("");
    mutation.reset();
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an image to analyze.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe what you see in the image.");
      return;
    }
    setError("");
    mutation.mutate(description.trim());
  };

  const result = mutation.data;

  const voiceText = result
    ? `Image Analysis. Observation: ${result.observation}. Possible Cause: ${result.possibleCause}. What to Do: ${result.whatToDo}. ${result.disclaimer}`
    : "";

  return (
    <div className="space-y-5">
      <UploadZone
        onFileSelected={handleFileSelected}
        preview={preview}
        onClear={handleClear}
      />

      {file && (
        <div className="space-y-1.5">
          <Label
            htmlFor="symptom-description"
            className="text-sm font-medium text-foreground"
          >
            Describe what you see
          </Label>
          <Input
            id="symptom-description"
            data-ocid="symptom.input"
            placeholder="e.g. rash on arm, wound on hand, bruise on leg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">
            A brief description helps the AI give you a more accurate and
            relevant response.
          </p>
        </div>
      )}

      {error && (
        <div
          data-ocid="symptom.error_state"
          className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        data-ocid="symptom.primary_button"
        className="w-full gap-2"
        onClick={handleAnalyze}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing image...
          </>
        ) : (
          <>
            <Activity className="w-4 h-4" />
            Analyze Image
          </>
        )}
      </Button>

      {mutation.isPending && (
        <div data-ocid="symptom.loading_state" className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Running visual analysis...</span>
            <span className="animate-pulse-ring">Processing</span>
          </div>
          <div className="h-1.5 bg-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress" />
          </div>
        </div>
      )}

      {mutation.isError && (
        <div
          data-ocid="symptom.error_state"
          className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {mutation.error?.message ?? "Analysis failed. Please try again."}
        </div>
      )}

      {result && (
        <div
          data-ocid="symptom.success_state"
          className="animate-fade-slide space-y-4"
        >
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 card-shadow">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-foreground">Analysis Result</h3>
            </div>

            <AnalysisSection
              label="🔍 Observation"
              value={result.observation}
            />
            <AnalysisSection
              label="💡 Possible Cause"
              value={result.possibleCause}
            />
            <AnalysisSection label="✅ What to Do" value={result.whatToDo} />
          </div>

          <DisclaimerBox text="This is not a medical diagnosis. Please consult a doctor." />

          <VoiceButton text={voiceText} />
        </div>
      )}
    </div>
  );
}

function AnalysisSection({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-accent/30 rounded-lg px-4 py-3 space-y-1">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}
