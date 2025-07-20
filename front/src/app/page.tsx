'use client';

import { useState } from 'react';

interface LostItem {
  id: number;
  title: string;
  location: string;
  timeAgo: string;
  imageUrl: string;
}

export default function Home() {
  const [foundItems] = useState<LostItem[]>([
    {
      id: 1,
      title: '애플워치 분실물',
      location: '충청북도 충주시',
      timeAgo: '5분 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 2,
      title: '지갑 분실물',
      location: '충청북도 충주시',
      timeAgo: '2시간 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 3,
      title: '아이폰 14 ...',
      location: '충청북도 충주시',
      timeAgo: '2시간 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 4,
      title: '에어팟 프로',
      location: '충청북도 충주시',
      timeAgo: '1일 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 5,
      title: '카드지갑',
      location: '충청북도 충주시',
      timeAgo: '3시간 전',
      imageUrl: '/api/placeholder/124/124'
    }
  ]);

  const [wantedItems] = useState<LostItem[]>([
    {
      id: 6,
      title: '애플워치 분실물',
      location: '충청북도 충주시',
      timeAgo: '5분 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 7,
      title: '지갑 잃어버리신 분',
      location: '충청북도 충주시',
      timeAgo: '2시간 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 8,
      title: '아이폰 14 ...',
      location: '충청북도 충주시',
      timeAgo: '2시간 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 9,
      title: '갤럭시 버즈 찾아요',
      location: '충청북도 충주시',
      timeAgo: '6시간 전',
      imageUrl: '/api/placeholder/124/124'
    },
    {
      id: 10,
      title: '반지 잃어버림',
      location: '충청북도 충주시',
      timeAgo: '1일 전',
      imageUrl: '/api/placeholder/124/124'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleRegister = () => {
    {console.log('등록하기 버튼 클릭');}
    //todo
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
        {/* 상단 헤더 */}
        <div className="relative px-6 pt-16 pb-6">
        {/* 로고와 프로필 */}
        <div className="flex justify-between items-center mb-[50px]">
          <div className="flex gap-[15px]">
            <div className="w-[61px] h-10 bg-gray-300 rounded-[20px]"></div>
            <div className="w-[61px] h-10 bg-gray-300 rounded-[20px]"></div>
          </div>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>

        {/* 위치 */}
        <div className="flex items-center gap-2 mb-15">
          <img src="/location logo.svg" alt="위치" width="31" height="31" className="text-red-500" />
          <h1 className="text-2xl font-semibold text-black">
            충청북도 충주시 대소원면
          </h1>
        </div>

        {/* 검색바 */}
        <div className="relative mb-[20px]">
          {/* 검색바 컨테이너 */}
          <div className="relative h-[54px] w-full max-w-[340px] mx-auto">
            {/* 배경과 테두리 */}
            <div className="absolute inset-0 bg-white border-2 border-solid border-black rounded-[27px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
            
            {/* 검색 아이콘 */}
            <div className="absolute left-3 top-[13px] w-[29px] h-[29px] overflow-hidden">
              <div className="absolute inset-[12.5%]">
                <img src="/Search.svg" alt="검색" className="w-full h-full block" />
              </div>
            </div>
            
            {/* 입력 필드 */}
            <input
              type="text"
              placeholder="내 물건 찾기"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="absolute left-[55px] top-[15px] w-[200px] h-[24px] text-[#8b8484] text-base font-normal outline-none bg-transparent leading-none placeholder:text-[#8b8484] placeholder:leading-none"
              style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}
            />
            
            {/* 카메라 아이콘 */}
            <div className="absolute right-3 top-[17px] w-5 h-5 overflow-hidden">
              <div className="absolute bottom-[12.5%] left-[4.167%] right-[4.167%] top-[12.5%]">
                <img src="/Camera.svg" alt="카메라" className="w-full h-full block" />
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-[15px] mb-[13px] pl-[23px]">
          {[1, 2, 3, 4].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`w-[61px] h-6 rounded-[20px] text-sm font-normal flex items-center justify-center ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#d9d9d9] text-[#8b8484]'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 분실물 찾기 섹션 */}
      <section className="mb-[56px]">
        <div className="flex justify-between items-center mb-[27px] px-6">
          <h2 className="text-lg font-normal text-black">분실물 찾기</h2>
          <button className="text-xs text-black/30">더보기</button>
        </div>
        
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
            {foundItems.map((item) => (
              <div key={item.id} className="flex flex-col flex-shrink-0" style={{ width: '124px' }}>
                <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                  {/* 실제로는 데이터베이스에서 가져온 이미지를 표시 */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                </div>
                <h3 className="text-[13px] font-normal text-black mb-[5px] line-clamp-1" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  {item.title}
                </h3>
                <div className="flex justify-between items-center text-[8px] text-[#9e9e9e]" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  <span className="line-clamp-1 max-w-[70px]">{item.location}</span>
                  <span className="flex-shrink-0">{item.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 분실물 수배 섹션 */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-[27px] px-6">
          <h2 className="text-lg font-normal text-black">분실물 수배</h2>
          <button className="text-xs text-black/30">더보기</button>
        </div>
        
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
            {wantedItems.map((item) => (
              <div key={item.id} className="flex flex-col flex-shrink-0" style={{ width: '124px' }}>
                <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                </div>
                <h3 className="text-[13px] font-normal text-black mb-[5px] line-clamp-1" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  {item.title}
                </h3>
                <div className="flex justify-between items-center text-[8px] text-[#9e9e9e]" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  <span className="line-clamp-1 max-w-[70px]">{item.location}</span>
                  <span className="flex-shrink-0">{item.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* 등록하기 버튼 */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={handleRegister}
            className="bg-gray-300 hover:bg-gray-400 transition-colors duration-200 px-6 py-3 rounded-xl shadow-lg"
          >
            <span className="text-white text-sm font-normal">+ 등록하기</span>
          </button>
        </div>
      </div>
    </main>
  );
}