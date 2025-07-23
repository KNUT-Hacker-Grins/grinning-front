interface PhotoUploadSectionProps {
  // 필요한 props가 있다면 여기에 추가
}

export default function PhotoUploadSection({}: PhotoUploadSectionProps) {
  return (
    <section>
      <label className="block text-sm font-medium text-gray-900 mb-2">분실물 사진</label>
      <div className="flex gap-2">
        <div className="w-20 h-20 border border-gray-300 rounded flex flex-col items-center justify-center text-sm text-gray-50">
          <span>촬영</span>
        </div>
        <div className="w-20 h-20 border border-gray-300 rounded flex flex-col items-center justify-center text-sm text-gray-500">
          <span>갤러리</span>
        </div>
        <div className="w-20 h-20 border border-gray-300 rounded flex items-center justify-center text-2xl text-gray-300">
          +
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1">최대 3장까지 업로드 가능합니다</p>
    </section>
  );
}
