import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Badge, Flex, Button, Input } from '@forgedevstack/bear';
import { apiRequest } from './Dashboard.utils';
import {
  Mic,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Copy,
  Check,
  Sparkles,
  Droplets,
  Apple as AppleFoodIcon,
  Award,
  Activity,
  ClipboardCheck,
} from 'lucide-react';

interface V120SuitePanelProps {
  token: string;
  babyId: string;
  babyName: string;
  nightShiftMode: boolean;
  onToggleNightShift: () => void;
  onRefreshDashboard: () => Promise<void>;
}

interface MilkStashBag {
  id: string;
  pumpedAt: string;
  expiresAt: string;
  isExpiringSoon: boolean;
  isExpired: boolean;
  storageLocation: 'fridge' | 'freezer';
  volumeMl: number;
  leftMl: number;
  rightMl: number;
}

interface MilkStashResponse {
  totalFridgeMl: number;
  totalFreezerMl: number;
  totalBags: number;
  expiringSoonCount: number;
  bags: MilkStashBag[];
}

interface SolidsSummaryResponse {
  uniqueFoodsCount: number;
  goalCount: number;
  foodsTried: Array<{
    food: string;
    category: string;
    exposureCount: number;
    preference: string;
    reaction: string;
    texture: string;
  }>;
  topAllergens: Array<{
    key: string;
    name: string;
    icon: string;
    exposures: number;
    targetExposures: number;
    cleared: boolean;
    reaction: string;
  }>;
}

interface MilestonesResponse {
  ageWeeks: number;
  tummyTimeTodayMinutes: number;
  tummyTimeGoalMinutes: number;
  currentLeap: {
    leapNumber: number;
    title: string;
    tip: string;
  };
  milestones: Array<{
    key: string;
    ageMonths: number;
    category: string;
    title: string;
    achieved: boolean;
    achievedAt: string | null;
  }>;
}

interface GrowthPercentilesResponse {
  whoWeightCurve: Array<{
    month: number;
    p3: number;
    p15: number;
    p50: number;
    p85: number;
    p97: number;
  }>;
  measurements: Array<{
    id: string;
    date: string;
    ageMonths: number;
    weightKg: number | null;
    heightCm: number | null;
    headCm: number | null;
    weightPercentile: number | null;
  }>;
  vaccines: Array<{
    code: string;
    ageLabel: string;
    name: string;
    completed: boolean;
    completedAt: string | null;
  }>;
}

interface HandoffResponse {
  babyName: string;
  shareText: string;
}

type ActiveModuleTab = 'voice' | 'pump' | 'solids' | 'milestones' | 'growth' | 'sounds' | 'handoff';

