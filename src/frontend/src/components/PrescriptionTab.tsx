import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Loader2, Pill } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAnalyzePrescription } from "../hooks/useQueries";
import { ImageUploadZone } from "./ImageUploadZone";
import { VoiceButton } from "./VoiceButton";

export function PrescriptionTab() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const urlRef = useRef<string | null>(null);
  const mutation = useAnalyzePrescription();

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
      setError("Please upload a prescription image first.");
      return;
    }
    setError("");
    const context = notes.trim() ? `${file.name}: ${notes.trim()}` : file.name;
    mutation.mutate(context);
  }

  const result = mutation.data;

  function confidenceBadge(level: string) {
    const l = level.toLowerCase();
    if (l === "high")
      return (
        <Badge className="bg-success text-success-foreground text-xs">
          ✓ High Confidence
        </Badge>
      );
    if (l === "medium")
      return (
        <Badge className="bg-warning text-warning-foreground text-xs">
          ⚠ Medium Confidence
        </Badge>
      );
    return (
      <Badge variant="destructive" className="text-xs">
        ✗ Low Confidence
      </Badge>
    );
  }

  const voiceText = result
    ? `Prescription Analysis. Medicine: ${result.medicineName}. Dosage: ${result.dosage}. Frequency: ${result.frequency}. Confidence: ${result.confidenceLevel}. Notes: ${result.notes}`
    : "";

  return (
    <div className="space-y-5">
      <ImageUploadZone
        onFileSelected={handleFileSelected}
        onRemove={handleRemove}
        previewUrl={previewUrl}
        accept="image/*"
        label="Upload prescription image"
      />

      <div className="space-y-1.5">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="rx-notes"
        >
          Additional notes{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <Textarea
          id="rx-notes"
          data-ocid="prescription.textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Patient name, date, or any visible text on the prescription..."
          className="min-h-[80px] resize-none text-sm"
        />
      </div>

      {error && (
        <div
          data-ocid="prescription.error_state"
          className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Button
        data-ocid="prescription.primary_button"
        className="w-full gap-2"
        onClick={handleAnalyze}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Reading prescription...
          </>
        ) : (
          <>
            <Pill className="w-4 h-4" />
            Analyze Prescription
          </>
        )}
      </Button>

      {mutation.isPending && (
        <div data-ocid="prescription.loading_state" className="space-y-2">
          <p className="text-xs text-muted-foreground text-center animate-pulse-ring">
            Reading handwriting and identifying medicines...
          </p>
          <div className="h-1.5 bg-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress" />
          </div>
        </div>
      )}

      {mutation.isError && (
        <div
          data-ocid="prescription.error_state"
          className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {mutation.error?.message ?? "Analysis failed. Please try again."}
        </div>
      )}

      {result && (
        <div
          data-ocid="prescription.success_state"
          className="animate-fade-slide space-y-4"
        >
          <div className="bg-card border border-border rounded-xl p-5 space-y-4 card-shadow">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-foreground">
                  Prescription Analysis
                </h3>
              </div>
              {confidenceBadge(result.confidenceLevel)}
            </div>
            <div className="grid gap-2.5">
              <ResultRow
                icon={<Pill className="w-4 h-4" />}
                label="Medicine Name"
                value={result.medicineName}
              />
              <ResultRow label="Dosage" value={result.dosage} />
              <ResultRow label="Frequency" value={result.frequency} />
              {result.notes && (
                <div className="bg-accent/40 rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-foreground">{result.notes}</p>
                </div>
              )}
            </div>
          </div>
          <DisclaimerBox text="Please verify this with a pharmacist or doctor before taking any medicine." />
          <VoiceButton text={voiceText} />
        </div>
      )}
    </div>
  );
}

function ResultRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  const isUnclear =
    value.toLowerCase().includes("unable") ||
    value.toLowerCase().includes("unclear");
  return (
    <div className="flex items-start justify-between gap-3 bg-accent/30 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2 shrink-0">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-medium text-right leading-relaxed ${
          isUnclear ? "text-muted-foreground italic" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function DisclaimerBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3.5">
      <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
      <p className="text-xs text-foreground/80 leading-relaxed">{text}</p>
    </div>
  );
}
