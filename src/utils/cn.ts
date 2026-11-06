import { EMPTY_STRING, SPACE_STRING } from '@constants/generals.const';

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(SPACE_STRING);
};
