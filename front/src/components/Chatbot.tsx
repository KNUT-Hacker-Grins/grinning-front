"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./chatbot/ChatHeader"; // 챗봇 헤더 (타이틀 + 상태 뱃지 + 닫기 버튼)
import MessageList from "./chatbot/MessageList"; // 메시지 리스트 (대화창 + 에러 표시)
import MessageInput from "./chatbot/MessageInput"; // 입력창 + 전송 버튼
import { useChatbot } from "@/hooks/useChatbot"; // 챗봇 상태/로직을 관리하는 커스텀 훅

// Chatbot 컴포넌트에 전달되는 props 타입 정의
// - autoOpen: 외부에서 자동으로 챗봇을 열도록 설정할지 여부
// - onRequestClose: 챗봇이 닫힐 때 호출되는 콜백 함수
type ChatbotProps = { autoOpen?: boolean; onRequestClose?: () => void };

export default function Chatbot({
  autoOpen = false,
  onRequestClose,
}: ChatbotProps) {
  // 모달이 열려 있는지 여부
  const [isOpen, setIsOpen] = useState(false);
  // 모달 슬라이드 애니메이션 제어 상태 (translate-y로 전환)
  const [panelEnter, setPanelEnter] = useState(false);

  // useChatbot 훅에서 가져온 상태/함수들
  // - input: 현재 입력창 값
  // - setInput: 입력창 값 업데이트
  // - messages: 대화 메시지 배열
  // - choices: 현재 서버가 내려준 선택지 버튼들
  // - health: 서버 헬스 상태 (online/offline)
  // - loading: 서버와 통신 중인지 여부
  // - errorMsg: 에러 메시지 (있으면 화면 표시)
  // - scrollRef: 메시지 리스트 스크롤 참조
  // - handleSend: 입력창 전송 핸들러
  // - handleChoiceClick: 선택지 버튼 클릭 핸들러
  const {
    input,
    setInput,
    messages,
    choices,
    health,
    loading,
    errorMsg,
    scrollRef,
    handleSend,
    handleChoiceClick,
  } = useChatbot(isOpen);

  // 챗봇 모달 열기
  const openModal = () => {
    setIsOpen(true); // 모달 자체는 true로 열림
    setTimeout(() => setPanelEnter(true), 10); // 짧은 지연 후 panelEnter true → 슬라이드 인 애니메이션
  };

  // 챗봇 모달 닫기
  const closeModal = () => {
    setPanelEnter(false); // 애니메이션: 패널이 아래로 내려감
    setTimeout(() => setIsOpen(false), 300); // 애니메이션 시간 후 실제 모달 언마운트
    onRequestClose?.(); // 부모 컴포넌트에서 정의한 닫기 콜백 실행 (있다면)
  };

  // autoOpen이 true라면 처음 렌더 시 자동으로 챗봇 열기
  useEffect(() => {
    if (autoOpen && !isOpen) openModal();
  }, [autoOpen, isOpen]);

  return (
    <>
      {/* 모달이 열렸을 때만 렌더링 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40"
          onClick={closeModal} // 오버레이 클릭 시 닫기
        >
          <div
            onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫힘 방지
            className={[
              "w-[300px] bg-white rounded-2xl shadow-xl", // 패널 크기, 배경, 그림자, 둥근 모서리
              "flex flex-col", // 세로 레이아웃
              "h-[600px]", // 높이 고정
              "pb-4",
              "mb-[80px]", // 하단 여백
              "transform transition-transform duration-300 ease-out", // 전환 애니메이션
              panelEnter ? "translate-y-0" : "translate-y-full", // 슬라이드 인/아웃 상태
            ].join(" ")}
          >
            {/* 상단 헤더: 챗봇 타이틀 + 상태 뱃지 + 닫기 버튼 */}
            <ChatHeader health={health} onClose={closeModal} />

            {/* 메시지 리스트: 유저/봇 메시지 + 에러 메시지 */}
            <MessageList
              messages={messages}
              scrollRef={scrollRef}
              errorMsg={errorMsg}
              choices={choices}
              loading={loading}
              onChoiceClick={handleChoiceClick}
            />

            {/* 입력창 + 전송 버튼 */}
            <MessageInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              loading={loading}
            />
          </div>
        </div>
      )}
    </>
  );
}