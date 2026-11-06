import type { FC } from 'react';
import {
  HERO_TITLE,
  HERO_SUBTITLE,
  FEATURES_LIST,
  STATS_LIST,
} from './Home.consts';
import type { HomeProps } from './Home.types';
import { StoreButtons } from '@components/StoreButtons';
import {
  Clock,
  Heart,
  Users,
  ShieldCheck,
  Moon,
  Sparkles,
  ChevronRight,
  Baby,
  Utensils,
  BellRing,
} from 'lucide-react';

const ICON_MAP = {
  feed: Utensils,
  sleep: Moon,
  alarm: BellRing,
  diaper: Baby,
  sharing: Users,
  shield: ShieldCheck,
};

export const Home: FC<HomeProps> = ({ onOpenChat }) => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-6 px-4 sm:px-6 max-w-6xl mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F0] border border-[#FFE0E0] text-[#FF7A7A] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A7A]" />
              <span>Designed with love for modern parents & caregivers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D3142] tracking-tight leading-[1.12]">
              {HERO_TITLE}
            </h1>

            <p className="text-base sm:text-lg text-[#71788E] max-w-xl leading-relaxed">
              {HERO_SUBTITLE}
            </p>

            <StoreButtons />

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-[#71788E]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFAA00]" />
                <span>Next Meal Clock Alarms</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3897F0]" />
                <span>Multi-Parent Live Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#48C78E]" />
                <span>100% Ad-Free & Private</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center relative">
            <div className="relative w-[280px] sm:w-[320px] rounded-[42px] p-3 bg-gradient-to-b from-[#FFF0F0] to-[#EAE6F9] shadow-2xl ring-1 ring-black/5 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <img
                src="/assets/01_daily_overview.png"
                alt="BabyDaily Daily Overview"
                className="w-full h-auto rounded-[34px] shadow-md border border-white/60"
              />
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-xl border border-[#F0EBE6] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EFFBF5] text-[#34A873] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#2D3142]">Liam Woke Up</div>
                  <div className="text-[11px] text-[#71788E]">Slept 1h 45m • Woken 12:45</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#F0EBE6] shadow-sm">
          {STATS_LIST.map((stat, idx) => (
            <div key={idx} className="text-center p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#2D3142] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[#71788E] mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D3142] tracking-tight">
            Everything your baby needs, without the noise
          </h2>
          <p className="text-sm sm:text-base text-[#71788E]">
            Built with pediatric guidelines, soft pastel aesthetics, and instant actions to keep your focus on your little one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feat) => {
            const IconComponent = ICON_MAP[feat.iconName];
            return (
              <div
                key={feat.id}
                className="group p-7 rounded-3xl bg-white border border-[#F0EBE6] hover:border-[#FF7A7A]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: feat.accentColor }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FBF7F2] text-[#71788E]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#2D3142] group-hover:text-[#FF7A7A] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-[#71788E] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* App Screenshots Showcase */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D3142] tracking-tight">
            Simple, Intuitive & Calming
          </h2>
          <p className="text-sm text-[#71788E]">
            Designed to be easy to use with one hand at 3:00 AM.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="rounded-3xl overflow-hidden bg-white border border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/01_daily_overview.png"
              alt="Daily Timeline"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <div className="font-bold text-sm text-[#2D3142]">Daily Timeline</div>
              <div className="text-xs text-[#71788E]">Swipe-to-delete entries</div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white border border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/02_feeding_tracker.png"
              alt="Feeding Tracker"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <div className="font-bold text-sm text-[#2D3142]">Feeding & Bottles</div>
              <div className="text-xs text-[#71788E]">Breast timer & volumes</div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white border border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/03_sleep_and_diaper.png"
              alt="Sleep & Diapers"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <div className="font-bold text-sm text-[#2D3142]">Sleep & Diapers</div>
              <div className="text-xs text-[#71788E]">Real-time sleep ticker</div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-white border border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/04_family_sharing.png"
              alt="Caregiver Sharing"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <div className="font-bold text-sm text-[#2D3142]">Caregiver Sharing</div>
              <div className="text-xs text-[#71788E]">Direct email invites</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#FFF0F0] via-[#F5F3FC] to-[#EEF6FD] border border-[#F0EBE6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#8C7AE6] text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#8C7AE6]" />
              <span>BabyDaily AI Guide (DeepSeek)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2D3142]">
              Have questions about routine tracking or alarms?
            </h3>
            <p className="text-sm text-[#71788E] max-w-lg leading-relaxed">
              Ask our intelligent AI assistant about how to set phone clock alarms for feedings, invite family members, or manage baby routines.
            </p>
          </div>

          <button
            onClick={onOpenChat}
            className="px-7 py-4 rounded-2xl bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold text-sm shadow-xl shadow-coral-500/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Ask BabyDaily AI</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D3142] tracking-tight">
          Ready for calmer, simpler days?
        </h2>
        <p className="text-sm sm:text-base text-[#71788E] max-w-xl mx-auto">
          Download BabyDaily today. Track routine milestones with zero stress and real-time family peace of mind.
        </p>
        <div className="flex justify-center">
          <StoreButtons />
        </div>
      </section>
    </div>
  );
};
