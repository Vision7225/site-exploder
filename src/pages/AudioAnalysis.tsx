import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Mic, Upload, Loader2 } from "lucide-react";

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
    const content = description
      ? `Analyze the following audio content for mood and stress indicators: ${description}`
      : "No audio description provided";
    analyze(content);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Mic className="w-7 h-7 text-primary" />
            Audio Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Upload audio or describe speech content for AI mood detection.</p>
        </div>

        {/* Upload */}
        <div
          onClick={() => fileRef.current?.click()}
          className="bg-card border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          {fileName ? (
            <p className="text-foreground font-medium">{fileName}</p>
          ) : (
            <>
              <p className="text-muted-foreground">Click to upload audio file</p>
              <p className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-foreground block mb-2">
            Audio Content Description (optional - helps improve analysis)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is being said in the audio, the speaker's tone, pace, etc..."
            className="w-full h-32 p-4 rounded-lg border border-border bg-card text-foreground text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!fileName && !description.trim())}
          className="w-full py-3 rounded-xl text-primary-foreground font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "var(--gradient-hero)" }}
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Analyze Audio"}
        </button>

        {result && <AnalysisResultCard result={result} type="audio" />}
      </div>
    </AppLayout>
  );
}
