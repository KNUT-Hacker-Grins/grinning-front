import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface RegisterHeaderProps {
  title: string;
}

export default function RegisterHeader({ title }: RegisterHeaderProps) {
  return (
    <header className="w-full bg-white border-b flex items-center justify-between px-4 py-2 sticky top-0 z-10">
      <Link href="/" className="p-2">
        <FaArrowLeft size={20} className="text-gray-700" />
      </Link>
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="w-8" />
    </header>
  );
}
