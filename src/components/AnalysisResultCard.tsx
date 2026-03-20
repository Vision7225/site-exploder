import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Activity, Zap, Heart, Brain } from "lucide-react";

interface Props {
  result: Record<string, any>;
  type: string;
}

export default function AnalysisResultCard({ result, type }: Props) {
  const moodScore = result.mood_score || result.overall_mood || 0;
  const stressLevel = result.stress_level || "N/A";

  const statCards = [
    moodScore > 0 && { icon: TrendingUp, label: "Mood Score", value: `${moodScore}/10`, accent: "text-primary" },
    result.confidence && { icon: Activity, label: "Confidence", value: `${result.confidence}%`, accent: "text-success" },
    result.emotion && { icon: Heart, label: "Emotion", value: result.emotion, accent: "text-accent" },
    result.primary_emotion && { icon: Heart, label: "Primary Emotion", value: result.primary_emotion, accent: "text-accent" },
    stressLevel !== "N/A" && {
      icon: Zap,
      label: "Stress",
      value: stressLevel,
      accent: stressLevel === "high" ? "text-destructive" : stressLevel === "medium" ? "text-warning" : "text-success",
    },
    result.focus_score !== undefined && { icon: Brain, label: "Focus", value: `${result.focus_score}%`, accent: "text-primary" },
    result.relaxation_score !== undefined && { icon: Activity, label: "Relaxation", value: `${result.relaxation_score}%`, accent: "text-secondary" },
  ].filter(Boolean) as { icon: any; label: string; value: string; accent: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass-card p-4 text-center"
          >
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.accent}`} />
            <p className="stat-label">{s.label}</p>
            <p className="text-xl font-bold text-foreground capitalize mt-1 tabular-nums">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Analysis */}
      <div className="section-card">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          AI Analysis
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
      </div>

      {/* Keywords */}
      {result.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((kw: string, i: number) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/8 text-primary border border-primary/10">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="glass-card-static p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Recommendations</h3>
          </div>
          <ul className="space-y-2.5">
            {result.recommendations.map((r: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-success text-xs font-bold">✓</span>
                </div>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
