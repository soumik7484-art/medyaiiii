import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2, Pill } from "lucide-react";
import { useCallback, useState } from "react";
import { useAnalyzePrescription } from "../hooks/useQueries";
import { UploadZone } from "./UploadZone";
import { VoiceButton } from "./VoiceButton";

export function PrescriptionTab() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [medicineHint, setMedicineHint] = useState("");
  const [error, setError] = useState("");

  const mutation = useAnalyzePrescription();

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
    setMedicineHint("");
    mutation.reset();
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload an image of the prescription first.");
      return;
    }
    setError("");
    const inputText = medicineHint.trim()
      ? `${medicineHint.trim()} (file: ${file.name})`
      : file.name;
    mutation.mutate(inputText);
  };

  const result = mutation.data;

  const confidenceBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l === "high")
      return (
        <Badge className="bg-success text-success-foreground">
          High Confidence
        </Badge>
      );
    if (l === "medium")
      return (
        <Badge className="bg-warning text-warning-foreground">
          Medium Confidence
        </Badge>
      );
    return <Badge variant="destructive">Low Confidence</Badge>;
  };

  const voiceText = result
    ? `Prescription Analysis. Medicine: ${result.medicineName}. Dosage: ${result.dosage}. Frequency: ${result.frequency}. Confidence: ${result.confidenceLevel}. ${result.notes}`
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
            htmlFor="medicine-hint"
            className="text-sm font-medium text-foreground"
          >
            Type the medicine name if visible
          </Label>
          <Input
            id="medicine-hint"
            data-ocid="prescription.input"
            placeholder="e.g. Amoxicillin, Paracetamol, Metformin"
            value={medicineHint}
            onChange={(e) => setMedicineHint(e.target.value)}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Optional — helps the AI recognise the medicine from the prescription
            image.
          </p>
        </div>
      )}

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
            Analyzing prescription...
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
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Processing image...</span>
            <span className="animate-pulse-ring">Please wait</span>
          </div>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-foreground">
                  Analysis Result
                </h3>
              </div>
              {confidenceBadge(result.confidenceLevel)}
            </div>

            <div className="grid gap-3">
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
}: { icon?: React.ReactNode; label: string; value: string }) {
  const isUnclear =
    value.toLowerCase().includes("unable") ||
    value.toLowerCase().includes("unclear");
  return (
    <div className="flex items-start justify-between gap-3 bg-accent/30 rounded-lg px-4 py-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-medium text-right ${isUnclear ? "text-muted-foreground italic" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

function DisclaimerBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl px-4 py-3">
      <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
      <p className="text-xs text-foreground/80 leading-relaxed">{text}</p>
    </div>
  );
}

export { DisclaimerBox };
