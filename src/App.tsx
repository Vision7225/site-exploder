import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
            <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
            <Route path="/eeg" element={<ProtectedRoute><EEGScan /></ProtectedRoute>} />
            <Route path="/image" element={<ProtectedRoute><ImageAnalysis /></ProtectedRoute>} />
            <Route path="/audio" element={<ProtectedRoute><AudioAnalysis /></ProtectedRoute>} />
            <Route path="/video" element={<ProtectedRoute><VideoAnalysis /></ProtectedRoute>} />
            <Route path="/text" element={<ProtectedRoute><TextAnalysis /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
