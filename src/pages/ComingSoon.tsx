import AppLayout from "@/components/AppLayout";
import { Construction } from "lucide-react";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Construction className="w-16 h-16 text-primary mb-6" />
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          This module is under development. Check back soon for AI-powered analysis features.
        </p>
      </div>
    </AppLayout>
  );
}
