import { NavLink, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, Image, Mic, Video, FileText, BookOpen, Bed, Activity } from "lucide-react";

const navSections = [
  {
    title: "AI Analysis",
    links: [
      { to: "/eeg", icon: Brain, label: "EEG Live Scan" },
      { to: "/image", icon: Image, label: "Image Analysis" },
      { to: "/audio", icon: Mic, label: "Audio Analysis" },
      { to: "/video", icon: Video, label: "Emotion Video" },
      { to: "/text", icon: FileText, label: "Text Analysis" },
    ],
  },
  {
    title: "Wellness",
    links: [
      { to: "/diary", icon: BookOpen, label: "AI Diary" },
      { to: "/sleep", icon: Bed, label: "Sleep Tracker" },
    ],
  },
  {
    title: "Overview",
    links: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-[256px] bg-card/60 backdrop-blur-xl border-r border-border/50 h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto py-4 hidden md:flex flex-col gap-1 z-30">
      {navSections.map((section) => (
        <div key={section.title} className="px-3">
          <h3 className="px-3 pt-4 pb-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground/70">
            {section.title}
          </h3>
          <div className="space-y-0.5">
            {section.links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? "bg-primary/15" : "bg-muted/50"
                  }`}>
                    <link.icon className="w-4 h-4" />
                  </div>
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
