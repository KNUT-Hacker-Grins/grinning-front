import Link from 'next/link';

type Props = {
  id: string | number
  title: string
  location: string
  date: string
  status: '진행 중' | '회수 완료'
}

export default function RegisteredItemCard({ id, title, location, date, status }: Props) {
  const statusColor = status === '진행 중' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'

  return (
    <Link href={`/lost-item/${id}`} className="block cursor-pointer hover:opacity-80 transition-opacity">
      <div className="border border-gray-100 rounded-lg p-3 space-y-1 bg-white">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>{status}</span>
        </div>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </Link>
  )
}
  