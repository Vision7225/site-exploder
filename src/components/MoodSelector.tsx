const moods = [
  { key: "calm", emoji: "😌", label: "Calm" },
  { key: "happy", emoji: "😊", label: "Happy" },
  { key: "neutral", emoji: "😐", label: "Neutral" },
  { key: "sad", emoji: "😞", label: "Sad" },
  { key: "angry", emoji: "😡", label: "Angry" },
];

interface MoodSelectorProps {
  selected: string;
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="glass-card-static flex items-center gap-2 p-3 reveal">
      <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wide ml-2 mr-1 hidden sm:inline">Mood</span>
      {moods.map((mood) => (
        <button
          key={mood.key}
          onClick={() => onSelect(mood.key)}
          className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
            selected === mood.key
              ? "text-primary-foreground shadow-md"
              : "bg-muted/50 text-foreground hover:bg-muted"
          }`}
          style={selected === mood.key ? { background: "var(--gradient-primary)", boxShadow: "0 3px 12px hsla(225, 73%, 57%, 0.25)" } : undefined}
        >
          {mood.emoji} {mood.label}
        </button>
      ))}
    </div>
  );
}

export { moods };
