"use client";

import { useMemo, useState } from "react";
import { Card, Cite, LayerTag, Note, Page } from "@/components/ui";
import { DICTIONARY, DISCLAIMER, LEDGER, type LedgerRow } from "@/lib/data";
import {
  BadgeCheck,
  Link2Off,
  PenTool,
  Quote,
  ShieldAlert,
  Scissors,
} from "lucide-react";

const STATUS_STYLE: Record<
  LedgerRow["status"],
  { fg: string; bg: string; bd: string }
> = {
  확정: { fg: "var(--sign)", bg: "var(--sign-bg)", bd: "var(--sign)" },
  "확인 대기": { fg: "var(--unknown)", bg: "var(--unknown-bg)", bd: "var(--unknown)" },
  "사슬 끊음": { fg: "var(--stamp)", bg: "var(--stamp-bg)", bd: "var(--stamp)" },
};

export default function LedgerPage() {
  const [selId, setSelId] = useState("L-001");
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [broken, setBroken] = useState<Record<string, boolean>>({ "L-006": true });

  const row = useMemo(
    () => LEDGER.find((r) => r.id === selId) ?? LEDGER[0],
    [selId],
  );

  const isSigned = signed[row.id] ?? row.status === "확정";
  const isBroken = broken[row.id] ?? false;

  return (
    <Page
      n="2"
      title="불합격 판정 대장 — 다섯 칸과 사건 사슬"
      lead={
        <>
          앞의 두 칸은 <b>검측대장에 이미 있는 칸</b>이고, 뒤의 세 칸이 이 제안이 더하는 것이다 —
          「불합격 사유(원문 인용)」, 「시정 유형」, 「사건 사슬」. 보라색은 AI가 제시한 값,
          청록색은 규칙이 결정한 값이며, <b>끊고 확정하고 서명하는 일은 사람이 한다.</b>
        </>
      }
    >
      <Note kind="warn">{DISCLAIMER}</Note>

      {/* 대장 표 */}
      <Card
        title="불합격 판정 대장"
        right={
          <span className="text-[11.5px] text-[var(--ink-3)]">
            행을 누르면 아래에 사건 사슬이 열린다
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr>
                <th className="pb-1" />
                <th
                  colSpan={2}
                  className="border-b-2 border-[var(--rule-2)] pb-1 text-center text-[10.5px] font-semibold text-[var(--ink-3)]"
                >
                  검측대장에 이미 있는 칸
                </th>
                <th
                  colSpan={3}
                  className="border-b-2 border-[var(--stamp)]/50 pb-1 text-center text-[10.5px] font-semibold text-[var(--stamp)]"
                >
                  이 제안이 더하는 세 칸
                </th>
                <th className="pb-1" />
              </tr>
              <tr className="border-b border-[var(--rule-2)]">
                {[
                  "사건 · 현장",
                  "① 대상",
                  "② 기준",
                  "③ 불합격 사유 (원문 인용)",
                  "④ 시정 유형",
                  "⑤ 사건 사슬 · 재검측",
                  "상태",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-1.5 pr-2 text-[11px] font-semibold text-[var(--ink-3)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEDGER.map((r) => {
                const on = r.id === selId;
                const st = STATUS_STYLE[r.status];
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelId(r.id)}
                    className={[
                      "cursor-pointer border-b border-dashed border-[var(--rule)] align-top transition-colors",
                      on ? "bg-[#fffdf0]" : "hover:bg-[#f8f7f2]",
                    ].join(" ")}
                  >
                    <td className="py-2 pr-2">
                      <p className="mono text-[11px] font-semibold text-[var(--ink)]">
                        {r.chainId}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--ink-3)]">{r.project}</p>
                    </td>
                    <td className="max-w-[190px] py-2 pr-2 text-[12px] leading-snug text-[var(--ink)]">
                      {r.target}
                    </td>
                    <td className="max-w-[170px] py-2 pr-2 text-[12px] leading-snug text-[var(--ink-2)]">
                      {r.criterion}
                    </td>
                    <td className="max-w-[250px] py-2 pr-2">
                      <p className="text-[12px] leading-snug text-[var(--ink)]">
                        <span className="text-[var(--stamp)]">“</span>
                        {r.reasonQuote}
                        <span className="text-[var(--stamp)]">”</span>
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-1">
                        <LayerTag layer="ai" text={r.defectType} size="xs" />
                        <span className="mono text-[10px] text-[var(--ink-3)]">
                          κ후보 {r.defectConf.toFixed(2)}
                        </span>
                      </p>
                    </td>
                    <td className="max-w-[150px] py-2 pr-2 text-[12px] leading-snug text-[var(--ink)]">
                      {r.fixType}
                    </td>
                    <td className="py-2 pr-2">
                      <p className="flex items-center gap-1 text-[11.5px] text-[var(--ink-2)]">
                        <span className="mono">{r.chain.length}마디</span>
                        <span className="text-[var(--ink-3)]">·</span>
                        <span
                          className={
                            r.outcome === "합격"
                              ? "font-semibold text-[var(--det)]"
                              : r.outcome === "미확인"
                                ? "font-semibold text-[var(--unknown)]"
                                : "text-[var(--ink-2)]"
                          }
                        >
                          {r.outcome}
                        </span>
                      </p>
                      <p className="mono mt-0.5 text-[10px] text-[var(--ink-3)]">
                        사슬 신뢰도 {r.chainConf.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-2">
                      <span
                        className="inline-block rounded-[3px] border px-1.5 py-[1px] text-[10.5px] font-semibold"
                        style={{ color: st.fg, background: st.bg, borderColor: st.bd + "55" }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 선택된 사건 상세 */}
      <div className="grid items-start gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card
          tone={isBroken ? "stamp" : "sign"}
          title={
            <span className="flex items-center gap-2">
              <span className="mono text-[var(--stamp)]">{row.chainId}</span>
              사건 사슬 — 원검측 → 시정지시 → 재검측
            </span>
          }
          right={
            <LayerTag layer="ai" text="사슬은 AI가 잇고, 끊는 것은 사람이다" size="xs" />
          }
        >
          <Chain row={row} broken={isBroken} />

          {row.adversarial && (
            <p className="mt-3 flex items-start gap-1.5 rounded-md border border-[var(--unknown)]/40 bg-[var(--unknown-bg)] px-3 py-2 text-[12px] leading-relaxed text-[#6b5527]">
              <ShieldAlert size={13} className="mt-[2px] shrink-0" strokeWidth={2.2} />
              <span>
                <b>반대 방향 표본.</b> {row.adversarial}
              </span>
            </p>
          )}

          {isBroken && (
            <p className="mt-2 flex items-start gap-1.5 rounded-md border border-[var(--stamp)]/35 bg-[var(--stamp-bg)] px-3 py-2 text-[12px] leading-relaxed text-[#7d1f1a]">
              <Link2Off size={13} className="mt-[2px] shrink-0" strokeWidth={2.2} />
              <span>
                <b>사슬을 끊었다.</b>{" "}
                {row.breakNote ??
                  "감리원이 마지막 마디를 끊고 사유를 남겼다. 이 건은 오결합률의 분자로 집계된다."}
              </span>
            </p>
          )}

          {/* 사람의 행위 */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-[var(--rule)] pt-3">
            <button
              type="button"
              onClick={() => setBroken((b) => ({ ...b, [row.id]: !isBroken }))}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--stamp)]/45 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[var(--stamp)] transition-colors hover:bg-[var(--stamp-bg)]"
            >
              <Scissors size={13} strokeWidth={2.2} />
              {isBroken ? "사슬 다시 잇기" : "사슬 끊기 (사유 필수)"}
            </button>

            <button
              type="button"
              disabled={isSigned}
              onClick={() => setSigned((s) => ({ ...s, [row.id]: true }))}
              className={[
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                isSigned
                  ? "cursor-default border-[var(--sign)]/40 bg-[var(--sign-bg)] text-[var(--sign)]"
                  : "border-[var(--sign)] bg-[var(--sign)] text-white hover:bg-[#16294380]",
              ].join(" ")}
            >
              {isSigned ? (
                <BadgeCheck size={13} strokeWidth={2.2} />
              ) : (
                <PenTool size={13} strokeWidth={2.2} />
              )}
              {isSigned ? "확정·서명 완료" : "책임건설사업관리기술인 확정·서명"}
            </button>

            <span className="text-[11.5px] text-[var(--ink-3)]">
              {isSigned
                ? `${row.signedBy ?? "책임건설사업관리기술인(기계)"} · ${row.signedAt ?? "확정 시각 기록됨"}`
                : "서명 전에는 별지 제50호 초안에 인용되지 않는다"}
            </span>
          </div>

          <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--ink-3)]">
            결재를 차단하는 게이트가 아니다. 시스템은 초안을 놓을 뿐이고, 법적 판정 행위는 사람의
            서명이다.
          </p>
        </Card>

        {/* 칸별 근거 */}
        <div className="space-y-5">
          <Card title="칸마다 근거가 붙는다">
            <CellRow
              label="① 대상"
              layer="det"
              value={row.target}
              note="검측대장에 이미 있는 칸 — 규칙이 서식 필드에서 옮긴다"
            />
            <CellRow
              label="② 기준"
              layer="det"
              value={row.criterion}
              cite={row.criterionCite}
              note="검사항목의 시공기준 또는 합격기준"
            />
            <CellRow
              label="③ 불합격 사유"
              layer="ocr"
              value={
                <span className="flex gap-1.5">
                  <Quote size={12} className="mt-[3px] shrink-0 text-[var(--stamp)]" />
                  <span>{row.reasonQuote}</span>
                </span>
              }
              cite={row.reasonCite}
              note="원문 인용 그대로. 원문에 남지 않은 원인은 만들지 않는다"
            />
            <CellRow
              label="④ 시정 유형"
              layer="ai"
              value={
                <span>
                  {row.fixType}{" "}
                  <span className="mono text-[11px] text-[var(--ink-3)]">
                    (신뢰도 {row.fixConf.toFixed(2)})
                  </span>
                </span>
              }
              note="조치사항 문장을 유형으로 분류한다"
            />
            <CellRow
              label="⑤ 사건 사슬"
              layer="ai"
              value={
                <span className="mono">
                  {row.chainId} · {row.chain.length}마디 · 신뢰도{" "}
                  {row.chainConf.toFixed(2)}
                </span>
              }
              note="문서번호가 끊겨도 위치·부위·공종·날짜로 잇는다"
            />
          </Card>

          <Card title="결함 유형 사전 — 현업이 엑셀로 고친다">
            <p className="mb-2 text-[12px] leading-relaxed text-[var(--ink-2)]">
              표현이 다른 원문이 한 유형으로 모인다. 사전이 바뀌어도 <b>과거 대장에 소급하지
              않고</b> 변경 이력만 남긴다 — 확정된 판정이 뒤에서 바뀌지 않게 한다.
            </p>
            <ul className="space-y-1.5">
              {DICTIONARY.map((d) => {
                const on = d.type === row.defectType;
                return (
                  <li
                    key={d.type}
                    className={[
                      "rounded-md border px-2.5 py-1.5",
                      on
                        ? "border-[var(--ai)]/45 bg-[var(--ai-bg)]"
                        : "border-[var(--rule)] bg-[#fbfaf7]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-semibold text-[var(--ink)]">
                        {d.type}
                      </span>
                      <span className="mono ml-auto text-[11px] tabnum text-[var(--ink-2)]">
                        {d.count}건
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--ink-3)]">
                      {d.variants.join(" / ")}
                    </p>
                    <p className="mono mt-0.5 text-[10px] text-[var(--ink-3)]">
                      소유 {d.owner} · 갱신 {d.updated}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ── 사슬 시각화 ─────────────────────────────────────────── */

function Chain({ row, broken }: { row: LedgerRow; broken: boolean }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[620px] items-stretch gap-0">
        {row.chain.map((n, i) => {
          const last = i === row.chain.length - 1;
          const cut = broken && last;
          return (
            <div key={n.docNo + n.step} className="flex flex-1 items-stretch">
              <div
                className={[
                  "flex-1 rounded-md border px-3 py-2.5",
                  cut
                    ? "border-dashed border-[var(--stamp)]/60 bg-[var(--stamp-bg)] opacity-70"
                    : "border-[var(--rule-2)] bg-[#fbfaf7]",
                ].join(" ")}
              >
                <div className="flex items-center gap-1.5">
                  <span className="mono flex h-[17px] w-[17px] items-center justify-center rounded-[3px] bg-[var(--ink)] text-[10.5px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[12.5px] font-bold text-[var(--ink)]">
                    {n.step}
                  </span>
                  {n.reStamp && (
                    <span
                      className="ml-1 rounded-[3px] border border-[var(--stamp)]/50 bg-white px-1 text-[11px] font-black text-[var(--stamp)]"
                      style={{ fontFamily: "serif" }}
                    >
                      (재)
                    </span>
                  )}
                </div>
                <p className="mono mt-1.5 text-[11px] text-[var(--ink)]">{n.docNo}</p>
                <p className="mono text-[10.5px] text-[var(--ink-3)]">
                  {n.date} · p.{n.page}
                </p>
                <p className="mt-1 text-[11.5px] leading-snug text-[var(--ink-2)]">
                  {n.result}
                </p>
                {cut && (
                  <p className="mono mt-1 text-[10.5px] font-semibold text-[var(--stamp)]">
                    사람이 끊음 — 오결합 집계
                  </p>
                )}
              </div>
              {!last && (
                <div className="flex w-8 shrink-0 items-center justify-center">
                  <span
                    className={
                      broken && i === row.chain.length - 2
                        ? "text-[16px] text-[var(--stamp)]"
                        : "text-[16px] text-[var(--ink-3)]"
                    }
                  >
                    {broken && i === row.chain.length - 2 ? "⇢" : "→"}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CellRow({
  label,
  layer,
  value,
  cite,
  note,
}: {
  label: string;
  layer: "ocr" | "ai" | "det";
  value: React.ReactNode;
  cite?: { doc: string; page: number; xy: string };
  note: string;
}) {
  return (
    <div className="border-b border-dashed border-[var(--rule)] py-2 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold text-[var(--ink)]">{label}</span>
        <LayerTag layer={layer} size="xs" />
      </div>
      <div className="mt-1 text-[12.5px] leading-snug text-[var(--ink)]">{value}</div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        {cite && <Cite doc={cite.doc} page={cite.page} xy={cite.xy} />}
        <span className="text-[11px] text-[var(--ink-3)]">{note}</span>
      </div>
    </div>
  );
}
