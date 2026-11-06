import { formatCurrentTime } from '@utils/date.utils';
import type { ChatMessage } from './chat.consts';

export const createChatMessage = (
  role: 'user' | 'assistant' | 'system',
  content: string
): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  role,
  content,
  timestamp: formatCurrentTime(),
});
