"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BottomNav() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-sm max-w-md mx-auto h-16 flex justify-around items-center"
      style={{ maxWidth: "390px" }}
    >
      <NavItem href="/" imageSrc="/button (3).png" active={activePath === '/'} />
      <NavItem href="/register" imageSrc="/button (2).png" active={activePath === '/register'} />
      <NavItem href="/chat" imageSrc="/button (1).png" active={activePath.startsWith('/chat')} />
      <NavItem href="/mypage" imageSrc="/button.png" active={activePath.startsWith('/mypage')} />
    </nav>
  );
}

type NavItemProps = {
  href: string;
  imageSrc: string;
  active: boolean;
};

function NavItem({ href, imageSrc, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center text-sm"
    >
      <Image
        src={imageSrc}
        alt="nav-icon"
        width={40}
        height={40}
        className={active ? "opacity-100" : "opacity-40"}
      />
    </Link>
  );
}
