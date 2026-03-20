import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";
import { BookOpen, Trash2 } from "lucide-react";

const moodEmojis = ["😊", "😐", "😞", "😡"];

interface DiaryEntry {
  mood: string;
  text: string;
  date: string;
}

export default function DiaryPage() {
  const [mood, setMood] = useState("neutral");
  const [selectedEmoji, setSelectedEmoji] = useState("😐");
  const [text, setText] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("diaryEntries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = () => {
    if (!text.trim()) return;
    const newEntries = [...entries, { mood: selectedEmoji, text, date: new Date().toISOString() }];
    setEntries(newEntries);
    localStorage.setItem("diaryEntries", JSON.stringify(newEntries));
    setText("");
  };

  const deleteEntry = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    localStorage.setItem("diaryEntries", JSON.stringify(newEntries));
  };

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const entryDates = new Set(entries.map((e) => new Date(e.date).toDateString()));
  const streak = entryDates.size;
  const progress = Math.round((streak / 30) * 100);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <MoodSelector selected={mood} onSelect={setMood} />

        {/* Hero */}
        <section className="rounded-2xl p-8 text-primary-foreground relative overflow-hidden reveal reveal-delay-1" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsla(0,0%,100%,0.06),transparent_50%)]" />
          <div className="relative flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold">Daily Emotional Reflection</h1>
              <p className="mt-1 opacity-80 text-sm">Track your thoughts, emotions, and mental progress</p>
            </div>
          </div>
        </section>

        {/* Write Entry */}
        <div className="section-card reveal reveal-delay-2">
          <h2 className="text-sm font-semibold text-foreground mb-4">Write Today's Reflection</h2>
          <div className="flex gap-2 mb-4">
            {moodEmojis.map((e) => (
              <button
                key={e}
                onClick={() => setSelectedEmoji(e)}
                className={`w-11 h-11 rounded-xl text-xl transition-all active:scale-95 ${
                  selectedEmoji === e ? "shadow-md text-primary-foreground" : "bg-muted/60"
                }`}
                style={selectedEmoji === e ? { background: "var(--gradient-primary)" } : undefined}
              >
                {e}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts…"
            className="input-field min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground/60 tabular-nums">{text.length} characters</p>
            <button onClick={saveEntry} className="gradient-btn px-5 py-2.5 text-sm">
              Save Entry
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="section-card reveal reveal-delay-3">
          <h2 className="text-sm font-semibold text-foreground mb-3">Monthly Tracker</h2>
          <p className="text-xs text-muted-foreground mb-3">
            {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = new Date(now.getFullYear(), now.getMonth(), i + 1);
              const hasEntry = entryDates.has(day.toDateString());
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-center text-xs font-medium transition-colors ${
                    isToday ? "ring-2 ring-primary/30" : ""
                  } ${hasEntry ? "bg-success/10 text-success" : "bg-muted/40 text-muted-foreground"}`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span>🔥 Streak: <strong className="text-foreground">{streak}</strong></span>
            <span>📊 Progress: <strong className="text-foreground">{progress}%</strong></span>
          </div>
        </div>

        {/* Previous Entries */}
        <div className="section-card reveal reveal-delay-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Previous Entries</h2>
          {entries.length === 0 && <p className="text-sm text-muted-foreground">No entries yet. Start writing above!</p>}
          <div className="space-y-2.5">
            {[...entries].reverse().map((entry, i) => (
              <div key={i} className="bg-muted/40 p-4 rounded-xl relative group">
                <p className="text-xs text-muted-foreground font-medium">
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {entry.mood}
                </p>
                <p className="text-sm mt-1.5 text-foreground leading-relaxed">{entry.text}</p>
                <button
                  onClick={() => deleteEntry(entries.length - 1 - i)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
