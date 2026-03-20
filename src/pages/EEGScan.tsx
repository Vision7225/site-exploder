import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Brain, Play, Square, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface WavePoint {
  time: number;
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  gamma: number;
}

function generateWavePoint(time: number): WavePoint {
  return {
    time,
    alpha: Math.round(8 + Math.random() * 5 + Math.sin(time * 0.3) * 3),
    beta: Math.round(13 + Math.random() * 8 + Math.cos(time * 0.5) * 4),
    theta: Math.round(4 + Math.random() * 4 + Math.sin(time * 0.2) * 2),
    delta: Math.round(1 + Math.random() * 3 + Math.cos(time * 0.1) * 1.5),
    gamma: Math.round(30 + Math.random() * 10 + Math.sin(time * 0.7) * 5),
  };
}

const waveColors = {
  alpha: "hsl(225, 73%, 57%)",
  beta: "hsl(0, 72%, 56%)",
  theta: "hsl(152, 60%, 42%)",
  delta: "hsl(36, 90%, 52%)",
  gamma: "hsl(256, 65%, 58%)",
};

export default function EEGScanPage() {
  const { analyze, loading, result } = useAnalysis("eeg");
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState<WavePoint[]>([]);
  const [elapsed, setElapsed] = useState(0);

  const startScan = useCallback(() => { setScanning(true); setData([]); setElapsed(0); }, []);
  const stopScan = useCallback(() => { setScanning(false); }, []);

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        setData((d) => [...d, generateWavePoint(next)].slice(-60));
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleAnalyze = () => {
    if (data.length === 0) return;
    const avg = (key: keyof WavePoint) => Math.round(data.reduce((s, d) => s + (d[key] as number), 0) / data.length);
    const peak = (key: keyof WavePoint) => Math.max(...data.map(d => d[key] as number));
    const content = `EEG brainwave data recorded over ${elapsed} intervals. Average: Alpha=${avg("alpha")}Hz, Beta=${avg("beta")}Hz, Theta=${avg("theta")}Hz, Delta=${avg("delta")}Hz, Gamma=${avg("gamma")}Hz. Peak Alpha=${peak("alpha")}Hz, Peak Beta=${peak("beta")}Hz. ${data.length} data points. Analyze stress, focus, relaxation and provide wellness recommendations.`;
    analyze(content);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            EEG Live Scan
          </h1>
          <p className="page-subtitle">Simulated brainwave monitoring with AI-powered stress analysis</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 reveal reveal-delay-1">
          {!scanning ? (
            <button onClick={startScan} className="gradient-btn px-6 py-3 flex items-center gap-2">
              <Play className="w-5 h-5" /> Start Scan
            </button>
          ) : (
            <button onClick={stopScan} className="px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold flex items-center gap-2 transition-all active:scale-97 hover:shadow-lg">
              <Square className="w-5 h-5" /> Stop Scan
            </button>
          )}
          {data.length > 10 && !scanning && (
            <button onClick={handleAnalyze} disabled={loading} className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-success-foreground transition-all active:scale-97" style={{ background: "var(--gradient-success)" }}>
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Analyze Brainwaves"}
            </button>
          )}
          {scanning && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium tabular-nums">Recording… {(elapsed * 0.2).toFixed(1)}s</span>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="section-card reveal reveal-delay-2">
          <h3 className="font-semibold text-foreground mb-4 text-sm">Brainwave Activity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Legend />
              {Object.entries(waveColors).map(([key, color]) => (
                <Line key={key} type="monotone" dataKey={key} stroke={color} dot={false} strokeWidth={2} name={key.charAt(0).toUpperCase() + key.slice(1)} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Metrics */}
        {data.length > 0 && (
          <div className="grid grid-cols-5 gap-3 reveal reveal-delay-3">
            {Object.entries(waveColors).map(([wave, color]) => {
              const last = data[data.length - 1];
              return (
                <div key={wave} className="glass-card p-4 text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: color, boxShadow: `0 0 10px ${color}40` }} />
                  <p className="stat-label">{wave}</p>
                  <p className="text-xl font-bold text-foreground tabular-nums">{last[wave as keyof WavePoint]}Hz</p>
                </div>
              );
            })}
          </div>
        )}

        {result && <AnalysisResultCard result={result} type="eeg" />}
      </div>
    </AppLayout>
  );
}
