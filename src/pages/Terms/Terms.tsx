import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import {
  TERMS_TITLE,
  TERMS_LAST_UPDATED,
  TERMS_SECTIONS,
} from './Terms.consts';
import { getFormattedTermsDate } from './Terms.utils';
import type { TermsProps } from './Terms.types';
import { FileText, ArrowLeft } from 'lucide-react';
import { ROUTE_HOME } from '@constants/routes.const';

export const Terms: FC<TermsProps> = () => {
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
        <div className="w-12 h-12 rounded-2xl bg-[#FFF9EB] text-[#FFAA00] flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <Typography variant="h2" className="text-3xl sm:text-4xl font-extrabold text-[#2D3142]">
            {TERMS_TITLE}
          </Typography>
          <Typography variant="caption" className="text-xs text-[#71788E] font-medium mt-0.5 block">
            {getFormattedTermsDate(TERMS_LAST_UPDATED)}
          </Typography>
        </div>
      </div>

      <Card
        variant="outlined"
        radius="2xl"
        className="bg-white p-6 sm:p-10 border-[#F0EBE6] shadow-sm space-y-8 text-sm text-[#71788E] leading-relaxed"
      >
        {TERMS_SECTIONS.map((sec, idx) => (
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
