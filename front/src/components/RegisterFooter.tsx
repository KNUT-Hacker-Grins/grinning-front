interface RegisterFooterProps {
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonText?: string;
}

export default function RegisterFooter({ onSubmit, isLoading = false, disabled = false, buttonText = "등록하기" }: RegisterFooterProps) {
  return (
    <footer className="w-full p-4 bg-white sticky bottom-0 border-t border-gray-200">
      <button
        onClick={onSubmit}
        disabled={isLoading || disabled}
        className={`w-full h-[60px] text-white text-lg font-semibold rounded-lg transition-colors ${
          isLoading || disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            등록 중...
          </div>
        ) : (
          buttonText
        )}
      </button>
    </footer>
  );
}
