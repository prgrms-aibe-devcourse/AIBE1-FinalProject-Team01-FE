import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getCommunityPosts } from "../services/communityApi";

export const useCommunityPosts = (boardType, initialParams = {}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPageState] = useState(1);
    const [sort, setSortState] = useState("최신순");

    const abortControllerRef = useRef(null);
    const isInitializedRef = useRef(false);

    const mapSortToParams = useCallback((sortValue) => {
        const sortMapping = {
            "최신순": { field: "POST_LATEST", sortDirection: "DESC" },
            "조회순": { field: "POST_MOST_VIEW", sortDirection: "DESC" },
            "좋아요순": { field: "POST_POPULAR", sortDirection: "DESC" },
        };
        return sortMapping[sortValue] || sortMapping["최신순"];
    }, []);

    const updateUrlParams = useCallback((newParams) => {
        const params = new URLSearchParams(searchParams);

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

        setSearchParams(params, { replace: false });
    }, [searchParams, setSearchParams]);

    const fetchPosts = useCallback(async (requestParams) => {
        if (!boardType) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const response = await getCommunityPosts(boardType, requestParams, abortControllerRef.current.signal);

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
            if (err.name !== 'AbortError') {
                setError(err.message || "게시글을 불러오는데 실패했습니다.");
                setPosts([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } finally {
            setLoading(false);
        }
    }, [boardType]);

    const search = useCallback(() => {
        setSearchTerm(keyword);
        setPageState(1);

        updateUrlParams({
            page: 1,
            keyword: keyword,
            sort: sort
        });

        const sortParams = mapSortToParams(sort);
        const searchParams = {
            page: 0,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(searchParams);
    }, [keyword, sort, mapSortToParams, initialParams, fetchPosts, updateUrlParams]);

    const setPage = useCallback((newPage) => {
        setPageState(newPage);

        updateUrlParams({
            page: newPage,
            keyword: keyword,
            sort: sort
        });

        const sortParams = mapSortToParams(sort);
        const pageParams = {
            page: newPage - 1,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(pageParams);
    }, [sort, keyword, mapSortToParams, initialParams, fetchPosts, updateUrlParams]);

    const setSort = useCallback((newSort) => {
        setSortState(newSort);
        setPageState(1);

        updateUrlParams({
            page: 1,
            keyword: keyword,
            sort: newSort
        });

        const sortParams = mapSortToParams(newSort);
        const sortChangeParams = {
            page: 0,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(sortChangeParams);
    }, [keyword, mapSortToParams, initialParams, fetchPosts, updateUrlParams]);

    const reset = useCallback(() => {
        setKeyword("");
        setSearchTerm("");
        setPageState(1);
        setSortState("최신순");
        setError(null);

        updateUrlParams({
            page: 1,
            keyword: "",
            sort: "최신순"
        });

        const resetParams = {
            page: 0,
            keyword: "",
            field: "POST_LATEST",
            sortDirection: "DESC",
            ...initialParams
        };
        fetchPosts(resetParams);
    }, [initialParams, fetchPosts, updateUrlParams]);

    const refresh = useCallback(() => {
        const sortParams = mapSortToParams(sort);
        const currentParams = {
            page: page - 1,
            keyword: keyword.trim(),
            ...sortParams,
            ...initialParams
        };
        fetchPosts(currentParams);
    }, [page, sort, keyword, mapSortToParams, initialParams, fetchPosts]);

    // boardType이 변경될 때만 초기화 및 데이터 로딩
    useEffect(() => {
        if (!boardType) return;

        const urlPage = parseInt(searchParams.get("page")) || 1;
        const urlKeyword = searchParams.get("keyword") || "";
        const urlSort = searchParams.get("sort") || "최신순";

        setKeyword(urlKeyword);
        setSearchTerm(urlKeyword);
        setPageState(urlPage);
        setSortState(urlSort);
        setError(null);

        const sortParams = mapSortToParams(urlSort);
        const initialLoadParams = {
            page: urlPage - 1,
            keyword: urlKeyword.trim(),
            ...sortParams,
            ...initialParams
        };

        // 직접 API 호출 (fetchPosts 의존성 제거)
        const loadData = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            try {
                const response = await getCommunityPosts(boardType, initialLoadParams, abortControllerRef.current.signal);

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
                if (err.name !== 'AbortError') {
                    setError(err.message || "게시글을 불러오는데 실패했습니다.");
                    setPosts([]);
                    setTotalPages(0);
                    setTotalElements(0);
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
        isInitializedRef.current = true;
    }, [boardType]); // boardType만 의존성으로 유지

    // cleanup 함수
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        keyword,
        setKeyword,
        page,
        setPage,
        sort,
        setSort,
        posts,
        totalPages,
        reset,
        loading,
        error,
        totalElements,
        searchTerm,
        refresh,
        fetchPosts,
        search
    };
};