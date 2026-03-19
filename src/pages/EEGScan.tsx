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

export default function EEGScanPage() {
  const { analyze, loading, result } = useAnalysis("eeg");
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState<WavePoint[]>([]);
  const [elapsed, setElapsed] = useState(0);

  const startScan = useCallback(() => {
    setScanning(true);
    setData([]);
    setElapsed(0);
  }, []);

  const stopScan = useCallback(() => {
    setScanning(false);
  }, []);

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        setData((d) => {
          const newData = [...d, generateWavePoint(next)];
          return newData.slice(-60); // keep last 60 data points
        });
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleAnalyze = () => {
    if (data.length === 0) return;
    const avgAlpha = Math.round(data.reduce((s, d) => s + d.alpha, 0) / data.length);
    const avgBeta = Math.round(data.reduce((s, d) => s + d.beta, 0) / data.length);
    const avgTheta = Math.round(data.reduce((s, d) => s + d.theta, 0) / data.length);
    const avgDelta = Math.round(data.reduce((s, d) => s + d.delta, 0) / data.length);
    const avgGamma = Math.round(data.reduce((s, d) => s + d.gamma, 0) / data.length);

    const content = `EEG brainwave data recorded over ${elapsed} intervals.
Average readings: Alpha=${avgAlpha}Hz, Beta=${avgBeta}Hz, Theta=${avgTheta}Hz, Delta=${avgDelta}Hz, Gamma=${avgGamma}Hz.
Peak Alpha=${Math.max(...data.map(d => d.alpha))}Hz, Peak Beta=${Math.max(...data.map(d => d.beta))}Hz.
Data points collected: ${data.length}. Analyze stress, focus, relaxation levels and provide wellness recommendations.`;

    analyze(content);
  };

  const waveColors = {
    alpha: "hsl(221, 83%, 53%)",
    beta: "hsl(0, 84%, 60%)",
    theta: "hsl(142, 71%, 45%)",
    delta: "hsl(38, 92%, 50%)",
    gamma: "hsl(280, 70%, 55%)",
  };

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary" />
            EEG Live Scan
          </h1>
          <p className="text-muted-foreground mt-1">Simulated brainwave monitoring with AI-powered stress analysis.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!scanning ? (
            <button
              onClick={startScan}
              className="px-6 py-3 rounded-xl text-primary-foreground font-bold flex items-center gap-2 transition-all hover:opacity-90"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Play className="w-5 h-5" /> Start Scan
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-bold flex items-center gap-2 transition-all hover:opacity-90"
            >
              <Square className="w-5 h-5" /> Stop Scan
            </button>
          )}

          {data.length > 10 && !scanning && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-success text-success-foreground font-bold flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Analyze Brainwaves"}
            </button>
          )}

          {scanning && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">Recording... {(elapsed * 0.2).toFixed(1)}s</span>
            </div>
          )}
        </div>

        {/* Live Chart */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <h3 className="font-semibold text-foreground mb-4">Brainwave Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
              <Legend />
              <Line type="monotone" dataKey="alpha" stroke={waveColors.alpha} dot={false} strokeWidth={2} name="Alpha" />
              <Line type="monotone" dataKey="beta" stroke={waveColors.beta} dot={false} strokeWidth={2} name="Beta" />
              <Line type="monotone" dataKey="theta" stroke={waveColors.theta} dot={false} strokeWidth={2} name="Theta" />
              <Line type="monotone" dataKey="delta" stroke={waveColors.delta} dot={false} strokeWidth={1.5} name="Delta" />
              <Line type="monotone" dataKey="gamma" stroke={waveColors.gamma} dot={false} strokeWidth={1.5} name="Gamma" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Metrics */}
        {data.length > 0 && (
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(waveColors).map(([wave, color]) => {
              const last = data[data.length - 1];
              return (
                <div key={wave} className="bg-card rounded-lg p-4 text-center shadow-sm border border-border">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: color }} />
                  <p className="text-xs text-muted-foreground uppercase font-semibold">{wave}</p>
                  <p className="text-xl font-bold text-foreground">{last[wave as keyof WavePoint]}Hz</p>
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
