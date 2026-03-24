import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Wind, Heart, Timer } from "lucide-react";

interface Props {
  stressPercent: number;
}

const breathingSteps = [
  { label: "Breathe In", duration: 4 },
  { label: "Hold", duration: 4 },
  { label: "Breathe Out", duration: 4 },
  { label: "Hold", duration: 4 },
];

export default function StressAlert({ stressPercent }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  const isHigh = stressPercent >= 70;

  // Reset dismissed when stress drops and rises again
  useEffect(() => {
    if (!isHigh) setDismissed(false);
  }, [isHigh]);

  // Breathing exercise timer
  useEffect(() => {
    if (!showBreathing) return;
    const iv = setInterval(() => {
      setBreathTimer((t) => {
        if (t <= 1) {
          setBreathStep((s) => {
            const next = (s + 1) % 4;
            if (next === 0) setBreathCycles((c) => c + 1);
            return next;
          });
          return breathingSteps[(breathStep + 1) % 4].duration;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [showBreathing, breathStep]);

  if (!isHigh || dismissed) return null;

  const currentStep = breathingSteps[breathStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="rounded-2xl border-2 border-destructive/30 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(0 72% 56% / 0.08), hsl(36 90% 52% / 0.05))",
          boxShadow: "0 0 30px hsl(0 72% 56% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
        }}
      >
        <div className="p-5">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0"
            >
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">⚠️ High Stress Alert</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive tabular-nums">
                  {stressPercent}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your stress level is critically elevated. We recommend a breathing exercise to activate your parasympathetic nervous system.
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!showBreathing ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowBreathing(true);
                setBreathStep(0);
                setBreathTimer(4);
                setBreathCycles(0);
              }}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-sm text-primary-foreground flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Wind className="w-4 h-4" />
              Start Breathing Exercise
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 p-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-destructive" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Box Breathing — Cycle {breathCycles + 1}
                </span>
              </div>

              <motion.div
                key={breathStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-3"
              >
                <p className="text-xl font-bold text-foreground">{currentStep.label}</p>
              </motion.div>

              {/* Animated circle */}
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={264}
                    animate={{ strokeDashoffset: 264 - (264 * (breathTimer / currentStep.duration)) }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground tabular-nums">{breathTimer}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 mt-2">
                {breathingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === breathStep ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>

              {breathCycles >= 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-success font-semibold mt-3"
                >
                  ✓ Great job! 3 cycles completed. Feeling better?
                </motion.p>
              )}

              <button
                onClick={() => setShowBreathing(false)}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close exercise
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
