/**
 * 목업 표시 데이터 — 전부 가상이다.
 * 실제 기업·발주청·현장·프로젝트명·인명은 한 건도 쓰지 않았다.
 * 프로젝트는 「예시 데이터센터 A/B/C」, 문서번호·장비 태그·인명은 모두 지어낸 값이다.
 * 대장에는 발주청·현장 식별자와 시공사 실명을 저장하지 않는다는 제안의 원칙에 따라,
 * 이 화면에서도 시공사는 「협력사 갑/을」 같은 역할명으로만 나타난다.
 */

export const DISCLAIMER =
  "표시 수치는 예시값입니다. 프로젝트·문서번호·장비 태그·지표 값은 모두 가상이며 실제 기업·현장·실적이 아닙니다. 서식의 칸 배치도 예시이며 서식 원본의 칸 구성에 맞추어 확정합니다.";

/* ── 1. 원본 봉인 뷰용 스캔 문서 ──────────────────────────── */

export type ScanField = {
  id: string;
  label: string;
  value: string;
  /** 인쇄 서식 필드인가, 손으로 쓴 칸인가 */
  kind: "print" | "hand";
  /** 인식층 신뢰도 (0~1). 임계 미만은 미확인으로 남긴다 */
  conf: number;
  /** 원본 좌표 (표시용) */
  xy: string;
};

export const SCAN = {
  docNo: "MEP-2026-0417(재)",
  formName: "검측요청ㆍ결과통보내용",
  formNote: "검측 서식 계통 표시 — 화면은 서식의 구조만 모사한 가상 문서다",
  project: "예시 데이터센터 A",
  page: 2,
  pages: 3,
  scannedAt: "2026-03-18",
  dpi: 300,
  color: "컬러 300dpi",
  sha256: "9f2c41ab7d0e58c3 6b91ee40a2d7f815 c0348b6ad19e7742 5ea3b8c96f01d24e",
  sealedAt: "2026-03-18 17:42:06",
  readonly: true,
  reStamp: true,
  fields: [
    {
      id: "f1",
      label: "공종 CODE",
      value: "M-CHW-2100",
      kind: "print",
      conf: 0.99,
      xy: "x112,y188",
    },
    {
      id: "f2",
      label: "위치 및 부위",
      value: "2F B구역 랙열 상부 수평주관 (GL+4,200)",
      kind: "print",
      conf: 0.97,
      xy: "x112,y232",
    },
    {
      id: "f3",
      label: "공종",
      value: "기계 · 냉수배관(CHW) DN200",
      kind: "print",
      conf: 0.98,
      xy: "x112,y276",
    },
    {
      id: "f4",
      label: "검사항목",
      value: "수평주관 구배 및 최고점 공기빼기 밸브 설치 상태",
      kind: "print",
      conf: 0.96,
      xy: "x112,y320",
    },
    {
      id: "f5",
      label: "검사기준",
      value: "기계설비공사 시방서 15100 3.2 — 구배 1/250 이상, 최고점 자동공기빼기 밸브 설치",
      kind: "print",
      conf: 0.95,
      xy: "x112,y364",
    },
    {
      id: "f6",
      label: "검사결과",
      value: "실측 구배 1/620 (3개소), 최고점 밸브 미설치",
      kind: "hand",
      conf: 0.88,
      xy: "x412,y412",
    },
    {
      id: "f7",
      label: "조치사항",
      value: "행거 높이 재조정하여 구배 확보 후 재검측 요청할 것. 최고점 공기빼기 밸브 추가 설치.",
      kind: "hand",
      conf: 0.81,
      xy: "x412,y688",
    },
    {
      id: "f8",
      label: "판정",
      value: "불합격",
      kind: "print",
      conf: 0.99,
      xy: "x690,y412",
    },
    {
      id: "f9",
      label: "비고(첨부)",
      value: "[판독 임계 미만 — 미확인]",
      kind: "hand",
      conf: 0.42,
      xy: "x412,y742",
    },
  ] as ScanField[],
  signatures: [
    { role: "시공 담당(협력사 갑)", note: "서명 — 성명은 마스킹" },
    { role: "건설사업관리기술인(기계)", note: "서명 — 성명은 마스킹" },
  ],
};

export const CONF_THRESHOLD = 0.6;

