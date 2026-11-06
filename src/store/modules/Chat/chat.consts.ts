import { EMPTY_STRING } from '@constants/generals.const';
import type { ChatState } from './chat.types';

export const ROLE_USER = 'user';
export const ROLE_ASSISTANT = 'assistant';
export const ROLE_SYSTEM = 'system';

export const DEFAULT_AI_ERROR_MESSAGE = 'Unknown AI assistant error occurred';

export const INITIAL_CHAT_STATE: ChatState = {
  isOpen: false,
  messages: [],
  inputMessage: EMPTY_STRING,
  isLoading: false,
  error: null,
};
