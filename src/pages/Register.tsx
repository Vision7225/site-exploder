import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    if (form.password.length < 6) { toast({ title: "Password must be at least 6 characters", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { display_name: form.name } },
      });
      if (error) throw error;
      toast({ title: "Account created! 🎉", description: "Check your email to confirm your account." });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Brand Panel */}
      <div className="flex-1 text-primary-foreground p-10 md:p-16 flex flex-col justify-center relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <AnimatedBackground variant="ripples" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsla(0,0%,100%,0.06),transparent_60%)]" />
        <div className="relative z-10 reveal">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">AI-EEG Wellness</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-md" style={{ lineHeight: "1.15" }}>
            Start your wellness journey today
          </h1>
          <p className="text-base opacity-75 mt-4 max-w-sm leading-relaxed">Join users tracking their mental wellness with AI-powered analysis.</p>
        </div>
      </div>

      {/* Register Panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md glass-card p-10 reveal">
          <h2 className="text-2xl font-bold text-foreground">Create account</h2>
          <p className="text-muted-foreground mt-1 mb-8 text-sm">Get started in seconds</p>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Enter your name" },
              { label: "Email", key: "email", type: "email", placeholder: "Enter your email" },
              { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters" },
              { label: "Confirm Password", key: "confirm", type: "password", placeholder: "Confirm password" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required
                  className="input-field mt-1.5"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 text-base">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating…</> : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
