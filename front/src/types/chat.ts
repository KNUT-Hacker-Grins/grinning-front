// front/src/types/chat.ts

export interface ChatMessageSender {
  id: number;
  name: string;
  profile_picture_url?: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: ChatMessageSender;
  timestamp: string;
  message_type: string;
}

export interface ChatRoom {
  id: number;
  user_a: ChatMessageSender;
  user_b: ChatMessageSender;
  created_at: string;
  post_type: 'found' | 'lost';
  post_id: number;
  last_message?: ChatMessage;
  unread_count?: number;
}
