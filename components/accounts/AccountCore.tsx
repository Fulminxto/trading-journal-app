import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  ClipboardCheck,
  Database,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

type CoreSector = {
  label: string;
  value: string;
  detail: string;
  href: string;
  icon: LucideIcon;
  tone: string;
};

function SectorLink({ sector }: { sector: CoreSector }) {
  const Icon = sector.icon;

  return (
    <Link
      href={sector.href}
      className="group relative z-20 flex items-start gap-3 rounded-inner border-[0.5px] border-flash/[0.09] bg-surface-2/60 p-4 outline-none backdrop-blur-md transition-all duration-base hover:-translate-y-0.5 hover:border-accent-bright/30 hover:bg-surface-2/75 focus-visible:ring-2 focus-visible:ring-accent-bright/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-1/80 text-muted transition-colors duration-base group-hover:text-accent-bright">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-micro uppercase tracking-label text-muted-faint">
          {sector.label}
        </span>
        <span className={`mt-1.5 block break-words text-subsection font-semibold tabular-nums ${sector.tone}`}>
          {sector.value}
        </span>
        <span className="mt-1 block text-caption leading-5 text-muted">
          {sector.detail}
        </span>
      </span>
      <ArrowUpRight
        size={15}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-muted-faint transition-colors duration-base group-hover:text-accent-bright"
      />
    </Link>
  );
}

function DataWaves() {
  const paths = [
    "M-30 170 C110 82 228 100 350 203 C410 252 445 256 500 256 C555 256 590 251 650 203 C772 100 890 82 1030 170",
    "M-30 205 C126 130 238 132 357 218 C414 259 452 265 500 265 C548 265 586 259 643 218 C762 132 874 130 1030 205",
    "M-30 246 C128 190 254 174 370 231 C422 257 458 272 500 272 C542 272 578 257 630 231 C746 174 872 190 1030 246",
    "M-30 286 C130 330 250 334 370 293 C424 275 458 278 500 278 C542 278 576 275 630 293 C750 334 870 330 1030 286",
    "M-30 326 C118 394 246 382 360 310 C418 273 454 286 500 286 C546 286 582 273 640 310 C754 382 882 394 1030 326",
    "M-30 362 C110 444 238 414 350 323 C410 275 448 294 500 294 C552 294 590 275 650 323 C762 414 890 444 1030 362",
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 520"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[330px] -translate-y-1/2 overflow-visible"
    >
      <defs>
        <linearGradient id="voltis-wave" x1="0" x2="1">
          <stop offset="0" stopColor="#173a67" stopOpacity="0" />
          <stop offset="0.18" stopColor="#286ea9" stopOpacity="0.5" />
          <stop offset="0.46" stopColor="#67e8f9" stopOpacity="0.12" />
          <stop offset="0.54" stopColor="#67e8f9" stopOpacity="0.12" />
          <stop offset="0.82" stopColor="#278bc1" stopOpacity="0.48" />
          <stop offset="1" stopColor="#173a67" stopOpacity="0" />
        </linearGradient>
        <filter id="voltis-node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {paths.map((path, index) => (
        <g key={path} opacity={0.42 + index * 0.07}>
          <path d={path} fill="none" stroke="url(#voltis-wave)" strokeWidth={index === 2 || index === 3 ? 1.2 : 0.75} />
          <path
            d={path}
            fill="none"
            stroke={index === 1 ? "#8bf3ff" : "#36bde8"}
            strokeWidth={index === 1 ? 1.5 : 1}
            strokeLinecap="round"
            strokeDasharray="2 150 1 210"
            className="voltis-wave-pulse"
            style={{ animationDelay: `${index * -3.1}s`, animationDuration: `${17 + index}s` }}
          />
        </g>
      ))}
      <g fill="#73ebff">
        <circle cx="145" cy="151" r="1.6" opacity="0.6" />
        <circle cx="238" cy="331" r="1.2" opacity="0.45" />
        <circle cx="795" cy="173" r="1.5" opacity="0.55" />
        <circle cx="876" cy="345" r="1.2" opacity="0.5" />
        <circle cx="110" cy="292" r="4" opacity="0.1" filter="url(#voltis-node-glow)" />
      </g>
      <circle cx="905" cy="242" r="1.1" fill="#ff746c" opacity="0.45" />
      <circle cx="72" cy="226" r="1.1" fill="#70d99a" opacity="0.4" />
    </svg>
  );
}

