import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Loader2, Shield, Activity, Zap, HeartPulse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

const features = [
  { icon: Shield, text: "Secure & private data" },
  { icon: Activity, text: "Real-time AI monitoring" },
  { icon: Zap, text: "Medical-grade insights" },
  { icon: HeartPulse, text: "Healthcare ready" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back! 🎉" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Brand Panel */}
      <div className="flex-1 text-primary-foreground p-10 md:p-16 flex flex-col justify-center relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <AnimatedBackground variant="neurons" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsla(0,0%,100%,0.06),transparent_60%)]" />
        <div className="relative z-10 reveal">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">AI-EEG Wellness</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-md" style={{ lineHeight: "1.15" }}>
            Your AI companion for mental wellness
          </h1>
          <p className="text-base opacity-75 mt-4 max-w-sm leading-relaxed">Secure platform for early depression detection and emotional well-being.</p>
          <div className="mt-10 space-y-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <f.icon className="w-4 h-4" />
                </div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-8 relative">
        <div className="w-full max-w-md glass-card p-10 reveal">
          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground mt-1 mb-8 text-sm">Sign in to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="input-field mt-1.5" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="input-field mt-1.5" />
            </div>
            <button type="submit" disabled={loading} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 text-base">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <div className="flex justify-between mt-6 text-sm">
            <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
            <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
