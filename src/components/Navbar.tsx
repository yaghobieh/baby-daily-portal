import type { FC } from 'react';
import { APP_NAME, BADGE_LIVE_NOW } from '@constants/strings.const';
import { URL_GOOGLE_PLAY, ROUTE_HOME, ROUTE_PRIVACY } from '@constants/routes.const';
import { MessageCircleHeart, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onOpenChat }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-[#F0EBE6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        <a href={ROUTE_HOME} className="flex items-center gap-3 group">
          <img
            src="/assets/logo.png"
            alt={APP_NAME}
            className="w-10 h-10 rounded-2xl shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#2D3142]">
                {APP_NAME}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EFFBF5] text-[#34A873] border border-[#DCF7EB]">
                {BADGE_LIVE_NOW}
              </span>
            </div>
            <div className="text-xs text-[#71788E] -mt-0.5 font-medium">Routine Tracker</div>
          </div>
        </a>

        <nav className="flex items-center gap-2 sm:gap-4">
          <a
            href="#features"
            className="hidden sm:inline-block text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors"
          >
            Features
          </a>
          <a
            href="#preview"
            className="hidden sm:inline-block text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors"
          >
            Screenshots
          </a>
          <a
            href={ROUTE_PRIVACY}
            className="text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors"
          >
            Privacy
          </a>

          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF0F0] hover:bg-[#FFE0E0] text-[#FF7A7A] font-semibold text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#FF7A7A]" />
            <span className="hidden xs:inline">Ask AI</span>
          </button>

          <a
            href={URL_GOOGLE_PLAY}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#2D3142] hover:bg-[#1C1F2B] text-white text-sm font-semibold transition-colors"
          >
            Install
          </a>
        </nav>
      </div>
    </header>
  );
};
