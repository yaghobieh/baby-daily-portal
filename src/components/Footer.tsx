import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { APP_NAME } from '@constants/strings.const';
import {
  ROUTE_PRIVACY,
  ROUTE_TERMS,
  ROUTE_DOCS,
  ROUTE_CHANGELOG,
  URL_GOOGLE_PLAY,
  URL_INTERNAL_TEST,
  URL_PLAY_TESTING,
  URL_DIRECT_APK,
  URL_SUPPORT_EMAIL,
} from '@constants/routes.const';
import { ExternalLink } from 'lucide-react';

export const Footer: FC = () => {
  const { t } = useLingo();

  return (
    <footer className="bg-white border-t border-[#F0EBE6] py-12 px-4 sm:px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-center md:text-left">
          <img src="/assets/logo.png" alt={APP_NAME} className="w-9 h-9 rounded-xl shadow-xs" />
          <div>
            <Typography variant="h6" className="font-bold text-base text-[#2D3142]">
              {APP_NAME}
            </Typography>
            <Typography variant="caption" className="text-xs text-[#71788E]">
              {t('footer.tagline')}
            </Typography>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[#71788E]">
          <a
            href={URL_DIRECT_APK}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#48C78E] text-white hover:bg-[#3bb07b] text-xs font-bold transition-colors shadow-2xs"
          >
            <span>⚡ Direct APK (v0.1.7+8)</span>
          </a>
          <a
            href={URL_PLAY_TESTING}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D3142] text-white hover:bg-[#1E202B] text-xs font-bold transition-colors shadow-2xs"
          >
            <span>🤖 Google Play Tester</span>
          </a>
          <a
            href={URL_GOOGLE_PLAY}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2D3142] transition-colors text-xs font-semibold"
          >
            Play Store
          </a>
          <a
            href={URL_INTERNAL_TEST}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2D3142] transition-colors text-xs"
          >
            Internal Testing
          </a>
          <Link to={ROUTE_DOCS} className="hover:text-[#2D3142] transition-colors">
            {t('nav.docs')}
          </Link>
          <Link to={ROUTE_CHANGELOG} className="hover:text-[#2D3142] transition-colors">
            {t('nav.changelog')}
          </Link>
          <Link to={ROUTE_PRIVACY} className="hover:text-[#2D3142] transition-colors">
            {t('nav.privacy')}
          </Link>
          <Link to={ROUTE_TERMS} className="hover:text-[#2D3142] transition-colors">
            {t('nav.terms')}
          </Link>
          <a href={URL_SUPPORT_EMAIL} className="hover:text-[#2D3142] transition-colors">
            Support & Feedback
          </a>
          <a
            href="https://forgedevstack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 hover:bg-orange-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>ForgeDevStack</span>
            <ExternalLink className="w-3 h-3 text-orange-500" />
          </a>
        </div>

        <div className="text-xs text-[#71788E] text-center md:text-right flex flex-col gap-1.5">
          <Typography variant="caption" className="text-xs text-[#71788E]">
            {t('footer.copyright')}
          </Typography>
          <div className="text-[12px] text-[#71788E] flex items-center justify-center md:justify-end gap-1">
            <span>Made with passion by</span>
            <a
              href="https://forgedevstack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#FF7A7A] hover:underline"
            >
              Forge
            </a>
            <span>and</span>
            <span className="font-bold text-[#2D3142]">John Yaghobieh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
