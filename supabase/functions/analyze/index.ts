import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  image: `You are an AI wellness image analyst. Analyze the image for emotional cues, facial expressions, body language, and overall mood. Return a JSON object with: emotion (primary detected emotion), confidence (0-100), mood_score (1-10, 10=happiest), description (detailed analysis), recommendations (array of wellness tips). Be empathetic and supportive.`,
  text: `You are an AI mental health text analyst. Analyze the text for sentiment, emotional state, stress indicators, and mental wellness signals. Return a JSON object with: sentiment (positive/negative/neutral), emotion (primary emotion), stress_level (low/medium/high), mood_score (1-10), keywords (array of emotional keywords found), analysis (detailed breakdown), recommendations (array of wellness suggestions).`,
  audio: `You are an AI audio mood analyst. Based on the transcription or description of audio content, analyze emotional tone, stress indicators, and mood patterns. Return a JSON object with: tone (calm/anxious/happy/sad/angry/neutral), stress_level (low/medium/high), mood_score (1-10), energy_level (low/medium/high), analysis (detailed breakdown), recommendations (array of suggestions).`,
  video: `You are an AI emotion video analyst. Based on the description of video content or frames, analyze facial expressions, body language, and emotional transitions. Return a JSON object with: primary_emotion (main emotion detected), emotion_timeline (array of {timestamp, emotion}), overall_mood (1-10), engagement_level (low/medium/high), analysis (detailed analysis), recommendations (array of wellness tips).`,
  eeg: `You are an AI EEG brainwave analyst specializing in mental wellness. Given simulated EEG brainwave data (alpha, beta, theta, delta, gamma waves), analyze stress levels, focus, relaxation, and emotional state. Return a JSON object with: stress_level (0-100), focus_score (0-100), relaxation_score (0-100), dominant_wave (alpha/beta/theta/delta/gamma), mental_state (focused/relaxed/stressed/meditative/alert), analysis (detailed interpretation), recommendations (array of wellness suggestions based on brainwave patterns).`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content, imageBase64 } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[type];
    if (!systemPrompt) throw new Error(`Unknown analysis type: ${type}`);

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (type === "image" && imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: content || "Analyze this image for emotional and wellness indicators." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      });
    } else {
      messages.push({ role: "user", content: content });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "return_analysis",
              description: "Return structured analysis results",
              parameters: {
                type: "object",
                properties: {
                  emotion: { type: "string" },
                  sentiment: { type: "string" },
                  mood_score: { type: "number" },
                  stress_level: { type: "string" },
                  confidence: { type: "number" },
                  analysis: { type: "string" },
                  recommendations: { type: "array", items: { type: "string" } },
                  tone: { type: "string" },
                  energy_level: { type: "string" },
                  focus_score: { type: "number" },
                  relaxation_score: { type: "number" },
                  dominant_wave: { type: "string" },
                  mental_state: { type: "string" },
                  keywords: { type: "array", items: { type: "string" } },
                  primary_emotion: { type: "string" },
                  overall_mood: { type: "number" },
                  engagement_level: { type: "string" },
                },
                required: ["analysis", "recommendations"],
                additionalProperties: true,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let result;

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: parse from content
      const content_text = data.choices?.[0]?.message?.content || "{}";
      try {
        result = JSON.parse(content_text);
      } catch {
        result = { analysis: content_text, recommendations: [] };
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
