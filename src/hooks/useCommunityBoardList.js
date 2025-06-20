import { useReducer } from "react";
import { DUMMY_POSTS, CATEGORY_MAP } from "../pages/community/communityData";

const PAGE_SIZE = 10;

const initialState = {
  keyword: "",
  searchTerm: "",
  page: 1,
  sort: "최신순",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_KEYWORD":
      return { ...state, keyword: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: state.keyword, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload, page: 1 };
    case "RESET":
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}

export function useCommunityBoardList(category) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 카테고리 바뀌면 검색/페이지 초기화
  // (이 부분은 커스텀 훅 내부에서 useEffect로 처리해도 되고, 외부에서 dispatch로 처리해도 됨)

  // 필터링/정렬/페이지네이션
  const filteredPosts = DUMMY_POSTS.filter(
    (post) =>
      post.category === category &&
      (state.searchTerm === "" || post.title.includes(state.searchTerm))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (state.sort === "최신순") return b.id - a.id;
    if (state.sort === "조회순") return (b.views || 0) - (a.views || 0);
    if (state.sort === "댓글순")
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    if (state.sort === "좋아요순") return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);
  const pagedPosts = sortedPosts.slice(
    (state.page - 1) * PAGE_SIZE,
    state.page * PAGE_SIZE
  );

  // 핸들러
  const setKeyword = (v) => dispatch({ type: "SET_KEYWORD", payload: v });
  const search = () => dispatch({ type: "SET_SEARCH_TERM" });
  const setPage = (p) => dispatch({ type: "SET_PAGE", payload: p });
  const setSort = (s) => dispatch({ type: "SET_SORT", payload: s });
  const reset = (payload) => dispatch({ type: "RESET", payload });

  return {
    ...state,
    posts: pagedPosts,
    totalPages,
    setKeyword,
    search,
    setPage,
    setSort,
    reset,
    categoryLabel: CATEGORY_MAP[category],
  };
}
