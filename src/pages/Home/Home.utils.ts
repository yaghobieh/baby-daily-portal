import { STORE_TARGET_MAP } from './Home.consts';
import type { StoreType } from './Home.types';

export const getStoreTarget = (type: StoreType): string => STORE_TARGET_MAP[type];
