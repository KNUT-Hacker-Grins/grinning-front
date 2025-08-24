type MessageInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
};

export default function MessageInput({ input, setInput, onSend, loading }: MessageInputProps) {
  return (
    <div className="flex items-center border-t px-3 pt-3">
      <input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
      />
      <button
        onClick={onSend}
        disabled={loading}
        className="ml-2 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:opacity-60"
      >
        {loading ? "..." : "전송"}
      </button>
    </div>
  );
}
