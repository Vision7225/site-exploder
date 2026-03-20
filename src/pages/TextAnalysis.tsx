import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { FileText, Loader2, PenLine } from "lucide-react";

export default function TextAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("text");
  const [text, setText] = useState("");

  const handleAnalyze = () => { if (text.trim()) analyze(text); };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            Text Analysis
          </h1>
          <p className="page-subtitle">Enter text to analyze sentiment, emotions, and stress indicators</p>
        </div>

        <div className="section-card reveal reveal-delay-1">
          <div className="flex items-center gap-2 mb-3">
            <PenLine className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your text</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write or paste text here for AI mental wellness analysis…"
            className="input-field min-h-[180px] resize-none"
          />
          <p className="text-right text-xs text-muted-foreground/60 mt-1.5 tabular-nums">{text.length} characters</p>
        </div>

        <button onClick={handleAnalyze} disabled={loading || !text.trim()} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal reveal-delay-2">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Text"}
        </button>

        {result && <AnalysisResultCard result={result} type="text" />}
      </div>
    </AppLayout>
  );
}
