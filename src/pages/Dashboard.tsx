import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { Brain, Image, Mic, Video, FileText, Activity, TrendingUp, Calendar } from "lucide-react";

const moodConfig: Record<string, { title: string; insight: string; color: string }> = {
  calm: { title: "Calm Emotional State", insight: "Balanced emotional activity detected.", color: "hsl(195, 85%, 47%)" },
  happy: { title: "Positive Emotional Energy", insight: "Keep maintaining healthy routines.", color: "hsl(152, 60%, 42%)" },
  neutral: { title: "Stable Emotional Phase", insight: "Continue daily monitoring.", color: "hsl(220, 12%, 50%)" },
  sad: { title: "Low Emotional Phase", insight: "Consider journaling or chatbot support.", color: "hsl(256, 65%, 58%)" },
  angry: { title: "High Emotional Intensity", insight: "Breathing exercise recommended.", color: "hsl(0, 72%, 56%)" },
};

const TYPE_META: Record<string, { icon: typeof Brain; label: string; color: string }> = {
  eeg: { icon: Brain, label: "EEG", color: "hsl(225, 73%, 57%)" },
  image: { icon: Image, label: "Image", color: "hsl(152, 60%, 42%)" },
  audio: { icon: Mic, label: "Audio", color: "hsl(36, 90%, 52%)" },
  video: { icon: Video, label: "Video", color: "hsl(0, 72%, 56%)" },
  text: { icon: FileText, label: "Text", color: "hsl(195, 85%, 47%)" },
};
const PIE_COLORS = Object.values(TYPE_META).map((m) => m.color);

export default function DashboardPage() {
  const [mood, setMood] = useState("calm");
  const [score, setScore] = useState(0);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const config = moodConfig[mood] || moodConfig.calm;

  useEffect(() => {
    setScore(0);
    const target = 78;
    let c = 0;
    const iv = setInterval(() => { c++; setScore(c); if (c >= target) clearInterval(iv); }, 18);
    return () => clearInterval(iv);
  }, [mood]);

  useEffect(() => {
    supabase.from("analysis_results").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setAnalyses(data); });
  }, []);

  const typeCounts = analyses.reduce<Record<string, number>>((a, r) => { a[r.analysis_type] = (a[r.analysis_type] || 0) + 1; return a; }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name: TYPE_META[name]?.label || name, value }));
  const moodTimeline = analyses.filter((a) => a.result?.mood_score != null).slice(0, 15).reverse().map((a, i) => ({ idx: i + 1, score: Number(a.result.mood_score) }));
  const stressData = analyses.filter((a) => a.result?.stress_level).reduce<Record<string, number>>((acc, a) => { const lvl = String(a.result.stress_level); acc[lvl] = (acc[lvl] || 0) + 1; return acc; }, {});
  const stressBarData = Object.entries(stressData).map(([name, count]) => ({ name, count }));
  const totalAnalyses = analyses.length;
  const avgMood = moodTimeline.length ? (moodTimeline.reduce((s, m) => s + m.score, 0) / moodTimeline.length).toFixed(1) : "—";

  const statCards = [
    { label: "Total Analyses", value: totalAnalyses, icon: Activity, accent: "text-primary", bg: "bg-primary/8" },
    { label: "Avg Mood", value: avgMood, icon: TrendingUp, accent: "text-success", bg: "bg-success/8" },
    { label: "Types Used", value: Object.keys(typeCounts).length, icon: Brain, accent: "text-secondary", bg: "bg-secondary/8" },
    { label: "Today", value: analyses.filter((a) => new Date(a.created_at).toDateString() === new Date().toDateString()).length, icon: Calendar, accent: "text-warning", bg: "bg-warning/8" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <MoodSelector selected={mood} onSelect={setMood} />

        <section className="rounded-2xl p-8 text-primary-foreground relative overflow-hidden reveal reveal-delay-1" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsla(0,0%,100%,0.08),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-2xl font-bold">{config.title}</h2>
            <p className="mt-1.5 opacity-80 text-sm">{config.insight}</p>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal reveal-delay-2">
          {statCards.map((s) => (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.accent}`} />
                </div>
                <span className="stat-label">{s.label}</span>
              </div>
              <p className="stat-value">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Score + Timeline */}
        <div className="grid md:grid-cols-2 gap-6 reveal reveal-delay-3">
          <div className="section-card flex flex-col items-center justify-center py-8">
            <p className="stat-label mb-4">Wellness Score</p>
            <div className="w-40 h-40 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${config.color} ${score}%, hsl(var(--border)) 0%)`, boxShadow: `0 0 30px ${config.color}20` }}>
              <div className="w-[132px] h-[132px] rounded-full bg-card flex items-center justify-center text-3xl font-bold text-foreground tabular-nums">
                {score}%
              </div>
            </div>
          </div>
          <div className="section-card">
            <p className="stat-label mb-4">Mood Score Timeline</p>
            {moodTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="idx" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="hsl(225, 73%, 57%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm text-center mt-16">Run analyses to see trends</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 reveal reveal-delay-4">
          <div className="section-card">
            <p className="stat-label mb-4">Analysis Distribution</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm text-center mt-16">No data yet</p>}
          </div>
          <div className="section-card">
            <p className="stat-label mb-4">Stress Distribution</p>
            {stressBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stressBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(195, 85%, 47%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-sm text-center mt-16">No data yet</p>}
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-2xl p-7 text-primary-foreground relative overflow-hidden reveal reveal-delay-5" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-success animate-pulse" />
          <h3 className="font-bold">AI Insight</h3>
          <p className="mt-2 opacity-85 text-sm leading-relaxed">{config.insight}</p>
        </div>

        {/* Recent */}
        {analyses.length > 0 && (
          <div className="section-card reveal reveal-delay-5">
            <p className="stat-label mb-4">Recent Analyses</p>
            <div className="space-y-1.5">
              {analyses.slice(0, 8).map((a) => {
                const meta = TYPE_META[a.analysis_type];
                const Icon = meta?.icon || Activity;
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${meta?.color || "hsl(var(--primary))"}12` }}>
                      <Icon className="w-4 h-4" style={{ color: meta?.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.input_summary || a.analysis_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                    {a.result?.mood_score != null && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/8 text-primary tabular-nums">
                        {a.result.mood_score}/10
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
