import React, { useState } from 'react';
import { Card, Typography, Badge, Flex, Button, Chip } from '@forgedevstack/bear';
import { CheckCircleIcon, InfoIcon } from '@forgedevstack/bear-icons';
import { DOCS_TITLE, DOCS_SUBTITLE, DOCS_SECTIONS } from './Docs.consts';
import { getSectionAnchor } from './Docs.utils';
import { Link } from 'react-router-dom';
import { ROUTE_DASHBOARD, URL_GOOGLE_PLAY } from '@constants/routes.const';
import { Copy, Check, Terminal, Code2, Sparkles, Smartphone } from 'lucide-react';

export const Docs: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <Flex justify="center" align="center" gap={2} className="mb-4">
            <Chip
              variant="soft"
              color="primary"
              size="md"
              icon={<InfoIcon size={16} />}
              className="px-4 py-1.5 font-bold bg-[#FFF0F0] text-[#FF7A7A] border border-[#FFE0E0]"
            >
              <Typography variant="caption" className="font-bold text-[#FF7A7A]">
                Engineering Reference & User Guide
              </Typography>
            </Chip>
          </Flex>
          <Typography
            variant="h1"
            className="text-3xl sm:text-5xl font-black text-[#2D3142] tracking-tight mb-4"
          >
            {DOCS_TITLE}
          </Typography>
          <Typography
            variant="body1"
            className="text-base sm:text-lg text-[#71788E] max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {DOCS_SUBTITLE}
          </Typography>
        </div>

        <Card
          variant="outlined"
          className="p-4 sm:p-6 mb-12 bg-white/90 backdrop-blur-md rounded-3xl border border-[#F0EBE6] shadow-sm"
        >
          <Typography
            variant="subtitle2"
            className="text-xs font-bold uppercase tracking-wider text-[#71788E] mb-3"
          >
            Documentation Index
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
                  className="text-xs font-bold border-[#E8E2D9] text-[#2D3142] hover:bg-[#FFF5F5] hover:border-[#FF7A7A] hover:text-[#FF7A7A] transition-colors"
                >
                  {section.badge}: {section.title.split('&')[0].split('(')[0].trim()}
                </Button>
              </a>
            ))}
          </Flex>
        </Card>

        <div className="space-y-12">
          {DOCS_SECTIONS.map((section) => (
            <div key={section.id} id={`doc-${section.id}`} className="scroll-mt-28">
              <Card
                variant="outlined"
                className="p-6 sm:p-9 rounded-3xl border border-[#F0EBE6] bg-white shadow-xs hover:shadow-sm transition-all"
              >
                <Flex align="center" gap={3} className="mb-4">
                  <Badge variant="primary" size="sm" pill className="font-extrabold px-3 py-1 bg-[#FF7A7A] text-white">
                    {section.badge}
                  </Badge>
                  <Typography variant="h3" className="text-xl sm:text-2xl font-black text-[#2D3142]">
                    {section.title}
                  </Typography>
                </Flex>

                <Typography variant="body1" className="text-base text-[#4F5D75] font-medium mb-6 leading-relaxed">
                  {section.summary}
                </Typography>

                {section.metrics && section.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {section.metrics.map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#FBF7F2] border border-[#F0EBE6]">
                        <Typography variant="caption" className="text-[11px] font-bold text-[#71788E] uppercase tracking-wider block">
                          {m.label}
                        </Typography>
                        <Typography variant="h4" className="text-xl font-black text-[#2D3142] my-0.5">
                          {m.value}
                        </Typography>
                        <Typography variant="caption" className="text-[11px] text-[#71788E]">
                          {m.desc}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-[#F0EBE6] mb-6">
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

                {section.codeSnippet && (
                  <div className="mt-6 rounded-2xl bg-[#1E1E2E] border border-[#313244] overflow-hidden text-white shadow-md">
                    <div className="px-4 py-2.5 bg-[#181825] border-b border-[#313244] flex items-center justify-between text-xs font-mono text-[#CDD6F4]">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#CBA6F7]" />
                        <span className="font-bold">{section.codeSnippet.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(section.id, section.codeSnippet?.code || '')}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#313244] hover:bg-[#45475A] text-xs font-semibold text-white transition-colors"
                      >
                        {copiedKey === section.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#A6E3A1]" />
                            <span className="text-[#A6E3A1]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#BAC2DE]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-[#CDD6F4] overflow-x-auto leading-relaxed whitespace-pre">
                      <code>{section.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {section.endpoints && section.endpoints.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <Typography variant="h5" className="font-bold text-base text-[#2D3142] flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#FF7A7A]" />
                      <span>Live Request & Response Examples</span>
                    </Typography>

                    {section.endpoints.map((ep, idx) => (
                      <div key={idx} className="rounded-2xl border border-[#E8E2D9] overflow-hidden bg-[#FAFAF9]">
                        <div className="p-3.5 bg-white border-b border-[#E8E2D9] flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2.5 font-mono text-xs">
                            <span
                              className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                ep.method === 'GET'
                                  ? 'bg-[#E6F4EA] text-[#137333]'
                                  : 'bg-[#E8F0FE] text-[#1A73E8]'
                              }`}
                            >
                              {ep.method}
                            </span>
                            <span className="font-bold text-[#2D3142]">{ep.path}</span>
                          </div>
                          <Typography variant="caption" className="text-xs text-[#71788E]">
                            {ep.description}
                          </Typography>
                        </div>

                        <div className="p-4 space-y-3 font-mono text-xs">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#71788E] mb-1 font-sans font-bold">
                              <span>cURL Request</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(`${section.id}-curl-${idx}`, ep.curl)}
                                className="text-[#FF7A7A] hover:underline flex items-center gap-1"
                              >
                                {copiedKey === `${section.id}-curl-${idx}` ? 'Copied!' : 'Copy cURL'}
                              </button>
                            </div>
                            <pre className="p-3 rounded-xl bg-[#2D3142] text-[#F0EBE6] overflow-x-auto leading-relaxed">
                              <code>{ep.curl}</code>
                            </pre>
                          </div>

                          <div>
                            <div className="text-[11px] text-[#71788E] mb-1 font-sans font-bold">
                              <span>JSON Response</span>
                            </div>
                            <pre className="p-3 rounded-xl bg-[#1E293B] text-[#38BDF8] overflow-x-auto leading-relaxed">
                              <code>{ep.response}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        <Card
          variant="elevated"
          className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-[#FFF5F5] via-[#FFF9F0] to-[#EFFBF5] border border-[#FFE0E0] text-center"
        >
          <Flex justify="center" align="center" gap={2} className="mb-3">
            <Sparkles className="w-5 h-5 text-[#FF7A7A]" />
            <Typography variant="h4" className="font-extrabold text-xl sm:text-2xl text-[#2D3142]">
              Experience BabyDaily Live Across All Your Devices
            </Typography>
          </Flex>
          <Typography variant="body1" className="text-sm text-[#71788E] max-w-xl mx-auto mb-6">
            Test the live sleep countdown, 1-tap routine logging, and DeepSeek AI directly in your browser or install on your phone.
          </Typography>
          <Flex justify="center" gap={3} wrap="wrap">
            <Link to={ROUTE_DASHBOARD}>
              <Button
                variant="primary"
                size="md"
                radius="pill"
                className="bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold px-6 py-2.5 shadow-sm"
              >
                Open Web App & AI Companion
              </Button>
            </Link>
            <a href={URL_GOOGLE_PLAY} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="md"
                radius="pill"
                icon={<Smartphone size={16} />}
                className="border-[#2D3142] text-[#2D3142] font-bold px-6 py-2.5 hover:bg-[#2D3142] hover:text-white transition-colors"
              >
                Get Android App
              </Button>
            </a>
          </Flex>
        </Card>
      </div>
    </div>
  );
};
