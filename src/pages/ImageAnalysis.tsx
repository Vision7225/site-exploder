import { useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import AnalysisResultCard from "@/components/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useCameraCapture } from "@/hooks/useCameraCapture";
import { Image, Loader2, ImagePlus, Camera, Upload, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ImageAnalysisPage() {
  const { analyze, loading, result } = useAnalysis("image");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cam = useCameraCapture();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const activePreview = preview || cam.capturedImage;

  const handleAnalyze = () => {
    if (!activePreview) return;
    const base64 = activePreview.split(",")[1];
    analyze("Analyze this image for emotional indicators, facial expressions, body language, and overall mood.", base64);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-6">
        <div className="reveal">
          <h1 className="page-title">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-success" />
            </div>
            Image Analysis
          </h1>
          <p className="page-subtitle">Upload or capture an image to detect emotions and get AI wellness insights</p>
        </div>

        <Tabs defaultValue="upload" className="reveal reveal-delay-1" onValueChange={() => { setPreview(null); cam.reset(); }}>
          <TabsList className="w-full grid grid-cols-2 bg-muted/50">
            <TabsTrigger value="upload" className="gap-2"><Upload className="w-4 h-4" /> Upload</TabsTrigger>
            <TabsTrigger value="camera" className="gap-2"><Camera className="w-4 h-4" /> Camera</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div onClick={() => fileRef.current?.click()} className="upload-zone">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" style={{ boxShadow: "var(--shadow-md)" }} />
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
                    <ImagePlus className="w-8 h-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-muted-foreground font-medium">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground/60">JPG, PNG up to 10MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          </TabsContent>

          <TabsContent value="camera">
            <div className="section-card space-y-4">
              {cam.error && <p className="text-destructive text-sm text-center">{cam.error}</p>}

              {cam.isOpen && (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video ref={cam.videoRef} autoPlay playsInline muted className="w-full rounded-xl" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    <button onClick={cam.capture} className="gradient-btn px-6 py-2.5 flex items-center gap-2 text-sm">
                      <Camera className="w-4 h-4" /> Capture
                    </button>
                    <button onClick={cam.closeCamera} className="px-4 py-2.5 rounded-xl bg-destructive/90 text-destructive-foreground text-sm flex items-center gap-1">
                      <X className="w-4 h-4" /> Close
                    </button>
                  </div>
                </div>
              )}

              {cam.capturedImage && (
                <div className="space-y-3">
                  <img src={cam.capturedImage} alt="Captured" className="max-h-64 mx-auto rounded-xl" style={{ boxShadow: "var(--shadow-md)" }} />
                  <button onClick={() => { cam.reset(); cam.openCamera(); }} className="text-sm text-primary underline mx-auto block">Retake</button>
                </div>
              )}

              {!cam.isOpen && !cam.capturedImage && (
                <button onClick={cam.openCamera} className="gradient-btn w-full py-3 flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" /> Open Camera
                </button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {activePreview && (
          <button onClick={handleAnalyze} disabled={loading} className="gradient-btn w-full py-3.5 flex items-center justify-center gap-2 reveal">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : "Analyze Image"}
          </button>
        )}

        {result && <AnalysisResultCard result={result} type="image" />}
      </div>
    </AppLayout>
  );
}
