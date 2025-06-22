// 팀원구하기(gathering) 더미 데이터
export const gatheringData = [
  {
    id: 1,
    user_id: 1,
    board_type: "gathering",
    title: "React 스터디 팀원 모집 (주 2회)",
    content:
      "<p>React 18의 새로운 기능들을 함께 공부할 스터디원을 모집합니다. 초급자도 환영!</p>",
    view_count: 123,
    like_count: 5,
    is_deleted: false,
    created_at: "2025-06-13T14:00:00Z",
    updated_at: "2025-06-13T14:00:00Z",
    tags: ["React", "JavaScript", "초보환영", "백엔드"],
    post_images: [],
    user: {
      id: 1,
      nickname: "김루이지",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "프론트엔드",
    },
    gathering_post: {
      gathering_type: "study",
      status: "모집중",
      headCount: 3,
      place: "경기도 화성 동탄",
      period: "2025.06.13 ~ 2025.07.13",
      required_skills: null,
    },
    bookmarked: false,
    comments: [],
  },
  {
    id: 2,
    user_id: 2,
    board_type: "gathering",
    title: "사이드 프로젝트 팀원 구합니다",
    content: "<p>함께 성장할 사이드 프로젝트 팀원을 모집합니다.</p>",
    view_count: 45,
    like_count: 2,
    is_deleted: false,
    created_at: "2025-06-12T10:00:00Z",
    updated_at: "2025-06-12T10:00:00Z",
    tags: ["프로젝트", "협업"],
    post_images: [],
    user: {
      id: 2,
      nickname: "홍길동",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "백엔드",
    },
    gathering_post: {
      gathering_type: "project",
      status: "모집완료",
      headCount: 5,
      place: "서울 강남구",
      period: "2025.06.20 ~ 2025.08.20",
      required_skills: null,
    },
    bookmarked: false,
    comments: [],
  },
];

// 커피챗/멘토링(match) 더미 데이터
export const matchData = [
  {
    id: 3,
    user_id: 9,
    board_type: "gathering",
    title: "프론트엔드 개발자 커피챗 구해요",
    content:
      "<p>프론트엔드 개발자와 진로, 취업 관련 커피챗 하실 분 구합니다.</p>",
    view_count: 77,
    like_count: 2,
    is_deleted: false,
    created_at: "2025-06-13T15:00:00Z",
    updated_at: "2025-06-13T15:00:00Z",
    tags: ["프론트엔드", "커피챗"],
    post_images: [],
    user: {
      id: 9,
      nickname: "이영희",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "프론트엔드",
    },
    gathering_post: {
      gathering_type: "coffeechat",
      status: "매칭가능",
      headCount: 1,
      place: "온라인",
      period: "2025.06.13 ~ 2025.06.30",
      required_skills: null,
    },
    bookmarked: false,
    comments: [],
  },
  {
    id: 4,
    user_id: 10,
    board_type: "gathering",
    title: "멘토링: 포트폴리오 첨삭해드립니다",
    content: "<p>포트폴리오 첨삭 및 피드백 멘토링 진행합니다.</p>",
    view_count: 55,
    like_count: 1,
    is_deleted: false,
    created_at: "2025-06-10T11:00:00Z",
    updated_at: "2025-06-10T11:00:00Z",
    tags: ["멘토링", "포트폴리오"],
    post_images: [],
    user: {
      id: 10,
      nickname: "박민수",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "멘토링",
    },
    gathering_post: {
      gathering_type: "mentoring",
      status: "매칭완료",
      headCount: 1,
      place: "온라인",
      period: "2025.06.10 ~ 2025.06.30",
      required_skills: null,
    },
    bookmarked: false,
    comments: [],
  },
];

// 장터(market) 더미 데이터
export const marketData = [
  {
    id: 5,
    user_id: 11,
    board_type: "market",
    title: "머쓱이 그립톡",
    content:
      "<p>머쓱이 얼굴이 그려진 귀여운 그립톡입니다. 미개봉 새상품!</p><p>측면 사진도 확인하세요.</p>",
    view_count: 34,
    like_count: 0,
    is_deleted: false,
    created_at: "2025-06-05T13:00:00Z",
    updated_at: "2025-06-05T13:00:00Z",
    tags: ["서적", "중고"],
    post_images: [
      { image_url: "/src/assets/masseuki.png" },
      {
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLlkP9EXGiropFvkyGVSJiQDkC3o8huVh06NIu0s4LHyTy_sTToM9vn2xKF5HwqFDF4A&usqp=CAU",
      },
    ],
    user: {
      id: 11,
      nickname: "최서적",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "서적판매",
    },
    market_item: {
      price: 5000,
      status: "판매중",
    },
    bookmarked: false,
    comments: [],
  },
  {
    id: 6,
    user_id: 12,
    board_type: "market",
    title: "클린코드 책",
    content:
      "<p>클린코드 1권입니다. 상태 아주 좋습니다.</p><p>내부도 깨끗합니다.</p>",
    view_count: 21,
    like_count: 1,
    is_deleted: false,
    created_at: "2025-06-06T17:00:00Z",
    updated_at: "2025-06-06T17:00:00Z",
    tags: ["모니터", "중고"],
    post_images: [
      {
        image_url:
          "https://via.placeholder.com/400x400.png?text=Clean+Code+Cover",
      },
    ],
    user: {
      id: 12,
      nickname: "박전자",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "전자제품",
    },
    market_item: {
      price: 10000,
      status: "판매완료",
    },
    bookmarked: false,
    comments: [],
  },
  {
    id: 7,
    user_id: 1,
    board_type: "market",
    title: "이펙티브 자바 3/E",
    content: "<p>이펙티브 자바 3판입니다. 거의 새 책입니다.</p>",
    view_count: 180,
    like_count: 12,
    is_deleted: false,
    created_at: "2025-06-11T18:00:00Z",
    updated_at: "2025-06-11T18:00:00Z",
    tags: ["자바", "필독서"],
    post_images: [
      {
        image_url:
          "https://via.placeholder.com/400x400.png?text=Effective+Java",
      },
    ],
    user: {
      id: 1,
      nickname: "김루이지",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "프론트엔드",
    },
    market_item: {
      price: 15000,
      status: "판매중",
    },
    bookmarked: true,
    comments: [],
  },
];
