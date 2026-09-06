import { Card, LayerTag, Meter, Note, Page } from "@/components/ui";
import {
  COUNTERSAMPLES,
  DISCLAIMER,
  LICENSES,
  METRICS,
  MOCKUP_LICENSES,
  ROADMAP,
  STOP_RULES,
} from "@/lib/data";
import { CircleCheck, OctagonX, Scale, Users } from "lucide-react";

const LAYER_COLOR = {
  ocr: "var(--ocr)",
  ai: "var(--ai)",
  det: "var(--det)",
  sign: "var(--sign)",
} as const;

const GROUPS = [
  { key: "ocr" as const, title: "인식층 — 확률적", gate: "판독 가능 비율로 잰다" },
  { key: "ai" as const, title: "판단층 (AI) — 판단", gate: "감리원 2인 κ가 상한 기준선" },
  { key: "det" as const, title: "결정층 (규칙) — 결정론", gate: "해시 대조 100%가 합격선" },
  { key: "sign" as const, title: "사람 · 산출물", gate: "칸 단위 일치율과 새 지표" },
];

export default function MetricsPage() {
  return (
    <Page
      n="4"
      title="지표 · 검증 설계 · 로드맵"
      lead={
        <>
          층마다 오차의 성질이 다르므로 <b>계측 방법과 합격선을 따로 둔다.</b> 잘못 이어붙인
          사건은 대장에 조용히 남으므로 사슬 오결합률은 별도 지표로 분리했다. 목표는 “AI가
          사람보다 낫다”가 아니라 <b>“사람의 판정을 표준화한다”</b>이며, 그래서 성능의 상한선을
          감리원 두 사람의 일치도로 먼저 정한다.
        </>
      }
    >
      <Note kind="warn">
        {DISCLAIMER} 아래 수치는 <b>목업 표시용 가상값</b>이며, 실제 값은 1단계 첫 4주의 실측으로
        정해진다.
      </Note>

      {/* 지표 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <Card
            key={g.key}
            title={
              <span className="flex items-center gap-2">
                <LayerTag layer={g.key} text={g.title} />
              </span>
            }
            right={
              <span className="text-[11px] text-[var(--ink-3)]">{g.gate}</span>
            }
          >
            <ul className="space-y-3">
              {METRICS.filter((m) => m.layer === g.key).map((m) => (
                <li key={m.name}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[12.5px] font-semibold text-[var(--ink)]">
                      {m.name}
                    </span>
                    <span
                      className="mono ml-auto text-[16px] font-bold tabnum"
                      style={{ color: LAYER_COLOR[g.key] }}
                    >
                      {m.value}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Meter value={m.num} max={m.max} color={LAYER_COLOR[g.key]} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-[3px] border px-1.5 text-[10.5px] font-semibold",
                        m.pass
                          ? "border-[var(--det)]/40 bg-[var(--det-bg)] text-[var(--det)]"
                          : "border-[var(--stamp)]/40 bg-[var(--stamp-bg)] text-[var(--stamp)]",
                      ].join(" ")}
                    >
                      <CircleCheck size={10} strokeWidth={2.6} />
                      {m.gate}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] leading-snug text-[var(--ink-3)]">
                    {m.note}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* 검증 설계 */}
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <Card
          title={
            <span className="flex items-center gap-2">
              <Users size={15} className="text-[var(--sign)]" strokeWidth={2} />
              정답셋은 두 갈래로 준비한다
            </span>
          }
        >
          <ol className="space-y-2">
            <li className="rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-2.5 py-2">
              <p className="text-[12px] font-semibold text-[var(--ink)]">
                있으면 즉시 — 완료 현장이 실제 제출한 서식
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
                사내에 남아 있으면 그대로 정답셋으로 쓴다.
              </p>
            </li>
            <li className="rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-2.5 py-2">
              <p className="text-[12px] font-semibold text-[var(--ink)]">
                없으면 이렇게 — 감리원 2인 수작성 대장
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
                두 사람이 독립적으로 손수 작성한 대장으로 대체한다.
              </p>
            </li>
          </ol>
          <p className="mt-2.5 rounded-md border border-[var(--sign)]/30 bg-[var(--sign-bg)] px-2.5 py-2 text-[12px] leading-relaxed text-[#1b3350]">
            어느 쪽이든 <b>두 사람의 일치도(κ)를 먼저 재고 그 값을 AI 성능의 상한 기준선</b>으로
            삼는다. 사람 둘도 갈리는 자리에서 시스템에 그 이상을 요구하지 않는다.
          </p>
        </Card>

        <Card
          title={
            <span className="flex items-center gap-2">
              <OctagonX size={15} className="text-[var(--stamp)]" strokeWidth={2} />
              중단 조건 셋
            </span>
          }
          tone="stamp"
        >
          <ul className="space-y-2">
            {STOP_RULES.map((s, i) => (
              <li
                key={s.when}
                className="rounded-md border border-[var(--stamp)]/25 bg-[var(--stamp-bg)]/60 px-2.5 py-2"
              >
                <p className="text-[12px] font-semibold text-[#7d1f1a]">
                  {i + 1}. {s.when}
                </p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
                  → {s.then}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="반대 방향 표본을 일부러 섞는다">
          <ul className="space-y-1.5">
            {COUNTERSAMPLES.map((c) => (
              <li
                key={c}
                className="flex gap-2 text-[12px] leading-snug text-[var(--ink)]"
              >
                <span className="mono mt-[2px] shrink-0 text-[var(--unknown)]">◆</span>
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-[var(--ink-2)]">
            잘못 이어붙인 사슬은 감리원이 끊고 그 사유가 <b>오결합률의 분자</b>가 된다. 유형
            오류는 현업이 사전을 고쳐 흡수한다. 판독 불가분은 칸을 채우지 않고 「미확인」으로
            남긴다.
          </p>
          <p className="mt-2 rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-2.5 py-2 text-[11.5px] leading-relaxed text-[var(--ink-2)]">
            <b>파일럿은 한 항목으로 좁힌다</b> — 기계 공종 배관·덕트 계열 불합격 건, 완료 현장
            3건, 기간 12주. 대상은 활자 검측조서이며 손글씨분은 실측 후 2단계 범위를 정한다.
          </p>
        </Card>
      </div>

      {/* 로드맵 */}
      <Card title="구현 로드맵 — 첫 4주는 개발이 아니라 실측이다">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--rule-2)]">
                {["단계", "기간", "대상 · 입력", "기존 자산 접합점", "산출 · 확인 과업"].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-1.5 pr-3 text-[11px] font-semibold text-[var(--ink-3)]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((r) => (
                <tr
                  key={r.phase + r.period}
                  className="border-b border-dashed border-[var(--rule)] align-top"
                >
                  <td className="py-2 pr-3 text-[12.5px] font-bold text-[var(--ink)]">
                    {r.phase}
                  </td>
                  <td className="mono py-2 pr-3 text-[11.5px] text-[var(--ink-2)]">
                    {r.period}
                  </td>
                  <td className="max-w-[260px] py-2 pr-3 text-[12px] leading-snug text-[var(--ink)]">
                    {r.scope}
                  </td>
                  <td className="max-w-[210px] py-2 pr-3 text-[12px] leading-snug text-[var(--ink-2)]">
                    {r.graft}
                  </td>
                  <td className="max-w-[260px] py-2 text-[12px] leading-snug text-[var(--ink)]">
                    {r.out}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 라이선스 */}
      <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title={
            <span className="flex items-center gap-2">
              <Scale size={15} className="text-[var(--ink-2)]" strokeWidth={2} />
              구현 도구 라이선스 검토 — 배제한 것을 먼저 적는다
            </span>
          }
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--rule-2)]">
                {["도구", "라이선스", "판정", "사유"].map((h) => (
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
              {LICENSES.map((l) => (
                <tr
                  key={l.item}
                  className="border-b border-dashed border-[var(--rule)] align-top"
                >
                  <td className="py-2 pr-2 text-[12px] font-semibold text-[var(--ink)]">
                    {l.item}
                  </td>
                  <td className="mono py-2 pr-2 text-[11.5px] text-[var(--ink-2)]">
                    {l.lic}
                  </td>
                  <td className="w-[46px] py-2 pr-2">
                    <span
                      className={[
                        "inline-block whitespace-nowrap rounded-[3px] border px-1.5 text-[10.5px] font-semibold",
                        l.verdict === "채택"
                          ? "border-[var(--det)]/40 bg-[var(--det-bg)] text-[var(--det)]"
                          : "border-[var(--stamp)]/40 bg-[var(--stamp-bg)] text-[var(--stamp)]",
                      ].join(" ")}
                    >
                      {l.verdict}
                    </span>
                  </td>
                  <td className="py-2 text-[12px] leading-snug text-[var(--ink-2)]">
                    {l.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="이 목업 자체의 라이선스">
          <p className="mb-2 text-[12px] leading-relaxed text-[var(--ink-2)]">
            공모전 서약서의 소스 라이선스 조항에 맞춰, 이 화면을 만든 구성 요소를 그대로
            적는다. <b>외부 이미지는 한 장도 쓰지 않았고</b> 도형은 전부 SVG·CSS로 그렸다.
          </p>
          <ul className="space-y-1">
            {MOCKUP_LICENSES.map((m) => (
              <li
                key={m.item}
                className="flex items-center gap-2 border-b border-dashed border-[var(--rule)] py-1.5 last:border-0"
              >
                <span className="text-[12px] text-[var(--ink)]">{m.item}</span>
                <span className="mono ml-auto text-[11px] text-[var(--ink-2)]">
                  {m.lic}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 기대효과 경계 */}
      <Card title="기대효과는 귀사 목표치 안쪽에 머문다">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              t: "보수 (1단계)",
              items: [
                "완료 3건에서 하나로 이어진 사건 N건 — 아무도 세어 본 적 없는 정수",
                "활자 검측조서 판독 가능 비율 실측치",
                "칸 단위 일치율 0.6 (2인 κ 상한 이내)",
                "원본 해시 대조 100%",
              ],
            },
            {
              t: "기준 (2단계)",
              items: [
                "칸 단위 일치율 0.75",
                "유형 정규화 κ가 2인 κ의 90% 도달",
                "불합격 이력을 찾는 시간 40% 단축 — 검색시간 80% 단축 목표의 하위 구간으로만 주장",
                "사건 직후 확정 비율 (새 지표)",
              ],
            },
            {
              t: "낙관 (3단계)",
              items: [
                "유형별 누적 건수 (새 지표) 상위 항목이 다음 현장 검사항목으로 반영된 건수",
                "재검측 감소율은 제시하지 않는다 — 국내에 분모가 되는 통계가 남지 않아 파일럿 실측 전에 부를 수 없다",
              ],
            },
          ].map((c) => (
            <div
              key={c.t}
              className="rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-3 py-2.5"
            >
              <p className="text-[12.5px] font-bold text-[var(--ink)]">{c.t}</p>
              <ul className="mt-1.5 space-y-1">
                {c.items.map((i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[11.5px] leading-snug text-[var(--ink-2)]"
                  >
                    <span className="mt-[2px] text-[var(--ink-3)]">·</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}
