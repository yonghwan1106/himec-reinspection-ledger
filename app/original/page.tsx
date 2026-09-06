"use client";

import { useState } from "react";
import { Card, Cite, KeyVal, LayerTag, Note, Page } from "@/components/ui";
import { CONF_THRESHOLD, DISCLAIMER, SCAN } from "@/lib/data";
import { Ban, Fingerprint, Lock, PenLine, ScanLine } from "lucide-react";

export default function OriginalPage() {
  const [sel, setSel] = useState<string>("f7");
  const [tried, setTried] = useState(false);

  return (
    <Page
      n="1"
      title="원본 봉인 뷰 — 읽기 전용, 해시로 봉인, 붉은 “(재)”"
      lead={
        <>
          서명이 들어 있는 문서는 원형 그대로 스캐너로 입력하도록 되어 있다. 그래서 이 화면에는
          <b> 원본에 대한 쓰기 경로 자체를 두지 않았다.</b> 여는 순간 해시가 표시되고, 우측 상단의
          붉은 “(재)” 표기와 서명란이 하이라이트되며, 인식 결과는 원본 옆에 따로 쌓인다.
          임계 미만 필드는 채우지 않고 「미확인」으로 남는다.
        </>
      }
    >
      <Note kind="warn">{DISCLAIMER}</Note>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        {/* 좌 : 스캔 원본 */}
        <Card
          tone="stamp"
          title={
            <span className="flex items-center gap-2">
              <ScanLine size={15} className="text-[var(--stamp)]" strokeWidth={2} />
              스캔 원본 (읽기 전용)
            </span>
          }
          right={
            <span className="inline-flex items-center gap-1 rounded-[3px] border border-[var(--det)]/40 bg-[var(--det-bg)] px-1.5 py-[1px] text-[11px] font-semibold text-[var(--det)]">
              <Lock size={11} strokeWidth={2.4} />
              쓰기 경로 없음
            </span>
          }
        >
          {/* 해시 배지 */}
          <div className="mb-3 rounded-md border border-[var(--det)]/35 bg-[var(--det-bg)] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Fingerprint size={13} className="text-[var(--det)]" strokeWidth={2.2} />
              <span className="text-[11.5px] font-bold text-[var(--det)]">
                SHA-256 봉인
              </span>
              <LayerTag layer="det" size="xs" />
              <span className="mono ml-auto text-[10.5px] text-[var(--ink-3)]">
                {SCAN.sealedAt} 봉인
              </span>
            </div>
            <p className="mono mt-1 break-all text-[11px] leading-relaxed text-[var(--ink-2)]">
              {SCAN.sha256}
            </p>
          </div>

          {/* 스캔 지면 */}
          <div
            className="scanpaper readonly relative rounded-[3px] border border-[var(--rule-2)] px-4 py-4 shadow-[inset_0_0_24px_rgba(26,26,28,0.05)]"
            onClick={() => setTried(true)}
          >
            {/* 붉은 (재) */}
            <div className="absolute right-3 top-3">
              <span className="relative inline-block">
                <span className="absolute -inset-1.5 animate-pulse rounded-[3px] border-2 border-[var(--stamp)]/60 bg-[var(--stamp)]/8" />
                <span
                  className="relative text-[20px] font-black text-[var(--stamp)]"
                  style={{ fontFamily: "serif", transform: "rotate(-6deg)", display: "inline-block" }}
                >
                  (재)
                </span>
              </span>
            </div>

            <p className="text-[10.5px] text-[var(--ink-3)]">{SCAN.formName}</p>
            <p className="mt-0.5 text-[14px] font-bold tracking-tight text-[var(--ink)]">
              {SCAN.project} · {SCAN.docNo}
            </p>
            <p className="mono mt-0.5 text-[10.5px] text-[var(--ink-3)]">
              p.{SCAN.page} / {SCAN.pages} · {SCAN.color} · 스캔 {SCAN.scannedAt}
            </p>

            <table className="mt-3 w-full border-collapse">
              <tbody>
                {SCAN.fields.map((f) => {
                  const on = sel === f.id;
                  const low = f.conf < CONF_THRESHOLD;
                  return (
                    <tr
                      key={f.id}
                      className={[
                        "border border-[var(--rule-2)] transition-colors",
                        on ? "bg-[#fff6c9]" : "bg-transparent",
                      ].join(" ")}
                    >
                      <td className="w-[92px] border border-[var(--rule-2)] bg-[#f3f0e7] px-2 py-1.5 align-top text-[11px] font-semibold text-[var(--ink-2)]">
                        {f.label}
                      </td>
                      <td className="border border-[var(--rule-2)] px-2 py-1.5 text-[12px] leading-snug text-[var(--ink)]">
                        <span
                          className={[
                            f.kind === "hand"
                              ? "italic text-[#2b3d63]"
                              : "text-[var(--ink)]",
                            low ? "text-[var(--unknown)]" : "",
                            f.label === "판정" ? "font-bold text-[var(--stamp)]" : "",
                          ].join(" ")}
                        >
                          {f.value}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 서명란 */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {SCAN.signatures.map((s) => (
                <div
                  key={s.role}
                  className="rounded-[3px] border-2 border-dashed border-[#2b3d63]/45 bg-[#eaeff7]/70 px-2 py-2"
                >
                  <p className="text-[10.5px] font-semibold text-[#2b3d63]">{s.role}</p>
                  <p className="mt-2 flex items-center gap-1 text-[10.5px] text-[var(--ink-3)]">
                    <PenLine size={11} strokeWidth={2} />
                    {s.note}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-2 text-[10px] leading-relaxed text-[var(--ink-3)]">
              ※ 화면은 검측 서식의 구조만 모사한 <b>가상 문서</b>다. 실제 서식 이미지·실제 현장
              문서를 쓰지 않았다.
            </p>
          </div>

          {tried && (
            <p className="mt-2 flex items-start gap-1.5 rounded-md border border-[var(--stamp)]/35 bg-[var(--stamp-bg)] px-3 py-2 text-[12px] leading-relaxed text-[#7d1f1a]">
              <Ban size={13} className="mt-[2px] shrink-0" strokeWidth={2.2} />
              원본은 편집할 수 없다. 이 화면에는 원본에 대한 쓰기 API가 존재하지 않는다. 고쳐 적을
              곳은 오른쪽의 <b>대장</b>이며, 대장은 원본과 다른 테이블에 쌓인다.
            </p>
          )}
        </Card>

        {/* 우 : 인식 결과 */}
        <div className="space-y-5">
          <Card
            title="인식층 결과 — 필드별 신뢰도"
            right={<LayerTag layer="ocr" />}
          >
            <p className="mb-2.5 text-[12px] leading-relaxed text-[var(--ink-2)]">
              필드를 누르면 왼쪽 원본의 해당 칸이 하이라이트된다. 신뢰도{" "}
              <span className="mono">{CONF_THRESHOLD.toFixed(2)}</span> 미만은 값을 채우지 않고
              「미확인」으로 남긴다 — 없는 글자를 지어내지 않는다.
            </p>
            <ul className="space-y-1">
              {SCAN.fields.map((f) => {
                const on = sel === f.id;
                const low = f.conf < CONF_THRESHOLD;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setSel(f.id)}
                      className={[
                        "w-full rounded-md border px-2.5 py-1.5 text-left transition-colors",
                        on
                          ? "border-[var(--rule-2)] bg-[#fffdf0]"
                          : "border-transparent hover:bg-[#f7f6f1]",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-[var(--ink)]">
                          {f.label}
                        </span>
                        <span
                          className={[
                            "rounded-[3px] px-1 text-[10px] font-semibold",
                            f.kind === "hand"
                              ? "bg-[#e8edf6] text-[#2b3d63]"
                              : "bg-[#eeece5] text-[var(--ink-3)]",
                          ].join(" ")}
                        >
                          {f.kind === "hand" ? "손글씨" : "인쇄 필드"}
                        </span>
                        {low && <LayerTag layer="unknown" size="xs" />}
                        <span className="mono ml-auto text-[11px] tabnum text-[var(--ink-2)]">
                          {f.conf.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#e6e3da]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${f.conf * 100}%`,
                              background: low ? "var(--unknown)" : "var(--ocr)",
                            }}
                          />
                        </div>
                        <span className="mono text-[10px] text-[var(--ink-3)]">{f.xy}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="이 원본이 대장에 남기는 것">
            <KeyVal k="문서" v={<span className="mono">{SCAN.docNo}</span>} />
            <KeyVal
              k="“(재)” 표기"
              v={
                <span className="flex items-center gap-2">
                  검출됨
                  <LayerTag layer="det" text="결정층 규칙 — 붉은 픽셀 + 문자" size="xs" />
                </span>
              }
            />
            <KeyVal
              k="사건 사슬 ID"
              v={
                <span className="flex flex-wrap items-center gap-2">
                  <span className="mono">EV-2026-0113</span>
                  <LayerTag layer="ai" text="판단층 AI — 사슬 추론" size="xs" />
                </span>
              }
            />
            <KeyVal
              k="근거 좌표"
              v={<Cite doc="MEP-2026-0417" page={2} xy="x412,y688" />}
            />
            <KeyVal
              k="대장에 남기지 않는 것"
              v="발주청·현장 식별자, 시공사 실명, 서명자 성명 (직급·역할만 남긴다)"
            />
            <div className="mt-3 rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-3 py-2">
              <p className="text-[12px] leading-relaxed text-[var(--ink-2)]">
                흑백 스캔에서는 붉은 픽셀 규칙이 성립하지 않는다. 그때는 문자 규칙만으로 처리하고,
                검출에 실패하면 「미확인」으로 남긴다.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
