import {
  DEEPSEEK_API_KEY,
  DEEPSEEK_API_URL,
  DEEPSEEK_MODEL,
  DEEPSEEK_SYSTEM_PROMPT,
} from '@constants/api.const';
import type { ChatMessage } from './chat.consts';

export interface DeepSeekChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export const sendDeepSeekMessage = async (
  conversationHistory: ChatMessage[],
  newMessage: string
): Promise<string> => {
  const messages = [
    { role: 'system', content: DEEPSEEK_SYSTEM_PROMPT },
    ...conversationHistory.slice(-10).map((m) => ({
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
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
  }

  const data: DeepSeekChatResponse = await response.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error('No response returned from BabyDaily AI.');
  }

  return reply;
};
