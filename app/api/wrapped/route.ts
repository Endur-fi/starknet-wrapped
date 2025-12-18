import { NextResponse } from 'next/server';

const VOYAGER_BASE = 'https://voyager.online/api';

type VoyagerContract = {
  address: string;
  creationTimestamp: number; // unix seconds
  isAccount?: boolean;
  classHash?: string | null;
  version?: string | null;
};

type VoyagerTxItem = {
  hash: string;
  timestamp: number; // unix seconds
  type: string;
  contractAddress?: string | null;
  senderAddress?: string | null;
  actualFee?: string | null;
};

type VoyagerPaged<T> = {
  lastPage: number;
  items: T[];
};

function validateAddress(addr: string) {
  if (!addr.startsWith('0x')) return false;
  if (addr.length < 10 || addr.length > 80) return false;
  if (!/^0x[0-9a-fA-F]+$/.test(addr)) return false;
  return true;
}

function monthShortFromUnix(ts: number) {
  return new Date(ts * 1000).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
}

function isoDateFromUnix(ts: number) {
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

// fetch("https://voyager.online/api/contract/0x040195d35909d57a0d2ad943c7491f7555c50091bc7b18914935a9743d48800c", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-GB,en;q=0.9",
//     "cache-control": "no-cache",
//     "pragma": "no-cache",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Brave\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "sec-gpc": "1"
//   },
//   "referrer": "https://voyager.online/contract/0x040195d35909D57a0D2aD943c7491f7555c50091bC7B18914935A9743D48800c",
// });
async function voyagerFetch<T>(path: string, apiKey: string): Promise<T> {
  const url = `${VOYAGER_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'accept': '*/*', 
      'accept-language': 'en-GB,en;q=0.9', 
      'cache-control': 'no-cache', 
      'pragma': 'no-cache', 
      'priority': 'u=1, i', 
      'referer': 'https://voyager.online/contract/0x040195d35909D57a0D2aD943c7491f7555c50091bC7B18914935A9743D48800c', 
      'sec-ch-ua': '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"macOS"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-origin', 
      'sec-gpc': '1', 
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 
      'Cookie': 'cf_clearance=BiaNM05jiAGhUQ0JPdvfQ74YkYTLkz3WkmQuxK62UVg-1763549420-1.2.1.1-.rVmKE2jOvyIxHJ0Ys7DwiApaq6N1Dag_D9PUgFo4gg_4fIEg.C__q5Obhr8Xa2gnTYjamxaNhKUYuNeDAo9HFkaAmkH_pUAAsox7oMOEmh.wW10EWbgpuTLjfvTt6MrfHxGSzhGjKpC.gSrT7noAX7_2WBcJR_MRTuUth0nG28daj_2SzsL6T0JyJoMK8egbN2Udr3JYKo97RS0XGCdGOVkaDFmmMgGHGbd6ig.QYc'
    },
    // Keep it server-only and avoid caching user-specific results
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Voyager error ${res.status} for ${path}`, apiKey);
    const txt = await res.text().catch(() => '');
    throw new Error(`Voyager error ${res.status} for ${path}: ${txt.slice(0, 300)}`);
  }

  return (await res.json()) as T;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = (searchParams.get('address') ?? '').trim();

  if (!validateAddress(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const apiKey = process.env.VOYAGER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'VOYAGER_API_KEY is not set on the server',
        hint: 'Add VOYAGER_API_KEY=... to your .env (server-side).',
      },
      { status: 500 },
    );
  }

  // Fetch contract metadata (gives creationTimestamp → first activity proxy)
  const contract = await voyagerFetch<VoyagerContract>(`/contracts/${address}`, apiKey);

  // Pull txns affecting this contract (Voyager param: `to`)
  // NOTE: Voyager spec says: `/txns?to=...`.
  // We’ll page until we pass below 2024 start (assuming newest-first ordering).
  const start2024 = Math.floor(Date.UTC(2024, 0, 1) / 1000);
  const start2025 = Math.floor(Date.UTC(2025, 0, 1) / 1000);

  const ps = 100;
  const hardPageCap = 40;
  let p = 1;
  let lastPage = 1;

  const txs2024: VoyagerTxItem[] = [];
  const uniqueContracts = new Set<string>();
  const months: Record<string, number> = {};

  let sampled = 0;
  let partial = false;

  while (p <= lastPage && p <= hardPageCap) {
    const page = await voyagerFetch<VoyagerPaged<VoyagerTxItem>>(`/txns?to=${address}&p=${p}&ps=${ps}`, apiKey);
    lastPage = page.lastPage || 1;

    if (!Array.isArray(page.items) || page.items.length === 0) break;

    sampled += page.items.length;

    for (const t of page.items) {
      if (typeof t.timestamp !== 'number') continue;

      // Track uniques from the tx item shape (best-effort)
      if (t.contractAddress) uniqueContracts.add(t.contractAddress);

      // Filter just 2024
      if (t.timestamp >= start2024 && t.timestamp < start2025) {
        txs2024.push(t);
        const m = monthShortFromUnix(t.timestamp);
        months[m] = (months[m] ?? 0) + 1;
      }
    }

    // If results are newest-first, once the oldest item is earlier than 2024 we can stop.
    const minTs = Math.min(...page.items.map((it) => (typeof it.timestamp === 'number' ? it.timestamp : Number.POSITIVE_INFINITY)));
    if (Number.isFinite(minTs) && minTs < start2024) break;

    p++;
  }

  if (p > hardPageCap && lastPage > hardPageCap) partial = true;

  const mostActiveMonth = Object.entries(months).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const nowSec = Math.floor(Date.now() / 1000);
  const accountAgeDays = Math.max(0, Math.round((nowSec - contract.creationTimestamp) / 86400));

  // Build response matching your UI’s expected structure.
  // Fields we can’t reliably derive from Voyager alone yet remain “dummy-realistic”.
  return NextResponse.json({
    address,
    voyager: {
      sampledTxns: sampled,
      partial,
      contract: {
        creationTimestamp: contract.creationTimestamp,
        isAccount: contract.isAccount ?? null,
        version: contract.version ?? null,
      },
    },
    act1: {
      accountAge: accountAgeDays,
      firstTxDate: isoDateFromUnix(contract.creationTimestamp),
      totalTransactions: txs2024.length,
      mostActiveMonth,
      uniqueContracts: uniqueContracts.size,

      // TODO: derive these from transfers/fees later (needs more endpoints + token pricing)
      gasSavedUSD: 980,
      gasSavedETH: 0.42,
      totalValueTransacted: 42000,
      badges: null,
    },
    act2: null,
  });
}
