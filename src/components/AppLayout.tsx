import { CSSProperties, ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import AnimatedBackground, { type AnimVariant } from "./AnimatedBackground";

const ROUTE_VARIANTS: Record<string, AnimVariant> = {
  "/": "neurons",
  "/dashboard": "dna",
  "/eeg": "brainwaves",
  "/image": "particles",
  "/audio": "waveform",
  "/video": "filmstrip",
  "/text": "letters",
  "/diary": "feathers",
  "/sleep": "stars",
  "/login": "ripples",
  "/register": "ripples",
  "/about": "neurons",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const variant = ROUTE_VARIANTS[location.pathname] || "neurons";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const layoutStyle = { "--app-header-height": "64px" } as CSSProperties;

  return (
    <div className="min-h-screen bg-background relative" style={layoutStyle}>
      <AnimatedBackground variant={variant} />
      <AppHeader onMenuToggle={() => setMobileMenuOpen((v) => !v)} />
      <AppSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="md:ml-[256px] pt-[calc(var(--app-header-height)+1rem)] p-5 md:p-8 md:pt-[calc(var(--app-header-height)+1.25rem)] relative z-10">
        {children}
      </main>
    </div>
  );
}
