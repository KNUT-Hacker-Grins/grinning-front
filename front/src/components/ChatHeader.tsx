import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface ChatHeaderProps {
  name: string;  // 채팅 상대방 이름
  imageUrl?: string; // 프로필 이미지 URL (없으면 기본값 사용)
}

export default function ChatHeader({ name, imageUrl }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/mypage" className="p-2">
        <FaArrowLeft size={20} className="text-gray-700" />
      </Link>
      <div className="flex items-center gap-3">
        <img
          src={imageUrl || "/cheetah.jpeg"}
          alt={imageUrl ? name : "기본 프로필"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h1 className="text-lg font-semibold text-gray-900">{name}</h1>
      </div>
      <div className="w-8" />
    </header>
  );
}

