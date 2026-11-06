import React from 'react';
import { Card, Typography, Badge, Flex, Button, Chip } from '@forgedevstack/bear';
import { CheckCircleIcon, InfoIcon, BearPawIcon } from '@forgedevstack/bear-icons';
import { useLingo } from '@forgedevstack/lingo';
import { DOCS_SECTIONS } from './Docs.consts';
import { getSectionAnchor } from './Docs.utils';

export const Docs: React.FC = () => {
  const { t } = useLingo();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <Flex justify="center" align="center" gap={2} className="mb-4">
            <Chip
              variant="soft"
              color="primary"
              size="md"
              icon={<InfoIcon size={16} />}
              className="px-4 py-1.5 font-bold bg-[#FFF0F0] text-[#FF7A7A] border border-[#FFE0E0]"
            >
              <Typography variant="caption" className="font-bold text-[#FF7A7A]">
                {t('docs.badge')}
              </Typography>
            </Chip>
          </Flex>
          <Typography
            variant="h1"
            className="text-3xl sm:text-5xl font-black text-[#2D3142] tracking-tight mb-4"
          >
            {t('docs.title')}
          </Typography>
          <Typography
            variant="body1"
            className="text-lg text-[#71788E] max-w-2xl mx-auto font-medium"
          >
            {t('docs.subtitle')}
          </Typography>
        </div>

        <Card variant="outlined" className="p-4 sm:p-6 mb-12 bg-white/80 backdrop-blur-md rounded-2xl border border-[#FFE8E8]">
          <Typography variant="subtitle2" className="text-xs font-bold uppercase tracking-wider text-[#71788E] mb-3">
            {t('docs.quickNav')}
          </Typography>
          <Flex wrap="wrap" gap={2}>
            {DOCS_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={getSectionAnchor(section.id)}
                className="inline-block"
              >
                <Button
                  variant="outline"
                  size="sm"
                  radius="pill"
                  className="text-xs font-semibold border-[#FFE8E8] text-[#2D3142] hover:bg-[#FFF5F5] hover:border-[#FF7A7A]"
                >
                  {section.badge}: {section.title.split('(')[0].trim()}
                </Button>
              </a>
            ))}
          </Flex>
        </Card>

        <div className="space-y-8">
          {DOCS_SECTIONS.map((section) => (
            <div key={section.id} id={`doc-${section.id}`} className="scroll-mt-28">
              <Card
                variant="outlined"
                className="p-6 sm:p-8 rounded-3xl border border-coral-50/80 bg-white/95 shadow-sm hover:shadow-md transition-shadow"
              >
                <Flex align="center" gap={3} className="mb-4">
                  <Badge variant="primary" size="sm" className="font-bold px-3 py-1 bg-[#FF7A7A] text-white">
                    {section.badge}
                  </Badge>
                  <Typography variant="h3" className="text-xl sm:text-2xl font-bold text-[#2D3142]">
                    {section.title}
                  </Typography>
                </Flex>

                <Typography variant="body1" className="text-base text-[#4F5D75] font-medium mb-6 leading-relaxed">
                  {section.summary}
                </Typography>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                  {section.details.map((detail, idx) => (
                    <Flex key={idx} align="start" gap={3}>
                      <span className="text-[#48C78E] mt-0.5 shrink-0">
                        <CheckCircleIcon size={18} />
                      </span>
                      <Typography variant="body2" className="text-sm text-[#2D3142] leading-normal font-normal">
                        {detail}
                      </Typography>
                    </Flex>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <Card variant="outlined" className="mt-12 p-8 text-center rounded-3xl bg-gradient-to-r from-[#FFF5F5] to-[#F5F8FF] border border-[#FFE8E8]">
          <Flex justify="center" className="mb-3 text-[#FF7A7A]">
            <BearPawIcon size={32} />
          </Flex>
          <Typography variant="h4" className="text-xl font-bold text-[#2D3142] mb-2">
            {t('docs.helpTitle')}
          </Typography>
          <Typography variant="body2" className="text-sm text-[#71788E] mb-4 max-w-md mx-auto">
            {t('docs.helpDesc')}
          </Typography>
        </Card>
      </div>
    </div>
  );
};