/* ── 2. 불합격 판정 대장 ──────────────────────────────────── */

export type ChainNode = {
  step: "원검측" | "시정지시" | "재검측";
  docNo: string;
  date: string;
  page: number;
  result: string;
  reStamp?: boolean;
};

export type LedgerRow = {
  id: string;
  /** 사건 사슬 ID */
  chainId: string;
  project: string;
  trade: "기계" | "소방";
  /** 다섯 칸 ① 대상 */
  target: string;
  /** 다섯 칸 ② 기준 */
  criterion: string;
  criterionCite: { doc: string; page: number; xy: string };
  /** 다섯 칸 ③ 불합격 사유 (원문 인용) */
  reasonQuote: string;
  reasonCite: { doc: string; page: number; xy: string };
  /** AI 유형 정규화 — 원문 표현들이 한 유형으로 모인다 */
  defectType: string;
  defectVariants: string[];
  defectConf: number;
  /** 다섯 칸 ④ 시정 유형 */
  fixType: string;
  fixConf: number;
  /** 다섯 칸 ⑤ 재검측 결과 */
  outcome: "합격" | "재불합격" | "진행 중" | "미확인";
  chain: ChainNode[];
  chainConf: number;
  /** 사람의 확정 상태 */
  status: "확정" | "확인 대기" | "사슬 끊음";
  signedBy?: string;
  signedAt?: string;
  breakNote?: string;
  /** 반대 방향 표본 여부 (검증 설계에 일부러 섞은 건) */
  adversarial?: string;
};

