import { useState, useEffect, useCallback, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Brain, Play, Square, Loader2, Activity, Zap, Moon, Eye } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Legend, Tooltip, AreaChart, Area, ReferenceLine,
} from "recharts";
import { generateEEGSample, resetSession, type EEGWavePoint } from "@/lib/eegSignalGenerator";
import { motion, AnimatePresence } from "framer-motion";

/* ── colour tokens (HSL from design system) ─────────────────────────── */
const WAVE_META = {
  alpha: { color: "hsl(225, 73%, 57%)", label: "Alpha (8-13 Hz)", icon: Eye, desc: "Relaxation" },
  beta:  { color: "hsl(0, 72%, 56%)",   label: "Beta (13-30 Hz)", icon: Zap, desc: "Stress / Focus" },
  theta: { color: "hsl(152, 60%, 42%)", label: "Theta (4-8 Hz)",  icon: Moon, desc: "Drowsiness" },
  delta: { color: "hsl(36, 90%, 52%)",  label: "Delta (0.5-4 Hz)", icon: Moon, desc: "Deep Sleep" },
  gamma: { color: "hsl(256, 65%, 58%)", label: "Gamma (30+ Hz)",  icon: Activity, desc: "Cognition" },
} as const;

type BandKey = keyof typeof WAVE_META;
const BANDS: BandKey[] = ["alpha", "beta", "theta", "delta", "gamma"];

const SAMPLE_INTERVAL_MS = 100; // 10 Hz sampling
const MAX_POINTS = 150; // ~15 seconds visible window

/* ── stress colour helper ───────────────────────────────────────────── */
function stressColor(s: number) {
  if (s >= 70) return "hsl(0, 72%, 56%)";
  if (s >= 40) return "hsl(36, 90%, 52%)";
  return "hsl(152, 60%, 42%)";
}
function stressLabel(s: number) {
  if (s >= 70) return "High";
  if (s >= 40) return "Moderate";
  return "Low";
}

/* ── custom tooltip ─────────────────────────────────────────────────── */
function WaveTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md px-3 py-2 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1 font-medium">t = {label}s</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.stroke || p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">{p.value} µV</span>
        </div>
      ))}
    </div>
  );
}

function StressTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md px-3 py-2 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1 font-medium">t = {label}s</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: stressColor(val) }} />
        <span className="font-semibold text-foreground tabular-nums">{val}%</span>
        <span className="text-muted-foreground">— {stressLabel(val)}</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════ */
