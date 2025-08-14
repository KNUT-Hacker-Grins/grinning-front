'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdHome, MdAddBox, MdChat, MdPerson, MdMap } from 'react-icons/md'; // Import MdMap

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-sm max-w-md mx-auto h-16 flex justify-around items-center" style={{ maxWidth: '390px' }}>
      <NavItem href="/" icon={<MdHome size={24} />} label="홈" active={pathname === '/'} />
      <NavItem href="/register" icon={<MdAddBox size={24} />} label="등록" active={pathname === '/register'} />
      <NavItem href="/map" icon={<MdMap size={24} />} label="지도" active={pathname === '/map'} /> {/* New Map NavItem */}
      <NavItem href="/chat" icon={<MdChat size={24} />} label="대화" active={pathname.startsWith('/chat')} />
      <NavItem href="/mypage" icon={<MdPerson size={24} />} label="내 정보" active={pathname.startsWith('/mypage')} />
    </nav>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center text-xs text-gray-500 hover:text-blue-600">
      <div className={active ? 'text-blue-600' : 'text-gray-400'}>
        {icon}
      </div>
      <span className={active ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
        {label}
      </span>
    </Link>
  );
}
