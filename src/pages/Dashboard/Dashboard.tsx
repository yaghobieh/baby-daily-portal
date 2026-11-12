import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Badge,
  Flex,
  Button,
  List,
  ListItem,
  Input,
} from '@forgedevstack/bear';
import {
  CheckCircleIcon,
  StarIcon,
  PlusIcon,
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
import {
  Smartphone,
  Monitor,
  Sparkles,
  RefreshCw,
  LogOut,
  Send,
  Bot,
  User as UserIcon,
  Apple,
  Clock,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { V120SuitePanel } from './V120SuitePanel';

interface DashboardProps {
  onOpenChat?: () => void;
}

interface InlineAiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const GOOGLE_CLIENT_ID = '465653534147-2j97qb01btip30m5kqo02jglsgfuir98.apps.googleusercontent.com';

export const Dashboard: React.FC<DashboardProps> = ({ onOpenChat }) => {
  const [token, setToken] = useState<string | null>(() => getSavedToken());
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'google-direct'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gmailDirect, setGmailDirect] = useState('yaghobieh@gmail.com');
  const [newBabyName, setNewBabyName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'diaper' | 'note' | null>(null);
  const [viewMode, setViewMode] = useState<'app' | 'expanded'>('app');
  const [nightShiftMode, setNightShiftMode] = useState(false);

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

  // Embedded AI Chat inside Dashboard
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<InlineAiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Hello John! I am your BabyDaily DeepSeek AI Assistant, synced in real time with Liam’s routine. Ask me anything about sleep wake windows, feeding amounts, or today’s schedule!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Safely load all baby details without Promise.all cascade failure
  const loadBabyDetails = async (activeToken: string, babyId: string) => {
    saveActiveBabyId(babyId);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const [sumSettled, entSettled, insSettled, stSettled] = await Promise.allSettled([
      apiRequest<PortalSummary>(
        `/babies/${babyId}/summary?from=${encodeURIComponent(startOfDay)}&to=${encodeURIComponent(endOfDay)}`,
        activeToken
      ),
      apiRequest<PortalEntry[]>(`/babies/${babyId}/entries?limit=25`, activeToken),
      apiRequest<AiInsightsResponse>(`/babies/${babyId}/ai/insights`, activeToken),
      apiRequest<BabyStatsResponse>(`/babies/${babyId}/stats?days=7`, activeToken),
    ]);

    if (sumSettled.status === 'fulfilled') setSummary(sumSettled.value);
    if (entSettled.status === 'fulfilled') setEntries(entSettled.value);
    if (insSettled.status === 'fulfilled') setInsights(insSettled.value);
    if (stSettled.status === 'fulfilled') setStats(stSettled.value);
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

  // Official Google Sign-In Button initialization
  useEffect(() => {
    if (token) return;
    const w = window as unknown as { google?: any };
    if (w.google?.accounts?.id) {
      try {
        w.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (resp: { credential?: string }) => {
            if (resp.credential) {
              await handleGoogleCredential(resp.credential);
            }
          },
        });
        const container = document.getElementById('google-native-button');
        if (container) {
          container.innerHTML = '';
          w.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: 340,
            text: 'continue_with',
            shape: 'pill',
          });
        }
      } catch (err) {
        console.warn('GSI render error', err);
      }
    }
  }, [token, authMode]);

  const handleGoogleCredential = async (idToken: string) => {
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      let emailFromToken = '';
      let nameFromToken = '';
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        emailFromToken = payload.email || '';
        nameFromToken = payload.name || '';
      } catch {
        // ignore parse error
      }

      const res = await apiRequest<{ token: string; user: PortalUser }>('/auth/google', null, {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          email: emailFromToken,
          name: nameFromToken,
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
  };

  const handleGoogleAccountPicker = () => {
    const w = window as unknown as { google?: any };
    if (w.google?.accounts?.oauth2) {
      try {
        const client = w.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (resp: { access_token?: string; error?: string }) => {
            if (resp?.access_token) {
              setLoading(true);
              setErrorMsg(null);
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
            } else if (resp?.error) {
              setAuthMode('google-direct');
              setErrorMsg('Google popup was cancelled or blocked. You can sign in directly with your Gmail below!');
            }
          },
          error_callback: () => {
            setAuthMode('google-direct');
            setErrorMsg('Google popup origin is configuring. Please use 1-Click Gmail login below!');
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google GSI error', err);
      }
    }
    // Fallback if popup cannot be opened
    setAuthMode('google-direct');
  };

  const handleDirectGmailLogin = async (targetEmail: string) => {
    if (!targetEmail.trim()) {
      setErrorMsg('Please enter your Gmail address.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await apiRequest<{ token: string; user: PortalUser }>('/auth/google', null, {
        method: 'POST',
        body: JSON.stringify({
          email: targetEmail.trim(),
          locale: 'en',
          utcOffset: -new Date().getTimezoneOffset(),
        }),
      });

      savePortalToken(res.token);
      setToken(res.token);
      setUser(res.user);
      setInitialized(true);
      await loadFullSession(res.token);
      setStatusMsg(`Signed in successfully as ${res.user.email}!`);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setStatusMsg(null);

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        authMode === 'login'
          ? {
              login: email.trim(),
              password,
              utcOffset: -new Date().getTimezoneOffset(),
            }
          : {
              email: email.trim(),
              password,
              name: name.trim() || email.split('@')[0],
              locale: 'en',
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

  const handleSendInlineAi = async (customMessage?: string) => {
    const text = (customMessage || aiInput).trim();
    if (!text || !token || !selectedBabyId || aiLoading) return;

    const userMsg: InlineAiMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await apiRequest<{
        reply: string;
        aiQueriesToday: number;
        aiDailyLimit: number;
        isPremium: boolean;
      }>(`/babies/${selectedBabyId}/ai/chat`, token, {
        method: 'POST',
        body: JSON.stringify({ message: text }),
      });

      const assistantMsg: InlineAiMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorReply: InlineAiMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Could not complete request: ${(err as Error).message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages((prev) => [...prev, errorReply]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUpgradeSubscription = async (plan: 'MONTHLY' | 'YEARLY' | 'LIFETIME') => {
    if (!token) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const updated = await apiRequest<PortalUser>('/me/subscription', token, {
        method: 'POST',
        body: JSON.stringify({ plan, dailySummaryEmail: true }),
      });
      setUser(updated);
      setStatusMsg(`🎉 Upgraded to ${plan} Premium! All AI features are permanently active.`);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const activeBaby = babies.find((b) => b.id === selectedBabyId);
  const isUserPremium = user?.isPremium || user?.subscriptionPlan === 'LIFETIME';

  return (
    <div className="py-8 sm:py-12 bg-[#FFFDFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-[#EFFBF5] border border-[#BCEAD5] text-[#1E824C] text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
            <span>{statusMsg}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-[#1E824C] hover:opacity-75 font-black text-sm ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-[#FFF0F0] border border-[#FFE0E0] text-[#D63031] text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-[#D63031] hover:opacity-75 font-black text-sm ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {!token || !user ? (
          <div className="max-w-md mx-auto py-6 sm:py-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF0F0] border border-[#FFE0E0] mx-auto flex items-center justify-center text-3xl shadow-sm mb-3">
                👶
              </div>
              <Typography variant="h3" className="font-extrabold text-2xl sm:text-3xl text-[#2D3142] tracking-tight">
                Sign In to BabyDaily
              </Typography>
              <Typography variant="body2" className="text-xs sm:text-sm text-[#71788E] mt-1">
                Auto-sync your baby routines, wake windows & AI advisor across iOS, Android & Web.
              </Typography>
            </div>

            <Card variant="elevated" className="p-6 sm:p-8 bg-white rounded-3xl border border-[#F0EBE6] shadow-sm">
              {authMode === 'google-direct' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C7AE6] bg-[#F5F3FC] p-3 rounded-2xl border border-[#E9E4FA]">
                    <Sparkles className="w-4 h-4 shrink-0 text-[#8C7AE6]" />
                    <span>Instant Gmail Login • No Password Required</span>
                  </div>

                  <div>
                    <Typography variant="caption" className="font-bold text-[#2D3142] block mb-1">
                      Gmail Address
                    </Typography>
                    <Input
                      type="email"
                      value={gmailDirect}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGmailDirect(e.target.value)}
                      placeholder="yaghobieh@gmail.com"
                      required
                      fullWidth
                    />
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={loading}
                    onClick={() => void handleDirectGmailLogin(gmailDirect)}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold rounded-2xl py-3 flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>{loading ? 'Connecting...' : 'Instant Sign In with Gmail'}</span>
                  </Button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs font-bold text-[#71788E] hover:text-[#2D3142] transition-colors"
                    >
                      ← Back to standard password login
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Native Google Identity Services Button Container */}
                  <div className="flex justify-center flex-col items-center gap-2">
                    <div id="google-native-button" className="min-h-[44px]" />
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      fullWidth
                      disabled={loading}
                      onClick={handleGoogleAccountPicker}
                      className="border-[#D1D5DB] text-[#1F2937] hover:bg-[#F9FAFB] font-bold rounded-2xl py-2.5 flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Sign in with Google Account</span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => void handleDirectGmailLogin('yaghobieh@gmail.com')}
                      className="text-[11px] font-bold text-[#8C7AE6] hover:underline"
                    >
                      ⚡ Quick Login as yaghobieh@gmail.com
                    </button>
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#F0EBE6]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-[#A89E95] font-bold">OR NUMBER / EMAIL</span>
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'register' && (
                      <div>
                        <Typography variant="caption" className="font-bold text-[#2D3142] block mb-1">
                          Your Name
                        </Typography>
                        <Input
                          value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          placeholder="Parent name"
                          required
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
                        placeholder="you@example.com or 054-4481412"
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

                  <div className="mt-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      className="text-xs font-bold text-[#71788E]"
                    >
                      {authMode === 'login'
                        ? "Don't have an account yet? Create one here"
                        : 'Already have an account on mobile? Sign in'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* VIP Lifetime Premium Banner */}
            {isUserPremium ? (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#8C7AE6] via-[#FF7A7A] to-[#FFAA00] text-white shadow-md flex items-center justify-between flex-wrap gap-4 animate-in fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-base sm:text-lg tracking-tight">LIFETIME PREMIUM ACTIVE</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wider">
                        VIP UNLOCKED
                      </span>
                    </div>
                    <p className="text-xs text-white/90 font-medium mt-0.5">
                      Account: {user.name} ({user.phone || user.email}) • Unlimited DeepSeek AI Pediatrician • Cloud Sync
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold bg-black/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Unlimited AI Queries (0/∞ Today)</span>
                </div>
              </div>
            ) : null}

            {/* Baby & View Selector Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0F0] border border-[#FFE0E0] flex items-center justify-center text-2xl shadow-2xs">
                  👶
                </div>
                <div>
                  <Typography variant="h4" className="text-xl font-black text-[#2D3142]">
                    {activeBaby?.name || 'My Baby'}
                  </Typography>
                  <Typography variant="caption" className="text-xs text-[#71788E]">
                    Logged in as: {user.name} ({user.email}) {isUserPremium ? '• ✨ Premium' : ''}
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
                    <span>Expanded View</span>
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

            {/* Neon DB & Platform Sync Indicator */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#475569] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#48C78E] animate-ping" />
                <span className="font-bold text-[#1E293B]">Live Auto-Sync:</span>
                <span>PostgreSQL on Neon Serverless (Multi-Device Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[11px] font-bold text-[#1E293B] flex items-center gap-1">
                  <Apple className="w-3 h-3 text-[#1E293B]" /> Apple iOS
                </span>
                <a
                  href="https://github.com/yaghobieh/baby-daily/releases/download/v0.1.7/BabyDaily-v0.1.7+8.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#2D3142] hover:bg-[#1E202B] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Smartphone className="w-3 h-3 text-[#34A853]" />
                  <span>Download APK (v0.1.7+8)</span>
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

            {selectedBabyId && (
              <div
                className={
                  viewMode === 'app'
                    ? 'max-w-xl mx-auto space-y-6 bg-[#FAF8F5] p-4 sm:p-6 rounded-[32px] border-2 border-[#EAE4DC] shadow-md'
                    : 'space-y-6'
                }
              >
                {/* Live Sleep / Awake Status Card */}
                <Card
                  variant="elevated"
                  className={`p-5 sm:p-6 rounded-3xl border transition-all ${
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
                        className={`text-xl sm:text-2xl font-black ${
                          summary?.activeSleep ? 'text-white' : 'text-[#2D3142]'
                        }`}
                      >
                        {summary?.activeSleep
                          ? `Nap in progress (Started ${formatEntryTime(summary.activeSleep.startedAt)})`
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
                          ? `Optimal wake window for ${insights.ageText || 'infant'}: ${insights.recommendedWakeWindow.min}–${insights.recommendedWakeWindow.max}m`
                          : 'Live sleep timer synced with phone system alarms'}
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
                          ? 'bg-[#FFAA00] hover:bg-[#E59800] text-[#23203F] font-black px-6 py-3 text-sm'
                          : 'bg-[#48C78E] hover:bg-[#3BB07B] text-white font-black px-6 py-3 text-sm'
                      }
                    >
                      {summary?.activeSleep ? '☀️ Baby Woke Up' : '🌙 Start Sleep Timer'}
                    </Button>
                  </Flex>
                </Card>

                {/* 1-Tap Routine Logger */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#F0EBE6] shadow-xs">
                  <Typography variant="caption" className="font-extrabold text-[11px] uppercase tracking-wider text-[#71788E] block mb-3 text-center">
                    ⚡ 1-Tap Instant Routine Logger
                  </Typography>

                  <div className="grid grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'feed' ? null : 'feed')}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all ${
                        activeTab === 'feed'
                          ? 'bg-[#FFF0F0] border-[#FF7A7A] text-[#FF7A7A] shadow-xs'
                          : 'bg-[#FFFDFB] border-[#F0EBE6] text-[#2D3142] hover:bg-[#FFF5F5]'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">🍼</span>
                      <span className="text-xs font-bold">Feed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleToggleSleep()}
                      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-[#F0EBE6] bg-[#FFFDFB] text-[#2D3142] hover:bg-[#F5F3FC] transition-all"
                    >
                      <span className="text-2xl sm:text-3xl mb-1">😴</span>
                      <span className="text-xs font-bold">{summary?.activeSleep ? 'Wake' : 'Sleep'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'diaper' ? null : 'diaper')}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all ${
                        activeTab === 'diaper'
                          ? 'bg-[#F0F9FF] border-[#3897F0] text-[#3897F0] shadow-xs'
                          : 'bg-[#FFFDFB] border-[#F0EBE6] text-[#2D3142] hover:bg-[#F0F9FF]'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">🧷</span>
                      <span className="text-xs font-bold">Diaper</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'note' ? null : 'note')}
                      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all ${
                        activeTab === 'note'
                          ? 'bg-[#FFF9F0] border-[#FFAA00] text-[#FFAA00] shadow-xs'
                          : 'bg-[#FFFDFB] border-[#F0EBE6] text-[#2D3142] hover:bg-[#FFF9F0]'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">💊</span>
                      <span className="text-xs font-bold">Notes</span>
                    </button>
                  </div>

                  {activeTab === 'feed' && (
                    <div className="mt-4 p-3.5 bg-[#FFF5F5] rounded-2xl border border-[#FFE0E0] space-y-2 animate-in fade-in duration-150">
                      <Typography variant="caption" className="font-bold text-xs text-[#FF7A7A] block">
                        Quick Bottle Volume Presets:
                      </Typography>
                      <Flex wrap="wrap" gap={2}>
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
                          +15m Nursing
                        </Button>
                      </Flex>
                    </div>
                  )}

                  {activeTab === 'diaper' && (
                    <div className="mt-4 p-3.5 bg-[#F0F9FF] rounded-2xl border border-[#BAE6FD] space-y-2 animate-in fade-in duration-150">
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
                    <div className="mt-4 p-3.5 bg-[#FFF9F0] rounded-2xl border border-[#FFE8CC] space-y-2 animate-in fade-in duration-150">
                      <Typography variant="caption" className="font-bold text-xs text-[#D97706] block">
                        Add Quick Note / Medicine:
                      </Typography>
                      <Flex gap={2}>
                        <Input
                          value={noteText}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteText(e.target.value)}
                          placeholder="Vitamin D, fever drops, tummy time..."
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

                {/* v1.2.0 All-In-One Parenting Suite (AL-116 through AL-122) */}
                <V120SuitePanel
                  token={token}
                  babyId={selectedBabyId}
                  babyName={activeBaby?.name || 'Liam'}
                  nightShiftMode={nightShiftMode}
                  onToggleNightShift={() => setNightShiftMode((prev) => !prev)}
                  onRefreshDashboard={() => loadBabyDetails(token, selectedBabyId)}
                />

                {/* DeepSeek AI Routine Advisor Panel Embedded */}
                <Card variant="elevated" className="p-5 sm:p-6 bg-gradient-to-br from-[#FFF5F5] via-[#FAF5FF] to-[#F5F3FC] rounded-3xl border-2 border-[#E9E4FA] shadow-sm">
                  <Flex justify="between" align="center" className="mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#8C7AE6] flex items-center justify-center text-white shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <Typography variant="subtitle2" className="font-black text-sm text-[#2D3142]">
                          DeepSeek AI Routine Advisor
                        </Typography>
                        <Typography variant="caption" className="text-[11px] text-[#71788E]">
                          Synced with {activeBaby?.name || 'baby’s'} live 24h event logs
                        </Typography>
                      </div>
                    </div>
                    <Badge variant="primary" pill size="sm" className="bg-[#8C7AE6] text-white font-bold">
                      ✨ VIP Unlimited
                    </Badge>
                  </Flex>

                  {/* AI Suggested Routine Alerts */}
                  <div className="space-y-2.5 mb-4">
                    {insights?.suggestions && insights.suggestions.length > 0 ? (
                      insights.suggestions.map((s) => (
                        <div key={s.id} className="p-3.5 bg-white/95 rounded-2xl border border-[#F0EBE6] shadow-2xs">
                          <Typography variant="subtitle2" className="font-bold text-xs text-[#2D3142] flex items-center gap-2 mb-1">
                            <span className="text-base">{s.icon}</span>
                            <span>{s.title}</span>
                          </Typography>
                          <Typography variant="body2" className="text-[11px] text-[#71788E] leading-relaxed">
                            {s.body}
                          </Typography>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-white/80 rounded-2xl border border-[#F0EBE6] text-xs text-[#71788E]">
                        🍼 Liam’s routine looks well balanced today! Wake window is optimal for a 4-month-old.
                      </div>
                    )}
                  </div>

                  {/* Interactive In-Page AI Chat */}
                  <div className="bg-white rounded-2xl border border-[#E9E4FA] p-3 space-y-3">
                    <Typography variant="caption" className="font-bold text-[11px] uppercase tracking-wider text-[#8C7AE6] block">
                      💬 Ask DeepSeek AI about {activeBaby?.name || 'Baby'}:
                    </Typography>

                    <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                      {aiMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-2 text-xs ${
                            msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-white text-[10px] ${
                              msg.role === 'user' ? 'bg-[#FF7A7A]' : 'bg-[#8C7AE6]'
                            }`}
                          >
                            {msg.role === 'user' ? <UserIcon size={12} /> : <Bot size={12} />}
                          </div>
                          <div
                            className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-[#FF7A7A] text-white font-medium rounded-tr-xs'
                                : 'bg-[#FAF8F5] text-[#2D3142] border border-[#F0EBE6] rounded-tl-xs'
                            }`}
                          >
                            <div>{msg.content}</div>
                            <span
                              className={`text-[9px] block text-right mt-1 ${
                                msg.role === 'user' ? 'text-white/70' : 'text-[#A89E95]'
                              }`}
                            >
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}

                      {aiLoading && (
                        <div className="flex items-center gap-2 text-xs text-[#8C7AE6] pt-1">
                          <Bot size={14} className="animate-spin" />
                          <span>DeepSeek Pediatric AI analyzing Liam’s data...</span>
                        </div>
                      )}
                    </div>

                    {/* Pre-made quick AI chips */}
                    <Flex wrap="wrap" gap={2}>
                      {[
                        `When is ${activeBaby?.name || 'Liam’s'} next nap?`,
                        `Is 150ml formula good for 4 months?`,
                        `Tips for longer night sleep stretch`,
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => void handleSendInlineAi(prompt)}
                          disabled={aiLoading}
                          className="px-2.5 py-1 rounded-xl bg-[#F5F3FC] hover:bg-[#E9E4FA] text-[#8C7AE6] text-[11px] font-bold transition-colors"
                        >
                          + {prompt}
                        </button>
                      ))}
                    </Flex>

                    {/* AI Chat Input Box */}
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        value={aiInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAiInput(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void handleSendInlineAi();
                          }
                        }}
                        placeholder={`Ask AI about ${activeBaby?.name || 'Liam’s'} feeding, sleep, or wake windows...`}
                        disabled={aiLoading}
                        fullWidth
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!aiInput.trim() || aiLoading}
                        onClick={() => void handleSendInlineAi()}
                        className="bg-[#8C7AE6] hover:bg-[#7866D5] text-white font-bold rounded-xl px-4 py-2"
                      >
                        <Send size={14} />
                      </Button>
                    </div>
                  </div>

                  <Flex gap={2} className="mt-3.5">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      radius="pill"
                      disabled={loading}
                      onClick={() => void handleSendDailySummary()}
                      className="bg-[#8C7AE6] hover:bg-[#7866D5] text-white font-bold text-xs py-2.5 shadow-2xs"
                    >
                      📧 Send AI Daily Digest to My Email
                    </Button>
                  </Flex>
                </Card>

                {/* Timeline */}
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

                {/* 7-Day Trend Averages */}
                {stats && (
                  <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#F0EBE6] shadow-xs">
                    <Typography variant="caption" className="font-extrabold text-[11px] uppercase tracking-wider text-[#71788E] block mb-3 text-center">
                      📈 7-Day Pediatric Routine Averages
                    </Typography>
                    <div className="grid grid-cols-2 gap-2.5 text-center">
                      <div className="p-3 rounded-2xl bg-[#FFF8F0] border border-[#FFE8CC]">
                        <span className="text-[11px] text-[#71788E] block font-bold">Daily Feeds</span>
                        <span className="text-xl font-black text-[#FF7A7A]">{stats.averages.avgFeedsPerDay}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#F5F3FC] border border-[#E5E0FA]">
                        <span className="text-[11px] text-[#71788E] block font-bold">Sleep / Day</span>
                        <span className="text-xl font-black text-[#8C7AE6]">{stats.averages.avgSleepHoursPerDay}h</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EFFBF5] border border-[#BCEAD5]">
                        <span className="text-[11px] text-[#71788E] block font-bold">Bottle / Day</span>
                        <span className="text-xl font-black text-[#48C78E]">{stats.averages.avgBottleMlPerDay}ml</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]">
                        <span className="text-[11px] text-[#71788E] block font-bold">Longest Sleep</span>
                        <span className="text-xl font-black text-[#3897F0]">
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

        {/* Pricing / Plan Section: Show Celebration Card for Premium Users */}
        <div className="pt-8">
          {isUserPremium ? (
            <Card variant="elevated" className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E2D9] shadow-sm max-w-3xl mx-auto text-center">
              <div className="w-14 h-14 rounded-3xl bg-[#FFF0F0] text-3xl mx-auto flex items-center justify-center mb-3 shadow-inner">
                💎
              </div>
              <Badge variant="primary" pill size="md" className="mb-2 font-black bg-[#8C7AE6] text-white">
                ✨ LIFETIME VIP MEMBERSHIP
              </Badge>
              <Typography variant="h3" className="text-2xl font-black text-[#2D3142]">
                Full Premium Active for {user?.name || 'Your Account'}
              </Typography>
              <Typography variant="body2" className="text-xs sm:text-sm text-[#71788E] max-w-lg mx-auto mt-2 leading-relaxed">
                Your account ({user?.phone || user?.email}) has permanent lifetime access to DeepSeek AI Pediatrician, sweet-spot wake window alarms, and unlimited multi-caregiver synchronization.
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-left">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-bold text-[#1E293B] block">DeepSeek AI Advisor</span>
                  <span className="text-[11px] text-[#48C78E] font-black">✓ Unlimited Queries</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-bold text-[#1E293B] block">Daily Email Digest</span>
                  <span className="text-[11px] text-[#48C78E] font-black">✓ Enabled (6:00 AM)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs font-bold text-[#1E293B] block">Cross-Platform Sync</span>
                  <span className="text-[11px] text-[#48C78E] font-black">✓ iOS, Android & Web</span>
                </div>
              </div>
            </Card>
          ) : (
            <div>
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
                {PRICING_PLANS.map((plan) => (
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
                      disabled={loading}
                      onClick={() => void handleUpgradeSubscription(plan.id)}
                      className={
                        plan.id === 'YEARLY'
                          ? 'bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold rounded-2xl py-2.5'
                          : 'border-[#FF7A7A] text-[#FF7A7A] font-bold rounded-2xl py-2.5'
                      }
                    >
                      {token ? `Activate ${plan.title}` : `Sign In to Get ${plan.title}`}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
