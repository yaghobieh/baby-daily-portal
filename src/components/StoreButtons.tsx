import type { FC } from 'react';
import { BADGE_COMING_SOON, STORE_APP_STORE_LABEL, STORE_GOOGLE_PLAY_LABEL } from '@constants/strings.const';
import { URL_GOOGLE_PLAY } from '@constants/routes.const';
import { Play, Apple } from 'lucide-react';

export const StoreButtons: FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <a
        href={URL_GOOGLE_PLAY}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#FF7A7A] hover:bg-[#E86262] text-white font-semibold shadow-lg shadow-coral-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/20">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </div>
        <div className="text-left">
          <div className="text-xs uppercase tracking-wider text-white/80 font-medium">Available on</div>
          <div className="text-sm font-bold leading-tight">{STORE_GOOGLE_PLAY_LABEL}</div>
        </div>
      </a>

      <div className="relative group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-[#E7E7EC] text-[#2D3142] font-semibold shadow-sm cursor-not-allowed opacity-90 transition-all">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#F5F6F8] text-[#2D3142]">
          <Apple className="w-5 h-5 fill-current" />
        </div>
        <div className="text-left">
          <div className="text-xs uppercase tracking-wider text-[#71788E] font-medium">{STORE_APP_STORE_LABEL}</div>
          <div className="text-sm font-bold leading-tight text-[#FF7A7A] flex items-center gap-1.5">
            <span>{BADGE_COMING_SOON}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
