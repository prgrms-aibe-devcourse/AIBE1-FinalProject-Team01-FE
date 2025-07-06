import { useState, useEffect, useCallback, useRef } from "react";
import { getInfoPosts } from "../services/infoApi";

/**
 * Info 게시글 목록을 관리하는 커스텀 훅
 */
export const useInfoPosts = (boardType, initialParams = {}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 기존 useBoardList와 호환되는 상태 관리
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("최신순");

    // 중복 호출 방지
    const isRequestInProgress = useRef(false);
    const lastRequestParams = useRef(null);

    /**
     * 프론트엔드 정렬값을 백엔드 정렬 파라미터로 변환
     */
    const mapSortToParams = useCallback((sortValue) => {
        const sortMapping = {
            "최신순": { field: "POST_LATEST", sortDirection: "DESC" },
            "조회순": { field: "POST_MOST_VIEW", sortDirection: "DESC" },
            "좋아요순": { field: "POST_POPULAR", sortDirection: "DESC" },
        };
        return sortMapping[sortValue] || sortMapping["최신순"];
    }, []);

    const fetchPosts = useCallback(async (requestParams = null) => {
        if (!boardType) return;

        const sortParams = mapSortToParams(sort);
        const currentParams = requestParams || {
            page: page - 1, // UI는 1-based, API는 0-based
            size: 10,
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
            const response = await getInfoPosts(boardType, currentParams);

            if (response && typeof response === 'object') {
                setPosts(response.content || []);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
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
        setPage(1);
        // 파라미터 초기화하고 fetchPosts 호출
        const sortParams = mapSortToParams(sort);
        const searchParams = {
            page: 0,
            size: 10,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(searchParams);
    }, [keyword, sort, mapSortToParams, initialParams, fetchPosts]);

    /**
     * 페이지 변경
     */
    const handleSetPage = useCallback((newPage) => {
        setPage(newPage);
        const sortParams = mapSortToParams(sort);
        const pageParams = {
            page: newPage - 1,
            size: 10,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(pageParams);
    }, [sort, keyword, mapSortToParams, initialParams, fetchPosts]);

    /**
     * 정렬 변경
     */
    const handleSetSort = useCallback((newSort) => {
        setSort(newSort);
        setPage(1);
        const sortParams = mapSortToParams(newSort);
        const sortChangeParams = {
            page: 0,
            size: 10,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(sortChangeParams);
    }, [keyword, mapSortToParams, initialParams, fetchPosts]);

    /**
     * 초기화
     */
    const reset = useCallback(() => {
        setKeyword("");
        setSearchTerm("");
        setPage(1);
        setSort("최신순");
        setError(null);

        // 파라미터 초기화하고 새로 조회
        lastRequestParams.current = null;
        const resetParams = {
            page: 0,
            size: 10,
            keyword: "",
            field: "POST_LATEST",
            sortDirection: "DESC",
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

    // 🔥 가장 중요: boardType이 변경될 때만 초기 로딩
    useEffect(() => {
        if (boardType) {
            // 상태 초기화
            setKeyword("");
            setSearchTerm("");
            setPage(1);
            setSort("최신순");
            setError(null);

            // 캐시 초기화
            lastRequestParams.current = null;

            // 초기 데이터 로딩
            const initialLoadParams = {
                page: 0,
                size: 10,
                keyword: "",
                field: "POST_LATEST",
                sortDirection: "DESC",
                ...initialParams
            };
            fetchPosts(initialLoadParams);
        }
    }, [boardType]); // boardType만 의존성으로!

    return {
        // 기존 useBoardList 호환 상태
        keyword,
        setKeyword,
        page,
        setPage: handleSetPage,
        sort,
        setSort: handleSetSort,
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
