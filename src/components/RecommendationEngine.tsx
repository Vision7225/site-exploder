import { motion } from "framer-motion";
import {
  Lightbulb, Wind, Coffee, Rocket, Music, BookOpen,
  Dumbbell, Heart, Sparkles, Timer, Leaf, Zap,
} from "lucide-react";

interface Recommendation {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  color: string;
  tag: string;
}

function getRecommendations(stressLevel: "high" | "medium" | "low"): Recommendation[] {
  if (stressLevel === "high") {
    return [
      {
        icon: Wind,
        title: "Guided Meditation",
        description: "Take 10 minutes for a calming meditation session. Deep breathing can reduce cortisol by up to 25%.",
        color: "hsl(256, 65%, 58%)",
        tag: "Meditation",
      },
      {
        icon: Music,
        title: "Calming Music",
        description: "Listen to binaural beats or nature sounds to lower your Beta wave activity.",
        color: "hsl(195, 85%, 47%)",
        tag: "Audio Therapy",
      },
      {
        icon: Heart,
        title: "Box Breathing",
        description: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 5 cycles for vagal nerve activation.",
        color: "hsl(0, 72%, 56%)",
        tag: "Breathing",
      },
      {
        icon: Leaf,
        title: "Nature Walk",
        description: "Even 15 minutes outdoors reduces stress hormones and boosts Alpha wave activity.",
        color: "hsl(152, 60%, 42%)",
        tag: "Exercise",
      },
    ];
  }

  if (stressLevel === "medium") {
    return [
      {
        icon: Coffee,
        title: "Take a Break",
        description: "Step away from your screen for 5-10 minutes. Micro-breaks restore cognitive resources.",
        color: "hsl(36, 90%, 52%)",
        tag: "Break",
      },
      {
        icon: Dumbbell,
        title: "Light Stretching",
        description: "Gentle stretches release physical tension and promote blood flow to the brain.",
        color: "hsl(152, 60%, 42%)",
        tag: "Exercise",
      },
      {
        icon: BookOpen,
        title: "Journaling",
        description: "Write down your thoughts for 5 minutes. Expressive writing reduces stress markers.",
        color: "hsl(225, 73%, 57%)",
        tag: "Mindfulness",
      },
      {
        icon: Timer,
        title: "Pomodoro Technique",
        description: "Work in 25-minute focused blocks with 5-minute breaks to manage cognitive load.",
        color: "hsl(256, 65%, 58%)",
        tag: "Productivity",
      },
    ];
  }

  // Low stress
  return [
    {
      icon: Rocket,
      title: "Deep Work Session",
      description: "Your stress is low — perfect time for complex, focused work. Enter a flow state.",
      color: "hsl(225, 73%, 57%)",
      tag: "Productivity",
    },
    {
      icon: Sparkles,
      title: "Creative Tasks",
      description: "Low stress and high Alpha waves are ideal for brainstorming and creative work.",
      color: "hsl(256, 65%, 58%)",
      tag: "Creativity",
    },
    {
      icon: BookOpen,
      title: "Learn Something New",
      description: "Your relaxed brain state is optimal for absorbing new information and skills.",
      color: "hsl(152, 60%, 42%)",
      tag: "Learning",
    },
    {
      icon: Zap,
      title: "Tackle Hard Problems",
      description: "With low cognitive load, your working memory is free for challenging tasks.",
      color: "hsl(36, 90%, 52%)",
      tag: "Challenge",
    },
  ];
}

function getStressLevel(stressPercent: number): "high" | "medium" | "low" {
  if (stressPercent >= 70) return "high";
  if (stressPercent >= 40) return "medium";
  return "low";
}

const LEVEL_CONFIG = {
  high: { label: "High Stress", color: "hsl(0, 72%, 56%)", bg: "bg-destructive/10" },
  medium: { label: "Moderate Stress", color: "hsl(36, 90%, 52%)", bg: "bg-warning/10" },
  low: { label: "Low Stress", color: "hsl(152, 60%, 42%)", bg: "bg-success/10" },
};

interface Props {
  stressPercent: number;
}

export default function RecommendationEngine({ stressPercent }: Props) {
  const level = getStressLevel(stressPercent);
  const levelConf = LEVEL_CONFIG[level];
  const recommendations = getRecommendations(level);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">AI Recommendations</h3>
        <span
          className="ml-auto text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full"
          style={{ background: `${levelConf.color}15`, color: levelConf.color }}
        >
          {levelConf.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((rec, i) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card p-5 hover:shadow-lg transition-all group cursor-default"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-shadow group-hover:shadow-md"
                  style={{ background: `${rec.color}12` }}
                >
                  <Icon className="w-5 h-5" style={{ color: rec.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground text-sm">{rec.title}</p>
                    <span
                      className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${rec.color}12`, color: rec.color }}
                    >
                      {rec.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
