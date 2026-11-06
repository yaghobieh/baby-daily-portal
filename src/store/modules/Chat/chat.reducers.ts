import { createNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '@constants/generals.const';
import { sendDeepSeekMessage } from './chat.apis';
import {
  INITIAL_CHAT_STATE,
  ROLE_ASSISTANT,
  ROLE_USER,
  DEFAULT_AI_ERROR_MESSAGE,
} from './chat.consts';
import type { ChatStoreState } from './chat.types';
import { createChatMessage } from './chat.utils';

export const chatNucleus = createNucleus<ChatStoreState>((set, get) => ({
  ...INITIAL_CHAT_STATE,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  setInputMessage: (inputMessage: string) => set({ inputMessage }),

  sendMessage: async (customText?: string) => {
    const text = (customText ?? get().inputMessage).trim();
    if (!text || get().isLoading) return;

    const userMsg = createChatMessage(ROLE_USER, text);
    const updatedMessages = [...get().messages, userMsg];

    const pendingChatState = {
      messages: updatedMessages,
      inputMessage: EMPTY_STRING,
      isLoading: true,
      error: null,
    };
    set(pendingChatState);

    try {
      const reply = await sendDeepSeekMessage(updatedMessages, text);
      const assistantMsg = createChatMessage(ROLE_ASSISTANT, reply);

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isLoading: false,
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : DEFAULT_AI_ERROR_MESSAGE;
      const fallbackMsg = createChatMessage(
        ROLE_ASSISTANT,
        `⚠️ ${errorMessage}. Please check network or retry shortly.`
      );

      set((state) => ({
        messages: [...state.messages, fallbackMsg],
        isLoading: false,
        error: errorMessage,
      }));
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));
