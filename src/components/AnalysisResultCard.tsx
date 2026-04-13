import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Activity, Zap, Heart, Brain, Play, Pause, Square, Volume2 } from "lucide-react";

interface Props {
  result: Record<string, any>;
  type: string;
}

export default function AnalysisResultCard({ result, type }: Props) {
  const moodScore = result.mood_score || result.overall_mood || 0;
  const stressLevel = result.stress_level || "N/A";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const stressRaw = result.stress_level ?? result.stress ?? result.stress_score ?? null;
  const emotionRaw = (result.primary_emotion || result.emotion || "").toString().toLowerCase();
  const analysisText = (result.analysis || "").toString().toLowerCase();

  const isHighStress = (() => {
    if (typeof stressRaw === "number") return stressRaw >= 70;
    if (typeof stressRaw === "string") {
      const normalized = stressRaw.toLowerCase();
      return normalized.includes("high") || normalized.includes("severe");
    }
    return false;
  })();

  const isHighEmotion = ["stress", "stressed", "anxious", "anxiety", "angry", "anger", "panic", "fear"].some((token) =>
    emotionRaw.includes(token)
  );
  const hasHighSignalInAnalysis =
    analysisText.includes("high stress") ||
    analysisText.includes("severe stress") ||
    analysisText.includes("very stressed") ||
    analysisText.includes("high anxiety");

  const shouldShowReliefMusic =
    ["image", "video", "text", "audio"].includes(type) && (isHighStress || isHighEmotion || hasHighSignalInAnalysis);

  const selectedTrack = useMemo(() => {
    if (emotionRaw.includes("sad")) {
      return {
        label: "Soft Piano",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      };
    }
    if (emotionRaw.includes("angry") || emotionRaw.includes("anger")) {
      return {
        label: "Nature Sounds",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      };
    }
    return {
      label: "Meditation Ambience",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    };
  }, [emotionRaw]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  const handlePlayRelaxingMusic = async () => {
    setPlayerVisible(true);
    setIsPlaying(true);
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    try {
      await audioRef.current.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const handleTogglePlayPause = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const statCards = [
    moodScore > 0 && { icon: TrendingUp, label: "Mood Score", value: `${moodScore}/10`, accent: "text-primary" },
    result.confidence && { icon: Activity, label: "Confidence", value: `${result.confidence}%`, accent: "text-success" },
    result.emotion && { icon: Heart, label: "Emotion", value: result.emotion, accent: "text-accent" },
    result.primary_emotion && { icon: Heart, label: "Primary Emotion", value: result.primary_emotion, accent: "text-accent" },
    stressLevel !== "N/A" && {
      icon: Zap,
      label: "Stress",
      value: stressLevel,
      accent: stressLevel === "high" ? "text-destructive" : stressLevel === "medium" ? "text-warning" : "text-success",
    },
    result.focus_score !== undefined && { icon: Brain, label: "Focus", value: `${result.focus_score}%`, accent: "text-primary" },
    result.relaxation_score !== undefined && { icon: Activity, label: "Relaxation", value: `${result.relaxation_score}%`, accent: "text-secondary" },
  ].filter(Boolean) as { icon: any; label: string; value: string; accent: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass-card p-4 text-center"
          >
            <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.accent}`} />
            <p className="stat-label">{s.label}</p>
            <p className="text-xl font-bold text-foreground capitalize mt-1 tabular-nums">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Analysis */}
      <div className="section-card">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          AI Analysis
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
      </div>

      {/* Keywords */}
      {result.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.keywords.map((kw: string, i: number) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/8 text-primary border border-primary/10">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="glass-card-static p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Recommendations</h3>
          </div>
          <ul className="space-y-2.5">
            {result.recommendations.map((r: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-success text-xs font-bold">✓</span>
                </div>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {shouldShowReliefMusic && (
        <div className="section-card space-y-3">
          <h3 className="font-semibold text-foreground">Stress Relief Music</h3>

          {!playerVisible && (
            <button onClick={handlePlayRelaxingMusic} className="gradient-btn px-5 py-2.5 inline-flex items-center gap-2">
              <Play className="w-4 h-4" />
              Play Relaxing Music
            </button>
          )}

          {playerVisible && (
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3">
              <p className="text-xs text-muted-foreground">Now loaded: {selectedTrack.label}</p>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={handleTogglePlayPause} className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium inline-flex items-center gap-1.5">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={handleStop} className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium inline-flex items-center gap-1.5">
                  <Square className="w-4 h-4" />
                  Stop
                </button>
                <label className="inline-flex items-center gap-2 ml-1">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-28"
                  />
                </label>
              </div>
              <audio
                ref={audioRef}
                src={selectedTrack.url}
                onEnded={() => setIsPlaying(false)}
                preload="auto"
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
