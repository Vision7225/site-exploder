import AppLayout from "@/components/AppLayout";
import { Brain, Cpu, Target, HeartPulse, Activity, Sparkles, GraduationCap, Users, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const eegBands = [
  { name: "Delta (0.5–4 Hz)", desc: "Deep sleep and unconscious processes. Dominant during restorative sleep stages.", color: "hsl(var(--accent))" },
  { name: "Theta (4–8 Hz)", desc: "Drowsiness, light sleep, and meditation. Associated with memory consolidation.", color: "hsl(var(--warning))" },
  { name: "Alpha (8–13 Hz)", desc: "Relaxed wakefulness with eyes closed. Indicates a calm, restful mental state.", color: "hsl(var(--success))" },
  { name: "Beta (13–30 Hz)", desc: "Active thinking, focus, and alertness. Elevated levels indicate stress or anxiety.", color: "hsl(var(--primary))" },
  { name: "Gamma (30+ Hz)", desc: "Higher cognitive functions, perception, and consciousness integration.", color: "hsl(var(--secondary))" },
];

const aiFeatures = [
  { icon: Activity, title: "Signal Processing", desc: "Synthetic EEG signals modeled with superimposed sinusoids, amplitude modulation, and physiological noise for realistic brainwave simulation." },
  { icon: Cpu, title: "Mental State Classification", desc: "Sigmoid activation and softmax normalization classify states as Relaxed, Stressed, or Focused using EEG band power ratios." },
  { icon: BarChart3, title: "Stress Index Computation", desc: "Real-time stress quantification via the Beta / (Alpha + Theta) ratio — a validated EEG biomarker for cognitive load." },
  { icon: Sparkles, title: "Multimodal Analysis", desc: "AI-powered emotion detection from images, audio sentiment analysis, video expression tracking, and NLP-based text sentiment scoring." },
];

const objectives = [
  { icon: Target, title: "Real-Time Monitoring", desc: "Provide continuous mental health assessment through EEG signal analysis and multimodal AI." },
  { icon: HeartPulse, title: "Early Intervention", desc: "Detect elevated stress before it becomes chronic, with automated wellness recommendations." },
  { icon: Users, title: "Accessible Mental Health", desc: "Democratize neurofeedback technology through a user-friendly web platform." },
  { icon: Shield, title: "Data-Driven Wellness", desc: "Enable evidence-based mental health tracking with historical trends and analytics." },
];

const benefits = [
  "Non-invasive stress monitoring using EEG pattern analysis",
  "Personalized AI recommendations based on individual brainwave profiles",
  "Historical tracking enables identification of long-term mental health trends",
  "Multimodal analysis provides comprehensive emotional assessment",
  "Automated alerts for critical stress levels with guided interventions",
  "Accessible web-based platform requiring no specialized hardware for demo",
];

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Hero */}
        <motion.section
          {...fadeIn(0)}
          className="rounded-2xl p-8 md:p-10 text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsla(0,0%,100%,0.1),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 opacity-80" />
              <span className="text-xs uppercase tracking-widest font-bold opacity-70">Academic Research Project</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              AI-Powered EEG Mental Wellness Platform
            </h1>
            <p className="mt-3 opacity-85 text-base max-w-2xl leading-relaxed">
              A comprehensive mental health monitoring system that combines electroencephalography (EEG) signal analysis 
              with artificial intelligence to provide real-time stress detection, mental state classification, 
              and personalized wellness recommendations.
            </p>
          </div>
        </motion.section>

        {/* What is EEG */}
        <motion.section {...fadeIn(0.1)} className="section-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">What is EEG?</h2>
              <p className="text-xs text-muted-foreground">Electroencephalography</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Electroencephalography (EEG) is a non-invasive neuroimaging technique that records electrical activity 
            of the brain using electrodes placed on the scalp. The brain's billions of neurons communicate through 
            electrical impulses, creating oscillatory patterns known as <strong className="text-foreground">brainwaves</strong>. 
            These patterns are categorized into frequency bands, each associated with distinct mental states:
          </p>
          <div className="space-y-3">
            {eegBands.map((band) => (
              <div key={band.name} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: band.color }} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{band.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{band.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* How AI is Used */}
        <motion.section {...fadeIn(0.15)} className="section-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">How AI is Used</h2>
              <p className="text-xs text-muted-foreground">Machine Learning & Signal Processing</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {aiFeatures.map((f) => (
              <div key={f.title} className="p-4 rounded-xl bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <f.icon className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Project Objectives */}
        <motion.section {...fadeIn(0.2)} className="section-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Project Objectives</h2>
              <p className="text-xs text-muted-foreground">Research Goals</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {objectives.map((o) => (
              <div key={o.title} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <o.icon className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{o.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section {...fadeIn(0.25)} className="section-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Benefits for Mental Health</h2>
              <p className="text-xs text-muted-foreground">Clinical & Practical Impact</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 text-xs font-bold text-accent">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          {...fadeIn(0.3)}
          className="rounded-2xl p-7 text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-primary)" }}
        >
          <h3 className="font-bold mb-3">Technology Stack</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["React + TypeScript", "Lovable Cloud", "Recharts", "Framer Motion"].map((tech) => (
              <div key={tech} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 text-center text-xs font-semibold">
                {tech}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </AppLayout>
  );
}
