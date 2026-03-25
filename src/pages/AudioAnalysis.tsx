import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Mic, Loader2, Music, Upload, Square, Circle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AudioAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("audio");
  const [fileName, setFileName] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const rec = useAudioRecorder();
  const [activeTab, setActiveTab] = useState("upload");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setDescription(`Audio file: ${file.name}, type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB`);
    }
  };

  const handleAnalyze = () => {
    const desc = activeTab === "record" && rec.audioBlob
      ? `Recorded audio (${rec.formatTime(rec.elapsed)} duration). ${description}`
      : description;
    analyze(desc ? `Analyze the following audio content for mood and stress indicators: ${desc}` : "No audio description provided");
  };

  const canAnalyze = activeTab === "upload" ? (!!fileName || !!description.trim()) : !!rec.audioBlob;

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-warning" />
            </div>
            Audio Analysis
          </h1>
          <p className="page-subtitle">Upload audio or record from microphone for AI mood detection</p>
        </div>

        <Tabs defaultValue="upload" className="reveal reveal-delay-1" onValueChange={(v) => { setActiveTab(v); setFileName(null); setDescription(""); rec.reset(); }}>
          <TabsList className="w-full grid grid-cols-2 bg-muted/50">
            <TabsTrigger value="upload" className="gap-2"><Upload className="w-4 h-4" /> Upload</TabsTrigger>
            <TabsTrigger value="record" className="gap-2"><Mic className="w-4 h-4" /> Record</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div onClick={() => fileRef.current?.click()} className="upload-zone">
              <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                <Music className="w-7 h-7 text-muted-foreground/60" />
              </div>
              {fileName ? (
                <p className="text-foreground font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-muted-foreground font-medium">Click to upload audio</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">MP3, WAV, M4A</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
            </div>
          </TabsContent>

          <TabsContent value="record">
            <div className="section-card space-y-4">
              {rec.error && <p className="text-destructive text-sm text-center">{rec.error}</p>}

              <div className="flex flex-col items-center gap-4 py-4">
                {/* Timer display */}
                <div className="text-4xl font-mono font-bold text-foreground tracking-wider">
                  {rec.formatTime(rec.elapsed)}
                </div>

                {/* Recording indicator */}
                {rec.isRecording && (
                  <div className="flex items-center gap-2 text-destructive">
                    <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    <span className="text-sm font-medium">Recording…</span>
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-3">
                  {!rec.isRecording && !rec.audioBlob && (
                    <button onClick={rec.startRecording} className="gradient-btn px-6 py-3 flex items-center gap-2">
                      <Circle className="w-5 h-5 fill-current" /> Start Recording
                    </button>
                  )}
                  {rec.isRecording && (
                    <button onClick={rec.stopRecording} className="px-6 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold flex items-center gap-2">
                      <Square className="w-4 h-4 fill-current" /> Stop
                    </button>
                  )}
                </div>

                {/* Playback */}
                {rec.audioUrl && (
                  <div className="w-full space-y-3">
                    <audio src={rec.audioUrl} controls className="w-full" />
                    <button onClick={() => { rec.reset(); }} className="text-sm text-primary underline mx-auto block">Record Again</button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="section-card reveal reveal-delay-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Content description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the speaker's tone, pace, emotional context…"
            className="input-field min-h-[120px] resize-none"
          />
        </div>

        <button onClick={handleAnalyze} disabled={loading || !canAnalyze} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal reveal-delay-3">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Audio"}
        </button>

        {result && <AnalysisResultCard result={result} type="audio" />}
      </div>
    </AppLayout>
  );
}
