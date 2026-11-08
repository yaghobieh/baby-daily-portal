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
      const payload =
        authMode === 'login'
          ? { email, password, utcOffset: -new Date().getTimezoneOffset() }
          : { email, password, name: name || 'Parent', utcOffset: -new Date().getTimezoneOffset() };

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
    setStatusMsg(null);
    try {
      await apiRequest(`/babies/${selectedBabyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type,
          startedAt: new Date().toISOString(),
          ...(endedAt !== undefined ? { endedAt } : {}),
          data,
        }),
      });
      setStatusMsg(`Logged ${type} entry and synced with mobile app!`);
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
        setStatusMsg('Live sleep timer started! Synced across all devices.');
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
      setStatusMsg('Entry deleted.');
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
        `✨ AI Summary generated & sent to your notifications${res.emailSent ? ' and email' : ''}: "${res.summary}"`
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

  return (
    <div className="py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <Flex justify="center" align="center" gap={2} className="mb-3">
            <Chip
              variant="soft"
              color="primary"
              size="md"
              icon={<StarIcon size={16} />}
              className="px-4 py-1.5 font-bold bg-[#FFF0F0] text-[#FF7A7A] border border-[#FFE0E0]"
            >
              <Typography variant="caption" className="font-bold text-[#FF7A7A]">
                Unified Web & Mobile Baby Companion
              </Typography>
            </Chip>
          </Flex>
          <Typography variant="h1" className="text-3xl sm:text-5xl font-black text-[#2D3142] tracking-tight mb-3">
            BabyDaily Web Dashboard & AI
          </Typography>
          <Typography variant="body1" className="text-base sm:text-lg text-[#71788E] max-w-2xl mx-auto">
            Sign in with the same account you use on the BabyDaily mobile app. Manage feedings, live sleep timers, AI insights, and 7-day statistics from any device.
          </Typography>
        </div>

        {errorMsg && (
          <Card variant="outlined" className="p-4 bg-[#FFF0F0] border-[#FF7A7A] rounded-2xl">
            <Typography variant="body2" className="text-[#D63031] font-bold">
              {errorMsg}
            </Typography>
          </Card>
        )}

        {statusMsg && (
          <Card variant="outlined" className="p-4 bg-[#EFFBF5] border-[#48C78E] rounded-2xl">
            <Typography variant="body2" className="text-[#1E824C] font-bold">
              {statusMsg}
            </Typography>
          </Card>
        )}

        {!token || !user ? (
          <div className="max-w-md mx-auto">
            <Card variant="elevated" className="p-6 sm:p-8 bg-white rounded-3xl border border-[#F0EBE6]">
              <Flex justify="between" align="center" className="mb-6">
                <Typography variant="h4" className="text-xl font-extrabold text-[#2D3142]">
                  {authMode === 'login' ? 'Sign In to Your Family Account' : 'Create Your BabyDaily Account'}
                </Typography>
                <Badge variant="primary" pill size="sm">
                  Synced with App
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
                    Email Address
                  </Typography>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="you@example.com"
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
                  className="bg-[#FF7A7A] hover:bg-[#E86262] text-white font-bold rounded-2xl py-3"
                >
                  {loading
                    ? 'Connecting to BabyDaily Cloud...'
                    : authMode === 'login'
                      ? 'Sign In & Sync Baby Data'
                      : 'Create Account & Start Tracking'}
                </Button>
              </form>

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
          <div className="space-y-8">
            <Card variant="elevated" className="p-6 bg-white rounded-3xl border border-[#F0EBE6]">
              <Flex justify="between" align="center" wrap="wrap" gap={4}>
                <div>
                  <Flex align="center" gap={3} wrap="wrap">
                    <Typography variant="h4" className="text-xl font-extrabold text-[#2D3142]">
                      Hello, {user.name}
                    </Typography>
                    <Badge
                      variant={user.isPremium ? 'success' : 'warning'}
                      pill
                      size="md"
                      className="font-bold"
                    >
                      {user.isPremium
                        ? `✨ PREMIUM (${user.subscriptionPlan})`
                        : `FREE TIER • ${insights?.quota.aiQueriesToday ?? user.aiQueriesToday}/3 AI Uses Today`}
                    </Badge>
                  </Flex>
                  <Typography variant="body2" className="text-xs text-[#71788E] mt-1">
                    Signed in as {user.email} • Shared in real time with your BabyDaily mobile app
                  </Typography>
                </div>

                <Flex align="center" gap={2} wrap="wrap">
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

                  <Button
                    variant="outline"
                    size="sm"
                    radius="pill"
                    icon={<ClockIcon size={14} />}
                    onClick={() => selectedBabyId && void loadBabyDetails(token, selectedBabyId)}
                  >
                    Refresh
                  </Button>

                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#71788E]">
                    Sign Out
                  </Button>
                </Flex>
              </Flex>

              {babies.length === 0 && (
                <div className="mt-6 pt-6 border-t border-[#F0EBE6]">
                  <Typography variant="subtitle1" className="font-bold text-[#2D3142] mb-2">
                    Add Your Baby Profile
                  </Typography>
                  <Flex gap={3} wrap="wrap">
                    <Input
                      value={newBabyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBabyName(e.target.value)}
                      placeholder="Baby's name (e.g. Liam)"
                    />
                    <Button
                      variant="primary"
                      icon={<PlusIcon size={16} />}
                      onClick={() => void handleCreateBaby()}
                      className="bg-[#FF7A7A] text-white font-bold"
                    >
                      Add Baby
                    </Button>
                  </Flex>
                </div>
              )}
            </Card>

            {selectedBabyId && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card
                    variant="elevated"
                    className={`p-6 rounded-3xl border ${
                      summary?.activeSleep
                        ? 'bg-[#23203F] text-white border-[#3B3568]'
                        : 'bg-[#EFFBF5] text-[#2D3142] border-[#BCEAD5]'
                    }`}
                  >
                    <Flex justify="between" align="center" wrap="wrap" gap={4}>
                      <div>
                        <Badge
                          variant={summary?.activeSleep ? 'primary' : 'success'}
                          pill
                          size="sm"
                          className="mb-2"
                        >
                          {summary?.activeSleep ? '🌙 SLEEPING NOW' : '☀️ AWAKE NOW'}
                        </Badge>
                        <Typography
                          variant="h3"
                          className={`text-2xl font-black ${
                            summary?.activeSleep ? 'text-white' : 'text-[#2D3142]'
                          }`}
                        >
                          {summary?.activeSleep
                            ? `Started nap at ${formatEntryTime(summary.activeSleep.startedAt)}`
                            : insights?.awakeMinutes !== null && insights?.awakeMinutes !== undefined
                              ? `Awake for ${insights.awakeMinutes} minutes`
                              : 'Ready to track sleep & wake windows'}
                        </Typography>
                        <Typography
                          variant="body2"
                          className={`text-xs mt-1 ${
                            summary?.activeSleep ? 'text-white/80' : 'text-[#4A5568]'
                          }`}
                        >
                          {insights?.ageText
                            ? `${insights.babyName} • ${insights.ageText} • Optimal wake window: ${insights.recommendedWakeWindow.min}–${insights.recommendedWakeWindow.max}m`
                            : 'Live sleep status synced between Web & Mobile'}
                        </Typography>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        radius="pill"
                        disabled={loading}
                        onClick={() => void handleToggleSleep()}
                        className={
                          summary?.activeSleep
                            ? 'bg-[#FFAA00] hover:bg-[#E59800] text-[#23203F] font-extrabold px-6'
                            : 'bg-[#48C78E] hover:bg-[#3BB07B] text-white font-extrabold px-6'
                        }
                      >
                        {summary?.activeSleep ? '☀️ Baby Woke Up' : '🌙 Start Sleep Timer'}
                      </Button>
                    </Flex>
                  </Card>

                  <Card variant="elevated" className="p-6 bg-white rounded-3xl border border-[#F0EBE6]">
                    <Typography variant="h5" className="font-extrabold text-lg text-[#2D3142] mb-3">
                      ⚡ 1-Tap Web Routine Logger
                    </Typography>
                    <div className="space-y-3">
                      <Flex align="center" gap={2} wrap="wrap">
                        <Typography variant="caption" className="font-bold text-[#71788E] w-20">
                          🍼 Feeding:
                        </Typography>
                        {QUICK_BOTTLE_AMOUNTS.map((ml) => (
                          <Button
                            key={ml}
                            variant="outline"
                            size="sm"
                            radius="pill"
                            disabled={loading}
                            onClick={() => void handleLogEntry('FEED', { kind: 'bottle', amountMl: ml })}
                            className="border-[#FFE0E0] text-[#FF7A7A] font-bold"
                          >
                            +{ml}ml Bottle
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          radius="pill"
                          disabled={loading}
                          onClick={() =>
                            void handleLogEntry('FEED', { kind: 'breast', side: 'both', durationMin: 15 })
                          }
                          className="border-[#FFE0E0] text-[#FF7A7A] font-bold"
                        >
                          +15m Nursing
                        </Button>
                      </Flex>

                      <Flex align="center" gap={2} wrap="wrap">
                        <Typography variant="caption" className="font-bold text-[#71788E] w-20">
                          🧷 Diaper:
                        </Typography>
                        {(['wet', 'dirty', 'both'] as const).map((kind) => (
                          <Button
                            key={kind}
                            variant="outline"
                            size="sm"
                            radius="pill"
                            disabled={loading}
                            onClick={() => void handleLogEntry('DIAPER', { kind })}
                            className="border-[#E0F2FE] text-[#3897F0] font-bold capitalize"
                          >
                            + {kind}
                          </Button>
                        ))}
                      </Flex>

                      <Flex align="center" gap={2} wrap="wrap">
                        <Input
                          value={noteText}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteText(e.target.value)}
                          placeholder="Add a quick note (e.g. took Vitamin D, happy mood)..."
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          radius="pill"
                          disabled={loading || !noteText.trim()}
                          onClick={() => {
                            void handleLogEntry('NOTE', { text: noteText.trim() });
                            setNoteText('');
                          }}
                        >
                          Save Note
                        </Button>
                      </Flex>
                    </div>
                  </Card>
                </div>

                <Card
                  variant="elevated"
                  className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF5F5] via-[#F5F3FC] to-[#EFFBF5] rounded-3xl border border-[#FFE0E0]"
                >
                  <Flex justify="between" align="center" wrap="wrap" gap={4} className="mb-5">
                    <div>
                      <Flex align="center" gap={2}>
                        <Badge variant="primary" pill size="sm">
                          ✨ LIVE AI ADVISOR
                        </Badge>
                        <Typography variant="h4" className="font-extrabold text-xl text-[#2D3142]">
                          Smart Routine Suggestions & Daily Digest
                        </Typography>
                      </Flex>
                      <Typography variant="body2" className="text-xs text-[#71788E] mt-1">
                        Powered by DeepSeek AI using {insights?.babyName || 'your baby'}&apos;s real-time logs
                      </Typography>
                    </div>

                    <Flex gap={2} wrap="wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        radius="pill"
                        icon={<StarIcon size={15} />}
                        onClick={onOpenChat}
                        className="bg-white border-[#FF7A7A] text-[#FF7A7A] font-bold"
                      >
                        Ask AI About Today
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        radius="pill"
                        disabled={loading}
                        onClick={() => void handleSendDailySummary()}
                        className="bg-[#8C7AE6] hover:bg-[#7866D5] text-white font-bold"
                      >
                        📧 Email & Notify Daily AI Summary
                      </Button>
                    </Flex>
                  </Flex>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(insights?.suggestions ?? []).map((s) => (
                      <Card key={s.id} variant="outlined" className="p-4 bg-white rounded-2xl border-[#F0EBE6]">
                        <Flex align="center" gap={2} className="mb-1.5">
                          <Typography variant="h5" className="text-xl">
                            {s.icon}
                          </Typography>
                          <Typography variant="subtitle2" className="font-extrabold text-sm text-[#2D3142]">
                            {s.title}
                          </Typography>
                        </Flex>
                        <Typography variant="body2" className="text-xs text-[#71788E] leading-relaxed">
                          {s.body}
                        </Typography>
                      </Card>
                    ))}
                  </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card variant="elevated" className="p-6 bg-white rounded-3xl border border-[#F0EBE6]">
                    <Flex justify="between" align="center" className="mb-4">
                      <div>
                        <Typography variant="h5" className="font-extrabold text-lg text-[#2D3142]">
                          📊 7-Day Routine Analytics
                        </Typography>
                        <Typography variant="caption" className="text-xs text-[#71788E]">
                          Weekly averages & daily breakdown
                        </Typography>
                      </div>
                      <Badge variant="success" pill size="sm">
                        Premium Stats
                      </Badge>
                    </Flex>

                    {stats && (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                          <Card variant="outlined" className="p-3 bg-[#FFF8F0] rounded-2xl border-[#FFE8CC]">
                            <Typography variant="caption" className="text-[11px] font-bold text-[#71788E] block">
                              Avg Feeds / Day
                            </Typography>
                            <Typography variant="h5" className="font-black text-lg text-[#FF7A7A]">
                              {stats.averages.avgFeedsPerDay}
                            </Typography>
                          </Card>
                          <Card variant="outlined" className="p-3 bg-[#F5F3FC] rounded-2xl border-[#E5E0FA]">
                            <Typography variant="caption" className="text-[11px] font-bold text-[#71788E] block">
                              Avg Sleep / Day
                            </Typography>
                            <Typography variant="h5" className="font-black text-lg text-[#8C7AE6]">
                              {stats.averages.avgSleepHoursPerDay}h
                            </Typography>
                          </Card>
                          <Card variant="outlined" className="p-3 bg-[#EFFBF5] rounded-2xl border-[#BCEAD5]">
                            <Typography variant="caption" className="text-[11px] font-bold text-[#71788E] block">
                              Avg Bottle / Day
                            </Typography>
                            <Typography variant="h5" className="font-black text-lg text-[#48C78E]">
                              {stats.averages.avgBottleMlPerDay} ml
                            </Typography>
                          </Card>
                          <Card variant="outlined" className="p-3 bg-[#F0F9FF] rounded-2xl border-[#BAE6FD]">
                            <Typography variant="caption" className="text-[11px] font-bold text-[#71788E] block">
                              Longest Sleep
                            </Typography>
                            <Typography variant="h5" className="font-black text-lg text-[#3897F0]">
                              {Math.round((stats.averages.longestSleepMinutes / 60) * 10) / 10}h
                            </Typography>
                          </Card>
                        </div>

                        <List className="space-y-2">
                          {stats.daily.map((d) => (
                            <ListItem
                              key={d.date}
                              className="p-2.5 rounded-xl bg-[#FBF7F2] border border-[#F0EBE6] flex items-center justify-between"
                            >
                              <Typography variant="body2" className="font-bold text-xs text-[#2D3142]">
                                {d.date}
                              </Typography>
                              <Flex gap={3} align="center">
                                <Badge variant="warning" size="sm" pill>
                                  🍼 {d.feedsCount} ({d.bottleMl}ml)
                                </Badge>
                                <Badge variant="primary" size="sm" pill>
                                  😴 {d.sleepHours}h
                                </Badge>
                                <Badge variant="info" size="sm" pill>
                                  🧷 {d.diapersTotal}
                                </Badge>
                              </Flex>
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Card>

                  <Card variant="elevated" className="p-6 bg-white rounded-3xl border border-[#F0EBE6]">
                    <Flex justify="between" align="center" className="mb-4">
                      <div>
                        <Typography variant="h5" className="font-extrabold text-lg text-[#2D3142]">
                          🕒 Recent Routine Timeline
                        </Typography>
                        <Typography variant="caption" className="text-xs text-[#71788E]">
                          Synced with mobile app • Click trash icon to delete
                        </Typography>
                      </div>
                      <Badge variant="info" pill size="sm">
                        {entries.length} entries
                      </Badge>
                    </Flex>

                    {entries.length === 0 ? (
                      <Typography variant="body2" className="text-sm text-[#71788E] py-8 text-center">
                        No entries logged yet today. Use the 1-Tap Logger above!
                      </Typography>
                    ) : (
                      <List className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {entries.map((entry) => (
                          <ListItem
                            key={entry.id}
                            className="p-3 rounded-2xl bg-[#FFFDFB] border border-[#F0EBE6] flex items-center justify-between"
                          >
                            <div>
                              <Flex align="center" gap={2}>
                                <Typography variant="subtitle2" className="font-bold text-xs text-[#2D3142]">
                                  {ENTRY_TYPE_LABELS[entry.type] || entry.type}
                                </Typography>
                                <Typography variant="caption" className="text-[11px] text-[#71788E]">
                                  {formatEntryTime(entry.startedAt)}
                                </Typography>
                              </Flex>
                              <Typography variant="body2" className="text-xs text-[#4A5568] mt-0.5">
                                {formatEntrySubtitle(entry)}
                              </Typography>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={loading}
                              onClick={() => void handleDeleteEntry(entry.id)}
                              className="text-[#FF7A7A] hover:bg-[#FFF0F0]"
                            >
                              🗑 Delete
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Card>
                </div>
              </>
            )}
          </div>
        )}

        <div className="pt-4">
          <div className="text-center mb-8">
            <Badge variant="primary" pill size="md" className="mb-2">
              ✨ BabyDaily Premium Pricing
            </Badge>
            <Typography variant="h2" className="text-2xl sm:text-4xl font-black text-[#2D3142]">
              Simple, Family-Friendly Plans
            </Typography>
            <Typography variant="body2" className="text-sm text-[#71788E] max-w-xl mx-auto mt-2">
              50%–65% more affordable than Huckleberry ($14.99/mo) & Napper ($14.99/mo). One subscription unlocks Premium for your entire family across Mobile & Web.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => {
              const isCurrent = user?.subscriptionPlan === plan.id && user?.isPremium;
              return (
                <Card
                  key={plan.id}
                  variant="elevated"
                  className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
                    plan.id === 'YEARLY'
                      ? 'bg-[#FFFDFB] border-2 border-[#FF7A7A] shadow-xl'
                      : 'bg-white border-[#F0EBE6]'
                  }`}
                >
                  <div>
                    <Flex justify="between" align="center" className="mb-3">
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

                    <Typography variant="h4" className="font-extrabold text-xl text-[#2D3142]">
                      {plan.title}
                    </Typography>

                    <Flex align="baseline" gap={1} className="my-3">
                      <Typography variant="h2" className="text-3xl font-black text-[#2D3142]">
                        {plan.price}
                      </Typography>
                      <Typography variant="caption" className="text-xs font-bold text-[#71788E]">
                        {plan.period}
                      </Typography>
                    </Flex>

                    <Typography variant="body2" className="text-xs text-[#71788E] leading-relaxed mb-5">
                      {plan.description}
                    </Typography>

                    <List className="space-y-2 mb-6">
                      <ListItem className="flex items-center gap-2 text-xs font-semibold text-[#2D3142]">
                        <CheckCircleIcon size={14} className="text-[#48C78E] shrink-0" />
                        <span>Unlimited DeepSeek AI Q&A & Live Advice</span>
                      </ListItem>
                      <ListItem className="flex items-center gap-2 text-xs font-semibold text-[#2D3142]">
                        <CheckCircleIcon size={14} className="text-[#48C78E] shrink-0" />
                        <span>Automated Daily AI Email & Push Digest</span>
                      </ListItem>
                      <ListItem className="flex items-center gap-2 text-xs font-semibold text-[#2D3142]">
                        <CheckCircleIcon size={14} className="text-[#48C78E] shrink-0" />
                        <span>7-Day & 14-Day Sleep, Feed & Diaper Trends</span>
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

          <Card variant="outlined" className="mt-6 p-4 bg-[#FBF7F2] rounded-2xl border-[#E8E2D9]">
            <Flex align="center" justify="center" gap={2}>
              <InfoIcon size={16} className="text-[#71788E]" />
              <Typography variant="caption" className="text-xs text-[#71788E] font-medium">
                Free Tier always includes unlimited feeding, sleep & diaper logging, family sharing, and 3 AI questions per day.
              </Typography>
            </Flex>
          </Card>
        </div>
      </div>
    </div>
  );
};
