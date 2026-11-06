import {
  DEEPSEEK_API_KEY,
  DEEPSEEK_API_URL,
  DEEPSEEK_MODEL,
  DEEPSEEK_SYSTEM_PROMPT,
} from '@constants/api.const';
import {
  CHAT_API_TEMPERATURE,
  CHAT_API_MAX_TOKENS,
  NUMBER_TEN,
} from '@constants/numbers.const';
import type { ChatMessage, DeepSeekChatResponse } from './chat.types';

export const sendDeepSeekMessage = async (
  conversationHistory: ChatMessage[],
  newMessage: string
): Promise<string> => {
  const messages = [
    { role: 'system', content: DEEPSEEK_SYSTEM_PROMPT },
    ...conversationHistory.slice(-NUMBER_TEN).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: 'user', content: newMessage },
  ];

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      temperature: CHAT_API_TEMPERATURE,
      max_tokens: CHAT_API_MAX_TOKENS,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as DeepSeekChatResponse;
  const replyContent = data.choices?.[0]?.message?.content;

  if (!replyContent) {
    throw new Error('No response returned by DeepSeek API');
  }

  return replyContent;
};