const shards = [
  { points: "31,2 48,22 19,31", className: "left-[17%] top-[28%] h-10 w-12 -rotate-12" },
  { points: "8,4 39,14 16,36", className: "left-[27%] top-[59%] h-9 w-10 rotate-12" },
  { points: "22,2 42,34 8,26", className: "left-[35%] top-[19%] h-8 w-10 rotate-6" },
  { points: "6,12 41,3 29,35", className: "right-[32%] top-[21%] h-9 w-11 -rotate-6" },
  { points: "13,2 44,25 6,36", className: "right-[24%] top-[57%] h-10 w-12 -rotate-12" },
  { points: "5,7 35,16 22,39", className: "right-[16%] top-[35%] h-9 w-10 rotate-12" },
  { points: "20,2 43,31 7,24", className: "left-[40%] top-[74%] hidden h-8 w-10 md:block rotate-6" },
  { points: "4,18 38,3 31,34", className: "right-[40%] top-[75%] hidden h-8 w-10 md:block -rotate-6" },
];

function CrystalShards() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      {shards.map((shard, index) => (
        <svg
          key={`${shard.points}-${index}`}
          viewBox="0 0 50 42"
          className={`voltis-shard absolute ${shard.className}`}
          style={{ animationDelay: `${index * -1.7}s`, animationDuration: `${9 + (index % 4) * 2}s` }}
        >
          <defs>
            <linearGradient id={`shard-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#18334a" stopOpacity="0.7" />
              <stop offset="1" stopColor="#03070d" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polygon points={shard.points} fill={`url(#shard-${index})`} stroke="rgba(91,224,255,0.32)" strokeWidth="0.8" />
          <path d="M13 8 L27 25 L38 12" fill="none" stroke="rgba(187,244,255,0.12)" strokeWidth="0.6" />
        </svg>
      ))}
    </div>
  );
}

function Singularity({ accountName, status }: { accountName: string; status: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative h-56 w-56 sm:h-60 sm:w-60 xl:h-[280px] xl:w-[280px]">
        <div aria-hidden="true" className="absolute inset-[3%] rounded-full bg-cyan-300/[0.08] blur-2xl" />
        <svg aria-hidden="true" viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="singularity-depth" cx="46%" cy="42%" r="62%">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.7" stopColor="#010205" />
              <stop offset="0.9" stopColor="#07121c" />
              <stop offset="1" stopColor="#46dff4" stopOpacity="0.72" />
            </radialGradient>
            <linearGradient id="fracture-light" x1="0" y1="1" x2="1" y2="0">
              <stop stopColor="#28a7d7" stopOpacity="0" />
              <stop offset="0.28" stopColor="#79efff" />
              <stop offset="0.55" stopColor="#f4fdff" />
              <stop offset="0.82" stopColor="#55dff5" />
              <stop offset="1" stopColor="#1d83b7" stopOpacity="0" />
            </linearGradient>
            <filter id="fracture-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="150" cy="150" r="143" fill="none" stroke="#4de4f5" strokeOpacity="0.08" strokeWidth="5" />
          <circle cx="150" cy="150" r="137" fill="url(#singularity-depth)" stroke="#9af5ff" strokeOpacity="0.42" strokeWidth="1.2" />
          <ellipse cx="150" cy="151" rx="132" ry="130" fill="#000" opacity="0.78" />
          <path d="M72 224 L101 195 L112 176 L133 164 L143 143 L162 132 L174 106 L195 91 L229 58" fill="none" stroke="#35c9eb" strokeOpacity="0.22" strokeWidth="10" filter="url(#fracture-glow)" />
          <path d="M70 226 L99 196 L111 178 L131 165 L142 145 L161 133 L172 107 L194 92 L231 56" fill="none" stroke="url(#fracture-light)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#fracture-glow)" />
          <path d="M112 177 L92 169 L81 155 M143 144 L132 124 L136 110 M173 107 L190 116 L202 113 M195 91 L203 72 L218 68" fill="none" stroke="#7beeff" strokeOpacity="0.62" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M85 64 A128 128 0 0 1 231 105 M226 208 A128 128 0 0 1 91 236" fill="none" stroke="#e6fdff" strokeOpacity="0.13" strokeWidth="1" />
        </svg>
      </div>
      <div className="mt-3 text-center">
        <p className="text-micro uppercase tracking-[0.24em] text-accent-bright">VOLTIS Core</p>
        <p className="mt-1.5 max-w-52 truncate text-caption font-medium text-flash sm:text-body">{accountName}</p>
        <p className="mt-1 text-micro uppercase tracking-label text-muted">{status}</p>
      </div>
    </div>
  );
}

