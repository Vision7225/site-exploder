import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ExternalLink } from "lucide-react";

interface ExtractorStageProps {
  selectedFile?: string;
  totalFiles: number;
  totalSize: string;
}

export default function ExtractorStage({ selectedFile, totalFiles, totalSize }: ExtractorStageProps) {
  return (
    <main className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="w-full max-w-2xl rounded-2xl bg-card p-12 flex flex-col items-center justify-center text-center"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-xl font-medium tracking-tight text-foreground">Website extracted successfully</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {totalFiles} files extracted · {totalSize}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Select an HTML file from the sidebar to preview</p>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-card"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
                <span className="font-mono text-xs text-muted-foreground truncate">{selectedFile}</span>
                <a
                  href={`/extracted/${selectedFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <iframe
                src={`/extracted/${selectedFile}`}
                className="flex-1 w-full border-0"
                title="Preview"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="px-6 py-3 border-t border-border flex items-center gap-4 text-[11px] text-muted-foreground font-mono tabular-nums">
        <span>{totalFiles} files</span>
        <span>·</span>
        <span>{totalSize}</span>
        <span className="ml-auto">AI_3.zip</span>
      </footer>
    </main>
  );
}
