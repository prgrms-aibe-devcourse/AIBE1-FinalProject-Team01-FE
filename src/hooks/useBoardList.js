import { useReducer } from "react";

const DEFAULT_PAGE_SIZE = 10;

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

/**
 * 게시판 리스트/검색/정렬/페이지네이션 커스텀 훅 (공통)
 * @param {Object} params
 * @param {Array} params.data - 전체 게시글 데이터
 * @param {string} [params.boardType] - 게시판 타입(필터링용)
 * @param {function} [params.customFilter] - 커스텀 필터 함수(옵션)
 * @param {number} [params.pageSize]
 * @returns 상태/핸들러/필터링된 posts/totalPages 등
 */
export function useBoardList({
  data,
  boardType,
  customFilter,
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 게시판 타입/검색 필터링
  let filtered = data;
  if (boardType) {
    if (customFilter) {
      filtered = filtered.filter((item) => customFilter(item, boardType));
    } else {
      filtered = filtered.filter((item) => item.boardType === boardType);
    }
  }

  if (state.searchTerm) {
    filtered = filtered.filter(
      (item) =>
        item.title?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

  // 정렬
  let sorted = [...filtered];
  if (state.sort === "최신순") {
    sorted.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } else if (state.sort === "조회순") {
    sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else if (state.sort === "댓글순") {
    sorted.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
  } else if (state.sort === "좋아요순") {
    sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  }

  // 페이지네이션
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pagedPosts = sorted.slice(
    (state.page - 1) * pageSize,
    state.page * pageSize
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
  };
}
