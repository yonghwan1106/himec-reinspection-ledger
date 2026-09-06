import type { Metadata } from "next";
import "./globals.css";
import Chrome from "@/components/Chrome";

export const metadata: Metadata = {
  title: "붉은 글씨로 (재)라고 쓴 그날의 이유 — 검측 불합격 판정 대장",
  description:
    "제1회 HIMEC AI 활용 아이디어 공모전 출품작 목업 (제안자 박용환). 서명이 든 검측 스캔 원본은 해시로 봉인한 채, 그 옆에 불합격 판정의 이유를 다섯 칸으로 옮겨 적는 대장. 표시 데이터는 전부 가상입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
