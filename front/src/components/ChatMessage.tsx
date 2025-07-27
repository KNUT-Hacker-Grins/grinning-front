interface ChatMessageProps {
  text: string;
  isMine: boolean;
}

export default function ChatMessage({ text, isMine }: ChatMessageProps) {
  const messageClass = isMine
    ? 'bg-blue-500 text-white self-end'
    : 'bg-gray-200 text-black self-start';

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-xs ${messageClass}`}>
        {text}
      </div>
    </div>
  );
}
