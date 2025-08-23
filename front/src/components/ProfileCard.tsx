'use client';

import { useRouter } from 'next/navigation';

type Props = {
  name: string
  email: string
  profileImage?: string | null
}

export default function ProfileCard({ name, email, profileImage }: Props) {
  const router = useRouter();

  const handleProfileClick = () => {
    // 간단한 로그인 상태 체크 (실제 프로젝트에서는 실제 인증 상태를 확인해야 함)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push('/login');
    } else {
      // 로그인된 경우 프로필 상세 페이지나 다른 동작 수행
      console.log('프로필 클릭 - 이미 로그인됨');
      // 필요시 프로필 상세 페이지로 이동
      // router.push('/profile');
    }
  };

  const defaultProfileImage = "/default-profile.png"; // Use a local placeholder image

  return (
    <div className="flex items-center gap-4">
      <img
        src={profileImage || defaultProfileImage}
        alt="profile"
        className="w-14 h-14 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleProfileClick}
        onError={(e) => {
          // 프로필 이미지 로드 실패 시 기본 이미지로 대체
          e.currentTarget.src = defaultProfileImage;
        }}
      />
      <div>
        <div className="text-base font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">{email}</div>
      </div>
    </div>
  )
}
  