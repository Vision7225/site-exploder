import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
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
      <div className="flex-1 text-primary-foreground p-12 md:p-16 flex flex-col justify-center relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute w-[280px] h-[280px] rounded-full bg-secondary/25 -top-16 -right-16" />
        <div className="absolute w-[220px] h-[220px] rounded-full bg-accent/25 -bottom-20 -left-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-10 h-10" />
            <span className="text-3xl font-bold">AI-EEG Wellness</span>
          </div>
          <p className="text-lg max-w-md opacity-95">Join thousands of users tracking their mental wellness with AI.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-muted p-8">
        <div className="w-full max-w-md bg-card/85 backdrop-blur-lg rounded-2xl p-10 shadow-xl">
          <h2 className="text-2xl font-bold text-foreground">Create Account 🚀</h2>
          <p className="text-muted-foreground mt-1 mb-8">Start your wellness journey</p>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Enter your name" },
              { label: "Email", key: "email", type: "email", placeholder: "Enter your email" },
              { label: "Password", key: "password", type: "password", placeholder: "Create password (min 6 chars)" },
              { label: "Confirm Password", key: "confirm", type: "password", placeholder: "Confirm password" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-foreground">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-primary-foreground font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-hero)" }}
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : "Register"}
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
