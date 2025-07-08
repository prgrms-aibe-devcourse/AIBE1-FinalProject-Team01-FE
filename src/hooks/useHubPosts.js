import { useState, useEffect, useCallback, useRef } from "react";
import { getPosts } from "../services/hubApi";

/**
 * Hub 프로젝트 목록을 관리하는 커스텀 훅
 */
export const useHubPosts = (initialParams = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    pageSize: 9,
    totalPages: 0,
    totalElements: 0
  });

  // 검색/필터 상태
  const [filters, setFilters] = useState({
    courseName: "",
    batchNumber: "",
    keyword: "",
  });
  const [page, setPage] = useState(1);

  // 중복 호출 방지
  const isRequestInProgress = useRef(false);
  const lastRequestParams = useRef(null);

  /**
   * 프로젝트 목록 조회
   */
  const fetchPosts = useCallback(async (requestParams = null) => {
    const currentParams = requestParams || {
      page: page - 1, // UI는 1-based, API는 0-based
      size: 9,
      ...(filters.keyword && { keyword: filters.keyword }),
      ...(filters.courseName && { course: filters.courseName }),
      ...(filters.batchNumber && { batch: filters.batchNumber }),
      ...initialParams
    };

    const paramsString = JSON.stringify(currentParams);

    // 중복 요청 방지
    if (isRequestInProgress.current || lastRequestParams.current === paramsString) {
      return;
    }

    isRequestInProgress.current = true;
    lastRequestParams.current = paramsString;
    setLoading(true);
    setError(null);

    try {
      const response = await getPosts(currentParams);

      if (response && typeof response === 'object') {
        setPosts(response.content || []);
        setPageInfo(response.pageInfo || {
          pageNumber: 0,
          pageSize: 9,
          totalPages: 0,
          totalElements: 0
        });
      } else {
        setPosts([]);
        setPageInfo({
          pageNumber: 0,
          pageSize: 9,
          totalPages: 0,
          totalElements: 0
        });
      }
    } catch (err) {
      setError(err.message || "프로젝트를 불러오는데 실패했습니다.");
      setPosts([]);
      setPageInfo({
        pageNumber: 0,
        pageSize: 9,
        totalPages: 0,
        totalElements: 0
      });
    } finally {
      setLoading(false);
      isRequestInProgress.current = false;
    }
  }, [page, filters, initialParams]);

  /**
   * 검색/필터 적용
   */
  const search = useCallback((searchFilters) => {
    setFilters(searchFilters);
    setPage(1);
    
    const searchParams = {
      page: 0,
      size: 9,
      ...(searchFilters.keyword && { keyword: searchFilters.keyword }),
      ...(searchFilters.courseName && { course: searchFilters.courseName }),
      ...(searchFilters.batchNumber && { batch: searchFilters.batchNumber }),
      ...initialParams
    };
    
    fetchPosts(searchParams);
  }, [initialParams, fetchPosts]);

  /**
   * 페이지 변경
   */
  const handleSetPage = useCallback((newPage) => {
    setPage(newPage);
    
    const pageParams = {
      page: newPage - 1,
      size: 9,
      ...(filters.keyword && { keyword: filters.keyword }),
      ...(filters.courseName && { course: filters.courseName }),
      ...(filters.batchNumber && { batch: filters.batchNumber }),
      ...initialParams
    };
    
    fetchPosts(pageParams);
  }, [filters, initialParams, fetchPosts]);

  /**
   * 초기화
   */
  const reset = useCallback(() => {
    setFilters({
      courseName: "",
      batchNumber: "",
      keyword: "",
    });
    setPage(1);
    setError(null);

    // 파라미터 초기화하고 새로 조회
    lastRequestParams.current = null;
    const resetParams = {
      page: 0,
      size: 9,
      ...initialParams
    };
    fetchPosts(resetParams);
  }, [initialParams, fetchPosts]);

  /**
   * 새로고침
   */
  const refresh = useCallback(() => {
    lastRequestParams.current = null; // 캐시 무효화
    fetchPosts();
  }, [fetchPosts]);

  // 초기 데이터 로딩
  useEffect(() => {
    // 상태 초기화
    setFilters({
      courseName: "",
      batchNumber: "",
      keyword: "",
    });
    setPage(1);
    setError(null);

    // 캐시 초기화
    lastRequestParams.current = null;

    // 초기 데이터 로딩
    const initialLoadParams = {
      page: 0,
      size: 9,
      ...initialParams
    };
    fetchPosts(initialLoadParams);
  }, []); // 컴포넌트 마운트시에만 실행

  return {
    // 데이터 상태
    posts,
    loading,
    error,
    pageInfo,
    
    // 필터/페이지 상태
    filters,
    page,
    setPage: handleSetPage,
    
    // 유틸리티 함수
    search,
    reset,
    refresh,
    fetchPosts
  };
};
