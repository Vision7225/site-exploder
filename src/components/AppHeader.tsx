import { Brain, User, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const topLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function AppHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="h-16 bg-card/70 backdrop-blur-xl flex items-center justify-between px-6 fixed top-0 w-full z-50 border-b border-border/50" style={{ boxShadow: "var(--shadow-sm)" }}>
      <Link to="/" className="flex items-center gap-2.5 text-primary font-bold text-lg tracking-tight group">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95" style={{ background: "var(--gradient-primary)", boxShadow: "0 3px 10px hsla(225, 73%, 57%, 0.2)" }}>
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="hidden sm:inline">AI-EEG Wellness</span>
      </Link>

      <nav className="flex items-center gap-1">
        {topLinks.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <div className="ml-2 w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer">
          <User className="w-4 h-4" />
        </div>
      </nav>
    </header>
  );
}
