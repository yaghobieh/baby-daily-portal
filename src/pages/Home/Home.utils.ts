import { URL_GOOGLE_PLAY } from '@constants/routes.const';
import type { StoreType } from './Home.types';

export const STORE_URL_MAP: Record<StoreType, string> = {
  android: URL_GOOGLE_PLAY,
  ios: '#ios-coming-soon',
};

export const getStoreTarget = (type: StoreType): string => {
  const targetMap: Record<StoreType, string> = {
    android: '_blank',
    ios: '_self',
  };
  return targetMap[type];
};
