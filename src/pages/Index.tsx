import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { Heart, Smile, Moon, Mic, Brain, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const moodMessages: Record<string, { title: string; message: string }> = {
  calm: { title: "Stay Calm 😌", message: "Breath in... Breath out. Your mind is at peace." },
  happy: { title: "Feeling Great! 😊", message: "Keep this energy going! Your wellness score is up." },
  neutral: { title: "Stay Steady 😐", message: "Balance is the key to life. Keep monitoring." },
  sad: { title: "Take it Easy 😞", message: "It's okay to not be okay. Try a breathing exercise." },
  angry: { title: "Cool Down 😡", message: "You are in control. Let's try some meditation." },
};

const vitals = [
  { icon: Heart, label: "Stress Level", value: "Medium", accent: "text-destructive", bg: "bg-destructive/8" },
  { icon: Smile, label: "Primary Emotion", value: "Positive", accent: "text-warning", bg: "bg-warning/8" },
  { icon: Moon, label: "Sleep Score", value: "85/100", accent: "text-primary", bg: "bg-primary/8" },
];

const activities = [
  { icon: Mic, module: "Audio Analysis", time: "10:30 AM", result: "Calm 😌", status: "Completed" },
  { icon: Brain, module: "EEG Scan", time: "Yesterday", result: "Focused ⚡", status: "Completed" },
];

const quickLinks = [
  { to: "/eeg", label: "EEG Scan", icon: Brain, desc: "Live brainwave analysis" },
  { to: "/image", label: "Image", icon: Heart, desc: "Emotion detection" },
  { to: "/text", label: "Text", icon: Lightbulb, desc: "Sentiment analysis" },
];

export default function HomePage() {
  const [mood, setMood] = useState("happy");
  const currentMood = moodMessages[mood] || moodMessages.happy;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Hero */}
        <section className="rounded-2xl p-8 md:p-10 text-primary-foreground relative overflow-hidden reveal reveal-delay-1" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsla(0,0%,100%,0.08),transparent_60%)]" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{currentMood.title}</h1>
            <p className="mt-3 opacity-85 text-base max-w-lg leading-relaxed">{currentMood.message}</p>
          </div>
        </section>

        <MoodSelector selected={mood} onSelect={setMood} />

        {/* AI Recommendation */}
        <div className="glass-card p-5 flex items-center gap-4 reveal reveal-delay-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-accent)" }}>
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-0.5">AI Recommendation</p>
            <p className="text-sm text-foreground leading-relaxed">Your EEG shows increased beta waves. Could you try a 5-minute meditation?</p>
          </div>
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal reveal-delay-2">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} className="glass-card p-5 group flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/15">
                <q.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{q.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{q.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-all group-hover:translate-x-0.5 mt-1" />
            </Link>
          ))}
        </div>

        {/* Vitals */}
        <div className="reveal reveal-delay-3">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Today's Vitals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vitals.map((v) => (
              <div key={v.label} className="glass-card p-6 text-center">
                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mx-auto mb-3`}>
                  <v.icon className={`w-6 h-6 ${v.accent}`} />
                </div>
                <h3 className="stat-label">{v.label}</h3>
                <p className="stat-value mt-1">{v.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="reveal reveal-delay-4">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
          <div className="section-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  <th className="pb-3 font-semibold">Module</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Result</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="py-4 flex items-center gap-2.5 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                        <a.icon className="w-4 h-4 text-primary" />
                      </div>
                      {a.module}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{a.time}</td>
                    <td className="py-4 text-sm">{a.result}</td>
                    <td className="py-4">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-success/10 text-success">{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
