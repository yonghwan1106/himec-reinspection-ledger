import Link from "next/link";
import { Card, LayerTag, Note, Page } from "@/components/ui";
import { DISCLAIMER } from "@/lib/data";
import { ArrowRight, FileLock2, Rows3, ClipboardCheck } from "lucide-react";

const CONTRAST = [
  {
    k: "판정 이유의 소재",
    a: "서명이 든 스캔 이미지 안에 잠긴다",
    b: "원본은 봉인한 채 옆에 다섯 칸으로 옮겨 적는다",
  },
  {
    k: "작성 시점",
    a: "용역 만료 뒤 열나흘 안",
    b: "검측 종료 직후, 그 건만 확인·확정",
  },
  {
    k: "사건의 연결",
    a: "문서번호가 끊겨 사람이 눈으로 맞춘다",
    b: "위치·부위·공종·날짜로 사슬 ID를 부여한다",
  },
  {
    k: "표현의 차이",
    a: "구배 불량 / 슬로프 부족 / 역구배가 각각 남는다",
    b: "현업이 편집하는 사전으로 한 유형에 모인다",
  },
  {
    k: "우수·실패시공 사례",
    a: "열나흘 안에 되살릴 수 있는 범위를 적는다",
    b: "유형별 누적 건수 상위 항목에서 초안이 선다",
  },
];

const LAYERS = [
  {
    layer: "ocr" as const,
    title: "인식층",
    kind: "확률적",
    does: "서식 영역 검출, 인쇄 필드와 손글씨 분리, 문자 인식",
    metric: "자기 신뢰도(임계 이상 필드 비율)와 정답 표본 대비 필드 단위 정확도를 함께 잰다. 임계 미만은 「미확인」",
  },
  {
    layer: "ai" as const,
    title: "판단층 (AI)",
    kind: "판단",
    does: "결함 유형 정규화 · 사건 사슬 추론 · 시정 유형 분류 · 종결 사유 3분류",
    metric: "감리원 2인 사이 κ_H를 먼저 재고, 2인 합의 라벨 대 시스템 κ_S를 그 차이(κ_H − κ_S)로 잰다",
  },
  {
    layer: "det" as const,
    title: "결정층 (규칙)",
    kind: "결정론",
    does: "서식 번호 판별, “(재)” 검출, 칸 배치, 원본 해시 봉인·색인, 권한 분리",
    metric: "해시 대조 100%가 합격선이다",
  },
  {
    layer: "sign" as const,
    title: "사람",
    kind: "법적 판정 행위",
    does: "사건 단위 확인·수정·확정, 사슬 끊기와 사유 기재, 서식 확정·서명",
    metric: "대장 행 확인·확정 = 분야별 건설사업관리기술인 / 별지 제50호 최종 확정·서명 = 책임건설사업관리기술인",
  },
];

const OUT_OF_SCOPE = [
  "원문에 남지 않은 원인을 만들지 않는다",
  "원본 스캔을 대체·수정하지 않는다",
  "검색창이나 지식그래프를 만들지 않는다",
  "현장 사진을 입력으로 받지 않는다",
  "검측 판정을 대신하지 않으며 결재를 차단하는 게이트가 아니다",
];

