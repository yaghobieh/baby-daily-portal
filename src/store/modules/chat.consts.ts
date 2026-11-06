import { EMPTY_STRING } from '@constants/generals.const';

export const CHAT_STORAGE_KEY = 'babydaily_portal_chat_v1';
export const ROLE_USER = 'user';
export const ROLE_ASSISTANT = 'assistant';
export const ROLE_SYSTEM = 'system';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
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

export const INITIAL_CHAT_STATE: ChatState = {
  isOpen: false,
  messages: [],
  inputMessage: EMPTY_STRING,
  isLoading: false,
  error: null,
};
