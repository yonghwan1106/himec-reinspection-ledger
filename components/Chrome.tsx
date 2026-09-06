"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Route,
  FileLock2,
  Rows3,
  ClipboardCheck,
  GaugeCircle,
  TriangleAlert,
} from "lucide-react";

const NAV = [
  {
    href: "/",
    n: "0",
    label: "개요 · 흐름",
    sub: "그날의 이유는 어디에 잠기는가",
    icon: Route,
  },
  {
    href: "/original",
    n: "1",
    label: "원본 봉인 뷰",
    sub: "읽기 전용 · 해시 배지 · (재)",
    icon: FileLock2,
  },
  {
    href: "/ledger",
    n: "2",
    label: "불합격 판정 대장",
    sub: "다섯 칸 · 사건 사슬 · 서명",
    icon: Rows3,
  },
  {
    href: "/form50",
    n: "3",
    label: "별지 제50호 초안",
    sub: "대장에서 뽑아 낸 부산물",
    icon: ClipboardCheck,
  },
  {
    href: "/metrics",
    n: "4",
    label: "지표 · 검증 · 로드맵",
    sub: "판독률 · κ · 오결합률",
    icon: GaugeCircle,
  },
];

export default function Chrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#3a3b3e] bg-[#1a1a1c] text-[#f2f1ec]">
        <div className="flex h-11 items-center gap-3 px-5">
          <span className="text-[12.5px] font-semibold tracking-tight">
            제1회 HIMEC AI 활용 아이디어 공모전 출품작 목업
          </span>
          <span className="text-[12px] text-[#a4a6a2]">제안자 박용환</span>
          <span className="hidden text-[12px] text-[#a4a6a2] xl:inline">
            · 「붉은 글씨로 (재)라고 쓴 그날의 이유」 — 검측 불합격 판정 대장
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-sm border border-[#b98a3a] bg-[#3a2f16] px-2 py-[3px] text-[11.5px] font-semibold text-[#f0c975]">
            <TriangleAlert size={13} strokeWidth={2.2} />
            가상 데이터 — 실제 기업·현장·프로젝트가 아닙니다
          </span>
        </div>
      </header>

      {/* 좌측 목록의 지면 색을 문서 전체 높이까지 깔아 둔다 (전체 캡처 시 흰 여백 방지) */}
      <div className="flex md:bg-[linear-gradient(to_right,#ecebe4_0,#ecebe4_235px,#dfdcd2_235px,#dfdcd2_236px,var(--paper)_236px)]">
        <nav className="sticky top-11 hidden h-[calc(100vh-2.75rem)] w-[236px] shrink-0 overflow-y-auto border-r border-[var(--rule)] bg-[#ecebe4] px-3 py-4 md:block">
          <p className="px-2 pb-2 text-[11px] font-semibold tracking-wide text-[var(--ink-3)]">
            화면 5종
          </p>
          <ul className="space-y-1">
            {NAV.map((it) => {
              const on = path === it.href;
              const Icon = it.icon;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={[
                      "block rounded-md border px-2.5 py-2 transition-colors",
                      on
                        ? "border-[var(--rule-2)] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                        : "border-transparent hover:bg-white/60",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={[
                          "mono flex h-[18px] w-[18px] items-center justify-center rounded-[3px] text-[11px] font-bold",
                          on
                            ? "bg-[var(--stamp)] text-white"
                            : "bg-[var(--rule-2)] text-[#46484d]",
                        ].join(" ")}
                      >
                        {it.n}
                      </span>
                      <span className="text-[13px] font-semibold text-[var(--ink)]">
                        {it.label}
                      </span>
                      <Icon
                        size={14}
                        className="ml-auto text-[var(--ink-3)]"
                        strokeWidth={1.8}
                      />
                    </span>
                    <span className="mt-0.5 block pl-[26px] text-[11.5px] text-[var(--ink-3)]">
                      {it.sub}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 rounded-md border border-[var(--rule)] bg-white/70 px-2.5 py-2.5">
            <p className="text-[11px] font-semibold text-[var(--ink-2)]">
              층 표시 규칙
            </p>
            <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
              <span className="mt-[3px] inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--ocr)]" />
              인식층 — 확률적, 판독률로 잰다
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
              <span className="mt-[3px] inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--ai)]" />
              판단층(AI) — 감리원 2인 κ가 상한
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
              <span className="mt-[3px] inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--det)]" />
              결정층(규칙) — 해시 대조 100%
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-[11.5px] leading-snug text-[var(--ink-2)]">
              <span className="mt-[3px] inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--sign)]" />
              사람 — 확정과 서명
            </p>
          </div>

          <p className="mt-4 px-2 text-[11px] leading-relaxed text-[var(--ink-3)]">
            원본 스캔에는 쓰기 경로를 두지 않았습니다.
            <br />
            최종 확정과 서명은 책임건설사업관리기술인입니다.
          </p>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
