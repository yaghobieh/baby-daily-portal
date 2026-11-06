import type { FC } from 'react';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: FC<FormattedMessageProps> = ({ content }) => {
  const lines = content.split('\n');

  const renderInline = (text: string) => {
    // Matches **bold**, `code`, or plain text
    const parts: Array<{ type: 'bold' | 'code' | 'text'; value: string }> = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: text.substring(lastIndex, match.index) });
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push({ type: 'bold', value: raw.slice(2, -2) });
      } else if (raw.startsWith('`') && raw.endsWith('`')) {
        parts.push({ type: 'code', value: raw.slice(1, -1) });
      }
      lastIndex = match.index + raw.length;
    }
    if (lastIndex < text.length) {
      parts.push({ type: 'text', value: text.substring(lastIndex) });
    }

    return (
      <>
        {parts.map((p, idx) => {
          if (p.type === 'bold') {
            return (
              <strong key={idx} className="font-extrabold text-[#2D3142]">
                {p.value}
              </strong>
            );
          }
          if (p.type === 'code') {
            return (
              <code
                key={idx}
                className="px-1.5 py-0.5 rounded-md bg-[#FBF7F2] border border-[#F0EBE6] text-[#FF7A7A] font-mono text-[11px]"
              >
                {p.value}
              </code>
            );
          }
          return <span key={idx}>{p.value}</span>;
        })}
      </>
    );
  };

  return (
    <div className="space-y-2 text-xs leading-relaxed text-[#4B4440]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section Heading: e.g. **Heading** or **Heading:** or ### Heading
        const headingMatch = trimmed.match(/^(\*{2})([^*:]+)(:?\*{2})$/) || trimmed.match(/^###\s*(.+)$/);
        if (headingMatch) {
          const title = headingMatch[2] || headingMatch[1];
          return (
            <div key={idx} className="pt-2 pb-1 font-bold text-[12.5px] text-[#2D3142] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A7A] shrink-0" />
              <span>{title.trim()}</span>
            </div>
          );
        }

        // Numbered list: e.g. 1. Title or 1. Description
        const numberedMatch = trimmed.match(/^(\d+)\.\s*(.+)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const rest = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="w-4 h-4 rounded-full bg-[#FFF0F0] text-[#FF7A7A] font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {num}
              </span>
              <div className="flex-1 text-[#3E3530]">{renderInline(rest)}</div>
            </div>
          );
        }

        // Bullet point: e.g. - or *
        const bulletMatch = trimmed.match(/^[-*]\s*(.+)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C7AE6] shrink-0 mt-1.5" />
              <div className="flex-1 text-[#3E3530]">{renderInline(bulletMatch[1])}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-[#3E3530]">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

