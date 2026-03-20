import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Mic, Upload, Loader2, Music } from "lucide-react";

export default function AudioAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("audio");
  const [fileName, setFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setDescription(`Audio file: ${file.name}, type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB`);
    }
  };

  const handleAnalyze = () => {
    analyze(description ? `Analyze the following audio content for mood and stress indicators: ${description}` : "No audio description provided");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-warning" />
            </div>
            Audio Analysis
          </h1>
          <p className="page-subtitle">Upload audio or describe speech content for AI mood detection</p>
        </div>

        <div onClick={() => fileRef.current?.click()} className="upload-zone reveal reveal-delay-1">
          <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
            <Music className="w-7 h-7 text-muted-foreground/60" />
          </div>
          {fileName ? (
            <p className="text-foreground font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-muted-foreground font-medium">Click to upload audio</p>
              <p className="text-xs text-muted-foreground/60 mt-1">MP3, WAV, M4A</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
        </div>

        <div className="section-card reveal reveal-delay-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Content description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the speaker's tone, pace, emotional context…"
            className="input-field min-h-[120px] resize-none"
          />
        </div>

        <button onClick={handleAnalyze} disabled={loading || (!fileName && !description.trim())} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal reveal-delay-3">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Audio"}
        </button>

        {result && <AnalysisResultCard result={result} type="audio" />}
      </div>
    </AppLayout>
  );
}
