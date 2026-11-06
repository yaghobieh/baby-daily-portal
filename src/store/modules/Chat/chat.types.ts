export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  inputMessage: string;
  isLoading: boolean;
  error: string | null;
}

export interface DeepSeekChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export interface ChatStoreState extends ChatState {
  toggleOpen: () => void;
  openChat: () => void;
  closeChat: () => void;
  setInputMessage: (text: string) => void;
  sendMessage: (customText?: string) => Promise<void>;
  clearChat: () => void;
}