export const V120SuitePanel: React.FC<V120SuitePanelProps> = ({
  token,
  babyId,
  babyName,
  nightShiftMode,
  onToggleNightShift,
  onRefreshDashboard,
}) => {
  const [activeModule, setActiveModule] = useState<ActiveModuleTab>('voice');
  const [busy, setBusy] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  // AL-120: Natural Language / Voice state
  const [nlText, setNlText] = useState('');
  const [listening, setListening] = useState(false);

  // AL-116: Pumping & Milk Stash state
  const [stash, setStash] = useState<MilkStashResponse | null>(null);
  const [leftMl, setLeftMl] = useState('70');
  const [rightMl, setRightMl] = useState('70');
  const [storageLoc, setStorageLoc] = useState<'fridge' | 'freezer'>('fridge');

  // AL-117: Solids & Allergens state
  const [solids, setSolids] = useState<SolidsSummaryResponse | null>(null);
  const [foodName, setFoodName] = useState('');
  const [foodPref, setFoodPref] = useState<'loved' | 'neutral' | 'disliked'>('loved');
  const [foodReaction, setFoodReaction] = useState<'none' | 'mild_rash' | 'hives' | 'tummy_upset'>('none');
  const [foodTexture, setFoodTexture] = useState<'puree' | 'mashed' | 'finger_food'>('puree');

  // AL-118: Milestones & Tummy Time state
  const [milestoneData, setMilestoneData] = useState<MilestonesResponse | null>(null);

  // AL-119: WHO Growth & Vaccines state
  const [growthData, setGrowthData] = useState<GrowthPercentilesResponse | null>(null);
  const [weightInput, setWeightInput] = useState('6.8');
  const [heightInput, setHeightInput] = useState('64');
  const [headInput, setHeadInput] = useState('41.5');

  // AL-121: Soothing White Noise Web Audio synthesizer
  const [playingSound, setPlayingSound] = useState<'white' | 'pink' | 'womb' | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // AL-122: Caregiver Shift Handoff state
  const [handoff, setHandoff] = useState<HandoffResponse | null>(null);
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  const loadV120Data = async () => {
    const [stRes, solRes, milRes, grRes, hoRes] = await Promise.allSettled([
      apiRequest<MilkStashResponse>(`/babies/${babyId}/milk-stash`, token),
      apiRequest<SolidsSummaryResponse>(`/babies/${babyId}/solids-summary`, token),
      apiRequest<MilestonesResponse>(`/babies/${babyId}/milestones`, token),
      apiRequest<GrowthPercentilesResponse>(`/babies/${babyId}/growth-percentiles`, token),
      apiRequest<HandoffResponse>(`/babies/${babyId}/handoff`, token),
    ]);

    if (stRes.status === 'fulfilled') setStash(stRes.value);
    if (solRes.status === 'fulfilled') setSolids(solRes.value);
    if (milRes.status === 'fulfilled') setMilestoneData(milRes.value);
    if (grRes.status === 'fulfilled') setGrowthData(grRes.value);
    if (hoRes.status === 'fulfilled') setHandoff(hoRes.value);
  };

  useEffect(() => {
    void loadV120Data();
  }, [babyId, token]);

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const handleVoiceParse = async (sample?: string) => {
    const query = (sample ?? nlText).trim();
    if (!query) return;
    setBusy(true);
    setBannerMsg(null);
    try {
      const res = await apiRequest<{ parsedCount: number; summary: string }>(
        `/babies/${babyId}/ai/parse-entry`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ text: query }),
        }
      );
      setNlText('');
      setBannerMsg(`✨ Logged ${res.parsedCount} routine event(s): ${res.summary}`);
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } catch (err) {
      setBannerMsg(`⚠️ ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleStartSpeechRecognition = () => {
    const w = window as unknown as {
      SpeechRecognition?: any;
      webkitSpeechRecognition?: any;
    };
    const SpeechRec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRec) {
      setBannerMsg('Browser voice dictation unavailable — type or tap a quick phrase below!');
      return;
    }
    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setNlText(transcript);
        void handleVoiceParse(transcript);
      }
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const handleLogPump = async () => {
    const l = Math.max(0, Number(leftMl) || 0);
    const r = Math.max(0, Number(rightMl) || 0);
    const total = l + r;
    if (total <= 0) return;
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type: 'FEED',
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          data: {
            method: 'pump',
            kind: 'pump',
            leftMl: l,
            rightMl: r,
            amountMl: total,
            storageLocation: storageLoc,
          },
          note: `Pumped ${total}ml (${l}ml L / ${r}ml R) → ${storageLoc}`,
        }),
      });
      setBannerMsg(`🍼 Stored ${total}ml breast milk in ${storageLoc.toUpperCase()}!`);
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const handleConsumeBag = async (bagId: string) => {
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/milk-stash/${bagId}/consume`, token, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setBannerMsg('🍼 Bag consumed from stash & logged as expressed breast-milk bottle!');
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const handleLogSolidFood = async (customFood?: string) => {
    const targetFood = (customFood ?? foodName).trim();
    if (!targetFood) return;
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type: 'FEED',
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          data: {
            method: 'solids',
            kind: 'solids',
            food: targetFood,
            preference: foodPref,
            texture: foodTexture,
            reaction: foodReaction,
          },
          note: `Tried ${targetFood} (${foodTexture}, ${foodPref})`,
        }),
      });
      setFoodName('');
      setBannerMsg(`🥑 Logged first food "${targetFood}" (${foodPref})!`);
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const handleLogActivity = async (activityKind: string, durationMinutes: number) => {
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type: 'NOTE',
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          data: {
            subType: 'activity',
            activityKind,
            durationMinutes,
            text: `${activityKind.replace('_', ' ')} (${durationMinutes}m)`,
          },
          note: `${activityKind.replace('_', ' ')}: ${durationMinutes} min`,
        }),
      });
      setBannerMsg(`🏆 Logged ${durationMinutes}m ${activityKind.replace('_', ' ')}!`);
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const handleAchieveMilestone = async (key: string, title: string, category: string) => {
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type: 'NOTE',
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          data: {
            subType: 'milestone',
            milestoneKey: key,
            milestoneTitle: title,
            milestoneCategory: category,
            text: `Milestone achieved: ${title}`,
          },
          note: `🌟 Milestone: ${title}`,
        }),
      });
      setBannerMsg(`🌟 Milestone unlocked: "${title}"!`);
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const handleLogGrowth = async () => {
    const w = Number(weightInput) || undefined;
    const h = Number(heightInput) || undefined;
    const hc = Number(headInput) || undefined;
    if (!w && !h && !hc) return;
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type: 'GROWTH',
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          data: { weightKg: w, heightCm: h, headCm: hc },
          note: `Growth checkup: ${w ? `${w}kg ` : ''}${h ? `${h}cm` : ''}`,
        }),
      });
      setBannerMsg('📈 Growth measurement saved & plotted on WHO percentile curve!');
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const handleMarkVaccine = async (code: string, name: string) => {
    setBusy(true);
    try {
      await apiRequest(`/babies/${babyId}/entries`, token, {
        method: 'POST',
        body: JSON.stringify({
          type: 'MEDICINE',
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          data: {
            name,
            vaccineCode: code,
            isVaccine: true,
          },
          note: `💉 Vaccine completed: ${name}`,
        }),
      });
      setBannerMsg(`💉 Marked immunization "${name}" as completed!`);
      await Promise.all([loadV120Data(), onRefreshDashboard()]);
    } finally {
      setBusy(false);
    }
  };

  const stopSound = () => {
    try {
      sourceNodeRef.current?.stop();
      sourceNodeRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {
      // ignore cleanup error
    }
    sourceNodeRef.current = null;
    audioCtxRef.current = null;
    setPlayingSound(null);
  };

  const playSoothingNoise = (kind: 'white' | 'pink' | 'womb') => {
    if (playingSound === kind) {
      stopSound();
      return;
    }
    stopSound();
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let lastOut = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (kind === 'white') {
          output[i] = white * 0.12;
        } else if (kind === 'pink') {
          b0 = 0.99765 * b0 + white * 0.099046;
          b1 = 0.963 * b1 + white * 0.2965164;
          b2 = 0.57 * b2 + white * 1.0526913;
          output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.04;
        } else {
          // Womb / Brown deep soothing noise
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 0.35;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(ctx.destination);
      source.start(0);

      audioCtxRef.current = ctx;
      sourceNodeRef.current = source;
      setPlayingSound(kind);
    } catch {
      setBannerMsg('Tap again to allow audio playback in your browser.');
    }
  };

  const MODULE_TABS: Array<{ id: ActiveModuleTab; label: string; icon: React.ReactNode }> = [
    { id: 'voice', label: '🎙️ AI Voice Log', icon: <Mic size={13} /> },
    { id: 'pump', label: '🍼 Milk Stash', icon: <Droplets size={13} /> },
    { id: 'solids', label: '🥑 100 Solids', icon: <AppleFoodIcon size={13} /> },
    { id: 'milestones', label: '🏆 Milestones', icon: <Award size={13} /> },
    { id: 'growth', label: '📈 WHO Curves', icon: <Activity size={13} /> },
    { id: 'sounds', label: '🎵 White Noise', icon: <Volume2 size={13} /> },
    { id: 'handoff', label: '🤝 Shift Handoff', icon: <ClipboardCheck size={13} /> },
  ];

  return (
    <Card
      variant="elevated"
      className={`p-5 sm:p-6 rounded-3xl border-2 transition-all ${
        nightShiftMode
          ? 'bg-[#1A0F14] text-[#FFD6CC] border-[#4A202A] shadow-xl'
          : 'bg-white text-[#2D3142] border-[#F0EBE6] shadow-xs'
      }`}
    >
      <Flex justify="between" align="center" wrap="wrap" gap={2} className="mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="primary" pill size="sm" className="bg-[#FF7A7A] text-white font-black">
            v1.2.0 SUITE
          </Badge>
          <Typography
            variant="h5"
            className={`font-black text-sm sm:text-base ${nightShiftMode ? 'text-[#FFD6CC]' : 'text-[#2D3142]'}`}
          >
            All-In-One Parenting Toolkit
          </Typography>
        </div>

        <button
          type="button"
          onClick={onToggleNightShift}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            nightShiftMode
              ? 'bg-[#3B1722] text-[#FF9E8A] border-[#6E2B3D]'
              : 'bg-[#23203F] text-amber-200 border-[#3B3568]'
          }`}
        >
          {nightShiftMode ? <Sun size={13} /> : <Moon size={13} />}
          <span>{nightShiftMode ? 'Exit 3 AM Red-Light Mode' : '3 AM Night-Shift Mode'}</span>
        </button>
      </Flex>

      {/* Module Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
        {MODULE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveModule(t.id)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeModule === t.id
                ? 'bg-[#FF7A7A] text-white shadow-xs'
                : nightShiftMode
                  ? 'bg-[#2B161E] text-[#E6B8AF] hover:bg-[#3B1E29]'
                  : 'bg-[#FAF8F5] text-[#4A5568] hover:bg-[#FFF0F0]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {bannerMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-[#EFFBF5] border border-[#BCEAD5] text-[#1E824C] text-xs font-bold flex items-center justify-between">
          <span>{bannerMsg}</span>
          <button type="button" onClick={() => setBannerMsg(null)} className="ml-2 font-black">
            ✕
          </button>
        </div>
      )}

      {/* 1. AL-120: Hands-Free AI Voice & Natural Language Logger */}
      {activeModule === 'voice' && (
        <div className="space-y-3">
          <Typography variant="caption" className="text-xs font-bold block opacity-85">
            🎙️ Speak or type natural sentences — DeepSeek AI automatically logs multiple routine events:
          </Typography>
          <div className="flex items-center gap-2">
            <Input
              value={nlText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNlText(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleVoiceParse();
                }
              }}
              placeholder={`e.g. "${babyName} drank 150ml formula 20m ago and had a wet diaper"`}
              fullWidth
            />
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={handleStartSpeechRecognition}
              className={`rounded-xl px-3 py-2 font-bold text-xs ${
                listening ? 'bg-[#FF7A7A] text-white animate-pulse' : 'border-[#FF7A7A] text-[#FF7A7A]'
              }`}
            >
              <Mic size={15} />
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={busy || !nlText.trim()}
              onClick={() => void handleVoiceParse()}
              className="bg-[#FF7A7A] text-white font-bold rounded-xl px-4 py-2 text-xs whitespace-nowrap"
            >
              <Sparkles size={14} className="mr-1 inline" />
              Auto-Log
            </Button>
          </div>
          <Flex wrap="wrap" gap={2}>
            {[
              `${babyName} drank 150ml formula 15 minutes ago and had a wet diaper`,
              `Pumped 160ml into fridge`,
              `20 minutes tummy time`,
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={busy}
                onClick={() => void handleVoiceParse(chip)}
                className="px-2.5 py-1 rounded-xl bg-[#FFF0F0] hover:bg-[#FFE0E0] text-[#FF7A7A] text-[11px] font-bold transition-colors"
              >
                ⚡ &ldquo;{chip}&rdquo;
              </button>
            ))}
          </Flex>
        </div>
      )}

      {/* 2. AL-116: Pumping & Breast Milk Stash Manager */}
      {activeModule === 'pump' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1]">
              <span className="text-[11px] font-bold block">🧊 Fridge Stash (4d freshness)</span>
              <span className="text-xl font-black">{stash?.totalFridgeMl ?? 0} ml</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F5F3FC] border border-[#E5E0FA] text-[#6D28D9]">
              <span className="text-[11px] font-bold block">❄️ Freezer Stash (6m freshness)</span>
              <span className="text-xl font-black">{stash?.totalFreezerMl ?? 0} ml</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-3 text-[#2D3142]">
            <Typography variant="caption" className="font-bold text-xs block">
              Log Pumped Breast Milk Bag:
            </Typography>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#71788E] block">Left (ml)</span>
                <Input value={leftMl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeftMl(e.target.value)} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#71788E] block">Right (ml)</span>
                <Input value={rightMl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRightMl(e.target.value)} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#71788E] block">Storage</span>
                <div className="flex gap-1 mt-1">
                  {(['fridge', 'freezer'] as const).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setStorageLoc(loc)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize ${
                        storageLoc === loc ? 'bg-[#8C7AE6] text-white' : 'bg-white border border-[#E8E2D9]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={busy}
              onClick={() => void handleLogPump()}
              className="bg-[#8C7AE6] text-white font-bold rounded-xl py-2 text-xs"
            >
              + Save Pumped Bag to Stash
            </Button>
          </div>

          {stash?.bags && stash.bags.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stash.bags.map((bag) => (
                <div
                  key={bag.id}
                  className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-between text-xs text-[#2D3142]"
                >
                  <div>
                    <span className="font-bold">
                      {bag.storageLocation === 'fridge' ? '🧊 Fridge' : '❄️ Freezer'} • {bag.volumeMl}ml
                    </span>
                    <span className="block text-[10px] text-[#71788E]">
                      Expires {new Date(bag.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => void handleConsumeBag(bag.id)}
                    className="border-[#48C78E] text-[#1E824C] font-bold text-[11px] rounded-xl"
                  >
                    🍼 Feed FIFO
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. AL-117: 100 First Foods & Top 9 Allergen Tracker */}
      {activeModule === 'solids' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#EFFBF5] border border-[#BCEAD5] text-[#1E824C] flex items-center justify-between">
            <div>
              <span className="text-xs font-black block">🥑 100 First Foods Before Age 1</span>
              <span className="text-[11px]">Track textures, preferences & Top 9 allergens</span>
            </div>
            <span className="text-2xl font-black">{solids?.uniqueFoodsCount ?? 0} / 100</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2.5 text-[#2D3142]">
            <Flex gap={2}>
              <Input
                value={foodName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFoodName(e.target.value)}
                placeholder="Food name (e.g. Avocado, Banana, Peanut Butter, Egg)"
                fullWidth
              />
              <Button
                variant="primary"
                size="sm"
                disabled={busy || !foodName.trim()}
                onClick={() => void handleLogSolidFood()}
                className="bg-[#48C78E] text-white font-bold rounded-xl px-4 text-xs whitespace-nowrap"
              >
                + Log Food
              </Button>
            </Flex>
            <Flex wrap="wrap" gap={2} className="text-[11px]">
              {(['loved', 'neutral', 'disliked'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFoodPref(p)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                    foodPref === p ? 'bg-[#FF7A7A] text-white' : 'bg-white border border-[#E8E2D9]'
                  }`}
                >
                  {p === 'loved' ? '😍 Loved' : p === 'neutral' ? '😐 Neutral' : '😣 Disliked'}
                </button>
              ))}
              {(['puree', 'mashed', 'finger_food'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFoodTexture(t)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                    foodTexture === t ? 'bg-[#8C7AE6] text-white' : 'bg-white border border-[#E8E2D9]'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
              {(['none', 'mild_rash', 'hives', 'tummy_upset'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFoodReaction(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold ${
                    foodReaction === r ? 'bg-[#2D3142] text-white' : 'bg-white border border-[#E8E2D9]'
                  }`}
                >
                  {r === 'none' ? '✓ No Reaction' : `⚠️ ${r.replace('_', ' ')}`}
                </button>
              ))}
            </Flex>
          </div>

          <div>
            <Typography variant="caption" className="font-bold text-xs block mb-2">
              🥜 Top 9 Pediatric Allergens (3 Exposures Recommended):
            </Typography>
            <div className="grid grid-cols-3 gap-2">
              {(solids?.topAllergens ?? []).map((alg) => (
                <button
                  key={alg.key}
                  type="button"
                  onClick={() => void handleLogSolidFood(alg.name)}
                  className="p-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#FFF5F5] border border-[#EAE4DC] text-left transition-colors text-[#2D3142]"
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>
                      {alg.icon} {alg.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-black text-[#48C78E]">
                      {alg.exposures}/{alg.targetExposures}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. AL-118: Tummy Time Goal Ring, Activities & CDC/WHO Milestones */}
      {activeModule === 'milestones' && (
        <div className="space-y-4">
          {milestoneData?.currentLeap && (
            <div className="p-3.5 rounded-2xl bg-[#F5F3FC] border border-[#E5E0FA] text-[#2D3142]">
              <span className="text-xs font-black text-[#8C7AE6] block">
                🧠 {milestoneData.currentLeap.title}
              </span>
              <span className="text-[11px] text-[#4A5568]">{milestoneData.currentLeap.tip}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-[#FFF9F0] border border-[#FFE8CC] flex items-center justify-between text-[#2D3142]">
            <div>
              <span className="text-xs font-black block">💪 Daily Tummy Time Goal Ring</span>
              <span className="text-[11px] text-[#71788E]">
                {milestoneData?.tummyTimeTodayMinutes ?? 0} / {milestoneData?.tummyTimeGoalMinutes ?? 30} min today
              </span>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="primary"
                size="sm"
                disabled={busy}
                onClick={() => void handleLogActivity('tummy_time', 10)}
                className="bg-[#FFAA00] text-[#23203F] font-bold text-xs rounded-xl"
              >
                +10m Tummy
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => void handleLogActivity('bath', 15)}
                className="border-[#E8E2D9] text-xs font-bold rounded-xl"
              >
                🛁 +15m Bath
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {(milestoneData?.milestones ?? []).map((m) => (
              <div
                key={m.key}
                className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-between text-xs text-[#2D3142]"
              >
                <div>
                  <span className="font-bold">
                    [{m.ageMonths}m • {m.category}] {m.title}
                  </span>
                </div>
                {m.achieved ? (
                  <Badge variant="success" pill size="sm">
                    ✓ Achieved
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => void handleAchieveMilestone(m.key, m.title, m.category)}
                    className="border-[#FF7A7A] text-[#FF7A7A] font-bold text-[11px] rounded-xl"
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AL-119: Interactive WHO Growth Percentile Curves & Vaccine Checklist */}
      {activeModule === 'growth' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2.5 text-[#2D3142]">
            <Typography variant="caption" className="font-bold text-xs block">
              📏 Log Growth Checkup (WHO Percentile Calculator):
            </Typography>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={weightInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeightInput(e.target.value)}
                placeholder="Weight (kg)"
              />
              <Input
                value={heightInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeightInput(e.target.value)}
                placeholder="Height (cm)"
              />
              <Input
                value={headInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeadInput(e.target.value)}
                placeholder="Head (cm)"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={busy}
              onClick={() => void handleLogGrowth()}
              className="bg-[#3897F0] text-white font-bold rounded-xl py-2 text-xs"
            >
              + Calculate WHO Percentile & Save
            </Button>
          </div>

          {growthData?.measurements && growthData.measurements.length > 0 && (
            <div className="space-y-1.5">
              {growthData.measurements.slice(-3).map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-between text-xs text-[#0369A1]"
                >
                  <span className="font-bold">
                    {m.weightKg ? `${m.weightKg} kg ` : ''}
                    {m.heightCm ? `• ${m.heightCm} cm ` : ''}
                    {m.headCm ? `• Head ${m.headCm} cm` : ''}
                  </span>
                  {m.weightPercentile != null && (
                    <Badge variant="info" pill size="sm">
                      WHO {m.weightPercentile}th Percentile
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          <div>
            <Typography variant="caption" className="font-bold text-xs block mb-2">
              💉 Pediatric Vaccine Immunization Checklist:
            </Typography>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {(growthData?.vaccines ?? []).map((v) => (
                <div
                  key={v.code}
                  className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-between text-xs text-[#2D3142]"
                >
                  <span>
                    <strong>{v.ageLabel}:</strong> {v.name}
                  </span>
                  {v.completed ? (
                    <Badge variant="success" pill size="sm">
                      ✓ Done
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => void handleMarkVaccine(v.code, v.name)}
                      className="border-[#3897F0] text-[#3897F0] font-bold text-[11px] rounded-xl"
                    >
                      Log Vaccine
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. AL-121: Built-In Soothing White Noise & Sleep Sound Machine */}
      {activeModule === 'sounds' && (
        <div className="space-y-3">
          <Typography variant="caption" className="text-xs font-bold block opacity-85">
            🎵 Instant Web Audio Soothing Sound Generator (calms fussy infants & masks household noise):
          </Typography>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'white' as const, title: '🌊 White Noise', desc: 'Steady classic hum' },
              { id: 'pink' as const, title: '🌧️ Pink Rain', desc: 'Soft balanced rainfall' },
              { id: 'womb' as const, title: '🤰 Womb Heartbeat', desc: 'Deep warm low-frequency' },
            ].map((s) => {
              const active = playingSound === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => playSoothingNoise(s.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    active
                      ? 'bg-[#23203F] text-white border-[#8C7AE6] shadow-md'
                      : 'bg-[#FAF8F5] text-[#2D3142] border-[#EAE4DC] hover:bg-[#F5F3FC]'
                  }`}
                >
                  <div className="font-black text-xs flex items-center justify-between">
                    <span>{s.title}</span>
                    {active ? <Volume2 size={14} className="text-[#48C78E] animate-pulse" /> : <VolumeX size={14} />}
                  </div>
                  <span className="text-[10px] opacity-75 block mt-1">{active ? 'Playing now (Tap to stop)' : s.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. AL-122: Caregiver Shift Handoff Summary Card */}
      {activeModule === 'handoff' && (
        <div className="space-y-3">
          <Typography variant="caption" className="text-xs font-bold block opacity-85">
            🤝 1-Tap Partner & Nanny Shift Handoff Summary:
          </Typography>
          <pre className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] text-xs font-mono whitespace-pre-wrap text-[#2D3142] leading-relaxed">
            {handoff?.shareText || `👶 ${babyName} — Ready for caregiver shift handoff.`}
          </pre>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => {
              if (handoff?.shareText) {
                void navigator.clipboard.writeText(handoff.shareText);
                setCopiedHandoff(true);
                setTimeout(() => setCopiedHandoff(false), 2000);
              }
            }}
            className="bg-[#2D3142] text-white font-bold rounded-xl py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            {copiedHandoff ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedHandoff ? 'Copied Shift Handoff Summary!' : 'Copy Handoff Summary for Partner / Nanny'}</span>
          </Button>
        </div>
      )}
    </Card>
  );
};
