import type { FC } from 'react';
import { APP_NAME, APP_TAGLINE, APP_COPYRIGHT, APP_DOMAIN } from '@constants/strings.const';
import { ROUTE_PRIVACY, ROUTE_TERMS, URL_GOOGLE_PLAY, URL_SUPPORT_EMAIL } from '@constants/routes.const';
import { Heart } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-[#F0EBE6] py-12 px-4 sm:px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-center md:text-left">
          <img src="/assets/logo.png" alt={APP_NAME} className="w-9 h-9 rounded-xl shadow-xs" />
          <div>
            <div className="font-bold text-base text-[#2D3142]">{APP_NAME}</div>
            <div className="text-xs text-[#71788E]">{APP_TAGLINE}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[#71788E]">
          <a href={URL_GOOGLE_PLAY} target="_blank" rel="noopener noreferrer" className="hover:text-[#2D3142]">
            Google Play
          </a>
          <a href={ROUTE_PRIVACY} className="hover:text-[#2D3142]">
            Privacy Policy
          </a>
          <a href={ROUTE_TERMS} className="hover:text-[#2D3142]">
            Terms of Service
          </a>
          <a href={URL_SUPPORT_EMAIL} className="hover:text-[#2D3142]">
            Support & Feedback
          </a>
        </div>

        <div className="text-xs text-[#71788E] text-center md:text-right flex flex-col gap-1">
          <div>{APP_COPYRIGHT}</div>
          <div className="flex items-center justify-center md:justify-end gap-1">
            <span>Domain:</span>
            <span className="font-semibold text-[#2D3142]">{APP_DOMAIN}</span>
            <span>• Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#FF7A7A] text-[#FF7A7A]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
