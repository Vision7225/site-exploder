import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { Video, Loader2, Film, Upload, Camera, Square, Circle, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function VideoAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("video");
  const [fileName, setFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const rec = useVideoRecorder();
  const [activeTab, setActiveTab] = useState("upload");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setDescription(`Video file: ${file.name}, type: ${file.type}, duration: unknown`);
    }
  };

  const handleAnalyze = () => {
    if (activeTab === "record" && rec.capturedFrame) {
      const base64 = rec.capturedFrame.split(",")[1];
      analyze("Analyze this video frame for emotional expressions, facial emotions, and body language.", base64);
    } else {
      analyze(description ? `Analyze this video content for emotional expressions and body language: ${description}` : "No video description provided");
    }
  };

  const canAnalyze = activeTab === "upload" ? (!!fileName || !!description.trim()) : !!rec.recordedUrl;

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-destructive" />
            </div>
            Emotion Video Analysis
          </h1>
          <p className="page-subtitle">Upload video or record from camera for AI emotion detection</p>
        </div>

        <Tabs defaultValue="upload" className="reveal reveal-delay-1" onValueChange={(v) => { setActiveTab(v); setFileName(null); setDescription(""); rec.reset(); rec.closeCamera(); }}>
          <TabsList className="w-full grid grid-cols-2 bg-muted/50">
            <TabsTrigger value="upload" className="gap-2"><Upload className="w-4 h-4" /> Upload</TabsTrigger>
            <TabsTrigger value="record" className="gap-2"><Camera className="w-4 h-4" /> Record</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div onClick={() => fileRef.current?.click()} className="upload-zone">
              <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                <Film className="w-7 h-7 text-muted-foreground/60" />
              </div>
              {fileName ? (
                <p className="text-foreground font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-muted-foreground font-medium">Click to upload video</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">MP4, MOV, AVI</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
            </div>
          </TabsContent>

          <TabsContent value="record">
            <div className="section-card space-y-4">
              {rec.error && <p className="text-destructive text-sm text-center">{rec.error}</p>}

              {rec.isStreaming && (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video ref={rec.videoRef} autoPlay playsInline muted className="w-full rounded-xl" />

                  {/* Timer overlay */}
                  {rec.isRecording && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                      <span className="text-sm font-mono font-bold text-white">{rec.formatTime(rec.elapsed)}</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    {!rec.isRecording ? (
                      <button onClick={rec.startRecording} className="gradient-btn px-6 py-2.5 flex items-center gap-2 text-sm">
                        <Circle className="w-4 h-4 fill-current" /> Record
                      </button>
                    ) : (
                      <button onClick={rec.stopRecording} className="px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm flex items-center gap-2">
                        <Square className="w-4 h-4 fill-current" /> Stop
                      </button>
                    )}
                    <button onClick={rec.closeCamera} className="px-4 py-2.5 rounded-xl bg-muted/80 text-foreground text-sm flex items-center gap-1">
                      <X className="w-4 h-4" /> Close
                    </button>
                  </div>
                </div>
              )}

              {rec.recordedUrl && !rec.isStreaming && (
                <div className="space-y-3">
                  <video src={rec.recordedUrl} controls className="w-full rounded-xl" />
                  <button onClick={() => { rec.reset(); rec.openCamera(); }} className="text-sm text-primary underline mx-auto block">Record Again</button>
                </div>
              )}

              {!rec.isStreaming && !rec.recordedUrl && (
                <button onClick={rec.openCamera} className="gradient-btn w-full py-3 flex items-center gap-2 justify-center">
                  <Camera className="w-5 h-5" /> Open Camera
                </button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {activeTab === "upload" && (
          <div className="section-card reveal reveal-delay-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Video content description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe facial expressions, body language, scene context…"
              className="input-field min-h-[120px] resize-none"
            />
          </div>
        )}

        <button onClick={handleAnalyze} disabled={loading || !canAnalyze} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal reveal-delay-3">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Video"}
        </button>

        {result && <AnalysisResultCard result={result} type="video" />}
      </div>
    </AppLayout>
  );
}
