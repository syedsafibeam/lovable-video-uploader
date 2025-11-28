import { useState } from "react";
import { Check, Copy, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ResultCardProps {
  videoUrl: string;
  apiSent: boolean;
}

export const ResultCard = ({ videoUrl, apiSent }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleOpen = () => {
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="animate-scale-in space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-success/10 p-3 rounded-full">
          <Sparkles className="w-6 h-6 text-success" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Upload Complete!</h3>
          <p className="text-sm text-muted-foreground">Your video is ready to share</p>
        </div>
      </div>

      {apiSent && (
        <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20">
          <Check className="w-3 h-3 mr-1" />
          Sent to API
        </Badge>
      )}

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Shareable Link</label>
        <div className="flex gap-2">
          <div className="flex-1 bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground break-all">
            {videoUrl}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 shadow-soft"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            onClick={handleOpen}
            className="flex-1 bg-gradient-primary hover:opacity-90 shadow-soft"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Link
          </Button>
        </div>
      </div>
    </div>
  );
};
