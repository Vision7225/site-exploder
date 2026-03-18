import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SleepRecord {
  hours: number;
  date: string;
}

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

  const chartData = records.map((r) => ({ date: r.date, hours: r.hours }));

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <MoodSelector selected={mood} onSelect={setMood} />

        {/* Hero */}
        <section className="rounded-lg p-8 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h1 className="text-2xl font-bold">Sleep Analysis & Tracking 🌙</h1>
          <p className="mt-2 opacity-90">Monitor your sleep patterns and improve mental wellness.</p>
        </section>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Last Night", value: `${lastSleep} hrs` },
            { label: "Quality", value: quality },
            { label: "Weekly Avg", value: `${avg} hrs` },
            { label: "Sleep Score", value: `${efficiency}%` },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg p-5 text-center shadow-sm">
              <h3 className="text-xl font-bold text-primary">{s.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Add Sleep Record</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-foreground">Bed Time</label>
              <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} className="block mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Wake Time</label>
              <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="block mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm" />
            </div>
            <button onClick={calculateSleep} className="px-5 py-2 rounded-lg text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              Save
            </button>
          </div>
          {duration && <p className="text-sm mt-3 font-medium text-foreground">Total Sleep: {duration}</p>}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Weekly Sleep Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Insight */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-2">AI Sleep Insight</h3>
          <p className="text-sm text-foreground">{insight}</p>
        </div>

        {/* History */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Sleep History</h3>
          {records.length === 0 && <p className="text-sm text-muted-foreground">No records yet.</p>}
          <div className="space-y-2">
            {[...records].reverse().map((r, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border text-sm">
                <span>{r.date} – {r.hours} hrs</span>
                <button onClick={() => deleteRecord(records.length - 1 - i)} className="text-destructive text-xs hover:opacity-70">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
