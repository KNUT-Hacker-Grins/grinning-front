import { useMemo } from "react";
import { HealthRes } from "@/types/chatbot";

type ChatHeaderProps = {
  health: HealthRes | null;
  onClose: () => void;
};

export default function ChatHeader({ health, onClose }: ChatHeaderProps) {
  const healthBadge = useMemo(() => {
    if (!health) return null;
    return (
      <span
        className={`ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
          health.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
        title={health.time}
      >
        ● {health.ok ? "online" : "offline"}
      </span>
    );
  }, [health]);

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">찾아줘 챗봇</h2>
        {healthBadge}
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
        aria-label="챗봇 닫기"
      >
        ✖
      </button>
    </div>
  );
}
