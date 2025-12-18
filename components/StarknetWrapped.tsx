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
  const reduce = useReducedMotion();
  const orbs = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const left = (i * 17 + 7) % 100;
        const top = (i * 23 + 9) % 100;
        const size = 180 + (i % 4) * 120;
        const hue = [265, 325, 195, 145][i % 4];
        return { i, left, top, size, hue };
      }),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {orbs.map((o) => (
        <motion.div
          key={o.i}
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle at 30% 30%, hsla(${o.hue}, 95%, 65%, 0.55), transparent 60%)`,
          }}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, (o.i % 2 ? 18 : -18), 0],
                  y: [0, (o.i % 3 ? -22 : 22), 0],
                  scale: [1, 1.06, 1],
                }
          }
          transition={{ duration: 10 + o.i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
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
}: {
  children: React.ReactNode;
  className?: string;
  gradient: string;
  glow: string;
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl',
        className,
      )}
    >
      <div className={cx('pointer-events-none absolute -inset-24 opacity-60 blur-3xl', gradient)} />
      <div className={cx('pointer-events-none absolute inset-0 opacity-70', glow)} />
      <div className="relative">{children}</div>
    </div>
  );
}

function NeonButton({
  children,
  onClick,
  disabled,
  kind = 'primary',
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  kind?: 'primary' | 'ghost' | 'danger';
  className?: string;
  ariaLabel?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition will-change-transform focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

  const styles =
    kind === 'ghost'
      ? 'border border-white/10 bg-white/5 hover:bg-white/10'
      : kind === 'danger'
        ? 'bg-gradient-to-r from-rose-500/90 to-orange-500/90 shadow-[0_0_30px_rgba(244,63,94,0.35)] hover:brightness-110'
        : 'bg-gradient-to-r from-violet-500/90 via-fuchsia-500/90 to-cyan-400/90 shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110';

  return (
    <button aria-label={ariaLabel} disabled={disabled} onClick={onClick} className={cx(base, styles, className)}>
      {children}
    </button>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cx('rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80', className)}>{children}</span>;
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="h-6 w-44 rounded-lg bg-white/10" />
      <div className="mt-6 h-16 w-2/3 rounded-2xl bg-white/10" />
      <div className="mt-3 h-4 w-1/2 rounded-lg bg-white/10" />
      <div className="mt-10 grid grid-cols-3 gap-3">
        <div className="h-10 rounded-2xl bg-white/10" />
        <div className="h-10 rounded-2xl bg-white/10" />
        <div className="h-10 rounded-2xl bg-white/10" />
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-x-24 top-0 h-full -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
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
    gradient: 'bg-gradient-to-br from-violet-500/40 via-indigo-500/10 to-cyan-400/30',
    glow: 'shadow-[0_0_45px_rgba(6,182,212,0.20)]',
    accent: 'from-cyan-400 to-violet-500',
    preview: (d) => `${formatCompact(d.act1.totalTransactions)} txs • ${d.act1.mostActiveMonth} peak`,
    status: 'live',
  },
  {
    id: 2,
    emoji: '🌊',
    title: 'LIQUID STAKING',
    subtitle: 'Staked. Liquid. Drippy.',
    gradient: 'bg-gradient-to-br from-cyan-400/40 via-sky-500/15 to-blue-600/35',
    glow: 'shadow-[0_0_45px_rgba(6,182,212,0.26)]',
    accent: 'from-cyan-400 to-blue-600',
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
    gradient: 'bg-gradient-to-br from-fuchsia-500/35 via-pink-500/10 to-violet-500/30',
    glow: 'shadow-[0_0_45px_rgba(236,72,153,0.20)]',
    accent: 'from-fuchsia-500 to-violet-500',
    preview: () => 'Future Act • LFG',
    status: 'future',
  },
  {
    id: 5,
    emoji: '🌍',
    title: 'NETWORK IMPACT',
    subtitle: 'Soon™',
    gradient: 'bg-gradient-to-br from-emerald-400/35 via-cyan-400/10 to-teal-500/30',
    glow: 'shadow-[0_0_45px_rgba(16,185,129,0.20)]',
    accent: 'from-emerald-400 to-cyan-400',
    preview: () => 'Future Act • WAGMI',
    status: 'future',
  },
  {
    id: 6,
    emoji: '🔮',
    title: '2025 PREDICTIONS',
    subtitle: 'Soon™',
    gradient: 'bg-gradient-to-br from-violet-500/35 via-fuchsia-500/10 to-pink-500/30',
    glow: 'shadow-[0_0_45px_rgba(139,92,246,0.20)]',
    accent: 'from-violet-500 to-pink-500',
    preview: () => 'Future Act • You’re early',
    status: 'future',
  },
];

function buildAct1Cards(): CardDef[] {
  const grad = 'bg-gradient-to-br from-violet-500/45 via-indigo-500/10 to-cyan-400/35';
  const glow = 'shadow-[0_0_55px_rgba(139,92,246,0.22)]';

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
            <Pill className="border-violet-400/30 bg-violet-500/10">GM ANON 🫡</Pill>
            <Pill className="border-cyan-400/30 bg-cyan-400/10">{shortAddr(d.address)}</Pill>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">{d.act1.accountAge}</span>{' '}
              <span className="text-white/90">days on Starknet</span>
            </div>
            <div className="mt-3 text-white/75">First tx: {d.act1.firstTxDate} • You’ve been cooking ever since.</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Transactions</div>
              <div className="mt-1 text-xl font-bold">
                <CountUp value={d.act1.totalTransactions} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
              <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                <CountUp value={d.act1.totalTransactions} />
              </span>
            </div>
            <div className="mt-2 text-white/75">Total transactions sent in 2024.</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Most active month</div>
              <div className="mt-1 text-xl font-bold">{d.act1.mostActiveMonth}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
            <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">{formatUSD(d.act1.gasSavedUSD)}</span>
          </div>
          <div className="mt-2 text-white/75">Estimated gas saved vs. doing this on L1.</div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Also saved</span>
              <span className="font-semibold">{d.act1.gasSavedETH} ETH</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
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
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              <CountUp value={d.act1.uniqueContracts} />
            </span>
          </div>
          <div className="mt-2 text-white/75">Unique contracts you interacted with.</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Vibe check</div>
              <div className="mt-1 text-sm font-semibold">Curious degen ✅</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
  const grad = 'bg-gradient-to-br from-cyan-400/45 via-sky-500/12 to-blue-700/40';
  const glow = 'shadow-[0_0_55px_rgba(6,182,212,0.26)]';

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
            <Pill className="border-cyan-400/30 bg-cyan-400/10">Season 1</Pill>
            <Pill className="border-blue-400/30 bg-blue-500/10">{d.act2.liquidStaking.season1Rank}</Pill>
          </div>
          <div className="mt-8">
            <div className="text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-blue-200 bg-clip-text text-transparent">
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
            <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
              <CountUp value={d.act2.liquidStaking.season1Points} />
            </span>
          </div>
          <div className="mt-2 text-white/75">Season 1 points. Rank: {d.act2.liquidStaking.season1Rank}</div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Staking days</div>
              <div className="mt-1 text-xl font-bold">
                <CountUp value={d.act2.liquidStaking.stakingDays} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="text-xs text-white/70">You</div>
                <div className="mt-1 text-3xl font-black">{youApr}%</div>
                <div className="mt-1 text-xs text-white/70">LP positions: {d.act2.liquidStaking.lpPositions}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
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
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Total staked</div>
              <div className="mt-1 text-xl font-bold">{formatCompact(d.act2.nativeStaking.totalStakedSTRK)} STRK</div>
              <div className="mt-1 text-xs text-white/60">+ {d.act2.nativeStaking.totalStakedBTC} BTC</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Native APR</div>
              <div className="mt-1 text-xl font-bold">{d.act2.nativeStaking.nativeAPR}%</div>
              <div className="mt-1 text-xs text-white/60">Rewards: {formatUSD(d.act2.nativeStaking.rewardsEarnedUSD)}</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">Validators you backed</div>
            <div className="mt-3 grid gap-2">
              {d.act2.nativeStaking.validators.slice(0, 4).map((v) => (
                <div key={v.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-3 py-2">
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
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
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
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
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

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
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
    <div className="relative">
      <Toaster position="top-center" toastOptions={{
        style: { background: 'rgba(15,23,42,0.92)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' },
      }} />
      <FloatingOrbs />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {screen === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl"
            >
              <div className="relative">
                <div className="pointer-events-none absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 opacity-80 blur" />
                <div className="pointer-events-none absolute -inset-[2px] rounded-[30px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 opacity-40" />
                <div className="relative rounded-[26px] border border-white/10 bg-[#0b1226]/80 p-8 shadow-[0_0_70px_rgba(139,92,246,0.22)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      <Sparkles className="h-4 w-4 text-amber-200" />
                      Powered by <span className="font-semibold text-white/85">Endur</span>
                    </div>
                    <div className="text-xs text-white/60">Dark mode only • obviously</div>
                  </div>

                  <div className="mt-8">
                    <div className="text-4xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">YOUR YEAR ON STARKNET</span>
                      <span className="ml-2">🚀</span>
                    </div>
                    <div className="mt-2 text-lg font-extrabold tracking-widest text-white/80">2024 WRAPPED</div>
                    <div className="mt-3 text-sm text-white/65">Paste your address. We’ll turn it into pure dopamine.</div>
                  </div>

                  <div className="mt-8 grid gap-3">
                    <label className="text-xs font-semibold text-white/70">Starknet address</label>
                    <div className={cx('rounded-2xl border bg-white/5 px-4 py-3', error ? 'border-rose-400/40' : 'border-white/10')}>
                      <input
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setError(null);
                        }}
                        placeholder="0x..."
                        className="w-full bg-transparent text-sm text-white/90 outline-none placeholder:text-white/35"
                        aria-label="Starknet address"
                        inputMode="text"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                    {error ? <div className="text-xs text-rose-200">{error}</div> : <div className="text-xs text-white/50">Validation: starts with 0x, hex only.</div>}

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
                      <NeonButton onClick={onSubmit} className="w-full py-4 text-base" ariaLabel="Lets go">
                        <Zap className="h-5 w-5" /> LET&apos;S GO 🎮
                      </NeonButton>
                    </motion.div>

                    <div className="mt-2 text-center text-xs text-white/45">
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
              className="w-full max-w-3xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-white/70">Fetching onchain vibes…</div>
                <Pill className="border-cyan-400/25 bg-cyan-400/10">Loading</Pill>
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
                  <div className="text-3xl font-black tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">Welcome back, legend.</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
                    <Pill className="border-white/10 bg-white/5">{shortAddr(data.address)}</Pill>
                    <Pill className="border-amber-400/25 bg-amber-400/10">{actsExplored}/6 Acts explored</Pill>
                    {unlockedActs[2] ? <Pill className="border-emerald-400/25 bg-emerald-400/10">Act 2 unlocked ✅</Pill> : <Pill className="border-white/10 bg-white/5">Unlock Act 2 by finishing Act 1</Pill>}
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
                        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl transition will-change-transform focus:outline-none focus:ring-2 focus:ring-white/20',
                        'hover:scale-[1.01] hover:bg-white/7 active:scale-[0.99]',
                      )}
                      aria-label={`Act ${a.id} ${a.title}`}
                    >
                      <div className={cx('pointer-events-none absolute -inset-24 opacity-80 blur-3xl', a.gradient)} />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-extrabold tracking-widest text-white/60">ACT {a.id}</div>
                            <div className="mt-2 text-xl font-black tracking-tight">{a.title}</div>
                            <div className="mt-1 text-sm text-white/70">{a.subtitle}</div>
                          </div>
                          <div className="text-3xl">{a.emoji}</div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-xs text-white/60">{preview}</div>
                          {locked ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs font-semibold text-white/70">
                              <Lock className="h-3.5 w-3.5" /> Locked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                              <BadgeCheck className="h-3.5 w-3.5" /> Unlocked
                            </span>
                          )}
                        </div>

                        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        <div className="mt-4 text-xs text-white/60">
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
                <NeonButton onClick={goToDashboard} kind="ghost" ariaLabel="Back to dashboard">
                  <ArrowLeft className="h-4 w-4" /> Back
                </NeonButton>

                <div className="text-center">
                  <div className="text-xs font-extrabold tracking-widest text-white/60">ACT {act} — {actMeta.title}</div>
                  <div className="mt-1 text-sm text-white/70">{cardIndex + 1}/{cards.length}</div>
                </div>

                <div className="flex items-center gap-2">
                  <NeonButton onClick={onShare} kind="ghost" ariaLabel="Share">
                    <Share2 className="h-4 w-4" /> Share
                  </NeonButton>
                </div>
              </div>

              <div className="relative mx-auto max-w-3xl">
                <div className="absolute -inset-10 -z-10 blur-3xl opacity-70" />

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
                      <GlassCard gradient={currentCard.gradient} glow={currentCard.glow} className="min-h-[540px]">
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

                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                              {currentCard.icon ?? <Sparkles className="h-4 w-4" />}
                              <span className="hidden sm:inline">Swipe</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">{currentCard.render(data)}</div>

                        <div className="mt-10 flex items-center justify-between gap-3">
                          <div className="text-xs text-white/55">Double-tap to favorite • Arrow keys supported</div>
                          <div className="flex items-center gap-2">
                            <NeonButton onClick={copyShare} kind="ghost" ariaLabel="Copy caption">
                              <Copy className="h-4 w-4" /> Copy
                            </NeonButton>
                            <NeonButton onClick={onShare} kind="primary" ariaLabel="Share card">
                              <Share2 className="h-4 w-4" /> Share
                            </NeonButton>
                          </div>
                        </div>
                      </GlassCard>

                      {firstViewBurst ? <SparkleBurst seed={currentCardKey ?? currentCard.id} /> : null}
                    </div>
                  </motion.div>

                  <div className="mt-6 flex items-center justify-between">
                    <NeonButton onClick={prevCard} kind="ghost" disabled={cardIndex === 0} ariaLabel="Previous card">
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

                    <NeonButton onClick={nextCard} kind="ghost" disabled={cardIndex === cards.length - 1} ariaLabel="Next card">
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
  );
}
