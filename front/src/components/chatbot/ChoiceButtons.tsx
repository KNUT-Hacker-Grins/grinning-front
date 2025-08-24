type ChoiceButtonsProps = {
  choices: string[];    // 버튼에 표시할 텍스트 배열 "분실물 찾기","분실물 신고" 등
  loading: boolean;     // 로딩 중이면 버튼 비활성화
  onChoiceClick: (choice: string) => void; /// 버튼 클릭 시 실행할 콜백 (클릭 될 시 부모로 이벤트 전달)
};

export default function ChoiceButtons({ choices, loading, onChoiceClick }: ChoiceButtonsProps) {
  if (choices.length === 0) return null;
  // choices가 없으면 아무것도 렌더링하지 않음
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {choices.map((c) => ( // 배열 순회로 버튼 생성
        <button
          key={c}
          disabled={loading} // 로딩 중 일 때 클릭 불가능
          onClick={() => onChoiceClick(c)} // 버튼 클릭 시 부모 컴포넌트에 값 전달
          className="px-3 py-1.5 rounded-full text-sm border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
          // px-3 py-1.5 → 버튼 패딩
          // rounded-full → pill 모양 버튼
          // text-sm → 작은 글씨
          // border border-indigo-200 → 연보라색 테두리
          // text-indigo-700 hover:bg-indigo-50 → 텍스트 색 + hover 시 배경
          // disabled:opacity-60 → 비활성화 시 반투명 처리
        >  
          {c}
        </button>
      ))}
    </div>
  );
}