function CoreStage({ accountName, status }: { accountName: string; status: string }) {
  return (
    <div className="relative flex h-[330px] items-center justify-center overflow-hidden sm:h-[360px] xl:h-full xl:overflow-visible">
      <DataWaves />
      <CrystalShards />
      <Singularity accountName={accountName} status={status} />
    </div>
  );
}

export default function AccountCore({
  accountId,
  accountName,
  status,
  totalPnl,
  totalPnlTone,
  currentEquity,
  currentDrawdown,
  drawdownDetail,
  drawdownTone,
  needsReview,
  totalTrades,
}: {
  accountId: string;
  accountName: string;
  status: string;
  totalPnl: string;
  totalPnlTone: string;
  currentEquity: string;
  currentDrawdown: string;
  drawdownDetail: string;
  drawdownTone: string;
  needsReview: number;
  totalTrades: number;
}) {
  const sectors: CoreSector[] = [
    { label: "Performance", value: totalPnl, detail: `Current equity ${currentEquity}`, href: `/accounts/${accountId}/dashboard`, icon: Activity, tone: totalPnlTone },
    { label: "Risk", value: currentDrawdown, detail: drawdownDetail, href: `/accounts/${accountId}/equity`, icon: ShieldAlert, tone: drawdownTone },
    { label: "Process", value: String(needsReview), detail: needsReview > 0 ? "Pending reviews" : "No pending reviews", href: `/accounts/${accountId}/diary`, icon: ClipboardCheck, tone: needsReview > 0 ? "text-yellow-200" : "text-muted" },
    { label: "Data", value: String(totalTrades), detail: totalTrades > 0 ? "Recorded trades" : "No trades recorded", href: `/accounts/${accountId}/diary`, icon: Database, tone: totalTrades > 0 ? "text-accent-bright" : "text-muted" },
  ];

  return (
    <div>
      <div className="mb-4">
        <p className="text-micro uppercase tracking-label text-accent-bright">Account state</p>
        <h2 className="mt-2 text-section text-flash">VOLTIS Account Core</h2>
        <p className="mt-2 max-w-2xl text-caption leading-5 text-muted">Performance, risk, process and data—connected to the account record.</p>
      </div>

      <div className="xl:hidden">
        <CoreStage accountName={accountName} status={status} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {sectors.map((sector) => <SectorLink key={sector.label} sector={sector} />)}
        </div>
      </div>

      <div className="relative hidden h-[540px] xl:block">
        <CoreStage accountName={accountName} status={status} />
        <svg aria-hidden="true" viewBox="0 0 1000 540" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full">
          <g fill="none" stroke="rgba(91,224,255,0.2)" strokeWidth="1" strokeDasharray="2 8">
            <path d="M320 108 H378 L420 166" /><path d="M680 108 H622 L580 166" />
            <path d="M320 432 H378 L420 374" /><path d="M680 432 H622 L580 374" />
          </g>
          <g fill="rgba(91,224,255,0.35)"><rect x="416" y="162" width="7" height="7" /><rect x="577" y="162" width="7" height="7" /><rect x="416" y="371" width="7" height="7" /><rect x="577" y="371" width="7" height="7" /></g>
        </svg>
        <div className="absolute left-[3%] top-[3%] z-20 w-[30%]"><SectorLink sector={sectors[0]} /></div>
        <div className="absolute right-[3%] top-[3%] z-20 w-[30%]"><SectorLink sector={sectors[1]} /></div>
        <div className="absolute bottom-[3%] left-[3%] z-20 w-[30%]"><SectorLink sector={sectors[2]} /></div>
        <div className="absolute bottom-[3%] right-[3%] z-20 w-[30%]"><SectorLink sector={sectors[3]} /></div>
      </div>

      <style>{`
        @keyframes voltis-wave-travel { to { stroke-dashoffset: -363; } }
        @keyframes voltis-shard-drift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(3px, -2px, 0) rotate(1.5deg); }
        }
        .voltis-wave-pulse { animation: voltis-wave-travel 18s linear infinite; }
        .voltis-shard { animation: voltis-shard-drift 12s ease-in-out infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .voltis-wave-pulse, .voltis-shard { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
