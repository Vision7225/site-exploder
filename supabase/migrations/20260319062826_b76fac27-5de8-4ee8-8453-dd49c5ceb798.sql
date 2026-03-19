-- Create analysis_results table to store all AI analysis outputs
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('image', 'eeg', 'audio', 'video', 'text')),
  input_summary TEXT,
  result JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses"
  ON public.analysis_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON public.analysis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON public.analysis_results FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow anonymous inserts"
  ON public.analysis_results FOR INSERT
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow anonymous selects"
  ON public.analysis_results FOR SELECT
  USING (user_id IS NULL);

CREATE INDEX idx_analysis_type ON public.analysis_results (analysis_type);
CREATE INDEX idx_analysis_user ON public.analysis_results (user_id);

-- Diary entries table
CREATE TABLE public.diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  mood TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diary entries"
  ON public.diary_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary entries"
  ON public.diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary entries"
  ON public.diary_entries FOR DELETE USING (auth.uid() = user_id);