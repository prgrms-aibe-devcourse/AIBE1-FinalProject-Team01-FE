// enum
export const GATHERING_TYPE = {
  STUDY: "STUDY",
  SIDE_PROJECT: "SIDE_PROJECT",
};

export const MATCH_TYPE = {
  COFFEE_CHAT: "COFFEE_CHAT",
  MENTORING: "MENTORING",
};

export const RECRUITMENT_TYPE = {
  FRONTEND: "FRONTEND",
  BACKEND: "BACKEND",
  AI: "AI",
  DATA: "DATA",
  DESIGN: "DESIGN",
  PM: "PM",
};

export const GATHERING_STATUS = {
  RECRUITING: "RECRUITING",
  COMPLETED: "COMPLETED",
};

export const MATCH_STATUS = {
  AVAILABLE: "OPEN",
  COMPLETED: "MATCHED",
};

export const MARKET_STATUS = {
  ON_SALE: "SELLING",
  RESERVED: "RESERVED",
  SOLD_OUT: "SOLD_OUT",
};

// UI 표시 이름
export const GATHERING_TYPE_LABELS = {
  [GATHERING_TYPE.STUDY]: "스터디",
  [GATHERING_TYPE.SIDE_PROJECT]: "팀 프로젝트",
};

export const MATCH_TYPE_LABELS = {
  [MATCH_TYPE.COFFEE_CHAT]: "커피챗",
  [MATCH_TYPE.MENTORING]: "멘토링",
};

export const TOGETHER_TYPE_LABELS = {
  ...GATHERING_TYPE_LABELS,
  ...MATCH_TYPE_LABELS,
};

export const RECRUITMENT_TYPE_LABELS = {
  ALL: "전체", // FE에서만 사용용
  [RECRUITMENT_TYPE.FRONTEND]: "프론트엔드",
  [RECRUITMENT_TYPE.BACKEND]: "백엔드",
  [RECRUITMENT_TYPE.AI]: "AI",
  [RECRUITMENT_TYPE.DATA]: "데이터",
  [RECRUITMENT_TYPE.DESIGN]: "디자인",
  [RECRUITMENT_TYPE.PM]: "기획",
};

export const GATHERING_STATUS_LABELS = {
  [GATHERING_STATUS.RECRUITING]: "모집중",
  [GATHERING_STATUS.COMPLETED]: "모집완료",
};

export const MATCH_STATUS_LABELS = {
  [MATCH_STATUS.AVAILABLE]: "매칭가능",
  [MATCH_STATUS.COMPLETED]: "매칭완료",
};

export const MARKET_STATUS_LABELS = {
  [MARKET_STATUS.ON_SALE]: "판매중",
  [MARKET_STATUS.RESERVED]: "예약중",
  [MARKET_STATUS.SOLD_OUT]: "판매완료",
};

export const STATUS_LABELS = {
  ...GATHERING_STATUS_LABELS,
  ...MATCH_STATUS_LABELS,
  ...MARKET_STATUS_LABELS,
};

export const STATUS_COLOR_MAP = {
  모집중: "bg-success-subtle text-success-emphasis border border-success-subtle",
  모집완료: "bg-light text-secondary border border-light",
  매칭가능: "bg-primary-subtle text-primary-emphasis border border-primary-subtle",
  매칭완료: "bg-light text-secondary border border-light",
  예약중: "bg-success text-white",
  판매완료: "bg-secondary text-white",
};

// UI 컴포넌트용 상수
export const BOARD_TABS = [
  { id: "gathering", label: "스터디/프로젝트" },
  { id: "match", label: "커피챗/멘토링" },
  { id: "market", label: "중고장터" },
];

// 글쓰기 페이지용 카테고리
export const TOGETHER_CATEGORIES = [
  {
    label: "스터디/프로젝트",
    value: "gathering",
    subCategories: [
      { label: "스터디", value: "STUDY" },
      { label: "프로젝트", value: "SIDE_PROJECT" },
    ],
  },
  {
    label: "커피챗/멘토링",
    value: "match",
    subCategories: [
      { label: "커피챗", value: "COFFEE_CHAT" },
      { label: "멘토링", value: "MENTORING" },
    ],
  },
  {
    label: "중고장터",
    value: "market",
    subCategories: [], // 중고장터는 하위 카테고리 없음
  },
];
