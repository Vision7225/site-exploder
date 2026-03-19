import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Video, Upload, Loader2 } from "lucide-react";

export default function VideoAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("video");
  const [fileName, setFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setDescription(`Video file: ${file.name}, type: ${file.type}, duration: unknown`);
    }
  };

  const handleAnalyze = () => {
    const content = description
      ? `Analyze this video content for emotional expressions and body language: ${description}`
      : "No video description provided";
    analyze(content);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Video className="w-7 h-7 text-primary" />
            Emotion Video Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Upload video or describe content for AI emotion detection.</p>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="bg-card border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          {fileName ? (
            <p className="text-foreground font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-muted-foreground">Click to upload video file</p>
              <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground block mb-2">
            Video Content Description (describe what happens in the video)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe facial expressions, body language, scene context, speech content..."
            className="w-full h-32 p-4 rounded-lg border border-border bg-card text-foreground text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!fileName && !description.trim())}
          className="w-full py-3 rounded-xl text-primary-foreground font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "var(--gradient-hero)" }}
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Analyze Video"}
        </button>

        {result && <AnalysisResultCard result={result} type="video" />}
      </div>
    </AppLayout>
  );
}
