import { type FC, type KeyboardEvent, useRef } from 'react';
import { useNucleus } from '@forgedevstack/synapse';
import { chatNucleus } from '@store/modules/chat.reducers';
import {
  CHAT_TITLE,
  CHAT_SUBTITLE,
  CHAT_PLACEHOLDER,
  CHAT_EMPTY_STATE,
  CHAT_SUGGESTION_1,
  CHAT_SUGGESTION_2,
  CHAT_SUGGESTION_3,
} from '@constants/strings.const';
import { Sparkles, Send, X, Bot, User, Trash2 } from 'lucide-react';

export const ChatWidget: FC = () => {
  const {
    isOpen,
    toggleOpen,
    closeChat,
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    clearChat,
    isLoading,
  } = useNucleus(chatNucleus);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    void sendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleOpen}
        aria-label="Open AI Assistant"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#FF7A7A] to-[#8C7AE6] text-white font-bold shadow-2xl hover:shadow-coral-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
        <span className="text-sm">BabyDaily AI</span>
        {messages.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-white ring-2 ring-[#FF7A7A]" />
        )}
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[82vh] bg-white rounded-3xl shadow-2xl border border-[#F0EBE6] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#FFF0F0] via-[#F5F3FC] to-[#EFFBF5] border-b border-[#F0EBE6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#FF7A7A] flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-[#2D3142] flex items-center gap-1.5">
                  <span>{CHAT_TITLE}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#8C7AE6]/10 text-[#8C7AE6]">
                    DeepSeek AI
                  </span>
                </div>
                <div className="text-[11px] text-[#71788E]">{CHAT_SUBTITLE}</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear chat history"
                  className="p-1.5 rounded-xl text-[#71788E] hover:text-[#FF7A7A] hover:bg-white/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeChat}
                className="p-1.5 rounded-xl text-[#71788E] hover:text-[#2D3142] hover:bg-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFFDFB]">
            {messages.length === 0 ? (
              <div className="pt-6 pb-2 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-3xl bg-[#FFF0F0] flex items-center justify-center mb-3 text-[#FF7A7A] shadow-inner">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-[#2D3142]">Welcome to BabyDaily AI</h4>
                <p className="text-xs text-[#71788E] max-w-[300px] mt-1.5 leading-relaxed">
                  {CHAT_EMPTY_STATE}
                </p>

                <div className="w-full mt-6 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#A89E95] text-left px-1">
                    Suggested Questions
                  </div>
                  {[CHAT_SUGGESTION_1, CHAT_SUGGESTION_2, CHAT_SUGGESTION_3].map((sugg, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(sugg)}
                      className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FBF7F2] border border-[#F0EBE6] text-xs font-medium text-[#2D3142] transition-colors flex items-center justify-between group"
                    >
                      <span>{sugg}</span>
                      <span className="text-[#FF7A7A] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                        isUser
                          ? 'bg-[#2D3142] text-white'
                          : 'bg-[#FFF0F0] text-[#FF7A7A]'
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#FF7A7A] text-white rounded-tr-xs shadow-sm font-medium'
                          : 'bg-white border border-[#F0EBE6] text-[#2D3142] rounded-tl-xs shadow-xs whitespace-pre-wrap'
                      }`}
                    >
                      {msg.content}
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          isUser ? 'text-white/70' : 'text-[#A89E95]'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-[#71788E] pt-2">
                <div className="w-7 h-7 rounded-xl bg-[#FFF0F0] flex items-center justify-center text-[#FF7A7A]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#F0EBE6] px-3.5 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A7A] animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#8C7AE6] animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#48C78E] animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                  <span className="text-[11px] text-[#71788E] ml-1">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#F0EBE6]">
            <div className="flex items-center gap-2 bg-[#FBF7F2] rounded-2xl px-3 py-1.5 border border-[#F0EBE6] focus-within:border-[#FF7A7A] focus-within:bg-white transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={CHAT_PLACEHOLDER}
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs text-[#2D3142] placeholder-[#A89E95] outline-none py-1.5"
              />
              <button
                onClick={() => void sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-[#FF7A7A] hover:bg-[#E86262] disabled:opacity-40 disabled:hover:bg-[#FF7A7A] flex items-center justify-center text-white transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <div className="text-[10px] text-center text-[#A89E95] mt-1.5 font-medium">
              Answers are scoped to BabyDaily and infant routine support
            </div>
          </div>
        </div>
      )}
    </>
  );
};
