import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAnalyzeSymptomImage } from "../hooks/useQueries";
import { ImageUploadZone } from "./ImageUploadZone";
import { DisclaimerBox } from "./PrescriptionTab";
import { VoiceButton } from "./VoiceButton";

export function SymptomTab() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const urlRef = useRef<string | null>(null);
  const mutation = useAnalyzeSymptomImage();

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  function handleFileSelected(selectedFile: File) {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(selectedFile);
    urlRef.current = url;
    setFile(selectedFile);
    setPreviewUrl(url);
    setError("");
    mutation.reset();
  }

  function handleRemove() {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    mutation.reset();
  }

  function handleAnalyze() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setError("");
    const context = description.trim()
      ? `${file.name}: ${description.trim()}`
      : file.name;
    mutation.mutate(context);
  }

  const result = mutation.data;

  const voiceText = result
    ? `Symptom Analysis. Observation: ${result.observation}. Possible Cause: ${result.possibleCause}. What to Do: ${result.whatToDo}. ${result.disclaimer}`
    : "";

  return (
    <div className="space-y-5">
      <ImageUploadZone
        onFileSelected={handleFileSelected}
        onRemove={handleRemove}
        previewUrl={previewUrl}
        accept="image/*"
        label="Upload symptom / scar image"
      />

      <div className="space-y-1.5">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="symptom-desc"
        >
          Describe what you see{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          id="symptom-desc"
          data-ocid="symptom.textarea"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
          placeholder="e.g. red rash on arm, blisters, itching..."
          className="min-h-[80px] resize-none text-sm"
        />
      </div>

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
            Analyze Symptom
          </>
        )}
      </Button>

      {mutation.isPending && (
        <div data-ocid="symptom.loading_state" className="space-y-2">
          <p className="text-xs text-muted-foreground text-center animate-pulse-ring">
            Scanning image for visible conditions...
          </p>
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
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 card-shadow">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-foreground">Analysis Result</h3>
            </div>
            <AnalysisSection
              label="Observation"
              value={result.observation}
              variant="blue"
            />
            <AnalysisSection
              label="Possible Cause"
              value={result.possibleCause}
              variant="amber"
            />
            <AnalysisSection
              label="What to Do"
              value={result.whatToDo}
              variant="green"
            />
          </div>
          <DisclaimerBox text="This is not a medical diagnosis. Please consult a doctor." />
          <VoiceButton text={voiceText} />
        </div>
      )}
    </div>
  );
}

function AnalysisSection({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "blue" | "amber" | "green";
}) {
  const styles = {
    blue: "bg-primary/8 border border-primary/20 text-primary",
    amber: "bg-warning/8 border border-warning/20 text-warning",
    green: "bg-success/8 border border-success/20 text-success",
  };
  return (
    <div className={`rounded-lg px-4 py-3 space-y-1.5 ${styles[variant]}`}>
      <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      <p className="text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  );
}
