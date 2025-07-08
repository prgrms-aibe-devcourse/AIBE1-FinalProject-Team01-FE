import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getCommunityPosts } from "../services/communityApi";

/**
 * 커뮤니티 게시글 목록을 관리하는 커스텀 훅 (URL 파라미터 지원)
 */
export const useCommunityPosts = (boardType, initialParams = {}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 기존 useBoardList와 호환되는 상태 관리
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPageState] = useState(1);
    const [sort, setSortState] = useState("최신순");

    // 중복 호출 방지
    const isRequestInProgress = useRef(false);
    const lastRequestParams = useRef(null);

    /**
     * URL 파라미터 업데이트
     */
    const updateUrlParams = useCallback((newParams) => {
        const params = new URLSearchParams(searchParams);

        // 파라미터 설정
        if (newParams.page && newParams.page !== 1) {
            params.set("page", newParams.page.toString());
        } else {
            params.delete("page");
        }

        if (newParams.keyword && newParams.keyword.trim()) {
            params.set("keyword", newParams.keyword.trim());
        } else {
            params.delete("keyword");
        }

        if (newParams.sort && newParams.sort !== "최신순") {
            params.set("sort", newParams.sort);
        } else {
            params.delete("sort");
        }

        // URL 업데이트
        setSearchParams(params, { replace: false });
    }, [searchParams, setSearchParams]);

    /**
     * 프론트엔드 정렬값을 백엔드 정렬 파라미터로 변환
     */
    const mapSortToParams = useCallback((sortValue) => {
        const sortMapping = {
            "최신순": { field: "POST_LATEST", sortDirection: "DESC" },
            "조회순": { field: "POST_MOST_VIEW", sortDirection: "DESC" },
            "댓글순": { field: "commentCount", sortDirection: "DESC" },
            "좋아요순": { field: "POST_POPULAR", sortDirection: "DESC" },
        };
        return sortMapping[sortValue] || sortMapping["최신순"];
    }, []);

    const fetchPosts = useCallback(async (requestParams = null) => {
        if (!boardType) return;

        const sortParams = mapSortToParams(sort);
        const currentParams = requestParams || {
            page: page - 1,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };

        const paramsString = JSON.stringify(currentParams);

        if (isRequestInProgress.current || lastRequestParams.current === paramsString) {
            return;
        }

        isRequestInProgress.current = true;
        lastRequestParams.current = paramsString;
        setLoading(true);
        setError(null);

        try {
            const response = await getCommunityPosts(boardType, currentParams);

            if (response && typeof response === 'object') {
                setPosts(response.content || []);
                setTotalPages(response.pageInfo.totalPages || 0);
                setTotalElements(response.pageInfo.totalElements || 0);

            } else {
                setPosts([]);
                setTotalPages(0);
                setTotalElements(0);
            }

        } catch (err) {
            setError(err.message || "게시글을 불러오는데 실패했습니다.");
            setPosts([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
            isRequestInProgress.current = false;
        }
    }, [boardType, page, sort, keyword, mapSortToParams, initialParams]);

    /**
     * 검색 실행
     */
    const search = useCallback(() => {
        setSearchTerm(keyword);
        setPageState(1);

        // URL 파라미터 업데이트
        updateUrlParams({
            page: 1,
            keyword: keyword,
            sort: sort
        });

        // API 호출
        const sortParams = mapSortToParams(sort);
        const searchParams = {
            page: 0,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(searchParams);
    }, [keyword, sort, mapSortToParams, initialParams, fetchPosts, updateUrlParams]);

    /**
     * 페이지 변경 (기존 BoardPagination과 호환되도록 함수명 유지)
     */
    const setPage = useCallback((newPage) => {
        setPageState(newPage);

        // URL 파라미터 업데이트
        updateUrlParams({
            page: newPage,
            keyword: keyword,
            sort: sort
        });

        // API 호출
        const sortParams = mapSortToParams(sort);
        const pageParams = {
            page: newPage - 1,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(pageParams);
    }, [sort, keyword, mapSortToParams, initialParams, fetchPosts, updateUrlParams]);

    /**
     * 정렬 변경
     */
    const setSort = useCallback((newSort) => {
        setSortState(newSort);
        setPageState(1);

        // URL 파라미터 업데이트
        updateUrlParams({
            page: 1,
            keyword: keyword,
            sort: newSort
        });

        // API 호출
        const sortParams = mapSortToParams(newSort);
        const sortChangeParams = {
            page: 0,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(sortChangeParams);
    }, [keyword, mapSortToParams, initialParams, fetchPosts, updateUrlParams]);

    /**
     * 초기화
     */
    const reset = useCallback(() => {
        setKeyword("");
        setSearchTerm("");
        setPageState(1);
        setSortState("최신순");
        setError(null);

        // URL 파라미터 초기화
        updateUrlParams({
            page: 1,
            keyword: "",
            sort: "최신순"
        });

        // 파라미터 초기화하고 새로 조회
        lastRequestParams.current = null;
        const resetParams = {
            page: 0,
            keyword: "",
            field: "POST_LATEST",
            sortDirection: "DESC",
            ...initialParams
        };
        fetchPosts(resetParams);
    }, [initialParams, fetchPosts, updateUrlParams]);

    /**
     * 새로고침
     */
    const refresh = useCallback(() => {
        lastRequestParams.current = null; // 캐시 무효화
        fetchPosts();
    }, [fetchPosts]);

    // URL 파라미터 변경 감지 및 상태 동기화
    useEffect(() => {
        const newPage = parseInt(searchParams.get("page")) || 1;
        const newKeyword = searchParams.get("keyword") || "";
        const newSort = searchParams.get("sort") || "최신순";

        // 상태 업데이트 (무한 루프 방지를 위해 값이 다를 때만)
        if (newPage !== page) setPageState(newPage);
        if (newKeyword !== keyword) {
            setKeyword(newKeyword);
            setSearchTerm(newKeyword);
        }
        if (newSort !== sort) setSortState(newSort);

    }, [searchParams]); // searchParams만 의존성으로

    useEffect(() => {
        if (boardType) {
            // URL에서 파라미터 읽기
            const urlPage = parseInt(searchParams.get("page")) || 1;
            const urlKeyword = searchParams.get("keyword") || "";
            const urlSort = searchParams.get("sort") || "최신순";

            // 상태 설정
            setKeyword(urlKeyword);
            setSearchTerm(urlKeyword);
            setPageState(urlPage);
            setSortState(urlSort);
            setError(null);

            // 캐시 초기화
            lastRequestParams.current = null;

            // 초기 데이터 로딩
            const sortParams = mapSortToParams(urlSort);
            const initialLoadParams = {
                page: urlPage - 1,
                keyword: urlKeyword.trim(),
                ...sortParams,
                ...initialParams
            };
            fetchPosts(initialLoadParams);
        }
    }, [boardType]); // boardType만 의존성으로

    return {
        // 기존 useBoardList 호환 상태
        keyword,
        setKeyword,
        page,
        setPage, // 기존 BoardPagination이 기대하는 함수명 유지
        sort,
        setSort,
        posts,
        totalPages,
        reset,

        // 추가 상태
        loading,
        error,
        totalElements,
        searchTerm,

        // 유틸리티 함수
        refresh,
        fetchPosts,

        // 액션 함수
        search
    };
};