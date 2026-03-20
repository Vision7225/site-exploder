import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Video, Loader2, Film } from "lucide-react";

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
    analyze(description ? `Analyze this video content for emotional expressions and body language: ${description}` : "No video description provided");
  };

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
          <p className="page-subtitle">Upload video or describe content for AI emotion detection</p>
        </div>

        <div onClick={() => fileRef.current?.click()} className="upload-zone reveal reveal-delay-1">
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

        <div className="section-card reveal reveal-delay-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Video content description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe facial expressions, body language, scene context…"
            className="input-field min-h-[120px] resize-none"
          />
        </div>

        <button onClick={handleAnalyze} disabled={loading || (!fileName && !description.trim())} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal reveal-delay-3">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Video"}
        </button>

        {result && <AnalysisResultCard result={result} type="video" />}
      </div>
    </AppLayout>
  );
}
