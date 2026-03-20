import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Diary from "./pages/Diary";
import Sleep from "./pages/Sleep";
import ImageAnalysis from "./pages/ImageAnalysis";
import TextAnalysis from "./pages/TextAnalysis";
import AudioAnalysis from "./pages/AudioAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import EEGScan from "./pages/EEGScan";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/eeg" element={<EEGScan />} />
          <Route path="/image" element={<ImageAnalysis />} />
          <Route path="/audio" element={<AudioAnalysis />} />
          <Route path="/video" element={<VideoAnalysis />} />
          <Route path="/text" element={<TextAnalysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
