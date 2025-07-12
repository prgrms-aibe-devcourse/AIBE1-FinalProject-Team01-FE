import { useState, useEffect, useCallback } from 'react';
import { getMyPosts, getMyLikedPosts, getMyBookmarkedPosts } from '../services/mypageApi';
import { useAuth } from '../context/AuthContext';

/**
 * 마이페이지 데이터를 관리하는 커스텀 훅 (PageResponseDTO 구조에 맞춤)
 * @param {string} activeTab - 현재 활성화된 탭 ('posts', 'likes', 'bookmarks')
 * @param {Object} options - 옵션 설정
 * @param {number} [options.pageSize=10] - 페이지 당 아이템 수
 * @param {boolean} [options.autoLoad=true] - 자동 로드 여부
 * @returns {Object} 마이페이지 데이터와 관련 함수들
 */
export const useMyPage = (activeTab = 'posts', options = {}) => {
    const { isLoggedIn } = useAuth();
    const { pageSize = 10, autoLoad = true } = options;

    // 각 탭별 데이터 상태
    const [data, setData] = useState({
        posts: {
            content: [],
            pageInfo: { page: 0, size: pageSize, totalPages: 0, totalElements: 0 },
            loading: false,
            error: null
        },
        likes: {
            content: [],
            pageInfo: { page: 0, size: pageSize, totalPages: 0, totalElements: 0 },
            loading: false,
            error: null
        },
        bookmarks: {
            content: [],
            pageInfo: { page: 0, size: pageSize, totalPages: 0, totalElements: 0 },
            loading: false,
            error: null
        }
    });

    /**
     * 특정 탭의 데이터를 로드하는 함수
     */
    const loadData = useCallback(async (tab, page = 0, append = false) => {
        if (!isLoggedIn) return;

        // 로딩 상태 설정
        setData(prev => ({
            ...prev,
            [tab]: { ...prev[tab], loading: true, error: null }
        }));

        try {
            let response;
            const params = { page, size: pageSize, sort: 'createdAt,desc' };

            // API 함수 매핑
            const apiFunctions = {
                posts: getMyPosts,
                likes: getMyLikedPosts,
                bookmarks: getMyBookmarkedPosts
            };

            response = await apiFunctions[tab](params);

            // PageResponseDTO 구조에 맞춰 데이터 처리
            const newContent = response.content || [];
            const pageInfo = response.pageInfo || {
                page: 0,
                size: pageSize,
                totalPages: 0,
                totalElements: 0
            };

            setData(prev => ({
                ...prev,
                [tab]: {
                    content: append ? [...prev[tab].content, ...newContent] : newContent,
                    pageInfo: pageInfo,
                    loading: false,
                    error: null
                }
            }));

        } catch (error) {
            setData(prev => ({
                ...prev,
                [tab]: {
                    ...prev[tab],
                    loading: false,
                    error: error.message || '데이터를 불러오는데 실패했습니다.'
                }
            }));
        }
    }, [isLoggedIn, pageSize]);

    /**
     * 다음 페이지 로드 (무한 스크롤용)
     */
    const loadMore = useCallback((tab) => {
        const currentData = data[tab];
        const nextPage = currentData.pageInfo.page + 1;

        if (nextPage < currentData.pageInfo.totalPages && !currentData.loading) {
            loadData(tab, nextPage, true);
        }
    }, [data, loadData]);

    /**
     * 데이터 새로고침
     */
    const refresh = useCallback((tab = activeTab) => {
        loadData(tab, 0, false);
    }, [activeTab, loadData]);

    /**
     * 모든 탭 데이터 새로고침
     */
    const refreshAll = useCallback(() => {
        ['posts', 'likes', 'bookmarks'].forEach(tab => {
            loadData(tab, 0, false);
        });
    }, [loadData]);

    // 로그인 상태 변경 시 데이터 로드
    useEffect(() => {
        if (isLoggedIn && autoLoad) {
            refresh(activeTab);
        }
    }, [isLoggedIn, activeTab, autoLoad, refresh]);

    // 현재 활성 탭의 데이터
    const currentData = data[activeTab];

    return {
        // 현재 탭 데이터 (PageResponseDTO 구조에 맞춤)
        posts: currentData.content,
        loading: currentData.loading,
        error: currentData.error,
        totalElements: currentData.pageInfo.totalElements,
        totalPages: currentData.pageInfo.totalPages,
        currentPage: currentData.pageInfo.page,
        pageSize: currentData.pageInfo.size,
        hasMore: currentData.pageInfo.page + 1 < currentData.pageInfo.totalPages,

        // 전체 데이터 (모든 탭)
        allData: data,

        // 함수들
        loadData,
        loadMore: () => loadMore(activeTab),
        refresh,
        refreshAll,

        // 헬퍼 함수들
        isEmpty: currentData.content.length === 0,
        isFirstLoad: currentData.pageInfo.page === 0 && currentData.content.length === 0,

        // PageResponseDTO의 pageInfo 직접 접근
        pageInfo: currentData.pageInfo
    };
};

/**
 * 간단한 버전의 마이페이지 데이터 훅
 * 특정 탭만 필요한 경우 사용
 */
export const useMyPageTab = (tab, options = {}) => {
    return useMyPage(tab, options);
};