import {
  DEEPSEEK_API_KEY,
  DEEPSEEK_API_URL,
  DEEPSEEK_MODEL,
  DEEPSEEK_SYSTEM_PROMPT,
} from '@constants/api.const';
import { URL_API_BACKEND } from '@constants/routes.const';
import {
  CHAT_API_TEMPERATURE,
  CHAT_API_MAX_TOKENS,
  NUMBER_TEN,
} from '@constants/numbers.const';
import type { ChatMessage, DeepSeekChatResponse } from './chat.types';

export const PORTAL_TOKEN_KEY = 'babydaily_portal_token';
export const PORTAL_BABY_ID_KEY = 'babydaily_active_baby_id';

export const sendDeepSeekMessage = async (
  conversationHistory: ChatMessage[],
  newMessage: string
): Promise<string> => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(PORTAL_TOKEN_KEY) : null;
  const babyId = typeof window !== 'undefined' ? window.localStorage.getItem(PORTAL_BABY_ID_KEY) : null;

  if (token && babyId) {
    const beRes = await fetch(`${URL_API_BACKEND}/babies/${babyId}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: newMessage }),
    });

    if (beRes.status === 402) {
      return '✨ Daily Free AI Limit (3/3) reached! Upgrade to **BabyDaily Premium ($4.99/mo or $39.99/yr)** in the Web Dashboard or Mobile App for unlimited AI guidance, daily email digests, and 7-day analytics.';
    }

    if (beRes.ok) {
      const beJson = (await beRes.json()) as {
        reply: string;
        aiQueriesToday: number;
        aiDailyLimit: number;
        isPremium: boolean;
      };
      const footer = beJson.isPremium
        ? `\n\n_✨ BabyDaily Premium • Synced with your baby's live routine_`
        : `\n\n_🔄 Free Tier: ${beJson.aiQueriesToday}/${beJson.aiDailyLimit} daily AI uses (shared across Web & App)_`;
      return `${beJson.reply}${footer}`;
    }
  }

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
