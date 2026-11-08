import { URL_API_BACKEND } from '@constants/routes.const';
import { PORTAL_TOKEN_KEY, PORTAL_BABY_ID_KEY } from '@store/modules/Chat/chat.apis';
import { ENTRY_TYPE_LABELS } from './Dashboard.consts';
import type { PortalEntry } from './Dashboard.types';

export const getSavedToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(PORTAL_TOKEN_KEY);
};

export const savePortalToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(PORTAL_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(PORTAL_TOKEN_KEY);
    window.localStorage.removeItem(PORTAL_BABY_ID_KEY);
  }
};

export const saveActiveBabyId = (babyId: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PORTAL_BABY_ID_KEY, babyId);
};

export const apiRequest = async <T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${URL_API_BACKEND}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg = typeof json.message === 'string' ? json.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
};

export const formatEntrySubtitle = (entry: PortalEntry): string => {
  const d = entry.data ?? {};
  switch (entry.type) {
    case 'FEED': {
      const kind = typeof d.kind === 'string' ? d.kind : 'bottle';
      const ml = typeof d.amountMl === 'number' ? `${d.amountMl} ml` : '';
      const min = typeof d.durationMin === 'number' ? `${d.durationMin} min` : '';
      return [kind, ml, min].filter(Boolean).join(' • ');
    }
    case 'SLEEP': {
      if (!entry.endedAt) return 'Sleeping now (Live)';
      const dur = Math.max(
        1,
        Math.round((new Date(entry.endedAt).getTime() - new Date(entry.startedAt).getTime()) / 60000)
      );
      return `Slept ${dur} min`;
    }
    case 'DIAPER': {
      return typeof d.kind === 'string' ? `Diaper: ${d.kind}` : 'Diaper change';
    }
    case 'NOTE': {
      return typeof d.text === 'string' ? d.text : 'Routine note';
    }
    default:
      return ENTRY_TYPE_LABELS[entry.type] || entry.type;
  }
};

export const formatEntryTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
};

