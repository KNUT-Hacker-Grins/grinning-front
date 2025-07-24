// app/mypage/page.tsx
import MyPageHeader from '@/components/MyPageHeader';
import ProfileCard from '@/components/ProfileCard';
import SectionTitle from '@/components/SectionTitle';
import RegisteredItemCard from '@/components/RegisteredItemCard';
import ChatPreviewCard from '@/components/ChatPreviewCard';

export default function MyPage() {
  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
        <div className="p-4 pt-0 space-y-4">
          <MyPageHeader />

          <ProfileCard name="김민지" email="minji.kim@email.com" />

          <div className="space-y-2">
            <SectionTitle title="내가 등록한 분실물" />
            <RegisteredItemCard
              id="1"
              title="검은색 지갑"
              location="홍대입구역 2번 출구 근처"
              date="2024.01.15"
              status="진행 중"
            />
            <RegisteredItemCard
              id="2"
              title="아이폰 14 Pro"
              location="강남역 스타벅스"
              date="2024.01.10"
              status="회수 완료"
            />
            <RegisteredItemCard
              id="1"
              title="노트북 파우치"
              location="이대역 2번 출구"
              date="2024.01.08"
              status="진행 중"
            />
          </div>

          <div className="space-y-2">
            <SectionTitle title="참여한 채팅" />
            <ChatPreviewCard
              name="이준호"
              message="안녕하세요, 지갑 찾으셨나요?"
              time="오후 2:30"
            />
            <ChatPreviewCard
              name="박서준"
              message="파우치 사진 좀 더 보내주실 수 있나요?"
              time="오전 11:15"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
