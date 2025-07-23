type Props = {
    name: string
    message: string
    time: string
  }
  
  export default function ChatPreviewCard({ name, message, time }: Props) {
    return (
      <div className="flex justify-between items-start p-3 border border-gray-100 rounded-lg bg-white">
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-sm text-gray-500">{message}</div>
        </div>
        <div className="text-xs text-gray-400">{time}</div>
      </div>
    )
  }
  