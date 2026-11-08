import React, { useState } from 'react';
import {
  Card,
  Typography,
  Badge,
  Flex,
  Button,
  Chip,
  List,
  ListItem,
  Input,
} from '@forgedevstack/bear';
import {
  CheckCircleIcon,
  StarIcon,
  InfoIcon,
  PlusIcon,
  ClockIcon,
} from '@forgedevstack/bear-icons';
import { PRICING_PLANS, QUICK_BOTTLE_AMOUNTS, ENTRY_TYPE_LABELS } from './Dashboard.consts';
import {
  getSavedToken,
  savePortalToken,
  saveActiveBabyId,
  apiRequest,
  formatEntrySubtitle,
  formatEntryTime,
} from './Dashboard.utils';
import type {
  PortalUser,
  PortalBaby,
  PortalEntry,
  PortalSummary,
  AiInsightsResponse,
  BabyStatsResponse,
} from './Dashboard.types';
import { Smartphone, Monitor, Sparkles, RefreshCw, LogOut, Check, Apple } from 'lucide-react';

interface DashboardProps {
  onOpenChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenChat }) => {
  const [token, setToken] = useState<string | null>(() => getSavedToken());
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newBabyName, setNewBabyName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'diaper' | 'note' | null>(null);
  const [viewMode, setViewMode] = useState<'app' | 'expanded'>('app');

  const [user, setUser] = useState<PortalUser | null>(null);
  const [babies, setBabies] = useState<PortalBaby[]>([]);
  const [selectedBabyId, setSelectedBabyId] = useState<string | null>(null);
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [entries, setEntries] = useState<PortalEntry[]>([]);
  const [insights, setInsights] = useState<AiInsightsResponse | null>(null);
  const [stats, setStats] = useState<BabyStatsResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const loadBabyDetails = async (activeToken: string, babyId: string) => {
    saveActiveBabyId(babyId);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const [sumRes, entRes, insRes, stRes] = await Promise.all([
      apiRequest<PortalSummary>(
        `/babies/${babyId}/summary?from=${encodeURIComponent(startOfDay)}&to=${encodeURIComponent(endOfDay)}`,
        activeToken
      ),
      apiRequest<PortalEntry[]>(`/babies/${babyId}/entries?limit=25`, activeToken),
      apiRequest<AiInsightsResponse>(`/babies/${babyId}/ai/insights`, activeToken),
      apiRequest<BabyStatsResponse>(`/babies/${babyId}/stats?days=7`, activeToken),
    ]);

    setSummary(sumRes);
    setEntries(entRes);
    setInsights(insRes);
    setStats(stRes);
  };

  const loadFullSession = async (activeToken: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [meRes, babiesRes] = await Promise.all([
        apiRequest<PortalUser>('/me', activeToken),
        apiRequest<PortalBaby[]>('/babies', activeToken),
      ]);
      setUser(meRes);
      setBabies(babiesRes);
      if (babiesRes.length > 0) {
        const firstId = selectedBabyId && babiesRes.some((b) => b.id === selectedBabyId)
          ? selectedBabyId
          : babiesRes[0].id;
        setSelectedBabyId(firstId);
        await loadBabyDetails(activeToken, firstId);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
      savePortalToken(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  if (token && !initialized) {
    setInitialized(true);
    void loadFullSession(token);
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const cleanIdentifier = email.trim();
      const payload =
        authMode === 'login'
          ? {
              identifier: cleanIdentifier,
              password,
              utcOffset: -new Date().getTimezoneOffset(),
            }
          : {
              email: cleanIdentifier,
              password,
              name: name || 'Parent',
              utcOffset: -new Date().getTimezoneOffset(),
            };

      const res = await apiRequest<{ token: string; user: PortalUser }>(endpoint, null, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      savePortalToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setInitialized(true);
      await loadFullSession(res.token);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAccountPicker = () => {
    const w = window as unknown as { google?: any };
    if (w.google?.accounts?.oauth2) {
      try {
        const client = w.google.accounts.oauth2.initTokenClient({
          client_id: '465653534147-2j97qb01btip30m5kqo02jglsgfuir98.apps.googleusercontent.com',
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (resp: { access_token?: string }) => {
            if (resp?.access_token) {
              setLoading(true);
              setErrorMsg(null);
              setStatusMsg(null);
              try {
                const res = await apiRequest<{ token: string; user: PortalUser }>('/auth/google', null, {
                  method: 'POST',
                  body: JSON.stringify({
                    accessToken: resp.access_token,
                    locale: 'en',
                    utcOffset: -new Date().getTimezoneOffset(),
                  }),
                });
                savePortalToken(res.token);
                setToken(res.token);
                setUser(res.user);
                setInitialized(true);
                await loadFullSession(res.token);
              } catch (err) {
                setErrorMsg((err as Error).message);
              } finally {
                setLoading(false);
              }
            }
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google GSI error', err);
      }
    }

    // Dynamic fallback load if script was deferred
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        const g = (window as unknown as { google?: any }).google;
        if (g?.accounts?.oauth2) {
          const client = g.accounts.oauth2.initTokenClient({
            client_id: '465653534147-2j97qb01btip30m5kqo02jglsgfuir98.apps.googleusercontent.com',
            scope: 'email profile openid',
            prompt: 'select_account',
            callback: async (resp: { access_token?: string }) => {
              if (resp?.access_token) {
                setLoading(true);
                const res = await apiRequest<{ token: string; user: PortalUser }>('/auth/google', null, {
                  method: 'POST',
                  body: JSON.stringify({
                    accessToken: resp.access_token,
                    locale: 'en',
                    utcOffset: -new Date().getTimezoneOffset(),
                  }),
                });
                savePortalToken(res.token);
                setToken(res.token);
                setUser(res.user);
                setInitialized(true);
                await loadFullSession(res.token);
                setLoading(false);
              }
            },
          });
          client.requestAccessToken({ prompt: 'select_account' });
        }
      } catch (err) {
        setErrorMsg('Unable to open Google account chooser. Please use email/phone and password.');
      }
    };
    document.head.appendChild(script);
  };

  const handleLogout = () => {
    savePortalToken(null);
    setToken(null);
    setUser(null);
    setBabies([]);
    setSelectedBabyId(null);
    setSummary(null);
    setEntries([]);
    setInsights(null);
    setStats(null);
    setInitialized(false);
  };

  const handleCreateBaby = async () => {
    if (!token || !newBabyName.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const created = await apiRequest<PortalBaby>('/babies', token, {
        method: 'POST',
        body: JSON.stringify({
          name: newBabyName.trim(),
          birthDate: new Date(Date.now() - 90 * 86400000).toISOString(),
        }),
      });
      const updatedBabies = [...babies, created];
      setBabies(updatedBabies);
      setSelectedBabyId(created.id);
      setNewBabyName('');
      await loadBabyDetails(token, created.id);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogEntry = async (
    type: PortalEntry['type'],
    data: Record<string, unknown>,
    endedAt?: string | null
  ) => {
    if (!token || !selectedBabyId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await apiRequest(`/babies/${selectedBabyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type,
          startedAt: new Date().toISOString(),
          endedAt: endedAt === undefined ? new Date().toISOString() : endedAt,
          data,
        }),
      });
      setStatusMsg(`Entry logged & synced across all family devices!`);
      setActiveTab(null);
      await loadBabyDetails(token, selectedBabyId);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSleep = async () => {
    if (!token || !selectedBabyId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      if (summary?.activeSleep) {
        await apiRequest(
          `/babies/${selectedBabyId}/entries/${summary.activeSleep.id}/end`,
          token,
          {
            method: 'POST',
            body: JSON.stringify({ endedAt: new Date().toISOString() }),
          }
        );
        setStatusMsg('Baby woke up! Sleep duration saved & family notified.');
      } else {
        await apiRequest(`/babies/${selectedBabyId}/entries`, token, {
          method: 'POST',
          body: JSON.stringify({
            type: 'SLEEP',
            startedAt: new Date().toISOString(),
            endedAt: null,
            data: { kind: 'nap' },
          }),
        });
        setStatusMsg('Live sleep timer started! Synced across Apple iOS & Android.');
      }
      await loadBabyDetails(token, selectedBabyId);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!token || !selectedBabyId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await apiRequest(`/babies/${selectedBabyId}/entries/${entryId}`, token, {
        method: 'DELETE',
      });
      setStatusMsg('Entry removed & synced.');
      await loadBabyDetails(token, selectedBabyId);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendDailySummary = async () => {
    if (!token || !selectedBabyId) return;
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await apiRequest<{
        summary: string;
        notificationSent: boolean;
        emailSent: boolean;
      }>(`/babies/${selectedBabyId}/ai/daily-summary`, token, {
        method: 'POST',
        body: JSON.stringify({ sendToEmail: true, sendNotification: true }),
      });
      setStatusMsg(
        `✨ AI Daily Summary sent to notifications${res.emailSent ? ' and email' : ''}: "${res.summary}"`
      );
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = async (plan: 'MONTHLY' | 'YEARLY' | 'LIFETIME') => {
    if (!token) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const updatedUser = await apiRequest<PortalUser>('/me/subscription', token, {
        method: 'POST',
        body: JSON.stringify({ plan, dailySummaryEmail: true }),
      });
      setUser(updatedUser);
      setStatusMsg(`🎉 Upgraded to BabyDaily Premium (${plan})! Unlimited AI & 7-Day Analytics unlocked on Web & Mobile.`);
      if (selectedBabyId) {
        await loadBabyDetails(token, selectedBabyId);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const activeBaby = babies.find((b) => b.id === selectedBabyId) || babies[0];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <Flex justify="center" align="center" gap={2} className="mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBFBF3] border border-[#BCEAD5] text-xs font-black text-[#1E824C] shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#48C78E] animate-pulse" />
              <span>🟢 Live Auto-Sync: Apple iOS & Android</span>
            </div>
          </Flex>
          <Typography variant="h1" className="text-3xl sm:text-4xl font-black text-[#2D3142] tracking-tight mb-2">
            BabyDaily Web App Companion
          </Typography>
          <Typography variant="body1" className="text-sm sm:text-base text-[#71788E] max-w-2xl mx-auto">
            Manage routine feeds, live sleep timers, and DeepSeek AI insights from your browser. Every change mirrors to your family&apos;s iPhones and Android phones instantly.
          </Typography>
        </div>

        {errorMsg && (
          <Card variant="outlined" className="p-4 bg-[#FFF0F0] border-[#FF7A7A] rounded-2xl max-w-xl mx-auto">
            <Typography variant="body2" className="text-[#D63031] font-bold text-center">
              {errorMsg}
            </Typography>
          </Card>
        )}

        {statusMsg && (
          <Card variant="outlined" className="p-4 bg-[#EFFBF5] border-[#48C78E] rounded-2xl max-w-xl mx-auto">
            <Typography variant="body2" className="text-[#1E824C] font-bold text-center">
              {statusMsg}
            </Typography>
          </Card>
        )}

        {!token || !user ? (
          <div className="max-w-md mx-auto">
            <Card variant="elevated" className="p-6 sm:p-8 bg-white rounded-3xl border border-[#F0EBE6] shadow-sm">
              <Flex justify="between" align="center" className="mb-6">
                <div>
                  <Typography variant="h4" className="text-xl font-extrabold text-[#2D3142]">
                    {authMode === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
                  </Typography>
                  <Typography variant="caption" className="text-xs text-[#71788E]">
                    Synced with your mobile app
                  </Typography>
                </div>
                <Badge variant="primary" pill size="sm">
                  Live Cloud
                </Badge>
              </Flex>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <Typography variant="caption" className="font-bold text-[#2D3142] block mb-1">
                      Your Name
                    </Typography>
                    <Input
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="e.g. Sarah / John"
                      fullWidth
                    />
                  </div>
                )}

                <div>
                  <Typography variant="caption" className="font-bold text-[#2D3142] block mb-1">
                    Email Address or Phone Number
                  </Typography>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="you@example.com or 050-123-4567"
                    required
                    fullWidth
                  />
                </div>

                <div>
                  <Typography variant="caption" className="font-bold text-[#2D3142] block mb-1">
                    Password
                  </Typography>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    fullWidth
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                  className="bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold rounded-2xl py-3 shadow-sm transition-colors"
                >
                  {loading
                    ? 'Connecting to BabyDaily Cloud...'
                    : authMode === 'login'
                      ? 'Sign In & Sync Baby Data'
                      : 'Create Account & Start Tracking'}
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#F0EBE6]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-[#A89E95] font-bold">OR</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                disabled={loading}
                onClick={handleGoogleAccountPicker}
                className="border-[#D1D5DB] text-[#1F2937] hover:bg-[#F9FAFB] font-bold rounded-2xl py-3 flex items-center justify-center gap-3 shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google Account</span>
              </Button>

              <div className="mt-5 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs font-bold text-[#71788E]"
                >
                  {authMode === 'login'
                    ? "Don't have an account yet? Create one here"
                    : 'Already have an account on the mobile app? Sign in'}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F0] border border-[#FFE0E0] flex items-center justify-center text-xl shadow-2xs">
                  👶
                </div>
                <div>
                  <Typography variant="h4" className="text-lg font-black text-[#2D3142]">
                    {activeBaby?.name || 'My Baby'}
                  </Typography>
                  <Typography variant="caption" className="text-xs text-[#71788E]">
                    Caregiver: {user.name} ({user.email})
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:inline-flex bg-[#F5F3FC] p-1 rounded-xl border border-[#E8E2D9]">
                  <button
                    type="button"
                    onClick={() => setViewMode('app')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'app' ? 'bg-white text-[#8C7AE6] shadow-2xs' : 'text-[#71788E]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>App View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('expanded')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'expanded' ? 'bg-white text-[#8C7AE6] shadow-2xs' : 'text-[#71788E]'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Expanded</span>
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  radius="pill"
                  icon={<RefreshCw size={13} />}
                  onClick={() => selectedBabyId && void loadBabyDetails(token, selectedBabyId)}
                  className="text-xs font-semibold border-[#E8E2D9]"
                >
                  Sync
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<LogOut size={13} />}
                  onClick={handleLogout}
                  className="text-xs font-semibold text-[#71788E] hover:text-[#D63031]"
                >
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#475569] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#48C78E] animate-ping" />
                <span className="font-bold text-[#1E293B]">Auto-Sync Connected:</span>
                <span>PostgreSQL on Neon Serverless</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[11px] font-bold text-[#1E293B] flex items-center gap-1">
                  <Apple className="w-3 h-3 text-[#1E293B]" /> iOS App
                </span>
                <a
                  href="https://play.google.com/apps/internaltest/4701450095669878477"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#2D3142] hover:bg-[#1E202B] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Smartphone className="w-3 h-3 text-[#34A853]" />
                  <span>Install on Android</span>
                </a>
                <span className="px-2 py-0.5 rounded-md bg-[#EFFBF5] text-[#1E824C] border border-[#BCEAD5] text-[11px] font-bold">
                  ✓ Instant Fanout
                </span>
              </div>
            </div>

            {babies.length > 1 && (
              <Flex gap={2} wrap="wrap">
                {babies.map((b) => (
                  <Button
                    key={b.id}
                    variant={b.id === selectedBabyId ? 'primary' : 'outline'}
                    size="sm"
                    radius="pill"
                    onClick={() => {
                      setSelectedBabyId(b.id);
                      void loadBabyDetails(token, b.id);
                    }}
                    className={
                      b.id === selectedBabyId
                        ? 'bg-[#FF7A7A] text-white font-bold'
                        : 'border-[#E8E2D9] text-[#2D3142] font-semibold'
                    }
                  >
                    👶 {b.name}
                  </Button>
                ))}
              </Flex>
            )}

            {babies.length === 0 && (
              <Card variant="outlined" className="p-6 bg-white rounded-3xl border border-[#F0EBE6] text-center max-w-md mx-auto">
                <Typography variant="h4" className="text-lg font-bold text-[#2D3142] mb-2">
                  Welcome to BabyDaily!
                </Typography>
                <Typography variant="body2" className="text-xs text-[#71788E] mb-4">
                  Add your baby&apos;s name to start tracking routines across your phone and web.
                </Typography>
                <Flex gap={2} justify="center">
                  <Input
                    value={newBabyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBabyName(e.target.value)}
                    placeholder="Baby's name (e.g. Liam)"
                  />
                  <Button
                    variant="primary"
                    icon={<PlusIcon size={16} />}
                    onClick={() => void handleCreateBaby()}
                    className="bg-[#FF7A7A] text-white font-bold whitespace-nowrap"
                  >
                    Add Baby
                  </Button>
                </Flex>
              </Card>
            )}

            {selectedBabyId && (
              <div
                className={
                  viewMode === 'app'
                    ? 'max-w-md mx-auto space-y-5 bg-[#FAF8F5] p-4 sm:p-5 rounded-[32px] border-2 border-[#EAE4DC] shadow-md'
                    : 'space-y-6'
                }
              >
                <Card
                  variant="elevated"
                  className={`p-5 rounded-3xl border transition-all ${
                    summary?.activeSleep
                      ? 'bg-[#23203F] text-white border-[#3B3568] shadow-lg'
                      : 'bg-[#EFFBF5] text-[#2D3142] border-[#BCEAD5] shadow-xs'
                  }`}
                >
                  <Flex justify="between" align="center" wrap="wrap" gap={3}>
                    <div>
                      <Badge
                        variant={summary?.activeSleep ? 'primary' : 'success'}
                        pill
                        size="sm"
                        className="mb-1.5 font-bold"
                      >
                        {summary?.activeSleep ? '🌙 SLEEPING NOW' : '☀️ AWAKE NOW'}
                      </Badge>
                      <Typography
                        variant="h3"
                        className={`text-xl font-black ${
                          summary?.activeSleep ? 'text-white' : 'text-[#2D3142]'
                        }`}
                      >
                        {summary?.activeSleep
                          ? `Nap in progress (${formatEntryTime(summary.activeSleep.startedAt)})`
                          : insights?.awakeMinutes !== null && insights?.awakeMinutes !== undefined
                            ? `Awake for ${insights.awakeMinutes} minutes`
                            : 'Ready for next routine'}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={`text-xs mt-0.5 ${
                          summary?.activeSleep ? 'text-white/80' : 'text-[#4A5568]'
                        }`}
                      >
                        {insights?.recommendedWakeWindow
                          ? `Sweet-spot wake window: ${insights.recommendedWakeWindow.min}–${insights.recommendedWakeWindow.max}m`
                          : 'Live sleep timer synced with phone alarms'}
                      </Typography>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      radius="pill"
                      disabled={loading}
                      onClick={() => void handleToggleSleep()}
                      className={
                        summary?.activeSleep
                          ? 'bg-[#FFAA00] hover:bg-[#E59800] text-[#23203F] font-black px-5 py-2.5'
                          : 'bg-[#48C78E] hover:bg-[#3BB07B] text-white font-black px-5 py-2.5'
                      }
                    >
                      {summary?.activeSleep ? '☀️ Baby Woke Up' : '🌙 Start Sleep Timer'}
                    </Button>
                  </Flex>
                </Card>

                <div className="bg-white p-4 rounded-3xl border border-[#F0EBE6] shadow-xs">
                  <Typography variant="caption" className="font-extrabold text-[11px] uppercase tracking-wider text-[#71788E] block mb-3 text-center">
                    1-Tap Routine Logger
                  </Typography>

                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'feed' ? null : 'feed')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        activeTab === 'feed'
                          ? 'bg-[#FFF0F0] border-[#FF7A7A] text-[#FF7A7A] shadow-xs'
                          : 'bg-[#FFFDFB] border-[#F0EBE6] text-[#2D3142] hover:bg-[#FFF5F5]'
                      }`}
                    >
                      <span className="text-2xl mb-1">🍼</span>
                      <span className="text-xs font-bold">Feed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleToggleSleep()}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl border border-[#F0EBE6] bg-[#FFFDFB] text-[#2D3142] hover:bg-[#F5F3FC] transition-all"
                    >
                      <span className="text-2xl mb-1">😴</span>
                      <span className="text-xs font-bold">{summary?.activeSleep ? 'Wake' : 'Sleep'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'diaper' ? null : 'diaper')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        activeTab === 'diaper'
                          ? 'bg-[#F0F9FF] border-[#3897F0] text-[#3897F0] shadow-xs'
                          : 'bg-[#FFFDFB] border-[#F0EBE6] text-[#2D3142] hover:bg-[#F0F9FF]'
                      }`}
                    >
                      <span className="text-2xl mb-1">🧷</span>
                      <span className="text-xs font-bold">Diaper</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'note' ? null : 'note')}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        activeTab === 'note'
                          ? 'bg-[#FFF9F0] border-[#FFAA00] text-[#FFAA00] shadow-xs'
                          : 'bg-[#FFFDFB] border-[#F0EBE6] text-[#2D3142] hover:bg-[#FFF9F0]'
                      }`}
                    >
                      <span className="text-2xl mb-1">💊</span>
                      <span className="text-xs font-bold">Notes</span>
                    </button>
                  </div>

                  {activeTab === 'feed' && (
                    <div className="mt-4 p-3 bg-[#FFF5F5] rounded-2xl border border-[#FFE0E0] space-y-2 animate-in fade-in duration-150">
                      <Typography variant="caption" className="font-bold text-xs text-[#FF7A7A] block">
                        Quick Bottle Volume Presets:
                      </Typography>
                      <Flex wrap="wrap" gap={1}>
                        {QUICK_BOTTLE_AMOUNTS.map((ml) => (
                          <Button
                            key={ml}
                            variant="outline"
                            size="sm"
                            radius="pill"
                            disabled={loading}
                            onClick={() => void handleLogEntry('FEED', { kind: 'bottle', amountMl: ml })}
                            className="bg-white border-[#FFE0E0] text-[#FF7A7A] font-bold text-xs"
                          >
                            +{ml}ml
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          radius="pill"
                          disabled={loading}
                          onClick={() => void handleLogEntry('FEED', { kind: 'breast', side: 'both', durationMin: 15 })}
                          className="bg-white border-[#FFE0E0] text-[#FF7A7A] font-bold text-xs"
                        >
                          +15m Breast
                        </Button>
                      </Flex>
                    </div>
                  )}

                  {activeTab === 'diaper' && (
                    <div className="mt-4 p-3 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-2 animate-in fade-in duration-150">
                      <Typography variant="caption" className="font-bold text-xs text-[#3897F0] block">
                        Log Diaper Type:
                      </Typography>
                      <Flex wrap="wrap" gap={2}>
                        {(['wet', 'dirty', 'both'] as const).map((kind) => (
                          <Button
                            key={kind}
                            variant="outline"
                            size="sm"
                            radius="pill"
                            disabled={loading}
                            onClick={() => void handleLogEntry('DIAPER', { kind })}
                            className="bg-white border-[#BAE6FD] text-[#3897F0] font-bold capitalize text-xs"
                          >
                            +{kind} Diaper
                          </Button>
                        ))}
                      </Flex>
                    </div>
                  )}

                  {activeTab === 'note' && (
                    <div className="mt-4 p-3 bg-[#FFF9F0] rounded-2xl border border-[#FFE8CC] space-y-2 animate-in fade-in duration-150">
                      <Typography variant="caption" className="font-bold text-xs text-[#D97706] block">
                        Add Quick Note / Medicine:
                      </Typography>
                      <Flex gap={2}>
                        <Input
                          value={noteText}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteText(e.target.value)}
                          placeholder="Vitamin D, fever medicine, tummy time..."
                          fullWidth
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          radius="pill"
                          disabled={loading || !noteText.trim()}
                          onClick={() => {
                            void handleLogEntry('NOTE', { text: noteText.trim() });
                            setNoteText('');
                          }}
                          className="bg-[#FFAA00] hover:bg-[#E59800] text-[#23203F] font-bold text-xs whitespace-nowrap"
                        >
                          Save
                        </Button>
                      </Flex>
                    </div>
                  )}
                </div>

                <Card variant="elevated" className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF5F5] to-[#F5F3FC] rounded-3xl border border-[#FFE0E0]">
                  <Flex justify="between" align="center" className="mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8C7AE6]" />
                      <Typography variant="subtitle2" className="font-extrabold text-sm text-[#2D3142]">
                        AI Routine Insights
                      </Typography>
                    </div>
                    <Badge variant="primary" pill size="sm">
                      DeepSeek AI
                    </Badge>
                  </Flex>

                  <div className="space-y-2">
                    {(insights?.suggestions ?? []).slice(0, 2).map((s) => (
                      <div key={s.id} className="p-3 bg-white/90 rounded-2xl border border-[#F0EBE6]">
                        <Typography variant="subtitle2" className="font-bold text-xs text-[#2D3142] flex items-center gap-1.5 mb-0.5">
                          <span>{s.icon}</span>
                          <span>{s.title}</span>
                        </Typography>
                        <Typography variant="body2" className="text-[11px] text-[#71788E] leading-relaxed">
                          {s.body}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  <Flex gap={2} className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      radius="pill"
                      onClick={onOpenChat}
                      className="bg-white border-[#FF7A7A] text-[#FF7A7A] font-bold text-xs py-2"
                    >
                      💬 Ask AI
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      radius="pill"
                      disabled={loading}
                      onClick={() => void handleSendDailySummary()}
                      className="bg-[#8C7AE6] hover:bg-[#7866D5] text-white font-bold text-xs py-2"
                    >
                      📧 Daily Digest
                    </Button>
                  </Flex>
                </Card>

                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0EBE6] shadow-xs">
                  <Flex justify="between" align="center" className="mb-3">
                    <Typography variant="h5" className="font-extrabold text-sm text-[#2D3142]">
                      🕒 Today&apos;s Timeline
                    </Typography>
                    <Badge variant="info" pill size="sm">
                      {entries.length} logged
                    </Badge>
                  </Flex>

                  {entries.length === 0 ? (
                    <Typography variant="body2" className="text-xs text-[#71788E] py-6 text-center">
                      No logs yet today. Use the buttons above to log feeding, sleep, or diaper changes!
                    </Typography>
                  ) : (
                    <List className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {entries.map((entry) => (
                        <ListItem
                          key={entry.id}
                          className="p-2.5 rounded-2xl bg-[#FBF7F2] border border-[#F0EBE6] flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#2D3142]">
                                {ENTRY_TYPE_LABELS[entry.type] || entry.type}
                              </span>
                              <span className="text-[11px] text-[#71788E]">
                                • {formatEntryTime(entry.startedAt)}
                              </span>
                            </div>
                            <Typography variant="caption" className="text-[11px] text-[#4A5568] block mt-0.5">
                              {formatEntrySubtitle(entry)}
                            </Typography>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={loading}
                            onClick={() => void handleDeleteEntry(entry.id)}
                            className="text-[#FF7A7A] hover:bg-[#FFF0F0] text-xs px-2"
                          >
                            ✕
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </div>

                {stats && (
                  <div className="p-4 bg-white rounded-3xl border border-[#F0EBE6] shadow-xs">
                    <Typography variant="caption" className="font-extrabold text-[11px] uppercase tracking-wider text-[#71788E] block mb-3 text-center">
                      7-Day Averages
                    </Typography>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-2xl bg-[#FFF8F0] border border-[#FFE8CC]">
                        <span className="text-[11px] text-[#71788E] block">Daily Feeds</span>
                        <span className="text-lg font-black text-[#FF7A7A]">{stats.averages.avgFeedsPerDay}</span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-[#F5F3FC] border border-[#E5E0FA]">
                        <span className="text-[11px] text-[#71788E] block">Sleep / Day</span>
                        <span className="text-lg font-black text-[#8C7AE6]">{stats.averages.avgSleepHoursPerDay}h</span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-[#EFFBF5] border border-[#BCEAD5]">
                        <span className="text-[11px] text-[#71788E] block">Bottle / Day</span>
                        <span className="text-lg font-black text-[#48C78E]">{stats.averages.avgBottleMlPerDay}ml</span>
                      </div>
                      <div className="p-2.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]">
                        <span className="text-[11px] text-[#71788E] block">Longest Sleep</span>
                        <span className="text-lg font-black text-[#3897F0]">
                          {Math.round((stats.averages.longestSleepMinutes / 60) * 10) / 10}h
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="pt-6">
          <div className="text-center mb-8">
            <Badge variant="primary" pill size="md" className="mb-2 font-bold">
              ✨ Premium Subscription
            </Badge>
            <Typography variant="h2" className="text-2xl sm:text-3xl font-black text-[#2D3142]">
              Simple, Family-Friendly Pricing
            </Typography>
            <Typography variant="body2" className="text-xs sm:text-sm text-[#71788E] max-w-lg mx-auto mt-1">
              One subscription unlocks unlimited AI and 7-day reports for your entire family across iOS, Android, and Web.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => {
              const isCurrent = user?.subscriptionPlan === plan.id && user?.isPremium;
              return (
                <Card
                  key={plan.id}
                  variant="elevated"
                  className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    plan.id === 'YEARLY'
                      ? 'bg-[#FFFDFB] border-2 border-[#FF7A7A] shadow-md'
                      : 'bg-white border-[#F0EBE6]'
                  }`}
                >
                  <div>
                    <Flex justify="between" align="center" className="mb-2">
                      <Badge
                        variant={plan.id === 'YEARLY' ? 'primary' : 'info'}
                        pill
                        size="sm"
                        className="font-bold"
                      >
                        {plan.badge}
                      </Badge>
                      {isCurrent && (
                        <Badge variant="success" pill size="sm">
                          Active Plan
                        </Badge>
                      )}
                    </Flex>

                    <Typography variant="h4" className="font-extrabold text-lg text-[#2D3142]">
                      {plan.title}
                    </Typography>

                    <Flex align="baseline" gap={1} className="my-2">
                      <Typography variant="h2" className="text-2xl font-black text-[#2D3142]">
                        {plan.price}
                      </Typography>
                      <Typography variant="caption" className="text-xs font-bold text-[#71788E]">
                        {plan.period}
                      </Typography>
                    </Flex>

                    <Typography variant="body2" className="text-xs text-[#71788E] leading-relaxed mb-4">
                      {plan.description}
                    </Typography>

                    <List className="space-y-1.5 mb-6">
                      <ListItem className="flex items-center gap-2 text-xs font-semibold text-[#2D3142]">
                        <CheckCircleIcon size={14} className="text-[#48C78E] shrink-0" />
                        <span>Unlimited DeepSeek AI Q&A</span>
                      </ListItem>
                      <ListItem className="flex items-center gap-2 text-xs font-semibold text-[#2D3142]">
                        <CheckCircleIcon size={14} className="text-[#48C78E] shrink-0" />
                        <span>Automated Daily AI Email Digest</span>
                      </ListItem>
                      <ListItem className="flex items-center gap-2 text-xs font-semibold text-[#2D3142]">
                        <CheckCircleIcon size={14} className="text-[#48C78E] shrink-0" />
                        <span>7-Day & 14-Day Sleep & Feeding Trends</span>
                      </ListItem>
                    </List>
                  </div>

                  <Button
                    variant={plan.id === 'YEARLY' ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    disabled={loading || Boolean(isCurrent)}
                    onClick={() => {
                      if (!token) {
                        setErrorMsg('Please sign in or create an account above first to activate Premium.');
                        return;
                      }
                      void handleUpgradeSubscription(plan.id);
                    }}
                    className={
                      plan.id === 'YEARLY'
                        ? 'bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold rounded-2xl py-2.5'
                        : 'border-[#FF7A7A] text-[#FF7A7A] font-bold rounded-2xl py-2.5'
                    }
                  >
                    {isCurrent
                      ? '✓ Current Active Plan'
                      : token
                        ? `Activate ${plan.title}`
                        : `Sign In to Get ${plan.title}`}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
