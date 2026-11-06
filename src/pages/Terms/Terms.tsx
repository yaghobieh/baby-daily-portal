import type { FC } from 'react';
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
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <a
        href={ROUTE_HOME}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#71788E] hover:text-[#FF7A7A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </a>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF9EB] text-[#FFAA00] flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2D3142]">
            {TERMS_TITLE}
          </h1>
          <div className="text-xs text-[#71788E] font-medium mt-0.5">
            {getFormattedTermsDate(TERMS_LAST_UPDATED)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0EBE6] shadow-sm space-y-8 text-sm text-[#71788E] leading-relaxed">
        {TERMS_SECTIONS.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-lg font-bold text-[#2D3142]">{sec.title}</h2>
            <p>{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
