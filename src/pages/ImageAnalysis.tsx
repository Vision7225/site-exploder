import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Image, Upload, Loader2, ImagePlus } from "lucide-react";

export default function ImageAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("image");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!preview) return;
    const base64 = preview.split(",")[1];
    analyze("Analyze this image for emotional indicators, facial expressions, body language, and overall mood.", base64);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-success" />
            </div>
            Image Analysis
          </h1>
          <p className="page-subtitle">Upload an image to detect emotions and get AI wellness insights</p>
        </div>

        <div onClick={() => fileRef.current?.click()} className="upload-zone reveal reveal-delay-1">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" style={{ boxShadow: "var(--shadow-md)" }} />
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
                <ImagePlus className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <p className="text-muted-foreground font-medium">Click to upload an image</p>
              <p className="text-xs text-muted-foreground/60">JPG, PNG up to 10MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {preview && (
          <button onClick={handleAnalyze} disabled={loading} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Image"}
          </button>
        )}

        {result && <AnalysisResultCard result={result} type="image" />}
      </div>
    </AppLayout>
  );
}
