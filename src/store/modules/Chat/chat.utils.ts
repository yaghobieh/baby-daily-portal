import { formatCurrentTime } from '@utils/date.utils';
import type { ChatMessage, ChatRole } from './chat.types';

export const createChatMessage = (
  role: ChatRole,
  content: string
): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  role,
  content,
  timestamp: formatCurrentTime(),
});

