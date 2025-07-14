import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getGatheringPostList } from "../services/together/gatheringApi";
import { getMarketPostList } from "../services/together/marketApi";
import { getMatchingPostList } from "../services/together/matchingApi";
export default function useTogetherPosts(boardType, initialParams = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 상태: 페이지(1-based), 검색어, 정렬
  const [keyword, setKeyword] = useState("");
  const [page, setPageState] = useState(1);
  const [sort, setSortState] = useState("최신순");
  const [searchTerm, setSearchTerm] = useState("");
  

  const inProgress = useRef(false);
  const lastParams = useRef(null);

  // URL에 변경사항 반영
  const updateUrl = useCallback((params) => {
    const qp = new URLSearchParams(searchParams);
    if(params.page && params.page > 1){
        qp.set("page", params.page.toString());
    }
    else{
        qp.delete("page");
    }
    if(params.keyword) {
        qp.set("keyword", params.keyword);
    }
    else{
        qp.delete("keyword");
    }
    if(params.sort && params.sort !== "최신순"){
        qp.set("sort", params.sort);
    }else{
        qp.delete("sort");
    }
    setSearchParams(qp, { replace: false });
  }, [searchParams, setSearchParams]);

  // 프론트 sort 값을 백엔드 파라미터로 매핑
  const mapSort = useCallback((sortValue) => {
        const sortMapping = {
            "최신순": { field: "POST_LATEST", sortDirection: "DESC" },
            "조회순": { field: "POST_MOST_VIEW", sortDirection: "DESC" },
            "좋아요순": { field: "POST_POPULAR", sortDirection: "DESC" },
        };
        return sortMapping[sortValue] || sortMapping["최신순"];
    }, []);

  // API 호출
  const fetchPosts = useCallback(async (params = null) => {
    if (!boardType) return;
    const sortParams = mapSort(sort);
    const req = params || {
      page: page - 1,
      keyword: keyword.trim(),
      ...sortParams,
      ...initialParams,
    };
    const key = JSON.stringify({ boardType, ...req });
    if (inProgress.current || lastParams.current === key) return;
    inProgress.current = true;
    lastParams.current = key;
    setLoading(true);
    setError(null);
    try {
        let res;
        if (boardType === "gathering") {
            res = await getGatheringPostList(req);
        } else if (boardType === "match") {
            res = await getMatchingPostList(req);
        } else {
            res = await getMarketPostList(req);
        }
        setPosts(res.content || []);
        setTotalPages(res.pageInfo?.totalPages || 0);
        setTotalElements(res.pageInfo?.totalElements || 0);
    } catch (e) {
        console.error(e);
        setError(e.message || "게시글 로드 실패");
        setPosts([]);
        setTotalPages(0);
        setTotalElements(0);
    } finally {
        setLoading(false);
        inProgress.current = false;
    }
  }, [boardType, page, keyword, sort, initialParams, mapSort]);



  // 검색
  const search = useCallback(() => {
    setSearchTerm(keyword);
    setPageState(1);
    updateUrl({ page: 1, keyword, sort });
    fetchPosts({ ...mapSort(sort), page: 0, keyword: keyword.trim(), ...initialParams });
  }, [keyword, sort, initialParams, fetchPosts, updateUrl, mapSort]);

  // 페이지 설정
  const setPage = useCallback((p) => {
    setPageState(p);
    updateUrl({ page: p, keyword, sort });
    fetchPosts({ ...mapSort(sort), page: p - 1, keyword: keyword.trim(), ...initialParams });
  }, [keyword, sort, initialParams, fetchPosts, updateUrl, mapSort]);


  // 정렬 설정
  const setSort = useCallback((s) => {
    setSortState(s);
    setPageState(1);
    updateUrl({ page: 1, keyword, sort: s });
    fetchPosts({ ...mapSort(s), page: 0, keyword: keyword.trim(), ...initialParams });
  }, [keyword, initialParams, fetchPosts, updateUrl, mapSort]);


  // 초기화
  const reset = useCallback(() => {
    setKeyword("");
    setPageState(1);
    setSortState("최신순");
    setSearchTerm("");
    updateUrl({ page: 1, keyword: "", sort: "최신순" });
    lastParams.current = null;
    fetchPosts({ page: 0, keyword: "", field: "POST_LATEST", sortDirection: "DESC", ...initialParams });
  }, [initialParams, fetchPosts, updateUrl]);



  useEffect(() => {
    const p = parseInt(searchParams.get("page")) || 1;
    const k = searchParams.get("keyword") || "";
    const s = searchParams.get("sort") || "최신순";
    if(p !== page) setPageState(p);
    if(k !== keyword){
        setSearchTerm(k);
        setKeyword(k);
    } 
    if(s !== sort) setSortState(s);
  }, [searchParams]);


  useEffect(() => {
    lastParams.current = null;
    const p = parseInt(searchParams.get("page")) || 1;
    const k = searchParams.get("keyword") || "";
    const s = searchParams.get("sort") || "최신순";
    if(p !== page) setPageState(p);
    if(k !== keyword){
        setSearchTerm(k);
        setKeyword(k);
    } 
    if(s !== sort) setSortState(s);
    fetchPosts({ ...mapSort(s), page: p - 1, keyword: k.trim(), ...initialParams });
  }, [boardType]);



  return {
    posts,
    page,
    sort,
    keyword,
    totalPages,
    loading,
    error,
    search,
    setPage,
    setSort,
    setKeyword,
    reset,
    searchTerm,
  };
}
