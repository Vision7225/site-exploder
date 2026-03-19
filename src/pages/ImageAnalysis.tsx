import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Image, Upload, Loader2 } from "lucide-react";

export default function ImageAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("image");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreview(dataUrl);
    };
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
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Image className="w-7 h-7 text-primary" />
            Image Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Upload an image to detect emotions and get AI wellness insights.</p>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="bg-card border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Click to upload an image</p>
              <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {preview && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl text-primary-foreground font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-hero)" }}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Analyze Image"}
          </button>
        )}

        {result && <AnalysisResultCard result={result} type="image" />}
      </div>
    </AppLayout>
  );
}
