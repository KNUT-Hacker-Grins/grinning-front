'use client';

import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const reportReasons = [
  '스팸/광고성 게시물',
  '부적절한 내용 포함',
  '사기 의심',
  '기타',
];

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState(reportReasons[0]);
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }
    onSubmit(reason, details);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-11/12 max-w-sm p-6">
        <h2 className="text-lg font-semibold text-center mb-4">신고하기</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">신고 사유</label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-white"
            >
              {reportReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">상세 내용 (선택)</label>
            <textarea
              id="details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg resize-none"
              placeholder="상세한 내용을 입력해주세요..."
            />
          </div>
        </div>

        <div className="flex justify-between mt-6 space-x-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
}
