import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Moon, Bed, Clock, TrendingUp, Trash2 } from "lucide-react";

interface SleepRecord { hours: number; date: string; }
const IDEAL_SLEEP = 8;

export default function SleepPage() {
  const [mood, setMood] = useState("neutral");
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [duration, setDuration] = useState("");
  const [records, setRecords] = useState<SleepRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sleepData");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const calculateSleep = () => {
    if (!bedTime || !wakeTime) return;
    const bed = new Date(`1970-01-01T${bedTime}`);
    let wake = new Date(`1970-01-01T${wakeTime}`);
    if (wake < bed) wake.setDate(wake.getDate() + 1);
    const hours = parseFloat(((wake.getTime() - bed.getTime()) / (1000 * 60 * 60)).toFixed(1));
    setDuration(`${hours} hrs`);
    const newRecords = [...records.slice(-6), { hours, date: new Date().toLocaleDateString() }];
    setRecords(newRecords);
    localStorage.setItem("sleepData", JSON.stringify(newRecords));
  };

  const deleteRecord = (index: number) => {
    const newRecords = records.filter((_, i) => i !== index);
    setRecords(newRecords);
    localStorage.setItem("sleepData", JSON.stringify(newRecords));
  };

  const lastSleep = records.length ? records[records.length - 1].hours : 0;
  const avg = records.length ? parseFloat((records.reduce((a, b) => a + b.hours, 0) / records.length).toFixed(1)) : 0;
  const efficiency = Math.min(100, Math.round((avg / IDEAL_SLEEP) * 100));
  const quality = avg >= 7.5 ? "Excellent" : avg >= 6.5 ? "Good" : avg >= 5.5 ? "Moderate" : "Poor";

  let insight = "Start tracking your sleep to get AI insights.";
  if (efficiency >= 90) insight = "Your sleep consistency is strong. Maintain current routine.";
  else if (efficiency >= 75) insight = "You're close to optimal sleep. Reduce screen time before bed.";
  else if (efficiency >= 60) insight = "Irregular sleep pattern detected. Try a fixed bedtime schedule.";
  else if (records.length > 0) insight = "High sleep debt detected. Mental wellness may be impacted.";

  const stats = [
    { icon: Moon, label: "Last Night", value: `${lastSleep} hrs`, accent: "text-primary", bg: "bg-primary/8" },
    { icon: TrendingUp, label: "Quality", value: quality, accent: "text-success", bg: "bg-success/8" },
    { icon: Clock, label: "Weekly Avg", value: `${avg} hrs`, accent: "text-warning", bg: "bg-warning/8" },
    { icon: Bed, label: "Sleep Score", value: `${efficiency}%`, accent: "text-accent", bg: "bg-accent/8" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <MoodSelector selected={mood} onSelect={setMood} />

        {/* Hero */}
        <section className="rounded-2xl p-8 text-primary-foreground relative overflow-hidden reveal reveal-delay-1" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsla(0,0%,100%,0.06),transparent_50%)]" />
          <div className="relative flex items-center gap-3">
            <Moon className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold">Sleep Analysis & Tracking</h1>
              <p className="mt-1 opacity-80 text-sm">Monitor sleep patterns and improve mental wellness</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal reveal-delay-2">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5 text-center">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className={`w-5 h-5 ${s.accent}`} />
              </div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="section-card reveal reveal-delay-3">
          <h3 className="text-sm font-semibold text-foreground mb-4">Add Sleep Record</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bed Time</label>
              <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} className="input-field mt-1.5 w-40" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wake Time</label>
              <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="input-field mt-1.5 w-40" />
            </div>
            <button onClick={calculateSleep} className="gradient-btn px-6 py-3 text-sm">Save</button>
          </div>
          {duration && <p className="text-sm mt-3 font-medium text-foreground">Total Sleep: {duration}</p>}
        </div>

        {/* Chart */}
        {records.length > 0 && (
          <div className="section-card reveal reveal-delay-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Sleep Chart</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={records.map((r) => ({ date: r.date, hours: r.hours }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Insight */}
        <div className="glass-card-static p-6 border-l-4 border-l-primary reveal reveal-delay-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Sleep Insight</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
        </div>

        {/* History */}
        <div className="section-card reveal reveal-delay-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Sleep History</h3>
          {records.length === 0 && <p className="text-sm text-muted-foreground">No records yet.</p>}
          <div className="space-y-2">
            {[...records].reverse().map((r, i) => (
              <div key={i} className="flex justify-between items-center py-3 px-4 rounded-xl bg-muted/40 group">
                <span className="text-sm font-medium">{r.date} — <span className="tabular-nums">{r.hours} hrs</span></span>
                <button onClick={() => deleteRecord(records.length - 1 - i)} className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
