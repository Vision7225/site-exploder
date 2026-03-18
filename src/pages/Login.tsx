import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just redirect to home
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Brand Panel */}
      <div className="flex-1 text-primary-foreground p-12 md:p-16 flex flex-col justify-center relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute w-[280px] h-[280px] rounded-full bg-secondary/25 -top-16 -right-16" />
        <div className="absolute w-[180px] h-[180px] rounded-full bg-success/25 bottom-10 right-32" />
        <div className="absolute w-[220px] h-[220px] rounded-full bg-accent/25 -bottom-20 -left-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-10 h-10" />
            <span className="text-3xl font-bold">AI-EEG Wellness</span>
          </div>
          <p className="text-lg max-w-md opacity-95">Secure AI-powered platform for early depression detection.</p>
          <ul className="mt-8 space-y-3 text-base">
            {["Medical-grade AI insights", "Secure & private data", "Real-time monitoring", "Healthcare ready"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-success font-bold">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Login Panel */}
      <div className="flex-1 flex items-center justify-center bg-muted p-8">
        <div className="w-full max-w-md bg-card/85 backdrop-blur-lg rounded-2xl p-10 shadow-xl">
          <h2 className="text-2xl font-bold text-foreground">Welcome Back 👋</h2>
          <p className="text-muted-foreground mt-1 mb-8">Login to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-foreground">Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-primary-foreground font-bold text-base transition-all hover:opacity-90"
              style={{ background: "var(--gradient-hero)" }}
            >
              Login
            </button>
          </form>

          <div className="flex justify-between mt-5 text-sm">
            <a href="#" className="text-primary font-semibold hover:underline">Forgot Password?</a>
            <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
