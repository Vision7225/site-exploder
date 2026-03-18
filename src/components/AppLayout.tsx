import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <AppSidebar />
      <main className="md:ml-[260px] pt-[65px] p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