export default function EEGScanPage() {
  const { analyze, loading, result } = useAnalysis("eeg");
  const [scanning, setScanning] = useState(false);
  const [data, setData] = useState<EEGWavePoint[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(0);

  const startScan = useCallback(() => {
    resetSession();
    setScanning(true);
    setData([]);
    setElapsed(0);
    startTimeRef.current = performance.now();
  }, []);

  const stopScan = useCallback(() => setScanning(false), []);

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      const t = (performance.now() - startTimeRef.current) / 1000;
      const sample = generateEEGSample(t);
      setData(prev => [...prev, sample].slice(-MAX_POINTS));
      setElapsed(t);
    }, SAMPLE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleAnalyze = () => {
    if (data.length < 20) return;
    const avg = (k: BandKey) => Math.round(data.reduce((s, d) => s + Math.abs(d[k]), 0) / data.length);
    const peak = (k: BandKey) => Math.round(Math.max(...data.map(d => Math.abs(d[k]))));
    const avgStress = Math.round(data.reduce((s, d) => s + d.stress, 0) / data.length);
    const content = `Realistic synthetic EEG data recorded for ${elapsed.toFixed(1)}s at 10Hz (${data.length} samples).
Average amplitudes (µV): Alpha=${avg("alpha")}, Beta=${avg("beta")}, Theta=${avg("theta")}, Delta=${avg("delta")}, Gamma=${avg("gamma")}.
Peak amplitudes (µV): Alpha=${peak("alpha")}, Beta=${peak("beta")}, Theta=${peak("theta")}, Delta=${peak("delta")}.
Average stress index: ${avgStress}/100 (based on Beta/(Alpha+Theta) ratio).
Analyze cognitive state, stress level, relaxation patterns and provide wellness recommendations.`;
    analyze(content);
  };

  const lastSample = data.length > 0 ? data[data.length - 1] : null;
  const avgStress = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.stress, 0) / data.length)
    : 0;

  return (
    <AppLayout>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            EEG Live Scan
          </h1>
          <p className="page-subtitle">
            Realistic synthetic brainwave monitoring with AI-powered cognitive analysis
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 reveal reveal-delay-1">
          {!scanning ? (
            <button onClick={startScan} className="gradient-btn px-6 py-3 flex items-center gap-2">
              <Play className="w-5 h-5" /> Start Scan
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold flex items-center gap-2 transition-all active:scale-95 hover:shadow-lg"
            >
              <Square className="w-5 h-5" /> Stop Scan
            </button>
          )}
          {data.length > 20 && !scanning && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-success-foreground transition-all active:scale-95"
              style={{ background: "var(--gradient-success)" }}
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Brainwaves"}
            </button>
          )}
          {scanning && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium tabular-nums">
                Recording… {elapsed.toFixed(1)}s
              </span>
            </div>
          )}
        </div>

        {/* ── Live metrics cards ──────────────────────────────────────── */}
        <AnimatePresence>
          {lastSample && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 reveal reveal-delay-2"
            >
              {BANDS.map(band => {
                const meta = WAVE_META[band];
                const Icon = meta.icon;
                return (
                  <div key={band} className="glass-card p-4 text-center group">
                    <div
                      className="w-3 h-3 rounded-full mx-auto mb-2 transition-shadow"
                      style={{ background: meta.color, boxShadow: `0 0 12px ${meta.color}50` }}
                    />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {meta.desc}
                    </p>
                    <p className="text-xl font-bold text-foreground tabular-nums mt-1">
                      {Math.abs(lastSample[band]).toFixed(0)}
                      <span className="text-xs font-normal text-muted-foreground ml-0.5">µV</span>
                    </p>
                  </div>
                );
              })}

              {/* Stress card */}
              <div className="glass-card p-4 text-center">
                <div
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ background: stressColor(lastSample.stress), boxShadow: `0 0 12px ${stressColor(lastSample.stress)}50` }}
                />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Stress</p>
                <p className="text-xl font-bold tabular-nums mt-1" style={{ color: stressColor(lastSample.stress) }}>
                  {lastSample.stress}%
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── EEG Waveform chart ─────────────────────────────────────── */}
        <div className="section-card reveal reveal-delay-2">
          <h3 className="font-semibold text-foreground mb-1 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Brainwave Signals (µV)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Synthetic EEG generated using superimposed sinusoidal models with physiological noise
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v: number) => `${v.toFixed(0)}s`}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "µV", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }}
              />
              <Tooltip content={<WaveTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value: string) => {
                  const meta = WAVE_META[value as BandKey];
                  return meta ? meta.label : value;
                }}
              />
              {BANDS.map(band => (
                <Line
                  key={band}
                  type="monotone"
                  dataKey={band}
                  stroke={WAVE_META[band].color}
                  dot={false}
                  strokeWidth={1.5}
                  name={band}
                  animationDuration={0}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Stress Trend chart ─────────────────────────────────────── */}
        <div className="section-card reveal reveal-delay-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-destructive" />
              Stress Level Trend
            </h3>
            {data.length > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${stressColor(avgStress)}20`,
                  color: stressColor(avgStress),
                }}
              >
                Avg: {avgStress}% — {stressLabel(avgStress)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Computed from Beta / (Alpha + Theta) ratio — a standard EEG stress biomarker
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 72%, 56%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(0, 72%, 56%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v: number) => `${v.toFixed(0)}s`}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "Stress %", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }}
              />
              <Tooltip content={<StressTooltip />} />
              <ReferenceLine y={70} stroke="hsl(0, 72%, 56%)" strokeDasharray="4 4" label={{ value: "High", fill: "hsl(0, 72%, 56%)", fontSize: 10 }} />
              <ReferenceLine y={40} stroke="hsl(36, 90%, 52%)" strokeDasharray="4 4" label={{ value: "Moderate", fill: "hsl(36, 90%, 52%)", fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="stress"
                stroke="hsl(0, 72%, 56%)"
                fill="url(#stressGrad)"
                strokeWidth={2}
                dot={false}
                animationDuration={0}
                isAnimationActive={false}
                name="Stress Level"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Band breakdown info ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 reveal reveal-delay-3">
          {BANDS.map(band => {
            const meta = WAVE_META[band];
            const Icon = meta.icon;
            return (
              <div key={band} className="glass-card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">{meta.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {result && <AnalysisResultCard result={result} type="eeg" />}
      </div>
    </AppLayout>
  );
}
