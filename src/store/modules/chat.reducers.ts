import { createNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '@constants/generals.const';
import { sendDeepSeekMessage } from './chat.apis';
import {
  INITIAL_CHAT_STATE,
  ROLE_ASSISTANT,
  ROLE_USER,
  type ChatMessage,
  type ChatState,
} from './chat.consts';
import { createChatMessage } from './chat.utils';

export interface ChatStoreState extends ChatState {
  toggleOpen: () => void;
  openChat: () => void;
  closeChat: () => void;
  setInputMessage: (text: string) => void;
  sendMessage: (customText?: string) => Promise<void>;
  clearChat: () => void;
}

export const chatNucleus = createNucleus<ChatStoreState>((set, get) => ({
  ...INITIAL_CHAT_STATE,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  setInputMessage: (inputMessage: string) => set({ inputMessage }),

  sendMessage: async (customText?: string) => {
    const state = get();
    const textToSend = (customText ?? state.inputMessage).trim();
    if (!textToSend || state.isLoading) return;

    const userMsg = createChatMessage(ROLE_USER, textToSend);
    const updatedMessages = [...state.messages, userMsg];

    set({
      messages: updatedMessages,
      inputMessage: EMPTY_STRING,
      isLoading: true,
      error: null,
    });

    try {
      const aiReplyText = await sendDeepSeekMessage(state.messages, textToSend);
      const aiMsg = createChatMessage(ROLE_ASSISTANT, aiReplyText);
      set((prev) => ({
        messages: [...prev.messages, aiMsg],
        isLoading: false,
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to BabyDaily AI.';
      const fallbackMsg = createChatMessage(
        ROLE_ASSISTANT,
        `Sorry, I encountered a temporary connection issue. You can still reach our team at yaghobieh@gmail.com!`
      );
      set((prev) => ({
        messages: [...prev.messages, fallbackMsg],
        isLoading: false,
        error: errorMessage,
      }));
    }
  },

  clearChat: () => set({ messages: [], error: null }),
}));
