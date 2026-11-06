import { NUMBER_TEN, NUMBER_ZERO } from '@constants/numbers.const';

export const formatCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(NUMBER_TEN < 10 ? 2 : 2, '0');
  const minutes = now.getMinutes().toString().padStart(NUMBER_TEN < 10 ? 2 : 2, '0');
  return `${hours}:${minutes}`;
};
