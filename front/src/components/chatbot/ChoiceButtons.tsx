type ChoiceButtonsProps = {
  choices: string[];
  loading: boolean;
  onChoiceClick: (choice: string) => void;
};

export default function ChoiceButtons({ choices, loading, onChoiceClick }: ChoiceButtonsProps) {
  if (choices.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2 px-4">
      {choices.map((c) => (
        <button
          key={c}
          disabled={loading}
          onClick={() => onChoiceClick(c)}
          className="px-3 py-1.5 rounded-full text-sm border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
