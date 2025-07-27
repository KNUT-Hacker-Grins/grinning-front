interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export default function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
        />
        <button onClick={onSend} className="ml-4 p-2 bg-blue-500 text-white rounded-full">
          전송
        </button>
      </div>
    </div>
  );
}