export const LEDGER: LedgerRow[] = [
  {
    id: "L-001",
    chainId: "EV-2026-0113",
    project: "예시 데이터센터 A",
    trade: "기계",
    target: "냉수배관(CHW) DN200 수평주관 / 2F B구역 랙열 상부",
    criterion: "구배 1/250 이상, 최고점 자동공기빼기 밸브 설치",
    criterionCite: { doc: "MEP-2026-0417", page: 2, xy: "x112,y364" },
    reasonQuote:
      "실측 구배 1/620 (3개소), 최고점 밸브 미설치. 행거 높이 재조정하여 구배 확보 후 재검측 요청할 것.",
    reasonCite: { doc: "MEP-2026-0417", page: 2, xy: "x412,y688" },
    defectType: "배관 구배 불량",
    defectVariants: ["구배 미확보", "슬로프 부족", "역구배 구간 발생"],
    defectConf: 0.93,
    fixType: "재시공 — 지지물(행거) 높이 조정",
    fixConf: 0.9,
    outcome: "합격",
    chainConf: 0.96,
    chain: [
      {
        step: "원검측",
        docNo: "MEP-2026-0417",
        date: "2026-03-11",
        page: 2,
        result: "불합격",
      },
      {
        step: "시정지시",
        docNo: "CM-2026-0142",
        date: "2026-03-12",
        page: 1,
        result: "보완시공 지시",
      },
      {
        step: "재검측",
        docNo: "MEP-2026-0417(재)",
        date: "2026-03-18",
        page: 2,
        result: "합격",
        reStamp: true,
      },
    ],
    status: "확정",
    signedBy: "분야별 건설사업관리기술인(기계)",
    signedAt: "2026-03-18 18:05",
  },
  {
    id: "L-002",
    chainId: "EV-2026-0227",
    project: "예시 데이터센터 A",
    trade: "기계",
    target: "급기덕트 1,000×400 플랜지 접합부 / 3F 공조실 ~ AHU-3-02",
    criterion: "덕트 기밀시험 누기율 시방 기준 이내, 가스켓 전주 삽입",
    criterionCite: { doc: "MEP-2026-0503", page: 1, xy: "x112,y352" },
    reasonQuote:
      "플랜지 4개소 가스켓 부분 누락, 기밀시험 중 접합부 누기음 확인. 볼트 체결 토크 미달 추정 기재.",
    reasonCite: { doc: "MEP-2026-0503", page: 1, xy: "x408,y664" },
    defectType: "덕트 접합부 기밀 불량",
    defectVariants: ["가스켓 누락", "플랜지 누기", "접합부 실링 미흡"],
    defectConf: 0.89,
    fixType: "부분 해체 후 재조립 — 가스켓 교체·재체결",
    fixConf: 0.86,
    outcome: "합격",
    chainConf: 0.94,
    chain: [
      {
        step: "원검측",
        docNo: "MEP-2026-0503",
        date: "2026-04-02",
        page: 1,
        result: "불합격",
      },
      {
        step: "시정지시",
        docNo: "CM-2026-0171",
        date: "2026-04-03",
        page: 1,
        result: "보완시공 지시",
      },
      {
        step: "재검측",
        docNo: "MEP-2026-0503(재)",
        date: "2026-04-09",
        page: 1,
        result: "합격",
        reStamp: true,
      },
    ],
    status: "확정",
    signedBy: "분야별 건설사업관리기술인(기계)",
    signedAt: "2026-04-09 17:20",
  },
  {
    id: "L-003",
    chainId: "EV-2026-0341",
    project: "예시 데이터센터 B",
    trade: "기계",
    target: "냉수배관 보온 두께 / B2F 기계실 헤더 ~ 입상관",
    criterion: "보온재 두께 시방 표기치, 이음부 겹침 및 방습층 연속",
    criterionCite: { doc: "MEP-2026-0688", page: 2, xy: "x112,y298" },
    reasonQuote:
      "입상관 구간 보온 두께 시방 미달 2개소, 이음부 방습층 절단 상태로 마감됨.",
    reasonCite: { doc: "MEP-2026-0688", page: 2, xy: "x404,y612" },
    defectType: "보온·방습 시공 불량",
    defectVariants: ["보온 두께 미달", "방습층 불연속", "이음부 겹침 부족"],
    defectConf: 0.85,
    fixType: "재시공 — 보온재 교체 및 방습층 재시공",
    fixConf: 0.82,
    outcome: "합격",
    chainConf: 0.91,
    chain: [
      {
        step: "원검측",
        docNo: "MEP-2026-0688",
        date: "2026-05-14",
        page: 2,
        result: "불합격",
      },
      {
        step: "시정지시",
        docNo: "CM-2026-0233",
        date: "2026-05-15",
        page: 1,
        result: "보완시공 지시",
      },
      {
        step: "재검측",
        docNo: "MEP-2026-0688(재)",
        date: "2026-05-22",
        page: 2,
        result: "합격",
        reStamp: true,
      },
    ],
    status: "확정",
    signedBy: "분야별 건설사업관리기술인(기계)",
    signedAt: "2026-05-22 16:48",
  },
  {
    id: "L-004",
    chainId: "EV-2026-0355",
    project: "예시 데이터센터 B",
    trade: "기계",
    target: "응축수 배관 트랩 / 3F AHU-3-05 드레인",
    criterion: "트랩 봉수 깊이 기기 정압 대응치 이상, 통기 확보",
    criterionCite: { doc: "MEP-2026-0702", page: 1, xy: "x112,y306" },
    reasonQuote:
      "트랩 봉수 깊이 부족으로 시운전 중 드레인 역류. 통기관 미설치 기재.",
    reasonCite: { doc: "MEP-2026-0702", page: 1, xy: "x410,y638" },
    defectType: "드레인 트랩 사양 부적합",
    defectVariants: ["봉수 깊이 부족", "트랩 규격 미달", "통기 미확보"],
    defectConf: 0.78,
    fixType: "설계 확인 후 트랩 교체 — 설계 기인 가능성",
    fixConf: 0.64,
    outcome: "합격",
    chainConf: 0.88,
    chain: [
      {
        step: "원검측",
        docNo: "MEP-2026-0702",
        date: "2026-06-03",
        page: 1,
        result: "불합격",
      },
      {
        step: "시정지시",
        docNo: "CM-2026-0261",
        date: "2026-06-04",
        page: 1,
        result: "보완시공 지시 (설계 확인 병행)",
      },
      {
        step: "재검측",
        docNo: "MEP-2026-0702(재)",
        date: "2026-06-12",
        page: 1,
        result: "합격",
        reStamp: true,
      },
    ],
    status: "확인 대기",
    adversarial:
      "합격 종결 뒤 준공 후 하자로 돌아온 건 — 시정 유형이 「시공」인지 「설계 기인」인지 사람이 갈린다",
  },
  {
    id: "L-005",
    chainId: "EV-2026-0402",
    project: "예시 데이터센터 C",
    trade: "기계",
    target: "냉수배관 DN150 용접부 / B1F 기계실 헤더 분기",
    criterion: "용접부 외관 및 비파괴검사 성적서 제출, 개선 각도 시방 준수",
    criterionCite: { doc: "MEP-2026-0811", page: 1, xy: "x112,y288" },
    reasonQuote:
      "용접부 언더컷 2개소 육안 확인. 비파괴검사 성적서 미제출 상태로 검측 요청됨.",
    reasonCite: { doc: "MEP-2026-0811", page: 1, xy: "x406,y602" },
    defectType: "용접부 결함 · 성적서 미제출",
    defectVariants: ["언더컷", "용접 비드 불량", "검사성적서 누락"],
    defectConf: 0.87,
    fixType: "재시공 — 용접부 보수 후 비파괴검사 재실시",
    fixConf: 0.85,
    outcome: "진행 중",
    chainConf: 0.9,
    chain: [
      {
        step: "원검측",
        docNo: "MEP-2026-0811",
        date: "2026-07-21",
        page: 1,
        result: "불합격",
      },
      {
        step: "시정지시",
        docNo: "CM-2026-0298",
        date: "2026-07-22",
        page: 1,
        result: "보완시공 지시",
      },
    ],
    status: "확인 대기",
  },
  {
    id: "L-006",
    chainId: "EV-2026-0455 / EV-2026-0456",
    project: "예시 데이터센터 C",
    trade: "기계",
    target: "덕트 행거 간격 / 4F 동일 구역, 4일 간격 2건",
    criterion: "행거 간격 시방 표기치 이내, 진동 절연 패드 삽입",
    criterionCite: { doc: "MEP-2026-0854", page: 1, xy: "x112,y294" },
    reasonQuote:
      "행거 간격 초과 3개소. (별건) 동일 구역 4일 뒤 다른 계통에서 절연 패드 누락 지적.",
    reasonCite: { doc: "MEP-2026-0854", page: 1, xy: "x402,y588" },
    defectType: "지지·고정 불량",
    defectVariants: ["행거 간격 초과", "절연 패드 누락", "지지물 고정 불량"],
    defectConf: 0.72,
    fixType: "재시공 — 행거 추가 및 패드 삽입",
    fixConf: 0.7,
    outcome: "미확인",
    chainConf: 0.58,
    chain: [
      {
        step: "원검측",
        docNo: "MEP-2026-0854",
        date: "2026-08-05",
        page: 1,
        result: "불합격",
      },
      {
        step: "시정지시",
        docNo: "CM-2026-0316",
        date: "2026-08-06",
        page: 1,
        result: "보완시공 지시",
      },
      {
        step: "재검측",
        docNo: "MEP-2026-0871(재)",
        date: "2026-08-09",
        page: 1,
        result: "합격 (다른 사건의 문서로 확인됨)",
        reStamp: true,
      },
    ],
    status: "사슬 끊음",
    breakNote:
      "같은 층 같은 구역이지만 계통이 다른 별개 사건이다. 마지막 마디를 끊고 EV-2026-0456으로 분리했다. 이 건은 오결합률의 분자로 집계된다.",
    adversarial:
      "이어붙이면 안 되는 문서 쌍 — 검증 설계에서 일부러 섞은 반대 방향 표본",
  },
];

