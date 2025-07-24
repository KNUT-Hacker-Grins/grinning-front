import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';


interface MySettingHeaderProps {
  onSave: () => void;
}

export default function MySettingHeader({ onSave }: MySettingHeaderProps) {
  return (
    <header className="w-full h-[69px] border-b border-gray-100 flex items-center justify-between px-4">
      <Link href="/mypage">
      <FaArrowLeft size={20} className="text-gray-700" />
      </Link>
      <h1 className="text-lg font-semibold text-gray-900">프로필 수정</h1>
      <button
        onClick={onSave}
        className="text-sm text-white bg-blue-500 px-4 py-1.5 rounded-lg"
      >
        저장
      </button>
    </header>
  );
}
