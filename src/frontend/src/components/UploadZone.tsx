import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  preview: string | null;
  onClear: () => void;
  accept?: string;
}

export function UploadZone({
  onFileSelected,
  preview,
  onClear,
  accept = "image/*",
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file?.type.startsWith("image/")) {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-accent/30">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-56 object-contain p-2"
        />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 bg-card rounded-full p-1 shadow-xs border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label
      data-ocid="upload.dropzone"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed
        transition-colors cursor-pointer
        ${
          isDragging
            ? "border-primary bg-accent/60"
            : "border-border bg-accent/20 hover:bg-accent/40 hover:border-primary/50"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Drag & drop an image here, or
        </p>
        <Button
          data-ocid="upload.upload_button"
          type="button"
          size="sm"
          className="mt-2 pointer-events-none"
          tabIndex={-1}
        >
          Browse Files
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Supports JPG, PNG, HEIC, WebP
      </p>
    </label>
  );
}