/* ── 3. 결함 유형 사전 (현업이 엑셀로 편집) ────────────────── */

export const DICTIONARY = [
  {
    type: "배관 구배 불량",
    variants: ["구배 미확보", "슬로프 부족", "역구배 구간 발생", "물고임 발생"],
    count: 14,
    owner: "기계 검측 담당",
    updated: "2026-08-28",
  },
  {
    type: "덕트 접합부 기밀 불량",
    variants: ["가스켓 누락", "플랜지 누기", "접합부 실링 미흡"],
    count: 11,
    owner: "기계 검측 담당",
    updated: "2026-08-28",
  },
  {
    type: "지지·고정 불량",
    variants: ["행거 간격 초과", "절연 패드 누락", "지지물 고정 불량"],
    count: 9,
    owner: "기계 검측 담당",
    updated: "2026-08-14",
  },
  {
    type: "보온·방습 시공 불량",
    variants: ["보온 두께 미달", "방습층 불연속", "이음부 겹침 부족"],
    count: 7,
    owner: "기계 검측 담당",
    updated: "2026-07-30",
  },
  {
    type: "용접부 결함 · 성적서 미제출",
    variants: ["언더컷", "용접 비드 불량", "검사성적서 누락"],
    count: 6,
    owner: "기계 검측 담당",
    updated: "2026-07-30",
  },
  {
    type: "드레인 트랩 사양 부적합",
    variants: ["봉수 깊이 부족", "트랩 규격 미달", "통기 미확보"],
    count: 4,
    owner: "기계 검측 담당",
    updated: "2026-06-19",
  },
];