export default function Home() {
  return (
    <Page
      n="0"
      title="붉은 글씨로 (재)라고 쓴 그날의 이유"
      lead={
        <>
          최종보고서는 용역 만료일부터 14일 이내에 낸다. 작성서식 아홉 종(별지 제43~51호)의
          여덟 번째 칸 「우수시공 및 실패시공 사례」 앞에서 담당자가 멈춘다. 무엇이 왜
          불합격이었는지는 캐비닛의 스캔 안에 있고, 결국 열나흘 안에 되살릴 수 있는 범위가
          적힌다. <b>이 목업은 원본을 해시로 봉인한 채, 그 옆에 판정의 이유만 다섯 칸으로 옮겨
          적는 대장</b>을 보여 준다. 산출물은 대장이고 별지 제50호는 그 부산물이다.
        </>
      }
    >
      <Note kind="warn">{DISCLAIMER}</Note>

      {/* 흐름도 */}
      <Card title="흐름 — 입력에서 대장까지, 층마다 합격선이 다르다">
        <FlowDiagram />
        <div className="mt-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {LAYERS.map((l) => (
            <div
              key={l.title}
              className="rounded-md border border-[var(--rule)] bg-[#fbfaf7] px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <LayerTag layer={l.layer} text={l.title} />
                <span className="text-[11.5px] text-[var(--ink-3)]">{l.kind}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ink)]">
                {l.does}
              </p>
              <p className="mt-1.5 border-t border-dashed border-[var(--rule)] pt-1.5 text-[11.5px] leading-relaxed text-[var(--ink-2)]">
                {l.metric}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* 기존 방식 대 제안 방식 */}
        <Card title="무엇이 달라지는가">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--rule-2)]">
                <th className="w-[130px] py-1.5 text-[11.5px] font-semibold text-[var(--ink-3)]">
                  구분
                </th>
                <th className="py-1.5 text-[11.5px] font-semibold text-[var(--ink-3)]">
                  기존 방식
                </th>
                <th className="py-1.5 text-[11.5px] font-semibold text-[var(--stamp)]">
                  제안 방식
                </th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST.map((r) => (
                <tr key={r.k} className="border-b border-dashed border-[var(--rule)]">
                  <td className="py-2 pr-2 align-top text-[12.5px] font-semibold text-[var(--ink)]">
                    {r.k}
                  </td>
                  <td className="py-2 pr-3 align-top text-[12.5px] leading-snug text-[var(--ink-3)]">
                    {r.a}
                  </td>
                  <td className="py-2 align-top text-[12.5px] leading-snug text-[var(--ink)]">
                    {r.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* 범위 밖 */}
        <div className="space-y-5">
          <Card title="범위 밖 — 하지 않는 일" tone="stamp">
            <ul className="space-y-1.5">
              {OUT_OF_SCOPE.map((t) => (
                <li
                  key={t}
                  className="flex gap-2 text-[12.5px] leading-snug text-[var(--ink)]"
                >
                  <span className="mono mt-[2px] text-[var(--stamp)]">×</span>
                  {t}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="세 칸을 더할 뿐이다">
            <p className="text-[12.5px] leading-relaxed text-[var(--ink)]">
              제77조제2항이 열거한 작성·비치 서식의 여섯 번째 <b>검측대장(별지 제19호 서식)</b>에
              세 칸을 더한다 —
              「불합격 사유(원문 인용)」, 「시정 유형」, 「원검측·시정지시·재검측을 잇는 사건 사슬
              ID」. 새 대장을 만드는 것이 아니다. 서식도 인력도 법정 절차도 바뀌지 않는다.
            </p>
          </Card>
        </div>
      </div>

      {/* 화면 안내 */}
      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            href: "/original",
            n: "화면 1",
            icon: FileLock2,
            t: "원본 봉인 뷰",
            d: "읽기 전용·해시 배지·붉은 “(재)” 하이라이트. 원본에 쓰기 경로가 없다는 것을 화면에서 증명한다.",
          },
          {
            href: "/ledger",
            n: "화면 2",
            icon: Rows3,
            t: "불합격 판정 대장",
            d: "다섯 칸과 사건 사슬. AI 구간과 규칙 구간이 색으로 갈리고, 사슬을 끊는 것도 서명도 사람이 한다.",
          },
          {
            href: "/form50",
            n: "화면 3",
            icon: ClipboardCheck,
            t: "별지 제50호 초안",
            d: "대장에서 뽑아 낸 부산물. 칸마다 근거 대장 행과 원본 쪽이 붙는다.",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-lg border border-[var(--rule)] bg-[var(--card)] px-4 py-3.5 transition-colors hover:border-[var(--rule-2)] hover:bg-white"
          >
            <div className="flex items-center gap-2">
              <c.icon size={15} className="text-[var(--stamp)]" strokeWidth={2} />
              <span className="text-[11px] font-semibold text-[var(--ink-3)]">{c.n}</span>
              <ArrowRight
                size={14}
                className="ml-auto text-[var(--ink-3)] transition-transform group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-1.5 text-[14px] font-bold text-[var(--ink)]">{c.t}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink-2)]">{c.d}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}

/* 흐름도 — 외부 이미지 없이 SVG로만 그린다 */
function FlowDiagram() {
  const boxes: {
    x: number;
    w: number;
    label: string;
    sub: string;
    fill: string;
    stroke: string;
    text: string;
  }[] = [
    {
      x: 8,
      w: 138,
      label: "서명이 든 스캔",
      sub: "검측요청 · 시정지시 · 재검측",
      fill: "#f4f2ec",
      stroke: "#c7c3b6",
      text: "#46484d",
    },
    {
      x: 168,
      w: 132,
      label: "인식층",
      sub: "필드 단위 정확도 · 좌표 · 「미확인」",
      fill: "var(--ocr-bg)",
      stroke: "var(--ocr)",
      text: "var(--ocr)",
    },
    {
      x: 322,
      w: 152,
      label: "판단층 (AI)",
      sub: "유형 정규화 · 사슬 추론",
      fill: "var(--ai-bg)",
      stroke: "var(--ai)",
      text: "var(--ai)",
    },
    {
      x: 496,
      w: 152,
      label: "결정층 (규칙)",
      sub: "해시 봉인 · (재) 검출 · 칸 배치",
      fill: "var(--det-bg)",
      stroke: "var(--det)",
      text: "var(--det)",
    },
    {
      x: 670,
      w: 140,
      label: "사람의 확정·서명",
      sub: "분야별 확인 → 책임 확정·서명",
      fill: "var(--sign-bg)",
      stroke: "var(--sign)",
      text: "var(--sign)",
    },
    {
      x: 832,
      w: 140,
      label: "불합격 판정 대장",
      sub: "다섯 칸 — 이것이 산출물이다",
      fill: "var(--stamp-bg)",
      stroke: "var(--stamp)",
      text: "var(--stamp)",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 990 168"
        className="w-full min-w-[860px]"
        role="img"
        aria-label="입력에서 판정 대장까지의 흐름도"
      >
        <defs>
          <marker
            id="ar"
            markerWidth="7"
            markerHeight="7"
            refX="5.6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 z" fill="#8d9098" />
          </marker>
        </defs>

        {boxes.map((b, i) => (
          <g key={b.label}>
            <rect
              x={b.x}
              y={30}
              width={b.w}
              height={62}
              rx={7}
              fill={b.fill}
              stroke={b.stroke}
              strokeWidth={1.2}
            />
            <text
              x={b.x + b.w / 2}
              y={56}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="700"
              fill={b.text}
            >
              {b.label}
            </text>
            <text
              x={b.x + b.w / 2}
              y={75}
              textAnchor="middle"
              fontSize="10.5"
              fill="#6e7178"
            >
              {b.sub}
            </text>
            {i < boxes.length - 1 && (
              <line
                x1={b.x + b.w + 3}
                y1={61}
                x2={boxes[i + 1].x - 5}
                y2={61}
                stroke="#8d9098"
                strokeWidth={1.2}
                markerEnd="url(#ar)"
              />
            )}
          </g>
        ))}

        {/* 원본은 옆으로 빠져 봉인된다 */}
        <line
          x1={77}
          y1={92}
          x2={77}
          y2={122}
          stroke="#b3261e"
          strokeWidth={1.2}
          strokeDasharray="3 3"
          markerEnd="url(#ar)"
        />
        <rect
          x={8}
          y={122}
          width={190}
          height={34}
          rx={6}
          fill="#fbeceb"
          stroke="#b3261e"
          strokeWidth={1.2}
        />
        <text x={103} y={137} textAnchor="middle" fontSize="11" fontWeight="700" fill="#b3261e">
          원본 = 읽기 전용 · 해시 봉인
        </text>
        <text x={103} y={150} textAnchor="middle" fontSize="10" fill="#8b4340">
          쓰기 경로를 두지 않는다
        </text>

        {/* 대장에서 서식이 나온다 */}
        <line
          x1={902}
          y1={92}
          x2={902}
          y2={122}
          stroke="#8d9098"
          strokeWidth={1.2}
          markerEnd="url(#ar)"
        />
        <rect
          x={790}
          y={122}
          width={192}
          height={34}
          rx={6}
          fill="#ffffff"
          stroke="#c7c3b6"
          strokeWidth={1.2}
        />
        <text x={886} y={137} textAnchor="middle" fontSize="11" fontWeight="700" fill="#46484d">
          별지 제50호 초안 — 부산물
        </text>
        <text x={886} y={150} textAnchor="middle" fontSize="10" fill="#6e7178">
          「우수시공 및 실패시공 사례」
        </text>

        {/* 시점 이동 */}
        <text x={8} y={18} fontSize="10.5" fill="#6e7178">
          작성 시점 : 용역 만료 후 14일 → <tspan fontWeight="700" fill="#b3261e">검측 종료 직후</tspan>
        </text>
      </svg>
    </div>
  );
}
