import Link from 'next/link';
import { FaCog } from 'react-icons/fa'

export default function MyPageHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
      <h1 className="text-xl font-semibold text-gray-900">마이페이지</h1>
      <Link href="/mysetting">
        <FaCog className="text-gray-500" size={20} />
      </Link>
    </header>
  )
}
