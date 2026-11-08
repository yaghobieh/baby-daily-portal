import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Badge } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { APP_NAME, BADGE_LIVE_NOW } from '@constants/strings.const';
import {
  URL_GOOGLE_PLAY,
  ROUTE_HOME,
  ROUTE_DOCS,
  ROUTE_CHANGELOG,
  ROUTE_PRIVACY,
  ROUTE_DASHBOARD,
} from '@constants/routes.const';
import { Globe, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenChat?: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  he: 'עברית',
  ru: 'Русский',
  es: 'Español',
};

export const Navbar: FC<NavbarProps> = () => {
  const { t, locale, setLocale } = useLingo();
  const [langOpen, setLangOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('baby_daily_token');
      setHasToken(Boolean(saved));
    } catch {
      setHasToken(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-[#F0EBE6] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <Link to={ROUTE_HOME} className="flex items-center gap-3 group shrink-0">
            <img
              src="/assets/logo.png"
              alt={APP_NAME}
              className="w-10 h-10 rounded-2xl shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <Typography variant="h5" className="font-extrabold text-lg sm:text-xl tracking-tight text-[#2D3142] whitespace-nowrap">
                  {APP_NAME}
                </Typography>
                <Badge variant="success" pill size="sm" className="font-bold text-[10px] whitespace-nowrap hidden sm:inline-flex">
                  {BADGE_LIVE_NOW}
                </Badge>
              </div>
              <Typography variant="caption" className="text-xs text-[#71788E] -mt-0.5 font-medium block whitespace-nowrap">
                Routine Tracker
              </Typography>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <a
              href="/#features"
              className="text-xs sm:text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors whitespace-nowrap"
            >
              {t('nav.features')}
            </a>
            <Link
              to={ROUTE_DOCS}
              className="text-xs sm:text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors whitespace-nowrap"
            >
              {t('nav.docs')}
            </Link>
            <Link
              to={ROUTE_CHANGELOG}
              className="text-xs sm:text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors whitespace-nowrap"
            >
              {t('nav.changelog')}
            </Link>
            <Link
              to={ROUTE_PRIVACY}
              className="text-xs sm:text-sm font-semibold text-[#71788E] hover:text-[#2D3142] px-3 py-2 rounded-xl hover:bg-[#FBF7F2] transition-colors whitespace-nowrap"
            >
              {t('nav.privacy')}
            </Link>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#FBF7F2] hover:bg-[#F0EBE6] text-[#2D3142] text-xs font-bold border border-[#E8E2D9] transition-colors whitespace-nowrap shrink-0"
              aria-label="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-[#71788E]" />
              <span className="hidden sm:inline">{LANGUAGE_LABELS[locale] || 'English'}</span>
              <span className="sm:hidden">{locale.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-[#71788E]" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-[#F0EBE6] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {['en', 'he', 'ru', 'es'].map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      void setLocale(code);
                      setLangOpen(false);
                      document.documentElement.dir = code === 'he' ? 'rtl' : 'ltr';
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                      locale === code
                        ? 'bg-[#FFF0F0] text-[#FF7A7A]'
                        : 'text-[#2D3142] hover:bg-[#FBF7F2]'
                    }`}
                  >
                    <span>{LANGUAGE_LABELS[code]}</span>
                    {locale === code && <span className="text-[#FF7A7A] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to={ROUTE_DASHBOARD}
            className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs"
          >
            <span>{hasToken ? 'Open App' : 'Login'}</span>
          </Link>

          <a
            href={URL_GOOGLE_PLAY}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap shrink-0 px-3.5 sm:px-4 py-2 rounded-xl bg-[#2D3142] hover:bg-[#1C1F2B] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            {t('nav.install')}
          </a>
        </nav>
      </div>
    </header>
  );
};
