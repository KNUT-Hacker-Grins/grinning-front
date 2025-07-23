interface RegisterFooterProps {
  onSubmit: () => void;
}

export default function RegisterFooter({ onSubmit }: RegisterFooterProps) {
  return (
    <footer className="w-full p-1 bg-white sticky bottom-16">
      <button
        onClick={onSubmit}
        className="w-full h-[60px] bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        분실물 등록하기
      </button>
    </footer>
  );
}
