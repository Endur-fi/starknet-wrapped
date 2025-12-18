'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Copy,
  ExternalLink,
  Heart,
  Lock,
  PartyPopper,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { toPng } from 'html-to-image';

type Badge = {
  id: string;
  emoji: string;
  name: string;
  description: string;
  earned: boolean;
  criteria?: string;
};

type ValidatorInfo = {
  name: string;
  amountStaked: number;
  icon?: string;
};

type UserWrappedData = {
  address: string;
  act1: {
    accountAge: number;
    firstTxDate: string;
    totalTransactions: number;
    gasSavedUSD: number;
    gasSavedETH: number;
    mostActiveMonth: string;
    totalValueTransacted: number;
    uniqueContracts: number;
    badges: Badge[];
  };
  act2: {
    liquidStaking: {
      xSTRKHoldings: number;
      xSTRKValueUSD: number;
      protocolsUsed: string[];
      lpPositions: number;
      avgAPR: number;
      season1Points: number;
      season1Rank: string;
      stakingDays: number;
      badges: Badge[];
    };
    nativeStaking: {
      totalStakedSTRK: number;
      totalStakedBTC: number;
      validators: ValidatorInfo[];
      nativeAPR: number;
      rewardsEarnedUSD: number;
      badges: Badge[];
    };
  };
};

type ActId = 1 | 2 | 3 | 4 | 5 | 6;

type ActMeta = {
  id: ActId;
  emoji: string;
  title: string;
  subtitle: string;
  gradient: string;
  glow: string;
  accent: string;
  preview: (d: UserWrappedData) => string;
  status: 'live' | 'future';
};

type CardKind = 'hero' | 'stat' | 'badge' | 'compare' | 'list';

