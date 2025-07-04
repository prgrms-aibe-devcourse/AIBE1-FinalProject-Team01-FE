// 마이페이지용 더미 데이터 (communityData.js의 post 형식 참고)

export const DUMMY_PROFILE = {
  name: "김개발",
  nickname: "개발자 개발새발",
  email: "kimcoding@programmers.com",
  topics: ["Frontend", "AI/CC"],
  profileImg: null,
};

export const DUMMY_POSTS = [
  {
    postId: 1,
    boardType: "FREE",
    title: "내가 쓴 글 1",
    content: "첫 번째 글 내용입니다.",
    createdAt: "2024-06-01T10:00:00Z",
    nickname: "김개발",
    profileImageUrl: "https://via.placeholder.com/40",
    likeCount: 2,
    commentCount: 1,
    isLiked: false,
    isBookmarked: false,
  },
  {
    postId: 2,
    boardType: "QNA",
    title: "내가 쓴 글 2",
    content: "두 번째 글 내용입니다.",
    createdAt: "2024-06-02T12:00:00Z",
    nickname: "김개발",
    profileImageUrl: "https://via.placeholder.com/40",
    likeCount: 1,
    commentCount: 0,
    isLiked: true,
    isBookmarked: true,
  },
];

export const DUMMY_LIKES = [
  {
    postId: 3,
    boardType: "FREE",
    title: "좋아요한 글 1",
    content: "좋아요한 글 내용입니다.",
    createdAt: "2024-05-30T09:00:00Z",
    nickname: "홍길동",
    profileImageUrl: "https://via.placeholder.com/40",
    likeCount: 5,
    commentCount: 2,
    isLiked: true,
    isBookmarked: false,
  },
];

export const DUMMY_BOOKMARKS = [
  {
    postId: 4,
    boardType: "RETROSPECT",
    title: "북마크한 글 1",
    content: "북마크한 글 내용입니다.",
    createdAt: "2024-05-28T15:00:00Z",
    nickname: "박개발",
    profileImageUrl: "https://via.placeholder.com/40",
    likeCount: 3,
    commentCount: 1,
    isLiked: false,
    isBookmarked: true,
  },
];
