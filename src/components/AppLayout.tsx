import { ReactNode } from "react";
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
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const variant = ROUTE_VARIANTS[location.pathname] || "neurons";

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground variant={variant} />
      <AppHeader />
      <AppSidebar />
      <main className="md:ml-[256px] pt-24 p-5 md:p-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
