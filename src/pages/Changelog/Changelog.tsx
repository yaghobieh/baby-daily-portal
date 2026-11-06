import React from 'react';
import { Card, Typography, Badge, Flex, List, ListItem } from '@forgedevstack/bear';
import { ClockIcon, CheckCircleIcon, StarIcon } from '@forgedevstack/bear-icons';
import { CHANGELOG_TITLE, CHANGELOG_SUBTITLE, RELEASES } from './Changelog.consts';
import { formatVersionString } from './Changelog.utils';

export const Changelog: React.FC = () => {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <Flex justify="center" align="center" gap={2} className="mb-4">
            <Badge variant="primary" size="md" className="px-4 py-1.5 font-bold bg-[#FFF0F0] text-[#FF7A7A] border border-[#FFE0E0]">
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon size={16} /> Product Updates
              </span>
            </Badge>
          </Flex>
          <Typography
            variant="h1"
            className="text-3xl sm:text-5xl font-black text-[#2D3142] tracking-tight mb-4"
          >
            {CHANGELOG_TITLE}
          </Typography>
          <Typography
            variant="body1"
            className="text-lg text-[#71788E] max-w-xl mx-auto font-medium"
          >
            {CHANGELOG_SUBTITLE}
          </Typography>
        </div>

        <div className="space-y-10">
          {RELEASES.map((release) => (
            <Card
              key={`${release.version}-${release.build}`}
              variant="outlined"
              className={`p-6 sm:p-8 rounded-3xl transition-all ${
                release.isLatest
                  ? 'border-[#FF7A7A]/60 bg-white shadow-md'
                  : 'border-[#FFE8E8] bg-white/90 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-gray-100">
                <Flex align="center" gap={3} wrap="wrap">
                  <Typography variant="h3" className="text-2xl font-bold text-[#2D3142]">
                    {formatVersionString(release.version, release.build)}
                  </Typography>
                  {release.isLatest && (
                    <Badge variant="primary" size="sm" className="font-bold px-3 py-0.5 bg-[#FF7A7A] text-white">
                      <span className="inline-flex items-center gap-1">
                        <StarIcon size={14} /> {release.badge}
                      </span>
                    </Badge>
                  )}
                  <Badge variant="secondary" size="sm" className="font-semibold text-xs bg-gray-100 text-[#71788E]">
                    {release.tag}
                  </Badge>
                </Flex>
                <Typography variant="caption" className="text-sm font-semibold text-[#71788E]">
                  {release.date}
                </Typography>
              </div>

              <div className="py-5">
                <Typography variant="subtitle2" className="text-xs font-bold uppercase tracking-wider text-[#FF7A7A] mb-3">
                  Highlights
                </Typography>
                <div className="space-y-2.5">
                  {release.highlights.map((highlight, idx) => (
                    <Flex key={idx} align="start" gap={2}>
                      <span className="text-[#48C78E] mt-0.5 shrink-0">
                        <CheckCircleIcon size={16} />
                      </span>
                      <Typography variant="body2" className="text-sm text-[#2D3142] leading-relaxed font-medium">
                        {highlight}
                      </Typography>
                    </Flex>
                  ))}
                </div>
              </div>

              {release.categories.length > 0 && (
                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {release.categories.map((cat, cIdx) => (
                    <div key={cIdx} className="bg-[#FFF9F9] rounded-2xl p-4 border border-[#FFE8E8]">
                      <Typography variant="subtitle2" className="text-xs font-bold text-[#2D3142] mb-2">
                        {cat.category}
                      </Typography>
                      <List dense disablePadding className="space-y-1">
                        {cat.items.map((item, iIdx) => (
                          <ListItem
                            key={iIdx}
                            dense
                            primary={
                              <Typography variant="caption" className="text-xs text-[#4F5D75] leading-relaxed">
                                • {item}
                              </Typography>
                            }
                          />
                        ))}
                      </List>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
