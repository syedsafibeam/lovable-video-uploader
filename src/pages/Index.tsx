import axios from "axios";
import { useEffect, useState } from "react";
import { UploadCard } from "@/components/UploadCard";
import { ResultCard } from "@/components/ResultCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";

const API_ENDPOINT_TWELVELABS = "https://api.twelvelabs.io/v1.3/tasks";
const API_ENDPOINT_BEAM = "https://hackathon-be-sepia.vercel.app";

const sendDataToBeam = async (data, niche) => {
  let res = null;

  try {
    const response = await axios.post(
      `${API_ENDPOINT_BEAM}/forward`,
      {
        taskQuery: JSON.stringify({
          ...data,
          video_id: data._id,
          niche: niche,
        }),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res = response.data;
  } catch (error) {
    console.warn(error);
  }

  return res;
};

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [niche, setNiche] = useState("academic-presentation");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [responseDataLoading, setResponseDataLoading] = useState(false);
  const [videoDataEl, setVideoDataEl] = useState(null);

  let interval = null;
  let interval1 = null;

  const uploadVideoToApi = async (file: File) => {
    const formData = new FormData();
    formData.append("method", "direct");
    formData.append("video_file", file);
    formData.append("index_id", "6929d856a9c790236c0aa856");

    try {
      const response = await axios.post(API_ENDPOINT_TWELVELABS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "tlk_286NXRQ0B0JJ7J2WKX3Z53A905DW",
        },
      });

      interval1 = setInterval(async () => {
        const response1 = await axios.get(
          `${API_ENDPOINT_TWELVELABS}/${response.data._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "tlk_286NXRQ0B0JJ7J2WKX3Z53A905DW",
            },
          }
        );

        if (response1.data.status === "ready") {
          setVideoDataEl(response.data);
          clearInterval(interval1);
          setIsUploading(false);
        }
      }, 5000);
    } catch (error) {
      console.warn(error);
    }
  };

  const convertKeysToLowerCase = (obj: Record<string, string>) => {
    if (obj === null || typeof obj !== "object") return {};
    return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
      acc[key.toLowerCase()] = obj[key] ?? "";
      return acc;
    }, {});
  };

  const pollTaskData = async (currTaskId) => {
    if (currTaskId && !responseData) {
      try {
        const response = await axios.get(
          `${API_ENDPOINT_BEAM}/forward-task?taskId=${currTaskId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "current-workspace-id": "c3896c44-7117-4010-a656-c4dde4ee811f",
            },
          }
        );

        if (response.data.status === "COMPLETED") {
          const { agentTaskNodes } = response.data;
          const step = agentTaskNodes[agentTaskNodes.length - 1];

          if (step) {
            const output =
              !step?.output?.value?.error &&
              Array.isArray(
                step?.agentGraphNode?.toolConfiguration?.outputParams
              ) &&
              step?.agentGraphNode?.toolConfiguration?.outputParams.length > 0
                ? step?.agentGraphNode?.toolConfiguration?.outputParams
                    ?.filter((param) => !param.parentId)
                    ?.reduce((acc, param) => {
                      acc[(param?.paramName as string).toLowerCase()] =
                        (convertKeysToLowerCase(
                          step?.output?.value as unknown as Record<
                            string,
                            string
                          >
                        )?.[
                          (param.paramName as string).toLowerCase()
                        ] as string) || "No output available";
                      return acc;
                    }, {} as Record<string, string>)
                : step?.output?.value;

            setResponseData(output);
            setResponseDataLoading(false);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const handleFileSelect = async () => {
    if (!uploadedFile) {
      toast.error("Please select a video file first.");
      return;
    }

    setIsUploading(true);

    try {
      const res = await uploadVideoToApi(uploadedFile);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  useEffect(() => {
    const func = async () => {
      const res1 = await sendDataToBeam(videoDataEl, niche);

      if (res1) {
        setTaskId(res1.upstreamResponse[0].id || null);
        setResponseDataLoading(true);

        interval = setInterval(() => {
          pollTaskData(res1.upstreamResponse[0].id);
        }, 10000);
      }
    };
    if (videoDataEl) {
      func();
    }
  }, [videoDataEl]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 animate-scale-in">
          <h1 className="text-4xl font-bold text-foreground">PitchScore AI</h1>

          {!taskId && (
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Upload your video and we'll analyze and give you the feedback.
            </p>
          )}
        </div>

        {/* Main Card */}

        {taskId ? (
          <>
            {responseDataLoading ? (
              <>
                <Card className="shadow-medium overflow-hidden border-border/50">
                  <p style={{ textAlign: "center", padding: "50px 0px" }}>
                    Your feedback is loading, please wait...
                  </p>
                </Card>
              </>
            ) : (
              <Card className="shadow-medium overflow-hidden border-border/50 p-4">
                <p
                  style={{
                    fontSize: "20px",
                    marginBottom: "20px",
                    fontWeight: "600",
                  }}
                >
                  Score:{" "}
                  <span
                    style={{ color: responseData.score > 80 ? "Green" : "Red" }}
                  >
                    {responseData.score > 80 ? "Good" : "Bad"}
                  </span>
                </p>
                <ReactMarkdown>{responseData.summary}</ReactMarkdown>
              </Card>
            )}
          </>
        ) : (
          <>
            <Card className="shadow-medium overflow-hidden border-border/50">
              <div className="p-8 space-y-6">
                <UploadCard
                  onFileSelect={(file) => setUploadedFile(file)}
                  isUploading={isUploading}
                />
              </div>
            </Card>

            <Card className="shadow-medium overflow-hidden border-border/50">
              <div className="p-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Category
                </label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic-presentation">
                      Academic Presentation
                    </SelectItem>
                    <SelectItem value="investor-pitch">
                      Investor Pitch
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Button
              className="w-full"
              onClick={handleFileSelect}
              disabled={!uploadedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
