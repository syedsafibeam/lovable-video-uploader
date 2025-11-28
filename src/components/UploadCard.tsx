import { useCallback, useState } from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export const UploadCard = ({ onFileSelect, isUploading }: UploadCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-dashed bg-gradient-accent p-12 transition-all duration-300",
        isDragging
          ? "border-primary bg-accent scale-[1.02]"
          : "border-border hover:border-primary/50",
        isUploading && "pointer-events-none opacity-60"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-primary/10 p-6 rounded-full">
            {isDragging ? (
              <Upload className="w-12 h-12 text-primary animate-bounce-subtle" />
            ) : (
              <Video className="w-12 h-12 text-primary" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragging ? "Drop your video here" : "Upload Your Video"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Drag and drop your video file here, or click the button below to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supports MP4, MOV, WebM
          </p>
        </div>

        <label htmlFor="video-input">
          <Button
            type="button"
            size="lg"
            className="relative overflow-hidden bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Select Video
            </span>
          </Button>
          <input
            id="video-input"
            type="file"
            accept="video/mp4,video/mov,video/webm"
            className="hidden"
            onChange={handleFileInput}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
};
