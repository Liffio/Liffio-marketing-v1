import { initials, safeLogoUrl } from "@/lib/partner-claim";

/*
  The partner logo strip (partner rewards SPEC 9.7): companies that give their customers Liffio.
  Only partners that are active and that a Liffio admin has turned on for the site come back
  from the API, so nothing shows until someone chooses to show it. With none, this renders
  nothing at all: no heading, no empty box.

  Server-side, cached for an hour like the API's own Cache-Control. A failed or slow call is
  treated as an empty list, so the page around it never waits on it for long or breaks.
*/

export type WallItem = { name: string; logoUrl: string | null; website: string | null };

const API = (process.env.NEXT_PUBLIC_API_URL ?? "https://api.liffio.com").replace(/\/$/, "");

/** Only an http(s) website is linked; anything else shows the logo unlinked. */
const safeWebsite = (url: string | null): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
};

export async function fetchPartnerWall(): Promise<WallItem[]> {
  try {
    const res = await fetch(`${API}/api/v1/public/partners/wall`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { items?: unknown };
    if (!Array.isArray(body.items)) return [];
    return body.items.filter(
      (i): i is WallItem => typeof i === "object" && i !== null && typeof (i as WallItem).name === "string" && (i as WallItem).name.trim().length > 0,
    );
  } catch {
    return [];
  }
}

function Tile({ item }: { item: WallItem }) {
  const logo = safeLogoUrl(item.logoUrl);
  const inner = logo ? (
    // eslint-disable-next-line @next/next/no-img-element -- partner logos live on our R2 bucket, outside next/image's remote patterns
    <img src={logo} alt={item.name} loading="lazy" decoding="async" className="h-9 w-auto max-w-[140px] object-contain" />
  ) : (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="plw-ini grid h-9 w-9 place-items-center rounded-[10px] bg-[#F3EEE8] text-[12px] font-bold text-[#625551]"
        style={{ fontFamily: "var(--font-outfit, sans-serif)" }}
      >
        {initials(item.name)}
      </span>
      <span className="plw-name text-[14px] font-semibold text-[#2A1916]">{item.name}</span>
    </span>
  );
  const site = safeWebsite(item.website);
  return (
    <li className="flex items-center">
      {site ? (
        <a
          href={site}
          target="_blank"
          rel="noopener nofollow"
          aria-label={logo ? undefined : `${item.name} (opens their website)`}
          className="flex items-center rounded-lg opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100"
        >
          {inner}
        </a>
      ) : (
        <span className="flex items-center opacity-80">{inner}</span>
      )}
    </li>
  );
}

/** The strip. `items` lets a page that already fetched the list pass it in. */
export default async function PartnerLogoWall({ items, title = "Partners who give their customers Liffio" }: { items?: WallItem[]; title?: string }) {
  const list = items ?? (await fetchPartnerWall());
  if (list.length === 0) return null;
  return (
    <section aria-label="Liffio partners" className="plw py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="plw-title text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8C807C]">{title}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {list.map((item, i) => (
            <Tile key={`${item.name}-${i}`} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
