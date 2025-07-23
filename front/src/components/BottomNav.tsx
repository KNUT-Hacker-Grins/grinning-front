'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-sm max-w-md mx-auto h-16 flex justify-around items-center" style={{maxWidth: '390px'}}>
      <NavItem href="/" label="홈" active={pathname === '/'} />
      <NavItem href="/register" label="등록" active={pathname === '/register'} />
      <NavItem
        href="/chat"
        label="채팅"
        active={pathname.startsWith('/chat')}
      />
      <NavItem
        href="/mypage"
        label="마이페이지"
        active={pathname.startsWith('/mypage')}
      />
    </nav>
  )
}

type NavItemProps = {
  href: string
  label: string
  active: boolean
}

function NavItem({ href, label, active }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center text-sm">
      <span className={`${active ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>{label}</span>
    </Link>
  )
}