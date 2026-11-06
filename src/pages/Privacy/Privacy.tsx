import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import {
  PRIVACY_TITLE,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from './Privacy.consts';
import { getFormattedPrivacyDate } from './Privacy.utils';
import type { PrivacyProps } from './Privacy.types';
import { Shield, ArrowLeft } from 'lucide-react';
import { ROUTE_HOME } from '@constants/routes.const';

export const Privacy: FC<PrivacyProps> = () => {
  const { t } = useLingo();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Link
        to={ROUTE_HOME}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#71788E] hover:text-[#FF7A7A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('privacy.backToHome')}</span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#EFFBF5] text-[#34A873] flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <Typography variant="h2" className="text-3xl sm:text-4xl font-extrabold text-[#2D3142]">
            {PRIVACY_TITLE}
          </Typography>
          <Typography variant="caption" className="text-xs text-[#71788E] font-medium mt-0.5 block">
            {getFormattedPrivacyDate(PRIVACY_LAST_UPDATED)}
          </Typography>
        </div>
      </div>

      <Card
        variant="outlined"
        radius="2xl"
        className="bg-white p-6 sm:p-10 border-[#F0EBE6] shadow-sm space-y-8 text-sm text-[#71788E] leading-relaxed"
      >
        {PRIVACY_SECTIONS.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <Typography variant="h5" className="text-lg font-bold text-[#2D3142]">
              {sec.title}
            </Typography>
            <Typography variant="body2" className="text-sm text-[#71788E]">
              {sec.content}
            </Typography>
          </div>
        ))}
      </Card>
    </div>
  );
};
