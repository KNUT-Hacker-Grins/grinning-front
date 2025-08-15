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
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-white rounded-2xl shadow-lg z-20 p-4 flex items-center gap-4 cursor-pointer" onClick={handleNavigate}>
      <img
        src={item.image_url || '/placeholder.png'}
        alt={item.title}
        className="w-20 h-20 rounded-lg object-cover"
      />
      <div className="flex-1">
        <p className={`text-xs font-semibold ${item.item_type === 'lost' ? 'text-red-500' : 'text-blue-500'}`}>
          {item.item_type === 'lost' ? '분실물' : '습득물'}
        </p>
        <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
        <p className="text-sm text-gray-500">클릭하여 상세 정보 보기</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigation when closing
          onClose();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
