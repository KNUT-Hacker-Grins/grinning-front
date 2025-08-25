import Image from 'next/image';
import Link from 'next/link';

// The full item object structure from the API
interface User {
  id: number | null;
  email: string;
  name: string;
  profile_picture_url: string;
}

interface Item {
  id: number;
  user: User | null;
  title: string;
  description: string;
  lost_at?: string;
  found_at?: string;
  lost_location?: string;
  found_location?: string;
  image_urls: string[];
  status: string;
}

interface RegisteredItemCardProps {
  item: Item;
  type: 'lost' | 'found';
}

export default function RegisteredItemCard({ item, type }: RegisteredItemCardProps) {
  const location = type === 'lost' ? item.lost_location : item.found_location;
  const date = type === 'lost' ? item.lost_at : item.found_at;
  const detailUrl = `/${type}-item/${item.id}`;

  // Default user object for robustness
  const user = item.user || { name: '익명', profile_picture_url: '/default-profile.png' };

  return (
    <Link href={detailUrl} legacyBehavior>
      <a className="flex items-center p-4 bg-white rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-50">
        <div className="w-24 h-24 relative rounded-lg overflow-hidden mr-4 flex-shrink-0">
          <Image
            src={item.image_urls?.[0] || '/placeholder.svg'}
            alt={item.title || 'Item image'}
            layout="fill"
            objectFit="cover"
            className="bg-gray-200"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-lg mb-1 truncate">{item.title || '제목 없음'}</h3>
          <p className="text-gray-600 text-sm mb-2 truncate">{item.description}</p>
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full overflow-hidden mr-2 relative flex-shrink-0">
              <Image
                src={user.profile_picture_url || '/placeholder.svg'}
                alt={user.name || 'User profile'}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <span className="truncate">{user.name || '익명'}</span>
            <span className="mx-2">|</span>
            <span className="truncate">{location}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
  