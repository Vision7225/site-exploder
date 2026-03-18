import { useState } from "react";

const moods = [
  { key: "calm", emoji: "😌", label: "Calm", color: "bg-sky-500" },
  { key: "happy", emoji: "😊", label: "Happy", color: "bg-success" },
  { key: "neutral", emoji: "😐", label: "Neutral", color: "bg-muted-foreground" },
  { key: "sad", emoji: "😞", label: "Sad", color: "bg-indigo-500" },
  { key: "angry", emoji: "😡", label: "Angry", color: "bg-destructive" },
];

interface MoodSelectorProps {
  selected: string;
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex items-center gap-3 bg-card p-4 rounded-lg border border-border shadow-sm">
      <span className="font-semibold text-sm text-foreground mr-2">Mood Check-in:</span>
      {moods.map((mood) => (
        <button
          key={mood.key}
          onClick={() => onSelect(mood.key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            selected === mood.key
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-foreground hover:bg-primary/10"
          }`}
        >
          {mood.emoji} {mood.label}
        </button>
      ))}
    </div>
  );
}

export { moods };
