import { NavLink, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, Image, Mic, Video, FileText, BookOpen, Bed, Activity, X } from "lucide-react";

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

interface AppSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AppSidebar({ mobileOpen = false, onClose }: AppSidebarProps) {
  const location = useLocation();

  const navContent = (
    <>
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
                  onClick={onClose}
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-[256px] bg-card/60 backdrop-blur-xl border-r border-border/50 h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto py-4 hidden md:flex flex-col gap-1 z-30">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute top-0 left-0 w-[280px] h-full bg-card/95 backdrop-blur-xl border-r border-border/50 overflow-y-auto py-4 flex flex-col gap-1 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 pb-2">
              <span className="text-sm font-bold text-foreground">Menu</span>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
