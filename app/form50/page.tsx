"use client";

import { useState } from "react";
import { Card, LayerTag, Note, Page } from "@/components/ui";
import { DISCLAIMER, FORM50, LEDGER } from "@/lib/data";
import { BadgeCheck, FileWarning, PenTool, Printer } from "lucide-react";

export default function Form50Page() {
  const [openCell, setOpenCell] = useState<string | null>("불합격 사유 — 원문 인용");
  const [signed, setSigned] = useState(false);

  const maxN = Math.max(...FORM50.topTypes.map((t) => t.n));

  return (
    <Page
      n="3"
      title="별지 제50호 초안 — 대장에서 뽑아 낸 부산물"
      lead={
        <>
          최종보고서 작성서식 아홉 종(별지 제43~51호)의 여덟 번째 칸 「우수시공 및 실패시공
          사례」다. 용역 만료 뒤 열나흘 안에 되살릴 수 있는 범위로 채우던 칸이,
          <b> 사건 직후에 확정된 대장 행에서 초안으로 선다.</b> 칸을 누르면 그 칸이 어느 층에서
          왔는지와 근거 대장 행·원본 쪽이 열린다. 확정과 서명은 사람이 한다.
          <b> 서식의 칸 배치는 예시이며 서식 원본의 칸 구성에 맞추어 확정한다.</b>
        </>
      }
    >
      <Note kind="warn">{DISCLAIMER}</Note>

      <div className="grid items-start gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* 서식 초안 */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <Printer size={15} className="text-[var(--ink-2)]" strokeWidth={2} />
              {FORM50.formTitle}
            </span>
          }
          right={
            <span className="rounded-[3px] border border-[var(--rule-2)] bg-[#f7f6f1] px-1.5 py-[1px] text-[11px] font-semibold text-[var(--ink-2)]">
              {FORM50.formNo} · 초안
            </span>
          }
        >
          <div className="scanpaper rounded-[3px] border border-[var(--rule-2)] px-4 py-4">
            <p className="text-center text-[15px] font-bold tracking-tight text-[var(--ink)]">
              {FORM50.formTitle}
            </p>
            <p className="mono mt-1 text-center text-[10.5px] text-[var(--ink-3)]">
              대상 {FORM50.project} · 기간 {FORM50.period}
            </p>

            <table className="mt-3 w-full border-collapse">
              <tbody>
                {FORM50.cells.map((c) => {
                  const on = openCell === c.key;
                  return (
                    <tr key={c.key}>
                      <td className="w-[120px] border border-[var(--rule-2)] bg-[#f3f0e7] px-2 py-2 align-top text-[11.5px] font-semibold text-[var(--ink-2)]">
                        {c.key}
                      </td>
                      <td
                        onClick={() => setOpenCell(on ? null : c.key)}
                        className={[
                          "cursor-pointer border border-[var(--rule-2)] px-2 py-2 align-top transition-colors",
                          on ? "bg-[#fffdf0]" : "hover:bg-[#faf9f4]",
                        ].join(" ")}
                      >
                        <p className="text-[12.5px] leading-relaxed text-[var(--ink)]">
                          {c.value}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <LayerTag layer={c.layer} size="xs" />
                          {c.rows.map((r) => (
                            <span
                              key={r}
                              className="mono rounded-[3px] border border-[var(--rule-2)] bg-white px-1.5 text-[10px] text-[var(--ink-2)]"
                            >
                              대장 {r}
                            </span>
                          ))}
                        </div>
                        {on && (
                          <div className="mt-2 rounded-md border border-[var(--rule)] bg-white px-2.5 py-2">
                            <p className="text-[11.5px] leading-relaxed text-[var(--ink-2)]">
                              <b>이 칸의 출처</b> — {c.from}
                            </p>
                            <ul className="mt-1.5 space-y-1">
                              {c.rows.map((rid) => {
                                const lr = LEDGER.find((x) => x.id === rid);
                                if (!lr) return null;
                                return (
                                  <li
                                    key={rid}
                                    className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--ink-2)]"
                                  >
                                    <span className="mono rounded-[3px] bg-[#f3f0e7] px-1">
                                      {lr.id}
                                    </span>
                                    <span>{lr.defectType}</span>
                                    <span className="mono text-[var(--ink-3)]">
                                      {lr.reasonCite.doc} · p.{lr.reasonCite.page} ·{" "}
                                      {lr.reasonCite.xy}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* 채우지 않은 칸 */}
                <tr>
                  <td className="w-[120px] border border-[var(--rule-2)] bg-[#f3f0e7] px-2 py-2 align-top text-[11.5px] font-semibold text-[var(--ink-2)]">
                    첨부 사진
                  </td>
                  <td className="border border-[var(--rule-2)] bg-[var(--unknown-bg)]/60 px-2 py-2 align-top">
                    <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-[var(--unknown)]">
                      <FileWarning
                        size={13}
                        strokeWidth={2.2}
                        className="mt-[3px] shrink-0"
                      />
                      <span>
                        <b>미확인 — 채우지 않는다.</b> 현장 사진은 이 시스템의 입력이 아니다.
                        담당자가 원본 철에서 직접 붙인다.
                      </span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 서명란 */}
            <div className="mt-3 flex items-center justify-end gap-3 border-t border-dashed border-[var(--rule-2)] pt-3">
              <span className="text-[11.5px] text-[var(--ink-3)]">
                작성 : 건설사업관리기술인(기계)
              </span>
              <div
                className={[
                  "flex h-[46px] w-[130px] items-center justify-center rounded-[3px] border-2 border-dashed",
                  signed
                    ? "border-[var(--sign)]/60 bg-[var(--sign-bg)]"
                    : "border-[var(--rule-2)] bg-white",
                ].join(" ")}
              >
                {signed ? (
                  <span className="text-center text-[11px] font-bold leading-tight text-[var(--sign)]">
                    책임건설사업관리기술인
                    <br />
                    확정·서명
                  </span>
                ) : (
                  <span className="text-[11px] text-[var(--ink-3)]">서명 전</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={signed}
              onClick={() => setSigned(true)}
              className={[
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                signed
                  ? "cursor-default border-[var(--sign)]/40 bg-[var(--sign-bg)] text-[var(--sign)]"
                  : "border-[var(--sign)] bg-[var(--sign)] text-white hover:opacity-90",
              ].join(" ")}
            >
              {signed ? (
                <BadgeCheck size={13} strokeWidth={2.2} />
              ) : (
                <PenTool size={13} strokeWidth={2.2} />
              )}
              {signed ? "서식 확정됨" : "책임건설사업관리기술인 확정·서명"}
            </button>
            <span className="text-[11.5px] text-[var(--ink-3)]">
              {FORM50.basis}
            </span>
          </div>
        </Card>

        {/* 유형별 누적 건수 */}
        <div className="space-y-5">
          <Card
            title="유형별 누적 건수 — 초안이 서는 자리"
            right={<LayerTag layer="ai" text="AI 정규화 결과의 집계" size="xs" />}
          >
            <p className="mb-2.5 text-[12px] leading-relaxed text-[var(--ink-2)]">
              열나흘 안에 되살릴 수 있는 범위가 아니라 누적 건수 상위 항목에서 초안이 선다. 이 정수는{" "}
              <b>아무도 세어 본 적 없는 값</b>이며, HDX가 목표를 걸지 않은 새 지표다.
            </p>
            <ul className="space-y-2">
              {FORM50.topTypes.map((t, i) => (
                <li key={t.type}>
                  <div className="flex items-center gap-2">
                    <span className="mono w-[14px] text-[11px] text-[var(--ink-3)]">
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] text-[var(--ink)]">{t.type}</span>
                    <span className="mono ml-auto text-[12px] tabnum font-semibold text-[var(--ink)]">
                      {t.n}
                    </span>
                  </div>
                  <div className="ml-[22px] mt-1 h-[7px] overflow-hidden rounded-full bg-[#e6e3da]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(t.n / maxN) * 100}%`,
                        background: i === 0 ? "var(--stamp)" : "var(--ai)",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="다음 현장으로 되돌아간다">
            <p className="text-[12.5px] leading-relaxed text-[var(--ink)]">
              현장별 『검측업무지침』은 검사항목과 검측체크리스트를 담아 수립·승인된다. 누적
              상위 항목은 <b>다음 현장의 그 문서로 들어간다.</b>
            </p>
            <div className="mt-2.5 space-y-1.5">
              {[
                {
                  t: "수평주관 구배 실측 위치 3점 지정",
                  from: "배관 구배 불량 14건",
                },
                {
                  t: "플랜지 가스켓 전주 삽입 사진 필수",
                  from: "덕트 접합부 기밀 불량 11건",
                },
                {
                  t: "행거 간격 시공 전 사전 승인 도면 첨부",
                  from: "지지·고정 불량 9건",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-2.5 py-2"
                >
                  <p className="text-[12.5px] font-semibold text-[var(--ink)]">{c.t}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--ink-3)]">
                    근거 — {c.from} · 검사항목 후보로 상정
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="대장이 본체이고 서식은 부산물이다" tone="stamp">
            <p className="text-[12.5px] leading-relaxed text-[var(--ink)]">
              발주청이 발주하는 건설공사의 건설사업관리 현장은 전국이 같은 칸을 쓴다. 민간 발주
              현장에서는 대장의 다섯 칸이 그대로 남고 <b>출력만 계약이 정한 서식으로 바뀐다.</b>{" "}
              제목의 무게중심이 서식이 아니라 대장에 있는 이유가 이것이다.
            </p>
          </Card>
        </div>
      </div>
    </Page>
  );
}
