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
  isLiked: false,
  bookmarkCount: 2,
  isBookmarked: false,
  commentCount: 3,
  createdAt: "2025-06-13T14:00:00Z",
  updatedAt: "2025-06-13T14:00:00Z",
  nickname: "김루이지",
  profileImageUrl: "https://via.placeholder.com/40",
  devcourseName: "생성형 AI 백엔드", // 실제 값은 src/onstants에서 관리
};

const exampleComments = [
  {
    id: 1,
    postId: 1,
    nickname: "댓글유저1",
    profileImageUrl: "https://via.placeholder.com/32",
    devcourseName: "프론트엔드",
    parentCommentId: null,
    content: "좋은 글 감사합니다!",
    replyCount: 0,
    likeCount: 2,
    hasLiked: false,
    createdAt: "2025-06-13T15:00:00Z",
    updatedAt: "2025-06-13T15:00:00Z",
  },
  {
    id: 2,
    postId: 1,
    nickname: "댓글유저2",
    profileImageUrl: "https://via.placeholder.com/32",
    devcourseName: "데이터",
    parentCommentId: null,
    content: "저도 참여하고 싶어요!",
    replyCount: 1,
    likeCount: 1,
    hasLiked: true,
    createdAt: "2025-06-13T16:00:00Z",
    updatedAt: "2025-06-13T16:00:00Z",
  },
];

const gatheringPosts = [
  {
    postId: 1,
    boardType: "GATHERING",
    title: "React 스터디 팀원 모집 (주 2회)",
    content: `<p>React 18의 새로운 기능들을 함께 공부할 스터디원을 모집합니다. 초급자도 환영!</p>
      <img src="https://picsum.photos/id/1015/600/400" alt="스터디이미지1" style="max-width:100%;height:auto;"/>
      <img src="https://picsum.photos/id/1016/600/400" alt="스터디이미지2" style="max-width:100%;height:auto;"/>
      `,
    tags: ["React", "JavaScript", "초보환영"],
    gatheringType: GATHERING_TYPE.STUDY,
    status: GATHERING_STATUS.RECRUITING,
    headCount: 3,
    place: "경기도 화성 동탄",
    period: "3개월",
    schedule: "매주 월, 목 저녁 8시",
    post_images: [
      {
        id: 101,
        image_url: "https://picsum.photos/id/1015/600/400",
        post_id: 1,
      },
      {
        id: 102,
        image_url: "https://picsum.photos/id/1016/600/400",
        post_id: 1,
      },
    ],
    ...commonFields,
    likeCount: 7,
    isLiked: true,
    bookmarkCount: 3,
    isBookmarked: true,
    commentCount: 2,
    comments: exampleComments,
  },
  {
    postId: 2,
    boardType: "GATHERING",
    title: "사이드 프로젝트 팀원 구합니다",
    content: "<p>함께 성장할 사이드 프로젝트 팀원을 모집합니다.</p>",
    tags: ["프로젝트", "협업", "포트폴리오"],
    gatheringType: GATHERING_TYPE.SIDE_PROJECT,
    status: GATHERING_STATUS.COMPLETED,
    headCount: 5,
    place: "서울 강남구",
    period: "2025.06.20 ~ 2025.08.20",
    schedule: "온라인 자율 진행",
    ...commonFields,
    userId: 2,
    likeCount: 10,
    isLiked: false,
    bookmarkCount: 1,
    isBookmarked: false,
    commentCount: 0,
    comments: [],
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
    likeCount: 2,
    isLiked: false,
    bookmarkCount: 2,
    commentCount: 1,
    comments: [
      {
        id: 3,
        postId: 3,
        nickname: "멘토유저",
        profileImageUrl: "https://via.placeholder.com/32",
        devcourseName: "멘토링",
        parentCommentId: null,
        content: "멘토링 신청합니다!",
        replyCount: 0,
        likeCount: 2,
        hasLiked: false,
        createdAt: "2025-06-14T10:00:00Z",
        updatedAt: "2025-06-14T10:00:00Z",
      },
    ],
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
    isBookmarked: false,
    likeCount: 1,
    isLiked: false,
    bookmarkCount: 0,
    commentCount: 0,
    comments: [],
  },
];

const marketPosts = [
  {
    postId: 5,
    boardType: "MARKET",
    title: "기계식 키보드(청축) 팝니다",
    content: `<p>사용감 거의 없는 기계식 키보드 팝니다. 풀박스 보유중</p>
      <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8" alt="키보드1" style="max-width:100%;height:auto;"/>
      <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" alt="키보드2" style="max-width:100%;height:auto;"/>
    `,
    tags: ["키보드", "기계식", "청축"],
    status: MARKET_STATUS.ON_SALE,
    price: 50000,
    place: "서울시 강남구",
    post_images: [
      {
        id: 1,
        image_url:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        post_id: 5,
      },
      {
        id: 2,
        image_url:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        post_id: 5,
      },
    ],
    ...commonFields,
    userId: 11,
    likeCount: 4,
    isLiked: false,
    bookmarkCount: 1,
    isBookmarked: false,
    commentCount: 0,
    comments: [],
  },
  {
    postId: 6,
    boardType: "MARKET",
    title: "모니터 받침대 거의 새거",
    content: `<p>구매 후 거의 사용하지 않은 모니터 받침대입니다.</p>
      <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308" alt="모니터받침대1" style="max-width:100%;height:auto;"/>
      <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca" alt="모니터받침대2" style="max-width:100%;height:auto;"/>
    `,
    tags: ["모니터", "받침대", "모니터암"],
    status: MARKET_STATUS.SOLD_OUT,
    price: 15000,
    place: "온라인",
    post_images: [
      {
        id: 3,
        image_url:
          "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
        post_id: 6,
      },
      {
        id: 4,
        image_url:
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
        post_id: 6,
      },
    ],
    ...commonFields,
    userId: 12,
    isLiked: true,
    likeCount: 8,
    bookmarkCount: 2,
    isBookmarked: true,
    commentCount: 2,
    comments: [
      {
        id: 4,
        postId: 6,
        nickname: "중고유저",
        profileImageUrl: "https://via.placeholder.com/32",
        devcourseName: "중고유저",
        parentCommentId: null,
        content: "가격 문의 드려요!",
        replyCount: 0,
        likeCount: 2,
        hasLiked: false,
        createdAt: "2025-06-15T09:00:00Z",
        updatedAt: "2025-06-15T09:00:00Z",
      },
      {
        id: 5,
        postId: 6,
        nickname: "관심유저",
        profileImageUrl: "https://via.placeholder.com/32",
        devcourseName: "관심유저",
        parentCommentId: null,
        content: "예약 가능할까요?",
        replyCount: 0,
        likeCount: 0,
        hasLiked: true,
        createdAt: "2025-06-15T10:00:00Z",
        updatedAt: "2025-06-15T10:00:00Z",
      },
    ],
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
