'use client';

import { useRouter } from 'next/navigation';

interface MapItem {
  id: number;
  title: string;
  image_url: string;
  item_type: 'lost' | 'found';
}

interface MapItemPreviewProps {
  item: MapItem;
  onClose: () => void;
}

export default function MapItemPreview({ item, onClose }: MapItemPreviewProps) {
  const router = useRouter();

  const handleNavigate = () => {
    const path = item.item_type === 'lost' ? `/lost-item/${item.id}` : `/found-item/${item.id}`;
    router.push(path);
  };

  return (
    <div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-20 p-5 flex items-center gap-5 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" 
      onClick={handleNavigate}
    >
      <img
        src={item.image_url || '/placeholder.png'}
        alt={item.title}
        className="w-24 h-24 rounded-xl object-cover border border-gray-100"
      />
      <div className="flex-1 overflow-hidden">
        <p className={`text-sm font-semibold ${item.item_type === 'lost' ? 'text-red-500' : 'text-blue-500'}`}>
          {item.item_type === 'lost' ? '분실물' : '습득물'}
        </p>
        <h3 className="font-bold text-lg text-gray-900 truncate">{item.title}</h3>
        <p className="text-base text-gray-600 mt-1">클릭하여 상세 정보 보기</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-1 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
