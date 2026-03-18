import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { Heart, Smile, Moon, Mic, Brain, Lightbulb } from "lucide-react";

const moodMessages: Record<string, { title: string; message: string }> = {
  calm: { title: "Stay Calm 😌", message: "Breath in... Breath out. Your mind is at peace." },
  happy: { title: "Feeling Great! 😊", message: "Keep this energy going! Your wellness score is up." },
  neutral: { title: "Stay Steady 😐", message: "Balance is the key to life. Keep monitoring." },
  sad: { title: "Take it Easy 😞", message: "It's okay to not be okay. Try a breathing exercise." },
  angry: { title: "Cool Down 😡", message: "You are in control. Let's try some meditation." },
};

const vitals = [
  { icon: Heart, label: "Stress Level", value: "Medium", color: "text-destructive" },
  { icon: Smile, label: "Primary Emotion", value: "Positive", color: "text-warning" },
  { icon: Moon, label: "Sleep Score", value: "85/100", color: "text-indigo-500" },
];

const activities = [
  { icon: Mic, module: "Audio Analysis", time: "10:30 AM", result: "Calm 😌", status: "Completed" },
  { icon: Brain, module: "EEG Scan", time: "Yesterday", result: "Focused ⚡", status: "Completed" },
];

export default function HomePage() {
  const [mood, setMood] = useState("happy");
  const currentMood = moodMessages[mood] || moodMessages.happy;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Mood Selector */}
        <MoodSelector selected={mood} onSelect={setMood} />

        {/* Hero */}
        <section className="rounded-lg p-8 text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          <h1 className="text-2xl font-bold m-0">{currentMood.title}</h1>
          <p className="mt-2 opacity-90">{currentMood.message}</p>
        </section>

        {/* AI Recommendation */}
        <div className="bg-card rounded-lg p-6 border-l-4 border-primary flex items-center gap-5 shadow-sm">
          <Lightbulb className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">AI Recommendation</p>
            <p className="text-sm text-foreground">Your EEG shows increased beta waves. Could you try a 5-minute meditation?</p>
          </div>
        </div>

        {/* Vitals */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Today's Vitals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {vitals.map((v) => (
              <div key={v.label} className="bg-card rounded-lg p-6 text-center shadow-sm">
                <v.icon className={`w-8 h-8 mx-auto mb-3 ${v.color}`} />
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{v.label}</h3>
                <p className="text-2xl font-bold text-foreground mt-2">{v.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card rounded-lg p-6 shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="pb-3 font-semibold">Module</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Result</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-4 flex items-center gap-2 text-sm">
                      <a.icon className="w-4 h-4 text-primary" />
                      {a.module}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{a.time}</td>
                    <td className="py-4 text-sm">{a.result}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success">{a.status}</span>
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