type CardDef = {
  id: string;
  kind: CardKind;
  title: string;
  kicker?: string;
  icon?: React.ReactNode;
  gradient: string;
  glow: string;
  render: (d: UserWrappedData) => React.ReactNode;
  shareText: (d: UserWrappedData) => string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCompact(n: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

function shortAddr(addr: string) {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function seededRandom(seed: string) {
  // simple xorshift-ish based on string hash
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    // xorshift32
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const t = (h >>> 0) / 4294967296;
    return t;
  };
}

function makeDummy(address: string): UserWrappedData {
  const rand = seededRandom(address.toLowerCase());
  const between = (min: number, max: number) => min + (max - min) * rand();
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  const accountAge = Math.round(between(410, 520));
  const txs = Math.round(between(1200, 5200));
  const gasSavedUSD = Math.round(between(520, 2100));
  const gasSavedETH = +(between(0.15, 0.9).toFixed(3));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mostActiveMonth = pick(months);
  const totalValueTransacted = Math.round(between(2500, 95000));
  const uniqueContracts = Math.round(between(60, 420));

  const mkBadges = (pool: Array<Omit<Badge, 'id' | 'earned'>>): Badge[] => {
    const earnedTarget = 0.7;
    return pool.map((b, idx) => {
      const earned = rand() < earnedTarget;
      return {
        ...b,
        id: `${b.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
        earned,
        criteria: earned ? undefined : 'Do the thing. Touch grass later. ✅',
      };
    });
  };

  const act1Badges = mkBadges([
    { emoji: '🧪', name: 'Testnet OG', description: 'You were here before it was cool.' },
    { emoji: '🧙‍♂️', name: 'Contract Whisperer', description: 'You talked to a LOT of contracts.' },
    { emoji: '⚡', name: 'Speedrunner', description: 'You move faster than L2 finality.' },
    { emoji: '🧾', name: 'Receipt Collector', description: 'Every tx is a souvenir.' },
    { emoji: '🧠', name: 'Brain Wallet', description: 'You sign like a pro.' },
    { emoji: '🦈', name: 'Liquidity Hunter', description: 'You sniffed out yields.' },
    { emoji: '🫡', name: 'GM Anon', description: 'You never missed a GM.' },
    { emoji: '🏆', name: 'Main Character', description: 'Starknet NPCs know your name.' },
  ]);

  const lsBadges = mkBadges([
    { emoji: '🌊', name: 'Liquid Legend', description: 'You staked and stayed liquid.' },
    { emoji: '🧃', name: 'Yield Sipper', description: 'APR tasted… refreshing.' },
    { emoji: '🧱', name: 'LP Architect', description: 'You built pools and vibes.' },
    { emoji: '🛰️', name: 'Protocol Hopper', description: 'You visited more dApps than friends.' },
    { emoji: '🥇', name: 'Season Grinder', description: 'Points? You farmed them.' },
    { emoji: '🪙', name: 'xSTRK Maxi', description: 'xSTRK is your love language.' },
    { emoji: '✨', name: 'Compound Enjoyer', description: 'Reinvest? Obviously.' },
  ]);

  const nsBadges = mkBadges([
    { emoji: '🧬', name: 'Native Staker', description: 'You locked in for the long game.' },
    { emoji: '🛡️', name: 'Validator Ally', description: 'You backed the good guys.' },
    { emoji: '🧯', name: 'Risk Manager', description: 'Diversified validators like a Chad.' },
    { emoji: '🎖️', name: 'Rewards Enjoyer', description: 'You earned your stripes.' },
  ]);

  const protocolsPool = ['Ekubo', 'Nostra', 'JediSwap', 'AVNU', 'ZkLend', 'Fibrous'];
  const protocolsUsed = Array.from(new Set(Array.from({ length: Math.round(between(2, 4)) }, () => pick(protocolsPool))));

  const validators = Array.from({ length: Math.round(between(2, 5)) }, (_, i) => {
    const names = ['StarkWare', 'Nethermind', 'Pragma', 'Cartridge', 'Braavos', 'Argent'];
    return {
      name: pick(names) + (rand() < 0.25 ? ' Labs' : ''),
      amountStaked: Math.round(between(2000, 22000)),
      icon: ['🧠', '🛡️', '🛰️', '🧰', '🦊', '🧿'][i % 6],
    };
  });

  const firstTx = new Date(Date.now() - accountAge * 24 * 60 * 60 * 1000);
  const firstTxDate = firstTx.toISOString().slice(0, 10);

  const xSTRKHoldings = Math.round(between(5000, 52000));
  const xSTRKValueUSD = Math.round(xSTRKHoldings * between(0.6, 2.1));

  const season1Points = Math.round(between(12000, 98000));
  const season1Rank = pick(['Top 25%', 'Top 10%', 'Top 5%', 'Top 1%']);

  const lpPositions = Math.round(between(1, 7));
  const avgAPR = +between(5, 26).toFixed(1);
  const stakingDays = Math.round(between(40, 240));

  const totalStakedSTRK = Math.round(between(2500, 52000));
  const totalStakedBTC = +between(0.01, 0.22).toFixed(3);
  const nativeAPR = +between(4, 16).toFixed(1);
  const rewardsEarnedUSD = Math.round(between(60, 1400));

  return {
    address,
    act1: {
      accountAge,
      firstTxDate,
      totalTransactions: txs,
      gasSavedUSD,
      gasSavedETH,
      mostActiveMonth,
      totalValueTransacted,
      uniqueContracts,
      badges: act1Badges,
    },
    act2: {
      liquidStaking: {
        xSTRKHoldings,
        xSTRKValueUSD,
        protocolsUsed,
        lpPositions,
        avgAPR,
        season1Points,
        season1Rank,
        stakingDays,
        badges: lsBadges,
      },
      nativeStaking: {
        totalStakedSTRK,
        totalStakedBTC,
        validators,
        nativeAPR,
        rewardsEarnedUSD,
        badges: nsBadges,
      },
    },
  };
}

async function fetchWrappedDummy(address: string) {
  // Real Voyager-backed fetch (server-side API route).
  // If Voyager isn't configured, we fall back to dummy data for dev.
  try {
    const res = await fetch(`/api/wrapped?address=${encodeURIComponent(address.trim())}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Voyager route failed');
    const j = (await res.json()) as any;
    const d = makeDummy(address.trim());

    if (j?.act1) {
      d.act1.accountAge = typeof j.act1.accountAge === 'number' ? j.act1.accountAge : d.act1.accountAge;
      d.act1.firstTxDate = typeof j.act1.firstTxDate === 'string' ? j.act1.firstTxDate : d.act1.firstTxDate;
      d.act1.totalTransactions = typeof j.act1.totalTransactions === 'number' ? j.act1.totalTransactions : d.act1.totalTransactions;
      d.act1.mostActiveMonth = typeof j.act1.mostActiveMonth === 'string' ? j.act1.mostActiveMonth : d.act1.mostActiveMonth;
      d.act1.uniqueContracts = typeof j.act1.uniqueContracts === 'number' ? j.act1.uniqueContracts : d.act1.uniqueContracts;
      d.act1.gasSavedUSD = typeof j.act1.gasSavedUSD === 'number' ? j.act1.gasSavedUSD : d.act1.gasSavedUSD;
      d.act1.gasSavedETH = typeof j.act1.gasSavedETH === 'number' ? j.act1.gasSavedETH : d.act1.gasSavedETH;
      d.act1.totalValueTransacted = typeof j.act1.totalValueTransacted === 'number' ? j.act1.totalValueTransacted : d.act1.totalValueTransacted;
    }

    // Optional: surface partial sampling info as a subtle toast
    if (j?.voyager?.partial) {
      toast('Voyager sampling cap hit — stats are partial.', {
        icon: '⚠️',
        style: { background: 'rgba(15,23,42,0.92)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
      });
    }

    return d;
  } catch {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 700));
    return makeDummy(address);
  }
}

function validateAddress(s: string) {
  const v = s.trim();
  if (!v.startsWith('0x')) return { ok: false, msg: 'Must start with 0x' };
  if (v.length < 10) return { ok: false, msg: 'Too short' };
  if (v.length > 80) return { ok: false, msg: 'Too long' };
  if (!/^0x[0-9a-fA-F]+$/.test(v)) return { ok: false, msg: 'Hex only (0-9, a-f)' };
  return { ok: true as const };
}

function useKeyNav(onLeft: () => void, onRight: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onLeft();
      if (e.key === 'ArrowRight') onRight();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [enabled, onLeft, onRight]);
}

function CountUp({ value, suffix = '', prefix = '', durationMs = 950 }: { value: number; suffix?: string; prefix?: string; durationMs?: number }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = display;
    const delta = value - from;
    let raf = 0;

    const tick = (t: number) => {
      const p = clamp((t - start) / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + delta * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs, reduce]);

  const nice = Math.round(display);
  return (
    <span className="tabular-nums">
      {prefix}
      {nice.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

function FloatingOrbs() {
  // Removed floating orbs for flat background design
  return null;
}

function SparkleBurst({ seed }: { seed: string }) {
  const reduce = useReducedMotion();
  const sparkles = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: 16 }).map((_, i) => {
      const x = (rand() * 120 - 60).toFixed(1);
      const y = (rand() * 120 - 60).toFixed(1);
      const r = (rand() * 360).toFixed(0);
      const s = (0.7 + rand() * 0.8).toFixed(2);
      const delay = rand() * 0.08;
      return { i, x, y, r, s, delay };
    });
  }, [seed]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {sparkles.map((p) => (
        <motion.div
          key={p.i}
          className="absolute"
          initial={{ opacity: 0, scale: 0.6, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.15, 0.6], x: Number(p.x), y: Number(p.y), rotate: Number(p.r) }}
          transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
        >
          <div
            className="h-3 w-3 rounded-sm"
            style={{
              background:
                p.i % 4 === 0
                  ? 'rgba(245, 158, 11, 0.95)'
                  : p.i % 4 === 1
                    ? 'rgba(236, 72, 153, 0.95)'
                    : p.i % 4 === 2
                      ? 'rgba(6, 182, 212, 0.95)'
                      : 'rgba(139, 92, 246, 0.95)',
              filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function GlassCard({
  children,
  className,
  gradient,
  glow,
  brutal,
}: {
  children: React.ReactNode;
  className?: string;
  gradient: string;
  glow: string;
  brutal?: boolean;
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-3xl cartoon-border-thick p-6 snw-card',
        className,
      )}
      style={{
        borderColor: brutal ? '#00ffe0' : '#1bb388',
        backgroundColor: brutal ? '#00101a' : '#252b3d',
      }}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

function NeonButton({
  children,
  onClick,
  disabled,
  kind = 'primary',
  brutal,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  kind?: 'primary' | 'ghost' | 'danger';
  brutal?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black transition will-change-transform focus:outline-none active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 cartoon-border';

  const styles =
    kind === 'ghost'
      ? cx(
          brutal ? 'snw-neon-button-ghost' : '',
          'bg-white/10 hover:bg-white/20 text-white',
        )
      : kind === 'danger'
        ? 'bg-[#ff4757] text-white hover:bg-[#ff6b7a]'
        : cx(
            brutal ? 'snw-neon-button-primary' : '',
            'bg-[#1bb388] text-white hover:bg-[#1dd9a0]',
          );

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cx(base, styles, className)}
      style={{ borderColor: '#000' }}
    >
      {children}
    </button>
  );
}

function Pill({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cx('rounded-full px-3 py-1 text-xs font-bold cartoon-border snw-chip', className)}
      style={{ borderColor: '#000', backgroundColor: 'rgba(27, 179, 136, 0.2)', color: '#fff', ...style }}
    >
      {children}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl cartoon-border-thick p-6 snw-card" style={{ borderColor: '#1bb388', backgroundColor: '#252b3d' }}>
      <div className="h-6 w-44 rounded-lg bg-white/15" />
      <div className="mt-6 h-16 w-2/3 rounded-2xl bg-white/15" />
      <div className="mt-3 h-4 w-1/2 rounded-lg bg-white/15" />
      <div className="mt-10 grid grid-cols-3 gap-3">
        <div className="h-10 rounded-2xl bg-white/15" />
        <div className="h-10 rounded-2xl bg-white/15" />
        <div className="h-10 rounded-2xl bg-white/15" />
      </div>
    </div>
  );
}

const ACTS: ActMeta[] = [
  {
    id: 1,
    emoji: '🚀',
    title: 'YOUR JOURNEY',
    subtitle: 'Main character arc',
    gradient: 'bg-gradient-to-br from-[#1bb388]/40 via-cyan-400/15 to-violet-500/30',
    glow: 'shadow-[0_0_45px_rgba(27,179,136,0.25)]',
    accent: 'from-[#1bb388] to-violet-500',
    preview: (d) => `${formatCompact(d.act1.totalTransactions)} txs • ${d.act1.mostActiveMonth} peak`,
    status: 'live',
  },
  {
    id: 2,
    emoji: '🌊',
    title: 'LIQUID STAKING',
    subtitle: 'Staked. Liquid. Drippy.',
    gradient: 'bg-gradient-to-br from-[#1bb388]/45 via-cyan-400/20 to-blue-500/35',
    glow: 'shadow-[0_0_45px_rgba(27,179,136,0.28)]',
    accent: 'from-[#1bb388] to-cyan-400',
    preview: (d) => `${formatCompact(d.act2.liquidStaking.xSTRKHoldings)} xSTRK • ${d.act2.liquidStaking.season1Rank}`,
    status: 'live',
  },
  {
    id: 3,
    emoji: '₿',
    title: 'BTCFI PIONEER',
    subtitle: 'Soon™',
    gradient: 'bg-gradient-to-br from-amber-400/35 via-orange-500/10 to-yellow-300/25',
    glow: 'shadow-[0_0_45px_rgba(245,158,11,0.20)]',
    accent: 'from-amber-400 to-yellow-300',
    preview: () => 'Future Act • Stay tuned',
    status: 'future',
  },
  {
    id: 4,
    emoji: '🎮',
    title: 'DEGEN MOMENTS',
    subtitle: 'Soon™',
    gradient: 'bg-gradient-to-br from-[#1bb388]/35 via-fuchsia-500/15 to-violet-500/30',
    glow: 'shadow-[0_0_45px_rgba(27,179,136,0.22)]',
    accent: 'from-[#1bb388] to-fuchsia-500',
    preview: () => 'Future Act • LFG',
    status: 'future',
  },
  {
    id: 5,
    emoji: '🌍',
    title: 'NETWORK IMPACT',
    subtitle: 'Soon™',
    gradient: 'bg-gradient-to-br from-[#1bb388]/40 via-emerald-400/20 to-cyan-500/35',
    glow: 'shadow-[0_0_45px_rgba(27,179,136,0.26)]',
    accent: 'from-[#1bb388] to-emerald-400',
    preview: () => 'Future Act • WAGMI',
    status: 'future',
  },
  {
    id: 6,
    emoji: '🔮',
    title: '2025 PREDICTIONS',
    subtitle: 'Soon™',
    gradient: 'bg-gradient-to-br from-violet-500/35 via-[#1bb388]/20 to-fuchsia-500/30',
    glow: 'shadow-[0_0_45px_rgba(27,179,136,0.24)]',
    accent: 'from-[#1bb388] to-violet-500',
    preview: () => 'Future Act • You’re early',
    status: 'future',
  },
];

function buildAct1Cards(): CardDef[] {
  const grad = 'bg-gradient-to-br from-[#1bb388]/45 via-cyan-400/15 to-violet-500/35';
  const glow = 'shadow-[0_0_55px_rgba(27,179,136,0.25)]';

  const base: Omit<CardDef, 'id' | 'render' | 'shareText'> & { render: CardDef['render']; shareText: CardDef['shareText'] } = {
    kind: 'stat',
    title: 'Stat',
    gradient: grad,
    glow,
    render: () => null,
    shareText: () => '',
  };

  return [
    {
      ...base,
      id: 'a1-hero',
      kind: 'hero',
      title: 'YOUR YEAR ON STARKNET',
      kicker: '2024 WRAPPED',
      icon: <PartyPopper className="h-5 w-5" />,
      render: (d) => (
        <div>
          <div className="flex items-center justify-between">
            <Pill style={{ borderColor: '#000', backgroundColor: '#1bb388', color: '#fff' }}>GM ANON 🫡</Pill>
            <Pill style={{ borderColor: '#000', backgroundColor: 'rgba(6, 182, 212, 0.3)', color: '#fff' }}>{shortAddr(d.address)}</Pill>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-black tracking-tight">
              <span className="text-[#1bb388] cartoon-text">{d.act1.accountAge}</span>{' '}
              <span className="text-white font-bold">days on Starknet</span>
            </div>
            <div className="mt-3 text-white/75">First tx: {d.act1.firstTxDate} • You’ve been cooking ever since.</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Transactions</div>
              <div className="mt-1 text-xl font-bold">
                <CountUp value={d.act1.totalTransactions} />
              </div>
            </div>
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Peak month</div>
              <div className="mt-1 text-xl font-bold">{d.act1.mostActiveMonth}</div>
            </div>
          </div>
        </div>
      ),
      shareText: (d) => `I’ve been on Starknet for ${d.act1.accountAge} days. Main character behavior. 🚀`,
    },
    {
      ...base,
      id: 'a1-txs',
      title: 'Transaction mode: ON',
      kicker: 'YOU’RE COOKING 🔥',
      icon: <Zap className="h-5 w-5" />,
      render: (d) => (
        <div className="grid gap-6">
          <div>
            <div className="text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#1bb388] to-violet-300 bg-clip-text text-transparent">
                <CountUp value={d.act1.totalTransactions} />
              </span>
            </div>
            <div className="mt-2 text-white/75">Total transactions sent in 2024.</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Most active month</div>
              <div className="mt-1 text-xl font-bold">{d.act1.mostActiveMonth}</div>
            </div>
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Value moved</div>
              <div className="mt-1 text-xl font-bold">{formatUSD(d.act1.totalValueTransacted)}</div>
            </div>
          </div>
        </div>
      ),
      shareText: (d) => `I sent ${formatCompact(d.act1.totalTransactions)} transactions on Starknet in 2024. NGMI? Never heard of her. 🚀`,
    },
    {
      ...base,
      id: 'a1-gas',
      title: 'Gas saved (aka free dopamine)',
      kicker: 'WAGMI ✨',
      icon: <Sparkles className="h-5 w-5" />,
      render: (d) => (
        <div>
          <div className="text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#1bb388] to-cyan-300 bg-clip-text text-transparent">{formatUSD(d.act1.gasSavedUSD)}</span>
          </div>
          <div className="mt-2 text-white/75">Estimated gas saved vs. doing this on L1.</div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Also saved</span>
              <span className="font-semibold">{d.act1.gasSavedETH} ETH</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1bb388] via-cyan-400 to-violet-400"
                style={{ width: `${clamp((d.act1.gasSavedUSD / 2200) * 100, 10, 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-white/60">Paper hands paid more. You paid less.</div>
          </div>
        </div>
      ),
      shareText: (d) => `Starknet saved me ~${formatUSD(d.act1.gasSavedUSD)} in gas this year. L2 supremacy. ✨`,
    },
    {
      ...base,
      id: 'a1-contracts',
      title: 'Explorer-level curiosity',
      kicker: 'CONTRACT WHISPERER 🧙‍♂️',
      icon: <BadgeCheck className="h-5 w-5" />,
      render: (d) => (
        <div>
          <div className="text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#1bb388] to-violet-300 bg-clip-text text-transparent">
              <CountUp value={d.act1.uniqueContracts} />
            </span>
          </div>
          <div className="mt-2 text-white/75">Unique contracts you interacted with.</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Vibe check</div>
              <div className="mt-1 text-sm font-semibold">Curious degen ✅</div>
            </div>
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Diagnosis</div>
              <div className="mt-1 text-sm font-semibold">Onchain, terminally</div>
            </div>
          </div>
        </div>
      ),
      shareText: (d) => `I touched ${formatCompact(d.act1.uniqueContracts)} unique contracts on Starknet. Curiosity = alpha. 🧙‍♂️`,
    },
    ...Array.from({ length: 4 }).map((_, i) => {
      const idx = i;
      return {
        ...base,
        id: `a1-badge-${idx}`,
        kind: 'badge' as const,
        title: 'Badge unlocked?',
        kicker: 'EARNED',
        icon: <BadgeCheck className="h-5 w-5" />,
        render: (d: UserWrappedData) => {
          const b = d.act1.badges[idx];
          if (!b) return <div className="text-white/70">No badge.</div>;
          return <BadgeCardView badge={b} />;
        },
        shareText: (d: UserWrappedData) => {
          const b = d.act1.badges[idx];
          if (!b) return 'Year on Starknet 2024 Wrapped';
          return b.earned ? `Unlocked: ${b.name} ${b.emoji} on Starknet. LFG!` : `Chasing badge: ${b.name} ${b.emoji} — next year I’m farming it.`;
        },
      } satisfies CardDef;
    }),
  ];
}

function buildAct2Cards(): CardDef[] {
  const grad = 'bg-gradient-to-br from-[#1bb388]/45 via-cyan-400/18 to-blue-600/40';
  const glow = 'shadow-[0_0_55px_rgba(27,179,136,0.28)]';

  return [
    {
      id: 'a2-ls-hero',
      kind: 'hero',
      title: 'LIQUID STAKING ARC',
      kicker: 'DRIP MODE 🌊',
      icon: <Sparkles className="h-5 w-5" />,
      gradient: grad,
      glow,
      render: (d) => (
        <div>
          <div className="flex items-center justify-between">
            <Pill className="border-[#1bb388]/30 bg-[#1bb388]/10">Season 1</Pill>
            <Pill className="border-blue-400/30 bg-blue-500/10">{d.act2.liquidStaking.season1Rank}</Pill>
          </div>
          <div className="mt-8">
            <div className="text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#1bb388] via-cyan-200 to-sky-200 bg-clip-text text-transparent">
                {formatCompact(d.act2.liquidStaking.xSTRKHoldings)}
              </span>{' '}
              <span className="text-white/90">xSTRK</span>
            </div>
            <div className="mt-2 text-white/75">Liquid staked value: {formatUSD(d.act2.liquidStaking.xSTRKValueUSD)}</div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {d.act2.liquidStaking.protocolsUsed.map((p) => (
              <Pill key={p} className="border-white/10 bg-white/5">
                {p}
              </Pill>
            ))}
          </div>
        </div>
      ),
      shareText: (d) => `I’m holding ${formatCompact(d.act2.liquidStaking.xSTRKHoldings)} xSTRK. Staked + liquid = chef’s kiss. 🌊`,
    },
    {
      id: 'a2-points',
      kind: 'stat',
      title: 'Season 1 points farm',
      kicker: 'GRINDSET 🥇',
      icon: <Zap className="h-5 w-5" />,
      gradient: grad,
      glow,
      render: (d) => (
        <div>
          <div className="text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#1bb388] to-cyan-200 bg-clip-text text-transparent">
              <CountUp value={d.act2.liquidStaking.season1Points} />
            </span>
          </div>
          <div className="mt-2 text-white/75">Season 1 points. Rank: {d.act2.liquidStaking.season1Rank}</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Staking days</div>
              <div className="mt-1 text-xl font-bold">
                <CountUp value={d.act2.liquidStaking.stakingDays} />
              </div>
            </div>
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Protocols used</div>
              <div className="mt-1 text-xl font-bold">{d.act2.liquidStaking.protocolsUsed.length}</div>
            </div>
          </div>
        </div>
      ),
      shareText: (d) => `Season 1 points: ${formatCompact(d.act2.liquidStaking.season1Points)} (${d.act2.liquidStaking.season1Rank}). I’m farming, respectfully. 🥇`,
    },
    {
      id: 'a2-lp',
      kind: 'compare',
      title: 'LP vibes',
      kicker: 'YIELD ENJOYER 🧃',
      icon: <Sparkles className="h-5 w-5" />,
      gradient: grad,
      glow,
      render: (d) => {
        const youApr = d.act2.liquidStaking.avgAPR;
        const netApr = 8.4;
        const pct = clamp(((youApr - netApr) / netApr) * 100, -60, 160);
        return (
          <div>
            <div className="text-white/75">You vs Network average</div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: 'rgba(27, 179, 136, 0.25)' }}>
                <div className="text-xs text-white/70">You</div>
                <div className="mt-1 text-3xl font-black">{youApr}%</div>
                <div className="mt-1 text-xs text-white/70">LP positions: {d.act2.liquidStaking.lpPositions}</div>
              </div>
              <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
                <div className="text-xs text-white/60">Network avg</div>
                <div className="mt-1 text-3xl font-black text-white/80">{netApr}%</div>
                <div className="mt-1 text-xs text-white/60">(approx)</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Paper hands</span>
                <span>Gigachads</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1bb388] via-cyan-400 to-sky-400"
                  style={{ width: `${clamp(50 + pct / 2, 8, 100)}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-white/70">Performance delta: {pct >= 0 ? '+' : ''}{pct.toFixed(0)}%</div>
            </div>
          </div>
        );
      },
      shareText: (d) => `My LP APR averaged ${d.act2.liquidStaking.avgAPR}%. Yield sipper energy. 🧃`,
    },
    ...Array.from({ length: 4 }).map((_, i) => {
      const idx = i;
      return {
        id: `a2-ls-badge-${idx}`,
        kind: 'badge' as const,
        title: 'Liquid staking badge',
        kicker: 'EARNED',
        icon: <BadgeCheck className="h-5 w-5" />,
        gradient: grad,
        glow,
        render: (d: UserWrappedData) => {
          const b = d.act2.liquidStaking.badges[idx];
          if (!b) return <div className="text-white/70">No badge.</div>;
          return <BadgeCardView badge={b} />;
        },
        shareText: (d: UserWrappedData) => {
          const b = d.act2.liquidStaking.badges[idx];
          if (!b) return 'Liquid staking on Starknet';
          return b.earned ? `Unlocked: ${b.name} ${b.emoji} — liquid staking arc completed.` : `Locked: ${b.name} ${b.emoji} — farming it next.`;
        },
      } satisfies CardDef;
    }),
    {
      id: 'a2-native',
      kind: 'list',
      title: 'Native staking (bonus stage)',
      kicker: 'LONG-TERM CHAD 🧬',
      icon: <Sparkles className="h-5 w-5" />,
      gradient: grad,
      glow,
      render: (d) => (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Total staked</div>
              <div className="mt-1 text-xl font-bold">{formatCompact(d.act2.nativeStaking.totalStakedSTRK)} STRK</div>
              <div className="mt-1 text-xs text-white/60">+ {d.act2.nativeStaking.totalStakedBTC} BTC</div>
            </div>
            <div className="rounded-2xl cartoon-border p-4" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
              <div className="text-xs text-white/60">Native APR</div>
              <div className="mt-1 text-xl font-bold">{d.act2.nativeStaking.nativeAPR}%</div>
              <div className="mt-1 text-xs text-white/60">Rewards: {formatUSD(d.act2.nativeStaking.rewardsEarnedUSD)}</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Validators you backed</div>
            <div className="mt-3 grid gap-2">
              {d.act2.nativeStaking.validators.slice(0, 4).map((v) => (
                <div key={v.name} className="flex items-center justify-between rounded-xl cartoon-border px-3 py-2" style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{v.icon ?? '🛡️'}</span>
                    <span className="text-sm font-semibold">{v.name}</span>
                  </div>
                  <span className="text-xs text-white/70">{formatCompact(v.amountStaked)} STRK</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      shareText: (d) => `Native staking bonus stage: ${formatCompact(d.act2.nativeStaking.totalStakedSTRK)} STRK staked. Long-term WAGMI. 🧬`,
    },
  ];
}

function BadgeCardView({ badge }: { badge: Badge }) {
  return (
    <div className="relative">
      <div className={cx('grid place-items-center text-center', !badge.earned && 'opacity-70 saturate-0')}>
        <div className="text-[96px] leading-none">{badge.emoji}</div>
        <div className="mt-4 text-2xl font-black tracking-tight">{badge.name}</div>
        <div className="mt-2 max-w-sm text-sm text-white/70">{badge.description}</div>
      </div>

      {badge.earned ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-4 py-2 text-xs font-extrabold tracking-widest text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.28)]">
            <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-amber-400/25">
              <BadgeCheck className="h-4 w-4" />
            </span>
            EARNED
          </span>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl cartoon-border p-4 text-center" style={{ borderColor: '#1bb388', backgroundColor: '#252b3d' }}>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white/80">
            <Lock className="h-4 w-4" /> Locked
          </div>
          <div className="mt-2 text-xs text-white/60">Criteria: {badge.criteria ?? 'Keep grinding.'}</div>
        </div>
      )}
    </div>
  );
}

function ShareModal({
  open,
  onClose,
  title,
  description,
  onCopy,
  onDownload,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Share"
        >
          <div className="absolute inset-0 bg-black/80" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0b1226]/90 p-6 shadow-[0_0_60px_rgba(139,92,246,0.25)]"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-black">{title}</div>
                <div className="mt-1 text-sm text-white/70">{description}</div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl cartoon-border px-3 py-2 text-xs font-black text-white hover:bg-[#1bb388] transition"
                style={{ borderColor: '#1bb388', backgroundColor: '#1a1f2e' }}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <NeonButton onClick={onCopy} kind="primary" className="w-full">
                <Copy className="h-4 w-4" /> Copy to clipboard
              </NeonButton>
              <NeonButton onClick={onDownload} kind="ghost" className="w-full">
                <ExternalLink className="h-4 w-4" /> Download PNG
              </NeonButton>
            </div>

            <div className="mt-4 rounded-2xl cartoon-border p-4 text-xs font-bold text-white/90" style={{ borderColor: '#1bb388', backgroundColor: '#252b3d' }}>
              Ready to flex on X 🐦 — paste your image + text.
              <div className="mt-2 text-white/55">Tip: screenshots are always acceptable. 😤</div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function StarknetWrapped() {
  const reduce = useReducedMotion();
  const [brutal, setBrutal] = useLocalStorageState<boolean>('snw:turquoise-brutalism:v1', false);
  const [screen, setScreen] = useState<'landing' | 'loading' | 'dashboard' | 'viewer'>('landing');
  const [address, setAddress] = useState('');
  const [data, setData] = useState<UserWrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [act, setAct] = useState<ActId | null>(null);
  const [cardIndex, setCardIndex] = useState(0);

  const [seen, setSeen] = useLocalStorageState<Record<string, true>>('snw:seenCards:v1', {});
  const [favorites, setFavorites] = useLocalStorageState<Record<string, true>>('snw:favs:v1', {});

  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const actsExplored = useMemo(() => {
    const keys = Object.keys(seen);
    const explored = new Set(keys.map((k) => (k.startsWith('act1:') ? 1 : k.startsWith('act2:') ? 2 : null)).filter(Boolean) as number[]);
    return explored.size;
  }, [seen]);

  const unlockedActs: Record<ActId, boolean> = useMemo(() => {
    return {
      1: true,
      2: !!seen['act1:complete'],
      3: false,
      4: false,
      5: false,
      6: false,
    };
  }, [seen]);

  const cards = useMemo(() => {
    if (!data || !act) return [] as CardDef[];
    if (act === 1) return buildAct1Cards();
    if (act === 2) return buildAct2Cards();
    return [];
  }, [data, act]);

  const currentCard = cards[cardIndex];
  const currentCardKey = act && currentCard ? `act${act}:${currentCard.id}` : null;

  const actMeta = useMemo(() => (act ? ACTS.find((a) => a.id === act) ?? null : null), [act]);

  const markSeen = (key: string) => {
    if (seen[key]) return;
    setSeen((s) => ({ ...s, [key]: true }));
  };

  const markAct1CompleteIfReady = (nextIndex: number) => {
    if (act !== 1) return;
    if (nextIndex >= cards.length - 1) {
      setSeen((s) => ({ ...s, 'act1:complete': true }));
    }
  };

  const goToDashboard = () => {
    setScreen('dashboard');
    setAct(null);
    setCardIndex(0);
  };

  const goToViewer = (nextAct: ActId) => {
    setAct(nextAct);
    setCardIndex(0);
    setScreen('viewer');
  };

  const nextCard = () => {
    if (!cards.length) return;
    const next = clamp(cardIndex + 1, 0, cards.length - 1);
    setCardIndex(next);
    markAct1CompleteIfReady(next);
  };

  const prevCard = () => {
    if (!cards.length) return;
    setCardIndex((i) => clamp(i - 1, 0, cards.length - 1));
  };

  useKeyNav(prevCard, nextCard, screen === 'viewer');

  useEffect(() => {
    if (!currentCardKey) return;
    markSeen(currentCardKey);
  }, [currentCardKey]);

  const firstViewBurst = currentCardKey && !seen[currentCardKey];

  const onSubmit = async () => {
    setError(null);
    const v = validateAddress(address);
    if (!v.ok) {
      setError(v.msg);
      toast.error(v.msg);
      return;
    }

    setScreen('loading');
    try {
      const d = await fetchWrappedDummy(address.trim());
      setData(d);
      setScreen('dashboard');
      toast.success('LFG! Your Wrapped is ready.');
    } catch {
      setScreen('landing');
      setError('Failed to load. Retry?');
      toast.error('Failed to load.');
    }
  };

  const toggleFavorite = () => {
    if (!currentCardKey) return;
    setFavorites((f) => {
      const next = { ...f };
      if (next[currentCardKey]) delete next[currentCardKey];
      else next[currentCardKey] = true;
      return next;
    });
  };

  const shareText = useMemo(() => {
    if (!data || !currentCard) return '';
    return `Just got my @EndurFi Year on Starknet! 🚀 ${currentCard.shareText(data)} #YearOnStarknet #Starknet`;
  }, [data, currentCard]);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied caption. Ready to flex on X! 🐦');
    } catch {
      toast.error('Clipboard blocked. Try again?');
    }
  };

  const captureCardPng = async () => {
    if (!cardRef.current) throw new Error('No card ref');
    return await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#0B1226',
    });
  };

  const downloadPng = async () => {
    if (!currentCard) return;
    setShareBusy(true);
    try {
      const dataUrl = await captureCardPng();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `year-on-starknet-2024-${act ?? 'x'}-${currentCard.id}.png`;
      a.click();
      toast.success('PNG downloaded. Post it. 😤');
    } catch {
      toast.error('Could not render image. Screenshot works too.');
    } finally {
      setShareBusy(false);
    }
  };

  const copyImageToClipboard = async () => {
    setShareBusy(true);
    try {
      const dataUrl = await captureCardPng();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const ClipboardItemCtor = (globalThis as any).ClipboardItem as any;
      if (ClipboardItemCtor) {
        const item = new ClipboardItemCtor({ [blob.type]: blob });
        await (navigator.clipboard as any).write([item]);
        toast.success('Image copied. Ready to flex on X! 🐦');
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Copied caption (image copy unsupported).');
      }
    } catch {
      toast.error('Image copy blocked. Download PNG or screenshot.');
    } finally {
      setShareBusy(false);
    }
  };

  const onShare = () => {
    if (!currentCard) return;
    setShareOpen(true);
  };

  const onShareAll = () => {
    toast('Act summaries coming soon — for now, share your favorite card 😈', {
      icon: '✨',
      style: { background: 'rgba(15,23,42,0.92)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  return (
    <div className={cx('relative', brutal && 'snw-brutal-turquoise')}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: brutal ? '#001824' : '#0B1226',
            color: 'white',
            border: '3px solid #000',
            boxShadow: brutal ? '0 0 24px rgba(0,245,255,0.8)' : undefined,
          },
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70 snw-muted-text">
            <span className="rounded-full bg-black/40 px-3 py-1 cartoon-border snw-chip">YEAR ON STARKNET</span>
            <span>Built by Endur</span>
          </div>
          <NeonButton
            brutal={brutal}
            kind={brutal ? 'primary' : 'ghost'}
            onClick={() => setBrutal(!brutal)}
            ariaLabel="Toggle Turquoise brutalism mode"
            className="snw-accent-pill-soft"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Turquoise brutalism</span>
            <span className="sm:hidden">Brutal mode</span>
          </NeonButton>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {screen === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl snw-panel"
            >
              <div className="relative">
                <div
                  className="relative rounded-[26px] cartoon-border-thick p-8 snw-card"
                  style={{ borderColor: '#1bb388', backgroundColor: '#252b3d' }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white cartoon-border snw-accent-pill-soft"
                      style={{ borderColor: '#1bb388', backgroundColor: 'rgba(27, 179, 136, 0.15)' }}
                    >
                      <Sparkles className="h-4 w-4 text-[#1bb388]" />
                      Powered by <span className="font-black text-[#1bb388]">Endur</span>
                    </div>
                    <div className="text-xs text-white/80 font-semibold">Dark mode only • obviously</div>
                  </div>

                  <div className="mt-8">
                    <div className="text-4xl font-black tracking-tight cartoon-text">
                      <span className="text-[#1bb388]">YOUR YEAR ON STARKNET</span>
                      <span className="ml-2">🚀</span>
                    </div>
                    <div className="mt-2 text-lg font-black tracking-widest text-white cartoon-text snw-muted-text">2024 WRAPPED</div>
                    <div className="mt-3 text-sm text-white/65 snw-muted-text">Paste your address. We’ll turn it into pure dopamine.</div>
                  </div>

                  <div className="mt-8 grid gap-4">
                    <label className="text-sm font-bold text-[#1bb388] snw-accent-text">Starknet address</label>
                    <div
                      className={cx('rounded-2xl px-4 py-3 cartoon-border snw-input', error ? '' : '')}
                      style={{ borderColor: error ? '#ff4757' : '#1bb388', backgroundColor: '#1a1f2e' }}
                    >
                      <input
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setError(null);
                        }}
                        placeholder="0x..."
                        className="w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-white/60"
                        aria-label="Starknet address"
                        inputMode="text"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                    {error ? <div className="text-sm font-semibold text-rose-400">{error}</div> : <div className="text-xs font-medium text-white/70 snw-muted-text">Validation: starts with 0x, hex only.</div>}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
                      <NeonButton brutal={brutal} onClick={onSubmit} className="w-full py-4 text-base" ariaLabel="Lets go">
                        <Zap className="h-5 w-5" /> LET&apos;S GO 🎮
                      </NeonButton>
                    </motion.div>

                    <div className="mt-3 text-center text-xs font-medium text-white/70 snw-muted-text">
                      Pro tip: double-tap cards to favorite. Share your best flex.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

            {screen === 'loading' ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl snw-panel"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="text-base font-bold text-white">Fetching onchain vibes…</div>
                <Pill style={{ borderColor: '#1bb388', backgroundColor: '#1bb388', color: '#fff' }}>Loading</Pill>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <div className="mt-6 text-center text-xs text-white/50">No cap: dummy data mode for now. API wiring comes next.</div>
            </motion.div>
          ) : null}

            {screen === 'dashboard' && data ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-4xl font-black tracking-tight cartoon-text">
                    <span className="text-white">Welcome back, </span>
                    <span className="text-[#1bb388]">legend.</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <Pill style={{ borderColor: '#1bb388', backgroundColor: 'rgba(27, 179, 136, 0.15)', color: '#fff' }}>{shortAddr(data.address)}</Pill>
                    <Pill style={{ borderColor: '#1bb388', backgroundColor: '#1bb388', color: '#fff' }}>{actsExplored}/6 Acts explored</Pill>
                    {unlockedActs[2] ? <Pill style={{ borderColor: '#1bb388', backgroundColor: '#1bb388', color: '#fff' }}>Act 2 unlocked ✅</Pill> : <Pill style={{ borderColor: '#1bb388', backgroundColor: 'rgba(27, 179, 136, 0.15)', color: '#fff' }}>Unlock Act 2 by finishing Act 1</Pill>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NeonButton onClick={onShareAll} kind="ghost">
                    <Share2 className="h-4 w-4" /> Share All
                  </NeonButton>
                  <NeonButton
                    onClick={() => {
                      setData(null);
                      setAddress('');
                      setScreen('landing');
                      toast('Reset. New address, new arc.');
                    }}
                    kind="ghost"
                  >
                    <ArrowLeft className="h-4 w-4" /> Change address
                  </NeonButton>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ACTS.map((a) => {
                  const unlocked = unlockedActs[a.id];
                  const future = a.status === 'future';
                  const locked = !unlocked || future;
                  const preview = a.preview(data);

                  return (
                    <button
                      key={a.id}
                      onClick={() => {
                        if (locked) {
                          toast.error(future ? 'Soon™. Keep farming.' : 'Complete previous acts to unlock.');
                          return;
                        }
                        goToViewer(a.id);
                      }}
                      className={cx(
                        'group relative overflow-hidden rounded-3xl cartoon-border-thick p-6 text-left transition will-change-transform focus:outline-none',
                        'hover:scale-[1.02] active:scale-[0.98]',
                      )}
                      aria-label={`Act ${a.id} ${a.title}`}
                    >
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-black tracking-widest text-[#1bb388] cartoon-text">ACT {a.id}</div>
                            <div className="mt-2 text-2xl font-black tracking-tight cartoon-text text-white">{a.title}</div>
                            <div className="mt-1 text-sm font-bold text-white/90">{a.subtitle}</div>
                          </div>
                          <div className="text-3xl">{a.emoji}</div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-sm font-bold text-white">{preview}</div>
                          {locked ? (
                            <span
                              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black text-white cartoon-border"
                              style={{ borderColor: '#666', backgroundColor: 'rgba(102, 102, 102, 0.2)' }}
                            >
                              <Lock className="h-3.5 w-3.5" /> Locked
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black text-white cartoon-border"
                              style={{ borderColor: '#1bb388', backgroundColor: '#1bb388' }}
                            >
                              <BadgeCheck className="h-3.5 w-3.5" /> Unlocked
                            </span>
                          )}
                        </div>

                        <div className="mt-4 h-1 w-full rounded-full" style={{ backgroundColor: unlocked ? 'rgba(27, 179, 136, 0.3)' : 'rgba(102, 102, 102, 0.2)' }} />
                        <div className="mt-4 text-xs font-semibold text-white/80">
                          {locked ? (future ? 'Future Act. We’re cooking.' : 'Complete previous acts to unlock this chapter.') : 'Tap to enter. Swipe cards. Screenshot everything.'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : null}

            {screen === 'viewer' && data && act && actMeta && currentCard ? (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <NeonButton brutal={brutal} onClick={goToDashboard} kind="ghost" ariaLabel="Back to dashboard">
                  <ArrowLeft className="h-4 w-4" /> Back
                </NeonButton>

                <div className="text-center">
                  <div className="text-xs font-extrabold tracking-widest text-white/60">ACT {act} — {actMeta.title}</div>
                  <div className="mt-1 text-sm text-white/70">{cardIndex + 1}/{cards.length}</div>
                </div>

                <div className="flex items-center gap-2">
                  <NeonButton brutal={brutal} onClick={onShare} kind="ghost" ariaLabel="Share">
                    <Share2 className="h-4 w-4" /> Share
                  </NeonButton>
                </div>
              </div>

              <div className="relative mx-auto max-w-3xl">

                <div className="relative">
                  <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                    drag={reduce ? false : 'x'}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                      const dx = info.offset.x;
                      if (dx < -80) nextCard();
                      if (dx > 80) prevCard();
                    }}
                    onDoubleClick={toggleFavorite}
                    className="select-none"
                    role="group"
                    aria-label="Wrapped card"
                  >
                    <div ref={cardRef} className="relative">
                      <GlassCard brutal={brutal} gradient={currentCard.gradient} glow={currentCard.glow} className="min-h-[540px]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            {currentCard.kicker ? (
                              <div className="text-xs font-extrabold tracking-widest text-white/60">{currentCard.kicker}</div>
                            ) : null}
                            <div className="mt-2 text-2xl font-black tracking-tight">{currentCard.title}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={toggleFavorite}
                              className={cx(
                                'rounded-2xl border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20',
                                favorites[currentCardKey ?? '']
                                  ? 'border-rose-400/30 bg-rose-400/15 text-rose-100'
                                  : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10',
                              )}
                              aria-label="Favorite"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Heart className={cx('h-4 w-4', favorites[currentCardKey ?? ''] && 'fill-rose-300')} />
                                {favorites[currentCardKey ?? ''] ? 'Faved' : 'Fav'}
                              </span>
                            </button>

                            <div className="inline-flex items-center gap-2 rounded-2xl cartoon-border px-3 py-2 text-xs font-bold text-white" style={{ borderColor: '#1bb388', backgroundColor: 'rgba(27, 179, 136, 0.15)' }}>
                              {currentCard.icon ?? <Sparkles className="h-4 w-4" />}
                              <span className="hidden sm:inline">Swipe</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">{currentCard.render(data)}</div>

                        <div className="mt-10 flex items-center justify-between gap-3">
                          <div className="text-xs text-white/55">Double-tap to favorite • Arrow keys supported</div>
                          <div className="flex items-center gap-2">
                            <NeonButton brutal={brutal} onClick={copyShare} kind="ghost" ariaLabel="Copy caption">
                              <Copy className="h-4 w-4" /> Copy
                            </NeonButton>
                            <NeonButton brutal={brutal} onClick={onShare} kind="primary" ariaLabel="Share card">
                              <Share2 className="h-4 w-4" /> Share
                            </NeonButton>
                          </div>
                        </div>
                      </GlassCard>

                      {firstViewBurst ? <SparkleBurst seed={currentCardKey ?? currentCard.id} /> : null}
                    </div>
                  </motion.div>

                  <div className="mt-6 flex items-center justify-between">
                    <NeonButton brutal={brutal} onClick={prevCard} kind="ghost" disabled={cardIndex === 0} ariaLabel="Previous card">
                      <ArrowLeft className="h-4 w-4" /> Prev
                    </NeonButton>

                    <div className="flex items-center gap-2">
                      {cards.map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => setCardIndex(i)}
                          className={cx(
                            'h-2.5 w-2.5 rounded-full border border-white/10 transition',
                            i === cardIndex ? 'bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.35)]' : 'bg-white/10 hover:bg-white/20',
                          )}
                          aria-label={`Go to card ${i + 1}`}
                        />
                      ))}
                    </div>

                    <NeonButton brutal={brutal} onClick={nextCard} kind="ghost" disabled={cardIndex === cards.length - 1} ariaLabel="Next card">
                      Next <ArrowRight className="h-4 w-4" />
                    </NeonButton>
                  </div>

                  {act === 1 && unlockedActs[2] ? (
                    <div className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-400/10 p-5 text-sm text-emerald-100">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-grid h-9 w-9 place-items-center rounded-2xl bg-emerald-400/15">
                          <BadgeCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-extrabold">Act 2 unlocked.</div>
                          <div className="mt-1 text-emerald-100/80">You’re officially a liquid legend. Go pick Act 2 on the dashboard.</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                title={shareBusy ? 'Rendering…' : 'Share this card'}
                description={shareBusy ? 'Hold tight — making a crisp PNG.' : 'Copy the image or download a PNG.'}
                onCopy={copyImageToClipboard}
                onDownload={downloadPng}
              />

              <div className="mt-8 text-center text-xs text-white/45">
                Made for degens • Built to go viral • Powered by Endur
              </div>
            </motion.div>
          ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
