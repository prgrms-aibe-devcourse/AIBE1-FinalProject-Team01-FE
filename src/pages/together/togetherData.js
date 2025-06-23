/**
 * 함께해요(스터디/프로젝트, 커피챗/멘토링) 게시판을 더미데이터
 * - boardType: 'gathering' (스터디/프로젝트), 'match' (커피챗/멘토링)
 */
import {
  GATHERING_STATUS,
  GATHERING_TYPE,
  MATCH_STATUS,
  MATCH_TYPE,
  MARKET_STATUS,
  RECRUITMENT_TYPE,
} from "./constants";

const commonFields = {
  userId: 1,
  viewCount: 123,
  likeCount: 5,
  commentCount: 3,
  isLiked: false,
  isBookmarked: false,
  createdAt: "2025-06-13T14:00:00Z",
  updatedAt: "2025-06-13T14:00:00Z",
  nickname: "김루이지",
  profileImg: "https://via.placeholder.com/40",
};

const gatheringPosts = [
  {
    postId: 1,
    boardType: "GATHERING",
    title: "React 스터디 팀원 모집 (주 2회)",
    content:
      "<p>React 18의 새로운 기능들을 함께 공부할 스터디원을 모집합니다. 초급자도 환영!</p>",
    tags: ["React", "JavaScript", "초보환영"],
    gatheringType: GATHERING_TYPE.STUDY,
    status: GATHERING_STATUS.RECRUITING,
    headCount: 3,
    place: "경기도 화성 동탄",
    period: "3개월",
    schedule: "매주 월, 목 저녁 8시",
    requiredSkills: ["React", "TypeScript"],
    ...commonFields,
  },
  {
    postId: 2,
    boardType: "GATHERING",
    title: "사이드 프로젝트 팀원 구합니다",
    content: "<p>함께 성장할 사이드 프로젝트 팀원을 모집합니다.</p>",
    tags: ["프로젝트", "협업", "포트폴리오"],
    gatheringType: GATHERING_TYPE.PROJECT,
    status: GATHERING_STATUS.COMPLETED,
    headCount: 5,
    place: "서울 강남구",
    period: "2025.06.20 ~ 2025.08.20",
    schedule: "온라인 자율 진행",
    requiredSkills: ["Spring Boot", "JPA", "React"],
    ...commonFields,
    userId: 2,
    likeCount: 10,
    isLiked: true,
  },
];

const matchPosts = [
  {
    postId: 3,
    boardType: "MATCH",
    title: "프론트엔드 개발자 커피챗 구해요",
    content:
      "<p>프론트엔드 개발자와 진로, 취업 관련 커피챗 하실 분 구합니다.</p>",
    tags: ["프론트엔드", "커피챗", "취업"],
    matchingType: MATCH_TYPE.COFFEE_CHAT,
    status: MATCH_STATUS.AVAILABLE,
    expertiseArea: RECRUITMENT_TYPE.FRONTEND,
    ...commonFields,
    userId: 9,
    isBookmarked: true,
  },
  {
    postId: 4,
    boardType: "MATCH",
    title: "멘토링: 포트폴리오 첨삭해드립니다",
    content: "<p>포트폴리오 첨삭 및 피드백 멘토링 진행합니다.</p>",
    tags: ["멘토링", "포트폴리오", "백엔드"],
    matchingType: MATCH_TYPE.MENTORING,
    status: MATCH_STATUS.COMPLETED,
    expertiseArea: RECRUITMENT_TYPE.BACKEND,
    ...commonFields,
    userId: 10,
  },
];

const marketPosts = [
  {
    postId: 5,
    boardType: "MARKET",
    title: "기계식 키보드(청축) 팝니다",
    content: "<p>사용감 거의 없는 기계식 키보드 팝니다. 풀박스 보유중</p>",
    tags: ["키보드", "기계식", "청축"],
    status: MARKET_STATUS.ON_SALE,
    price: 50000,
    place: "서울시 강남구",
    ...commonFields,
    userId: 11,
  },
  {
    postId: 6,
    boardType: "MARKET",
    title: "모니터 받침대 거의 새거",
    content: "<p>구매 후 거의 사용하지 않은 모니터 받침대입니다.</p>",
    tags: ["모니터", "받침대", "모니터암"],
    status: MARKET_STATUS.SOLD_OUT,
    price: 15000,
    place: "온라인",
    ...commonFields,
    userId: 12,
    isLiked: true,
  },
];

export const allTogetherPosts = [
  ...gatheringPosts,
  ...matchPosts,
  ...marketPosts,
];

export const gatheringData = {
  posts: gatheringPosts,
  totalElements: gatheringPosts.length,
};
export const matchData = {
  posts: matchPosts,
  totalElements: matchPosts.length,
};
export const marketData = {
  posts: marketPosts,
  totalElements: marketPosts.length,
};
