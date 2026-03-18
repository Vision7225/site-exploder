import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import MoodSelector from "@/components/MoodSelector";

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

  // Calendar
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
        <section className="rounded-lg p-8 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h1 className="text-2xl font-bold">Daily Emotional Reflection 📖</h1>
          <p className="mt-2 opacity-90">Track your thoughts, emotions, and mental progress.</p>
        </section>

        {/* Write Entry */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">✨ Write Today's Reflection</h2>
          <div className="flex gap-2 mb-4">
            {moodEmojis.map((e) => (
              <button
                key={e}
                onClick={() => setSelectedEmoji(e)}
                className={`w-11 h-11 rounded-full text-xl transition-all ${
                  selectedEmoji === e ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full h-28 p-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-right text-xs text-muted-foreground mt-1">{text.length} characters</p>
          <button
            onClick={saveEntry}
            className="mt-2 px-5 py-2 rounded-full text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            Save Entry
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">📅 Monthly Tracker</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
          </p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = new Date(now.getFullYear(), now.getMonth(), i + 1);
              const hasEntry = entryDates.has(day.toDateString());
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-center text-xs ${
                    isToday ? "border-2 border-primary" : ""
                  } bg-muted`}
                >
                  {i + 1}
                  <br />
                  <span className={hasEntry ? "text-success" : "text-destructive"}>
                    {hasEntry ? "✔" : "✖"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm mt-4">
            🔥 Streak: <strong>{streak}</strong> days · 📊 Monthly Progress: <strong>{progress}%</strong>
          </p>
        </div>

        {/* Previous Entries */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">🕒 Previous Entries</h2>
          {entries.length === 0 && <p className="text-sm text-muted-foreground">No entries yet.</p>}
          <div className="space-y-3">
            {[...entries].reverse().map((entry, i) => (
              <div key={i} className="bg-muted p-4 rounded-xl relative">
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.date).toDateString()} | {entry.mood}
                </p>
                <p className="text-sm mt-1 text-foreground">{entry.text}</p>
                <button
                  onClick={() => deleteEntry(entries.length - 1 - i)}
                  className="absolute top-3 right-3 text-destructive text-sm hover:opacity-70"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
