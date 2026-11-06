import type { FC } from 'react';
import { Typography, Button } from '@forgedevstack/bear';
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
        className="inline-block"
      >
        <Button
          variant="babyCoral"
          size="lg"
          radius="pill"
          className="px-6 py-3.5 shadow-lg shadow-coral-500/20 hover:-translate-y-0.5 transition-all text-left font-bold cursor-pointer"
          leftIcon={
            <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/20">
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </div>
          }
        >
          <div className="text-left">
            <Typography variant="caption" className="text-[10px] uppercase tracking-wider text-white/80 font-medium block leading-none">
              Available on
            </Typography>
            <Typography variant="body2" className="text-sm font-extrabold leading-tight text-white">
              {STORE_GOOGLE_PLAY_LABEL}
            </Typography>
          </div>
        </Button>
      </a>

      <Button
        variant="secondary"
        size="lg"
        radius="pill"
        disabled
        className="px-6 py-3.5 bg-white border border-[#E7E7EC] shadow-sm text-left opacity-90 cursor-not-allowed"
        leftIcon={
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#F5F6F8] text-[#2D3142]">
            <Apple className="w-4 h-4 fill-current" />
          </div>
        }
      >
        <div className="text-left">
          <Typography variant="caption" className="text-[10px] uppercase tracking-wider text-[#71788E] font-medium block leading-none">
            {STORE_APP_STORE_LABEL}
          </Typography>
          <Typography variant="body2" className="text-sm font-extrabold leading-tight text-[#FF7A7A]">
            {BADGE_COMING_SOON}
          </Typography>
        </div>
      </Button>
    </div>
  );
};
