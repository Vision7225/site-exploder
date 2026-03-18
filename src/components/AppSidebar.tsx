import { NavLink, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, Image, Mic, Video, FileText, BookOpen, Bed, Activity } from "lucide-react";

const navSections = [
  {
    title: "AI Analysis Tools",
    links: [
      { to: "/eeg", icon: Brain, label: "EEG Live Scan" },
      { to: "/image", icon: Image, label: "Image Analysis" },
      { to: "/audio", icon: Mic, label: "Audio Analysis" },
      { to: "/video", icon: Video, label: "Emotion Video" },
      { to: "/text", icon: FileText, label: "Text Analysis" },
    ],
  },
  {
    title: "Wellness & Solutions",
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
    <aside className="w-[260px] bg-card border-r border-border h-[calc(100vh-65px)] fixed top-[65px] left-0 overflow-y-auto py-2 hidden md:block">
      {navSections.map((section) => (
        <div key={section.title}>
          <h3 className="px-6 pt-4 pb-1 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
            {section.title}
          </h3>
          {section.links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-4 border-primary font-semibold"
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
