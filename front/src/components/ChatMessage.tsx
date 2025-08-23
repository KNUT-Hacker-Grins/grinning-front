interface ChatMessageProps {
  text: string;
  isMine: boolean;
  senderProfilePictureUrl?: string; // Added
  senderName: string; // Added for alt text
}

export default function ChatMessage({ text, isMine, senderProfilePictureUrl, senderName }: ChatMessageProps) {
  const messageClass = isMine
    ? 'bg-blue-500 text-white self-end'
    : 'bg-gray-200 text-black self-start';

  const defaultProfileImage = "/default-profile.png"; // Placeholder

  return (
    <div className={`flex items-end ${isMine ? 'flex-row-reverse' : 'flex-row'}`}> {/* Added items-end and flex-row-reverse */}
      {!isMine && ( // Only show profile picture for others' messages
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
          <img
            src={senderProfilePictureUrl || defaultProfileImage}
            alt={`${senderName} 프로필`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`rounded-lg px-4 py-2 max-w-xs ${messageClass}`}>
        {text}
      </div>
    </div>
  );
}
