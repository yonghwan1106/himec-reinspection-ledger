import type { ReactNode } from "react";

/* ── 층 배지 ─────────────────────────────────────────────── */

export type Layer = "ocr" | "ai" | "det" | "sign" | "unknown";

const LAYER_STYLE: Record<Layer, { fg: string; bg: string; label: string }> = {
  ocr: { fg: "var(--ocr)", bg: "var(--ocr-bg)", label: "인식층" },
  ai: { fg: "var(--ai)", bg: "var(--ai-bg)", label: "판단층 AI" },
  det: { fg: "var(--det)", bg: "var(--det-bg)", label: "결정층 규칙" },
  sign: { fg: "var(--sign)", bg: "var(--sign-bg)", label: "사람" },
  unknown: { fg: "var(--unknown)", bg: "var(--unknown-bg)", label: "미확인" },
};

export function LayerTag({
  layer,
  text,
  size = "sm",
}: {
  layer: Layer;
  text?: string;
  size?: "sm" | "xs";
}) {
  const s = LAYER_STYLE[layer];
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1 rounded-[3px] border px-1.5 font-semibold",
        size === "xs" ? "py-0 text-[10.5px]" : "py-[1px] text-[11px]",
      ].join(" ")}
      style={{ color: s.fg, background: s.bg, borderColor: s.fg + "40" }}
    >
      <span
        className="inline-block h-[7px] w-[7px] rounded-[1.5px]"
        style={{ background: s.fg }}
      />
      {text ?? s.label}
    </span>
  );
}

/* ── 지면 요소 ───────────────────────────────────────────── */

export function Page({
  n,
  title,
  lead,
  children,
}: {
  n: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-7">
      <div className="flex items-start gap-3">
        <span className="mono mt-[3px] flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-[var(--stamp)] text-[12px] font-bold text-white">
          {n}
        </span>
        <div className="min-w-0">
          <h1 className="text-[21px] font-bold leading-tight tracking-tight text-[var(--ink)]">
            {title}
          </h1>
          <p className="mt-1.5 max-w-[900px] text-[13.5px] leading-relaxed text-[var(--ink-2)]">
            {lead}
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

export function Card({
  title,
  right,
  tone = "plain",
  children,
  className = "",
}: {
  title?: ReactNode;
  right?: ReactNode;
  tone?: "plain" | "stamp" | "sign";
  children: ReactNode;
  className?: string;
}) {
  const border =
    tone === "stamp"
      ? "border-[var(--stamp)]/35"
      : tone === "sign"
        ? "border-[var(--sign)]/30"
        : "border-[var(--rule)]";
  return (
    <section
      className={`rounded-lg border ${border} bg-[var(--card)] shadow-[0_1px_0_rgba(0,0,0,0.03)] ${className}`}
    >
      {title && (
        <header className="flex items-center gap-2 border-b border-[var(--rule)] px-4 py-2.5">
          <h2 className="text-[13.5px] font-bold text-[var(--ink)]">{title}</h2>
          {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
        </header>
      )}
      <div className="px-4 py-3.5">{children}</div>
    </section>
  );
}

export function Note({
  kind = "info",
  children,
}: {
  kind?: "info" | "warn" | "stamp";
  children: ReactNode;
}) {
  const map = {
    info: "border-[var(--rule-2)] bg-[#f7f6f1] text-[var(--ink-2)]",
    warn: "border-[var(--unknown)]/40 bg-[var(--unknown-bg)] text-[#6b5527]",
    stamp: "border-[var(--stamp)]/35 bg-[var(--stamp-bg)] text-[#7d1f1a]",
  } as const;
  return (
    <p
      className={`rounded-md border px-3 py-2 text-[12.5px] leading-relaxed ${map[kind]}`}
    >
      {children}
    </p>
  );
}

/* 근거 좌표 칩 — 칸마다 원본 문서·쪽·좌표가 붙는다 */
export function Cite({
  doc,
  page,
  xy,
}: {
  doc: string;
  page: number;
  xy?: string;
}) {
  return (
    <span className="mono inline-flex items-center gap-1 rounded-[3px] border border-[var(--rule-2)] bg-[#f7f6f1] px-1.5 py-[1px] text-[10.5px] text-[var(--ink-2)]">
      {doc} · p.{page}
      {xy ? ` · ${xy}` : ""}
    </span>
  );
}

export function Meter({
  value,
  max = 100,
  color,
}: {
  value: number;
  max?: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#e6e3da]">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function KeyVal({
  k,
  v,
  mono = false,
}: {
  k: string;
  v: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-2 border-b border-dashed border-[var(--rule)] py-1.5 last:border-0">
      <span className="w-[104px] shrink-0 text-[12px] text-[var(--ink-3)]">{k}</span>
      <span
        className={`min-w-0 flex-1 text-[12.5px] text-[var(--ink)] ${mono ? "mono" : ""}`}
      >
        {v}
      </span>
    </div>
  );
}
