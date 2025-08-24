type MessageInputProps = {
  input: string; // 현재 입력 값
  setInput: (value: string) => void; // 입력값을 변경하는 함수
  onSend: () => void; // 전송 버튼 클릭
  loading: boolean; // 서버 통신 중이면 true
};

export default function MessageInput({
  input,
  setInput,
  onSend,
  loading,
}: MessageInputProps) {
  return (
    <div className="flex items-center border-t px-3 pt-3">
      <input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)} // 입력할 때마다 부모 state 업데이트
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend(); // 엔터키 누르면 메시지 전송
        }}
        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
      />
      <button
        onClick={onSend}
        disabled={loading}
        className="ml-2 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:opacity-60"
      >
        {loading ? (
          "..."
        ) : (
          <img src="/전송.png" alt="전송" className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
