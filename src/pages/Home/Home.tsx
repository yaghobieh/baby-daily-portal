import type { FC } from 'react';
import { Typography, Badge, Button, Card, Flex } from '@forgedevstack/bear';
import {
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  BearIcon,
} from '@forgedevstack/bear-icons';
import { useLingo } from '@forgedevstack/lingo';
import { FEATURES_LIST, ICON_MAP } from './Home.consts';
import type { HomeProps } from './Home.types';
import { StoreButtons } from '@components/StoreButtons';

export const Home: FC<HomeProps> = ({ onOpenChat }) => {
  const { t } = useLingo();

  return (
    <div className="space-y-24">
      <section className="relative pt-12 pb-6 px-4 sm:px-6 max-w-6xl mx-auto text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <Flex
              align="center"
              gap={2}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF0F0] border border-[#FFE0E0] text-[#FF7A7A] text-xs font-bold tracking-wide w-fit mx-auto md:mx-0"
            >
              <BearIcon className="w-3.5 h-3.5 text-[#FF7A7A]" />
              <Typography variant="caption" className="font-bold text-[#FF7A7A]">
                {t('hero.badge')}
              </Typography>
            </Flex>

            <Typography
              variant="h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2D3142] tracking-tight leading-[1.12]"
            >
              {t('hero.title')}
            </Typography>

            <Typography
              variant="body1"
              className="text-base sm:text-lg text-[#71788E] max-w-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </Typography>

            <StoreButtons />

            <Flex
              wrap="wrap"
              align="center"
              gap={6}
              className="pt-4 text-xs font-medium text-[#71788E] justify-center md:justify-start"
            >
              <Flex align="center" gap={2}>
                <ClockIcon className="w-4 h-4 text-[#FFAA00]" />
                <Typography variant="caption" className="font-semibold text-[#71788E]">
                  {t('hero.pills.clock')}
                </Typography>
              </Flex>
              <Flex align="center" gap={2}>
                <UsersIcon className="w-4 h-4 text-[#3897F0]" />
                <Typography variant="caption" className="font-semibold text-[#71788E]">
                  {t('hero.pills.sync')}
                </Typography>
              </Flex>
              <Flex align="center" gap={2}>
                <CheckCircleIcon className="w-4 h-4 text-[#48C78E]" />
                <Typography variant="caption" className="font-semibold text-[#71788E]">
                  {t('hero.pills.privacy')}
                </Typography>
              </Flex>
            </Flex>
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
                  <Typography variant="body2" className="font-bold text-[#2D3142]">
                    {t('hero.babyStatus.name')}
                  </Typography>
                  <Typography variant="caption" className="text-[11px] text-[#71788E]">
                    {t('hero.babyStatus.desc')}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <Card
          variant="outlined"
          radius="2xl"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-white border-[#F0EBE6] shadow-sm"
        >
          <div className="text-center p-2">
            <Typography variant="h3" className="text-2xl sm:text-3xl font-extrabold text-[#2D3142] tracking-tight">
              {t('stats.languages.value')}
            </Typography>
            <Typography variant="caption" className="text-xs text-[#71788E] mt-1 font-medium">
              {t('stats.languages.label')}
            </Typography>
          </div>
          <div className="text-center p-2">
            <Typography variant="h3" className="text-2xl sm:text-3xl font-extrabold text-[#2D3142] tracking-tight">
              {t('stats.free.value')}
            </Typography>
            <Typography variant="caption" className="text-xs text-[#71788E] mt-1 font-medium">
              {t('stats.free.label')}
            </Typography>
          </div>
          <div className="text-center p-2">
            <Typography variant="h3" className="text-2xl sm:text-3xl font-extrabold text-[#2D3142] tracking-tight">
              {t('stats.speed.value')}
            </Typography>
            <Typography variant="caption" className="text-xs text-[#71788E] mt-1 font-medium">
              {t('stats.speed.label')}
            </Typography>
          </div>
          <div className="text-center p-2">
            <Typography variant="h3" className="text-2xl sm:text-3xl font-extrabold text-[#2D3142] tracking-tight">
              {t('stats.sync.value')}
            </Typography>
            <Typography variant="caption" className="text-xs text-[#71788E] mt-1 font-medium">
              {t('stats.sync.label')}
            </Typography>
          </div>
        </Card>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Typography variant="h2" className="text-3xl sm:text-4xl font-extrabold text-[#2D3142] tracking-tight">
            {t('features.heading')}
          </Typography>
          <Typography variant="body1" className="text-sm sm:text-base text-[#71788E]">
            {t('features.subheading')}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feat) => {
            const IconComponent = ICON_MAP[feat.iconName];
            return (
              <Card
                key={feat.id}
                variant="outlined"
                radius="2xl"
                interactive
                className="group p-7 bg-white border-[#F0EBE6] hover:border-[#FF7A7A]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: feat.accentColor }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="neutral" pill size="sm" className="font-bold text-[11px] bg-[#FBF7F2] text-[#71788E]">
                      {t(`features.${feat.translationKey}.badge`)}
                    </Badge>
                  </div>

                  <Typography variant="h4" className="text-xl font-bold text-[#2D3142] group-hover:text-[#FF7A7A] transition-colors">
                    {t(`features.${feat.translationKey}.title`)}
                  </Typography>

                  <Typography variant="body2" className="text-sm text-[#71788E] leading-relaxed">
                    {t(`features.${feat.translationKey}.desc`)}
                  </Typography>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Typography variant="h2" className="text-3xl sm:text-4xl font-extrabold text-[#2D3142] tracking-tight">
            {t('preview.heading')}
          </Typography>
          <Typography variant="body1" className="text-sm text-[#71788E]">
            {t('preview.subheading')}
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <Card variant="outlined" radius="2xl" className="overflow-hidden bg-white border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/01_daily_overview.png"
              alt="Daily Timeline"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <Typography variant="h6" className="font-bold text-sm text-[#2D3142]">
                {t('preview.screen1.title')}
              </Typography>
              <Typography variant="caption" className="text-xs text-[#71788E]">
                {t('preview.screen1.subtitle')}
              </Typography>
            </div>
          </Card>

          <Card variant="outlined" radius="2xl" className="overflow-hidden bg-white border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/02_feeding_tracker.png"
              alt="Feeding Tracker"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <Typography variant="h6" className="font-bold text-sm text-[#2D3142]">
                {t('preview.screen2.title')}
              </Typography>
              <Typography variant="caption" className="text-xs text-[#71788E]">
                {t('preview.screen2.subtitle')}
              </Typography>
            </div>
          </Card>

          <Card variant="outlined" radius="2xl" className="overflow-hidden bg-white border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/03_sleep_and_diaper.png"
              alt="Sleep & Diapers"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <Typography variant="h6" className="font-bold text-sm text-[#2D3142]">
                {t('preview.screen3.title')}
              </Typography>
              <Typography variant="caption" className="text-xs text-[#71788E]">
                {t('preview.screen3.subtitle')}
              </Typography>
            </div>
          </Card>

          <Card variant="outlined" radius="2xl" className="overflow-hidden bg-white border-[#F0EBE6] shadow-md hover:shadow-xl transition-shadow p-3">
            <img
              src="/assets/04_family_sharing.png"
              alt="Caregiver Sharing"
              className="w-full h-auto rounded-2xl"
            />
            <div className="p-3 text-center">
              <Typography variant="h6" className="font-bold text-sm text-[#2D3142]">
                {t('preview.screen4.title')}
              </Typography>
              <Typography variant="caption" className="text-xs text-[#71788E]">
                {t('preview.screen4.subtitle')}
              </Typography>
            </div>
          </Card>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#FFF0F0] via-[#F5F3FC] to-[#EEF6FD] border border-[#F0EBE6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <Flex
              align="center"
              gap={2}
              className="px-3 py-1 rounded-full bg-white text-[#8C7AE6] text-xs font-bold shadow-2xs w-fit mx-auto md:mx-0"
            >
              <BearIcon className="w-3.5 h-3.5 text-[#8C7AE6]" />
              <Typography variant="caption" className="font-bold text-[#8C7AE6]">
                {t('aiBanner.badge')}
              </Typography>
            </Flex>
            <Typography variant="h3" className="text-2xl sm:text-3xl font-extrabold text-[#2D3142]">
              {t('aiBanner.title')}
            </Typography>
            <Typography variant="body1" className="text-sm text-[#71788E] max-w-lg leading-relaxed">
              {t('aiBanner.desc')}
            </Typography>
          </div>

          <Button
            variant="babyCoral"
            size="lg"
            radius="pill"
            onClick={onOpenChat}
            rightIcon={<ChevronRightIcon className="w-4 h-4" />}
            className="px-7 py-4 shadow-xl shadow-coral-500/20 hover:scale-105 transition-all shrink-0 font-bold"
          >
            {t('aiBanner.button')}
          </Button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <Typography variant="h2" className="text-3xl sm:text-4xl font-extrabold text-[#2D3142] tracking-tight">
          {t('cta.title')}
        </Typography>
        <Typography variant="body1" className="text-sm sm:text-base text-[#71788E] max-w-xl mx-auto">
          {t('cta.subtitle')}
        </Typography>
        <div className="flex justify-center">
          <StoreButtons />
        </div>
      </section>
    </div>
  );
};
