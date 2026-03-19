import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type AnalysisType = "image" | "text" | "audio" | "video" | "eeg";

export interface AnalysisResult {
  [key: string]: any;
  analysis: string;
  recommendations: string[];
}

export function useAnalysis(type: AnalysisType) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async (content: string, imageBase64?: string) => {
    setLoading(true);
    setResult(null);
    try {
      const body: any = { type, content };
      if (imageBase64) body.imageBase64 = imageBase64;

      const { data, error } = await supabase.functions.invoke("analyze", { body });

      if (error) throw error;
      if (data?.error) {
        toast({ title: "Analysis Error", description: data.error, variant: "destructive" });
        return null;
      }

      setResult(data.result);

      // Save to DB (best effort, anonymous allowed)
      await supabase.from("analysis_results").insert({
        analysis_type: type,
        input_summary: content.slice(0, 200),
        result: data.result,
      } as any);

      return data.result;
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Analysis failed", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, loading, result };
}
