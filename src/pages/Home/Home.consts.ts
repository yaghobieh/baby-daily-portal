import {
  Utensils,
  Moon,
  BellRing,
  Baby,
  Users,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { URL_GOOGLE_PLAY } from '@constants/routes.const';
import type { StoreType } from './Home.types';

export const HERO_TITLE = 'Parenting Made Simple, Calm & Beautiful';
export const HERO_SUBTITLE =
  'The all-in-one daily routine tracker for your baby. Seamlessly log feeding, sleep, diaper changes, and medications with instant family sync and real phone clock alarms.';

export const STORE_URL_MAP: Record<StoreType, string> = {
  android: URL_GOOGLE_PLAY,
  ios: '#ios-coming-soon',
};

export const STORE_TARGET_MAP: Record<StoreType, string> = {
  android: '_blank',
  ios: '_self',
};

export const ICON_MAP: Record<string, LucideIcon> = {
  feed: Utensils,
  sleep: Moon,
  alarm: BellRing,
  diaper: Baby,
  sharing: Users,
  shield: ShieldCheck,
};

export interface FeatureItem {
  id: string;
  translationKey: 'feeding' | 'sleep' | 'alarm' | 'diaper' | 'sharing' | 'privacy';
  iconName: 'feed' | 'sleep' | 'diaper' | 'alarm' | 'sharing' | 'shield';
  accentColor: string;
}

export const FEATURES_LIST: FeatureItem[] = [
  {
    id: 'feat-feed',
    translationKey: 'feeding',
    iconName: 'feed',
    accentColor: '#FF7A7A',
  },
  {
    id: 'feat-sleep',
    translationKey: 'sleep',
    iconName: 'sleep',
    accentColor: '#8C7AE6',
  },
  {
    id: 'feat-alarm',
    translationKey: 'alarm',
    iconName: 'alarm',
    accentColor: '#FFAA00',
  },
  {
    id: 'feat-diaper',
    translationKey: 'diaper',
    iconName: 'diaper',
    accentColor: '#48C78E',
  },
  {
    id: 'feat-sharing',
    translationKey: 'sharing',
    iconName: 'sharing',
    accentColor: '#3897F0',
  },
  {
    id: 'feat-shield',
    translationKey: 'privacy',
    iconName: 'shield',
    accentColor: '#FF7A7A',
  },
];
