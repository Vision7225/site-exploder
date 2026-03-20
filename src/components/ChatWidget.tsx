import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({ messages, onDelta, onDone, onError }: { messages: Msg[]; onDelta: (t: string) => void; onDone: () => void; onError: (msg: string) => void }) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
    body: JSON.stringify({ messages }),
  });
  if (!resp.ok) { const data = await resp.json().catch(() => ({})); onError(data.error || "Something went wrong"); return; }
  if (!resp.body) { onError("No response body"); return; }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) onDelta(c); }
      catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);
    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((p) => {
        const last = p[p.length - 1];
        if (last?.role === "assistant") return p.map((m, i) => (i === p.length - 1 ? { ...m, content: acc } : m));
        return [...p, { role: "assistant", content: acc }];
      });
    };
    try {
      await streamChat({
        messages: [...messages, userMsg], onDelta: upsert, onDone: () => setLoading(false),
        onError: (msg) => { setMessages((p) => [...p, { role: "assistant", content: `⚠️ ${msg}` }]); setLoading(false); },
      });
    } catch { setMessages((p) => [...p, { role: "assistant", content: "⚠️ Connection error." }]); setLoading(false); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground transition-all active:scale-95"
        style={{ background: "var(--gradient-primary)", boxShadow: "0 6px 24px hsla(225, 73%, 57%, 0.3)" }}
        aria-label="Chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[100] w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[70vh] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl flex flex-col overflow-hidden reveal" style={{ boxShadow: "var(--shadow-lg)" }}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3" style={{ background: "var(--gradient-primary)" }}>
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">Wellness Companion</p>
              <p className="text-[10px] text-primary-foreground/60">AI-powered support</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-10 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 opacity-40" />
                </div>
                <p className="font-medium">Hi there! 👋</p>
                <p className="text-xs text-muted-foreground/70">How are you feeling today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "text-primary-foreground rounded-br-lg" : "bg-muted/60 text-foreground rounded-bl-lg"
                }`} style={m.role === "user" ? { background: "var(--gradient-primary)" } : undefined}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-bl-lg px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border/50 p-3 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="How are you feeling?" className="input-field flex-1 !py-2.5 !rounded-xl" disabled={loading} />
            <button type="submit" disabled={!input.trim() || loading} className="gradient-btn w-10 h-10 !rounded-xl flex items-center justify-center !p-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
