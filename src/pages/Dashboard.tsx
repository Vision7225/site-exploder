import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { Brain, Image, Mic, Video, FileText, Activity, TrendingUp, Calendar } from "lucide-react";

const moodConfig: Record<string, { title: string; insight: string; color: string }> = {
  calm: { title: "Calm Emotional State", insight: "Balanced emotional activity detected.", color: "hsl(199, 89%, 48%)" },
  happy: { title: "Positive Emotional Energy", insight: "Keep maintaining healthy routines.", color: "hsl(142, 71%, 45%)" },
  neutral: { title: "Stable Emotional Phase", insight: "Continue daily monitoring.", color: "hsl(215, 16%, 47%)" },
  sad: { title: "Low Emotional Phase", insight: "Consider journaling or chatbot support.", color: "hsl(240, 6%, 10%)" },
  angry: { title: "High Emotional Intensity", insight: "Breathing exercise recommended.", color: "hsl(0, 84%, 60%)" },
};

const TYPE_META: Record<string, { icon: typeof Brain; label: string; color: string }> = {
  eeg: { icon: Brain, label: "EEG", color: "hsl(221, 83%, 53%)" },
  image: { icon: Image, label: "Image", color: "hsl(142, 71%, 45%)" },
  audio: { icon: Mic, label: "Audio", color: "hsl(38, 92%, 50%)" },
  video: { icon: Video, label: "Video", color: "hsl(0, 84%, 60%)" },
  text: { icon: FileText, label: "Text", color: "hsl(199, 89%, 48%)" },
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
    const iv = setInterval(() => { c++; setScore(c); if (c >= target) clearInterval(iv); }, 20);
    return () => clearInterval(iv);
  }, [mood]);

  useEffect(() => {
    supabase
      .from("analysis_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => { if (data) setAnalyses(data); });
  }, []);

  // Derived analytics
  const typeCounts = analyses.reduce<Record<string, number>>((a, r) => {
    a[r.analysis_type] = (a[r.analysis_type] || 0) + 1;
    return a;
  }, {});

  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name: TYPE_META[name]?.label || name, value }));

  const moodTimeline = analyses
    .filter((a) => a.result?.mood_score != null)
    .slice(0, 15)
    .reverse()
    .map((a, i) => ({
      idx: i + 1,
      score: Number(a.result.mood_score),
      type: TYPE_META[a.analysis_type]?.label || a.analysis_type,
    }));

  const stressData = analyses
    .filter((a) => a.result?.stress_level)
    .reduce<Record<string, number>>((acc, a) => {
      const lvl = typeof a.result.stress_level === "string" ? a.result.stress_level : String(a.result.stress_level);
      acc[lvl] = (acc[lvl] || 0) + 1;
      return acc;
    }, {});
  const stressBarData = Object.entries(stressData).map(([name, count]) => ({ name, count }));

  const totalAnalyses = analyses.length;
  const avgMood = moodTimeline.length
    ? (moodTimeline.reduce((s, m) => s + m.score, 0) / moodTimeline.length).toFixed(1)
    : "—";

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <MoodSelector selected={mood} onSelect={setMood} />

        {/* Hero */}
        <section className="rounded-2xl p-8 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="text-2xl font-bold">{config.title}</h2>
          <p className="mt-1 opacity-80 text-sm">{config.insight}</p>
        </section>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Analyses", value: totalAnalyses, icon: Activity, accent: "text-primary" },
            { label: "Avg Mood Score", value: avgMood, icon: TrendingUp, accent: "text-success" },
            { label: "Analysis Types", value: Object.keys(typeCounts).length, icon: Brain, accent: "text-secondary" },
            { label: "This Session", value: analyses.filter((a) => {
                const d = new Date(a.created_at);
                return d.toDateString() === new Date().toDateString();
              }).length, icon: Calendar, accent: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-5 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.accent}`} />
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Score ring + Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Score circle */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Wellness Score</p>
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${config.color} ${score}%, hsl(var(--border)) 0%)`,
                boxShadow: `0 0 40px ${config.color}30`,
              }}
            >
              <div className="w-[148px] h-[148px] rounded-full bg-card flex items-center justify-center text-4xl font-bold text-foreground">
                {score}%
              </div>
            </div>
          </div>

          {/* Mood timeline */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Mood Score Timeline</p>
            {moodTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="idx" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center mt-12">Run some analyses to see mood trends</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Analysis type distribution */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Analysis Distribution</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center mt-12">No analyses yet</p>
            )}
          </div>

          {/* Stress distribution */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Stress Level Distribution</p>
            {stressBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stressBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(199, 89%, 48%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center mt-12">No stress data yet</p>
            )}
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-2xl p-8 text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-success animate-pulse" />
          <h3 className="font-bold text-lg">AI Insight</h3>
          <p className="mt-2 opacity-90">{config.insight}</p>
        </div>

        {/* Recent analyses */}
        {analyses.length > 0 && (
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-4">Recent Analyses</p>
            <div className="space-y-2">
              {analyses.slice(0, 8).map((a) => {
                const meta = TYPE_META[a.analysis_type];
                const Icon = meta?.icon || Activity;
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${meta?.color || "hsl(var(--primary))"}20` }}>
                      <Icon className="w-4 h-4" style={{ color: meta?.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {a.input_summary || a.analysis_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                    {a.result?.mood_score != null && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Mood: {a.result.mood_score}/10
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
