import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Activity } from "lucide-react";

interface Props {
  result: Record<string, any>;
  type: string;
}

export default function AnalysisResultCard({ result, type }: Props) {
  const moodScore = result.mood_score || result.overall_mood || 0;
  const stressLevel = result.stress_level || "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {moodScore > 0 && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground uppercase font-semibold">Mood Score</p>
            <p className="text-2xl font-bold text-foreground">{moodScore}/10</p>
          </div>
        )}
        {result.confidence && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <Activity className="w-6 h-6 mx-auto mb-2 text-success" />
            <p className="text-xs text-muted-foreground uppercase font-semibold">Confidence</p>
            <p className="text-2xl font-bold text-foreground">{result.confidence}%</p>
          </div>
        )}
        {result.emotion && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Emotion</p>
            <p className="text-lg font-bold text-foreground capitalize mt-2">{result.emotion}</p>
          </div>
        )}
        {result.primary_emotion && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Primary Emotion</p>
            <p className="text-lg font-bold text-foreground capitalize mt-2">{result.primary_emotion}</p>
          </div>
        )}
        {stressLevel !== "N/A" && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Stress Level</p>
            <p className={`text-lg font-bold capitalize mt-2 ${
              stressLevel === "high" ? "text-destructive" :
              stressLevel === "medium" ? "text-warning" : "text-success"
            }`}>{stressLevel}</p>
          </div>
        )}
        {result.focus_score !== undefined && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Focus</p>
            <p className="text-2xl font-bold text-foreground">{result.focus_score}%</p>
          </div>
        )}
        {result.relaxation_score !== undefined && (
          <div className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Relaxation</p>
            <p className="text-2xl font-bold text-foreground">{result.relaxation_score}%</p>
          </div>
        )}
      </div>

      {/* Analysis Text */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="font-semibold text-foreground mb-3">AI Analysis</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
      </div>

      {/* Keywords */}
      {result.keywords && result.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((kw: string, i: number) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-card rounded-lg p-6 shadow-sm border-l-4 border-primary border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {result.recommendations.map((r: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-success font-bold mt-0.5">✔</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
