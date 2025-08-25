import { useState, useRef } from "react";

type MessageInputProps = {
  input: string; // 현재 입력 값
  setInput: (value: string) => void; // 입력값을 변경하는 함수
  onSend: () => void; // 전송 버튼 클릭
  loading: boolean; // 서버 통신 중이면 true
  onImageSend?: (file: File) => void; // 이미지 전송 콜백 (선택적)
};

export default function MessageInput({
  input,
  setInput,
  onSend,
  loading,
  onImageSend,
}: MessageInputProps) {
  const [isComposing, setIsComposing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      if (onImageSend) {
        onImageSend(file);
      }
      // Clear the file input value so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
  };

  return (
 <div className="flex items-center border-t px-3 pt-3">
  {/* ✅ 입력 박스를 relative 컨테이너로 */}
  <div className="relative flex-1">
    <input
      type="text"
      placeholder="메시지를 입력하세요..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => {
        setIsComposing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (isComposing) return;
          e.preventDefault();
          onSend();
        }
      }}
      className="w-full border rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none"
      // 👉 pr-10 (padding-right) 줘서 아이콘 들어갈 공간 확보
    />
    {/* 📎 버튼을 input 안쪽 오른쪽에 배치
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      title="이미지 첨부"
    >
      📎
    </button> */}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />
  </div>
      <button
        onClick={() => {
          (document.activeElement as HTMLElement)?.blur(); // IME 조합 강제 종료
          onSend();
        }}
        disabled={loading}
        className="ml-2 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:opacity-60"
      >
        {loading ? (
          "..."
        ) : (
          <img src="/전송.png" alt="전송" className="w-5 h-5" />
        )}
      </button>
      {previewImage && (
        <div className="ml-2 relative">
          <img src={previewImage} alt="preview" className="w-16 h-16 object-cover rounded" />
          <button
            type="button"
            onClick={handleRemovePreview}
            className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            title="이미지 삭제"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
