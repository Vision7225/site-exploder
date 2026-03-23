import { motion } from "framer-motion";
import { Brain, Smile, AlertTriangle, Target } from "lucide-react";
import type { MentalStateResult } from "@/lib/mentalStateClassifier";

const STATE_CONFIG = {
  relaxed: {
    icon: Smile,
    label: "Relaxed",
    color: "hsl(152, 60%, 42%)",
    bg: "bg-success/10",
    text: "text-success",
    desc: "Your brain shows dominant Alpha waves indicating a calm, restful state.",
  },
  stressed: {
    icon: AlertTriangle,
    label: "Stressed",
    color: "hsl(0, 72%, 56%)",
    bg: "bg-destructive/10",
    text: "text-destructive",
    desc: "Elevated Beta activity suggests heightened arousal and cognitive load.",
  },
  focused: {
    icon: Target,
    label: "Focused",
    color: "hsl(225, 73%, 57%)",
    bg: "bg-primary/10",
    text: "text-primary",
    desc: "Strong Beta-Gamma ratio indicates deep concentration and engagement.",
  },
};

interface Props {
  prediction: MentalStateResult | null;
}

export default function MentalStatePrediction({ prediction }: Props) {
  if (!prediction) {
    return (
      <div className="section-card flex flex-col items-center justify-center py-10 text-center">
        <Brain className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">Run an EEG scan to get AI mental state prediction</p>
      </div>
    );
  }

  const config = STATE_CONFIG[prediction.state];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="section-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">AI Mental State Prediction</h3>
        <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          ML Model
        </span>
      </div>

      {/* Main prediction */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${config.color}15`, boxShadow: `0 0 20px ${config.color}15` }}
        >
          <Icon className="w-8 h-8" style={{ color: config.color }} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{config.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{config.desc}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-bold tabular-nums" style={{ color: config.color }}>
            {prediction.confidence}%
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Confidence</p>
        </div>
      </div>

      {/* Probability bars */}
      <div className="space-y-2.5">
        {(Object.keys(prediction.probabilities) as Array<keyof typeof STATE_CONFIG>).map((key) => {
          const c = STATE_CONFIG[key];
          const prob = prediction.probabilities[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-24 shrink-0">
                <c.icon className="w-3.5 h-3.5" style={{ color: c.color }} />
                <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
              </div>
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${prob}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                />
              </div>
              <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color: c.color }}>
                {prob}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
