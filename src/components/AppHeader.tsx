import { Brain, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const topLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function AppHeader() {
  const location = useLocation();

  return (
    <header className="h-[65px] bg-card flex items-center justify-between px-6 shadow-sm fixed top-0 w-full z-50 border-b border-border">
      <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
        <Brain className="w-6 h-6" />
        AI-EEG Wellness
      </Link>
      <nav className="flex items-center gap-6">
        {topLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors ${
              location.pathname === link.to ? "text-primary" : "text-foreground hover:text-primary"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      </nav>
    </header>
  );
}
