import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { FileText, Loader2 } from "lucide-react";

export default function TextAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("text");
  const [text, setText] = useState("");

  const handleAnalyze = () => {
    if (!text.trim()) return;
    analyze(text);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" />
            Text Analysis
          </h1>
          <p className="text-muted-foreground mt-1">Enter text to analyze sentiment, emotions, and stress indicators.</p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write or paste text here for AI mental wellness analysis..."
          className="w-full h-48 p-4 rounded-lg border border-border bg-card text-foreground text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="w-full py-3 rounded-xl text-primary-foreground font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "var(--gradient-hero)" }}
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Analyze Text"}
        </button>

        {result && <AnalysisResultCard result={result} type="text" />}
      </div>
    </AppLayout>
  );
}
