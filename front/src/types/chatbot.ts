export type Role = "user" | "bot";

export type Message = {
  role: Role;
  content: string;
};

export type HealthRes = {
  ok: boolean;
  time: string;
  state?: string;
  session_id?: string;
  created?: boolean;
};

export type ChatbotReply = {
  session_id: string;
  state: "idle" | "awaiting_description" | "move_to_article" | "other" | string;
  reply: string;
  choices: string[];
  recommendations: unknown[];
  data: Record<string, unknown>;
};