/* ── 4. 지표 대시보드 ─────────────────────────────────────── */

export type Metric = {
  layer: "ocr" | "ai" | "det" | "sign";
  name: string;
  value: string;
  num: number;
  max: number;
  gate: string;
  pass: boolean;
  note: string;
};

export const METRICS: Metric[] = [
  {
    layer: "ocr",
    name: "필드 단위 정확도 (정답 표본 30장 대비)",
    value: "96.4%",
    num: 96.4,
    max: 100,
    gate: "중단선 95% 미만 — 활자 조서 구간의 값이며 2단계 손글씨 기준은 따로 정한다",
    pass: true,
    note: "합격선은 자기 신뢰도가 아니라 사람이 전면 전사한 30장 대비 필드 단위 정확도에 건다",
  },
  {
    layer: "ocr",
    name: "자기 신뢰도 — 임계 이상 필드 비율",
    value: "94.2%",
    num: 94.2,
    max: 100,
    gate: "임계값은 정확도와의 캘리브레이션으로 정한다. 미만은 「미확인」",
    pass: true,
    note: "표본 300장. 남은 5.8%는 손글씨 조치사항란에 몰려 있고 손글씨는 2단계 범위다",
  },
  {
    layer: "ai",
    name: "유형 정규화 κ_H − κ_S",
    value: "0.09",
    num: 91,
    max: 100,
    gate: "중단선 κ_S < κ_H × 0.8 — 미만이면 규칙 사전으로 환원. 상수는 4주차 게이트에서 고정한다",
    pass: true,
    note: "감리원 2인 사이 κ_H = 0.71을 먼저 쟀다. 2인 합의 라벨 대 시스템 κ_S = 0.62. 재는 것은 두 값의 차다",
  },
  {
    layer: "ai",
    name: "사건 재현율 (정답 목록 ⓒ 대비)",
    value: "91.5%",
    num: 91.5,
    max: 100,
    gate: "1단계는 실측만 하고 합격선을 걸지 않는다",
    pass: true,
    note: "감리원 2인이 완료 1건의 불합격분 전량을 독립 복원한 목록이 분모다. 제출된 제50호는 정답으로 쓰지 않는다",
  },
  {
    layer: "ai",
    name: "사슬 오결합률 (별도 지표)",
    value: "3.1%",
    num: 3.1,
    max: 10,
    gate: "중단선 5% 초과 — 초과 시 사슬 자동 제안 중지",
    pass: true,
    note: "정답 표본에서만 잰다. 절단율(감리원이 끊은 마디 비율)은 오차가 아니라 개입량이며, 두 값이 벌어진 폭이 조용히 남는 오결합의 크기다",
  },
  {
    layer: "det",
    name: "원본 해시 대조",
    value: "100%",
    num: 100,
    max: 100,
    gate: "합격선 100% — 한 건이라도 어긋나면 중단",
    pass: true,
    note: "1,284 / 1,284 건. 원본에 대한 쓰기 경로 자체가 없다",
  },
  {
    layer: "sign",
    name: "대장 다섯 칸의 칸 단위 일치율 (1차 지표)",
    value: "0.63",
    num: 63,
    max: 100,
    gate: "1단계 목표 0.60 · 2단계 0.75",
    pass: true,
    note: "정답 ⓑ = 감리원 2인이 독립으로 채우고 불일치를 합의로 확정한 다섯 칸. 상한은 같은 표본의 2인 일치율이며 κ와 비교하지 않는다. 발주 형태와 무관하고, 별지 제50호 일치율은 발주청 현장 한정 부속 지표다",
  },
  {
    layer: "sign",
    name: "사건 직후 확정 비율 (새 지표)",
    value: "76%",
    num: 76,
    max: 100,
    gate: "HDX가 목표를 걸지 않은 새 지표. 확인·확정은 불합격 1건당 3분 이내를 목표로 건다",
    pass: true,
    note: "작성 시점이 용역 만료 뒤 열나흘에서 사건 직후로 옮겨 갔는지를 잰다",
  },
];

