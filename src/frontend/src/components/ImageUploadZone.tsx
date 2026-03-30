import { Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ImageUploadZoneProps {
  onFileSelected: (file: File) => void;
  onRemove: () => void;
  previewUrl: string | null;
  accept?: string;
  label?: string;
}

export function ImageUploadZone({
  onFileSelected,
  onRemove,
  previewUrl,
  accept = "image/*",
  label = "Upload an image",
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      e.target.value = "";
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type.startsWith("image/")) {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  if (previewUrl) {
    return (
      <div className="relative rounded-xl border border-border overflow-hidden bg-accent/20">
        <img
          src={previewUrl}
          alt="Uploaded preview"
          className="w-full max-h-48 object-contain block"
        />
        <button
          type="button"
          onClick={onRemove}
          data-ocid="upload.close_button"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground transition-colors"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all active:scale-[0.99] select-none ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/30"
      }`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-label={label}
      data-ocid="upload.dropzone"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          isDragOver ? "bg-primary/20" : "bg-primary/10"
        }`}
      >
        <Upload
          className={`w-7 h-7 transition-colors ${
            isDragOver ? "text-primary" : "text-primary/70"
          }`}
        />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          Click to upload or drag &amp; drop
        </p>
        <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        data-ocid="upload.upload_button"
      />
    </button>
  );
}
