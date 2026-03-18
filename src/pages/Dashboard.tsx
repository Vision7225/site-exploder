import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";

const moodConfig: Record<string, { title: string; insight: string; color: string }> = {
  calm: { title: "Calm Emotional State", insight: "Balanced emotional activity detected.", color: "hsl(199, 89%, 48%)" },
  happy: { title: "Positive Emotional Energy", insight: "Keep maintaining healthy routines.", color: "hsl(142, 71%, 45%)" },
  neutral: { title: "Stable Emotional Phase", insight: "Continue daily monitoring.", color: "hsl(215, 16%, 47%)" },
  sad: { title: "Low Emotional Phase", insight: "Consider journaling or chatbot support.", color: "hsl(240, 6%, 10%)" },
  angry: { title: "High Emotional Intensity", insight: "Breathing exercise recommended.", color: "hsl(0, 84%, 60%)" },
};

export default function DashboardPage() {
  const [mood, setMood] = useState("calm");
  const [score, setScore] = useState(0);
  const config = moodConfig[mood] || moodConfig.calm;

  useEffect(() => {
    setScore(0);
    const target = 78;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setScore(current);
      if (current >= target) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [mood]);

  const bars = [
    { label: "Audio", value: 65 },
    { label: "Visual", value: 50 },
    { label: "EEG", value: 55 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <MoodSelector selected={mood} onSelect={setMood} />

        {/* Hero */}
        <section className="rounded-lg p-8 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="text-2xl font-bold">{config.title}</h2>
        </section>

        {/* Score Circle */}
        <div className="flex justify-center">
          <div
            className="w-52 h-52 rounded-full flex items-center justify-center animate-float"
            style={{
              background: `conic-gradient(${config.color} ${score}%, hsl(var(--border)) 0%)`,
              boxShadow: `0 0 50px ${config.color}40`,
            }}
          >
            <div className="w-[170px] h-[170px] rounded-full bg-card flex items-center justify-center text-4xl font-bold text-foreground">
              {score}%
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bars.map((bar) => (
            <div key={bar.label} className="bg-card rounded-lg p-6 shadow-sm backdrop-blur-lg">
              <p className="text-sm font-semibold text-foreground mb-3">{bar.label}</p>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${bar.value}%`, background: "var(--gradient-primary)" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{bar.value}%</p>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="rounded-lg p-8 text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-success animate-pulse-glow" />
          <h3 className="font-bold text-lg">AI Insight</h3>
          <p className="mt-2 opacity-90">{config.insight}</p>
        </div>
      </div>
    </AppLayout>
  );
}