export const STOP_RULES = [
  {
    when: "필드 단위 정확도 95% 미만",
    then: "스캔 경로를 중단하고, 2단계 초점을 대장 카드 종결 칸의 전향 적재로 돌린다(이슈 로그 유무와 무관)",
  },
  {
    when: "정답 표본 오결합률 5% 초과",
    then: "사슬 자동 제안을 중지한다. 사람이 직접 잇는 방식으로 되돌린다",
  },
  {
    when: "κ_S가 κ_H의 0.8배 미만",
    then: "AI 정규화를 내리고 규칙 사전으로 환원한다",
  },
];

export const COUNTERSAMPLES = [
  "합격 종결 뒤 준공 후 하자로 돌아온 건",
  "같은 층 같은 부위에서 며칠 간격으로 벌어진 별개 사건 쌍 (이어붙이면 안 되는 문서 쌍)",
  "구형 양식·타사 양식 묶음",
];

/* ── 5. 별지 제50호 초안 ──────────────────────────────────── */

export const FORM50 = {
  formTitle: "우수시공 및 실패시공 사례",
  formNo: "별지 제50호 서식",
  basis:
    "최종보고서 작성서식 아홉 종(별지 제43~51호)의 여덟 번째 칸 — 대장에서 뽑아 낸 초안이다. 대장 행의 확인·확정은 분야별 건설사업관리기술인이, 이 서식의 최종 확정과 서명은 책임건설사업관리기술인이 한다",
  project: "예시 데이터센터 A · B · C (가상)",
  period: "2026-03-11 ~ 2026-08-09",
  cells: [
    {
      key: "공종",
      value: "기계 — 냉수배관(CHW) 및 공조 덕트 계열",
      from: "결정층 규칙 — 대장 「대상」 칸 집계",
      layer: "det" as const,
      rows: ["L-001", "L-002", "L-003"],
    },
    {
      key: "사례 구분",
      value: "실패시공 사례",
      from: "결정층 규칙 — 대장 판정 칸이 「불합격」인 행만 모은다",
      layer: "det" as const,
      rows: ["L-001", "L-002", "L-003", "L-005"],
    },
    {
      key: "사례 내용",
      value:
        "냉수배관 수평주관 구배 미확보 3개소 및 최고점 자동공기빼기 밸브 미설치. 동일 유형이 완료 3개 현장에서 14건 누적.",
      from: "판단층 AI — 유형 정규화로 표현이 다른 14건을 한 유형으로 묶었다",
      layer: "ai" as const,
      rows: ["L-001"],
    },
    {
      key: "불합격 사유 — 원문 인용",
      value:
        "“실측 구배 1/620 (3개소), 최고점 밸브 미설치. 행거 높이 재조정하여 구배 확보 후 재검측 요청할 것.”",
      from: "인식층 + 결정층 — 원문 인용을 그대로 옮기고 좌표를 붙였다. 원문에 없는 원인은 만들지 않는다",
      layer: "ocr" as const,
      rows: ["L-001"],
    },
    {
      key: "조치 내용",
      value:
        "시정지시(CM-2026-0142) 후 지지물 높이 조정 재시공. 재검측 MEP-2026-0417(재)에서 합격.",
      from: "판단층 AI — 원검측·시정지시·재검측을 한 사건으로 이었다",
      layer: "ai" as const,
      rows: ["L-001"],
    },
    {
      key: "향후 대책",
      value:
        "다음 현장 『검측업무지침』의 검사항목에 「수평주관 구배 실측 위치 3점 지정」을 추가 상정.",
      from: "사람 — 되먹임 항목은 감리원이 판단해 적는다",
      layer: "sign" as const,
      rows: ["L-001", "L-002"],
    },
  ],
  topTypes: [
    { type: "배관 구배 불량", n: 14 },
    { type: "덕트 접합부 기밀 불량", n: 11 },
    { type: "지지·고정 불량", n: 9 },
    { type: "보온·방습 시공 불량", n: 7 },
    { type: "용접부 결함 · 성적서 미제출", n: 6 },
    { type: "드레인 트랩 사양 부적합", n: 4 },
  ],
};

/* ── 6. 로드맵 · 라이선스 ─────────────────────────────────── */

export const ROADMAP = [
  {
    phase: "1단계",
    period: "0~6개월 (3개월 데모)",
    scope:
      "완료 3건, 기계 공종 활자 검측조서. 첫 4주는 개발이 아니라 코퍼스 실사와 실측 — 스캔 300장 표본, 그 가운데 30장은 사람이 전면 전사해 정답으로 쓴다",
    graft: "기존 문서 DB에 「판정 대장」 테이블 하나 추가. 유형 사전은 엑셀로 현업이 편집",
    out: "완료 1건의 필드 단위 정확도 + 2인 일치도 + 별지 제50호 초안 1장. 투입은 개발·데이터 각 1인 12주와 사내 CPU 서버 1대",
  },
  {
    phase: "분기",
    period: "4주차",
    scope: "필드 단위 정확도가 중단선(95%) 아래인 경우",
    graft: "—",
    out: "2단계 초점을 대장 카드 종결 칸의 전향 적재로 돌린다(이슈 로그 유무와 무관)",
  },
  {
    phase: "2단계",
    period: "6~18개월",
    scope: "진행 현장에 사건 직후 적재, 소방 감리로 확대 — 소방은 법령 계통이 달라 별지 제50호가 따라가지 않고 확대되는 것은 다섯 칸이다",
    graft: "「소방공사감리 업무절차서」 검측 체크리스트와의 기호 매핑표",
    out: "칸 단위 일치율 0.75 · κ_H − κ_S ≤ 0.10 · 불합격 이력 검색 시간 40% 단축(분모는 1단계 실측치)",
  },
  {
    phase: "3단계",
    period: "18~36개월",
    scope: "유형별 누적 건수 상위 항목을 다음 현장으로 되돌린다",
    graft: "현장별 『검측업무지침』 수립 절차에 검사항목 후보로 상정",
    out: "파트너사 공유 → 협회 데이터센터기술위원회를 통한 업계 공유",
  },
];

export const LICENSES = [
  {
    item: "PaddleOCR",
    lic: "Apache-2.0",
    verdict: "채택" as const,
    why: "사내 배포 가능한 허용 라이선스이며 한국어 인식을 지원한다",
  },
  {
    item: "Docling · pdfplumber",
    lic: "MIT",
    verdict: "채택" as const,
    why: "허용 라이선스. 서식 구조 파싱에 사용",
  },
  {
    item: "pypdfium2",
    lic: "Apache-2.0 / BSD-3",
    verdict: "채택" as const,
    why: "PDF 래스터화 대체 경로",
  },
  {
    item: "PyMuPDF · Ultralytics YOLO",
    lic: "AGPL-3.0",
    verdict: "배제" as const,
    why: "사내 배포 시 소스 공개 의무가 문제된다. 대체 = pypdfium2 + Apache 계열 검출기",
  },
  {
    item: "layoutlmv3 가중치",
    lic: "cc-by-nc-sa-4.0",
    verdict: "배제" as const,
    why: "비상업 조건이라 업무 적용이 막힌다. 대체 = 서식 좌표 규칙 + Apache 계열 모델",
  },
  {
    item: "클라우드 문서 AI 서비스",
    lic: "—",
    verdict: "배제" as const,
    why: "문서가 사외로 나가 착수 시 제출하는 보안각서와 상충한다",
  },
];

/* 이 목업 자체의 라이선스 검토 — 서약서 3호 대응 */
export const MOCKUP_LICENSES = [
  { item: "Next.js", lic: "MIT" },
  { item: "React · React DOM", lic: "MIT" },
  { item: "Tailwind CSS", lic: "MIT" },
  { item: "TypeScript", lic: "Apache-2.0" },
  { item: "lucide-react (아이콘)", lic: "ISC" },
  { item: "Pretendard (폰트, 없으면 시스템 폰트)", lic: "SIL OFL 1.1" },
  { item: "이미지", lic: "사용하지 않음 — 도형은 전부 SVG/CSS" },
];
