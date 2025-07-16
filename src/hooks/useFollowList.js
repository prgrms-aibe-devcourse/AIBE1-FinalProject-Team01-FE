import { useState, useCallback } from 'react';
import {getFollowingList, unfollowUserApi} from "../services/followApi.js";

/**
 * 팔로잉 목록 관리 훅
 * @param {Object} options
 * @param {number} options.pageSize - 페이지당 항목 수
 * @param {boolean} options.autoLoad - 자동 로드 여부
 */
export const useFollowList = ({ pageSize = 10, autoLoad = false } = {}) => {
    const [follows, setFollows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isEmpty, setIsEmpty] = useState(true);

    // 팔로잉 목록 로드
    const loadFollowList = useCallback(async (page = 0) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getFollowingList({
                page,
                size: pageSize
            });

            setFollows(response.content || []);
            setTotalElements(response.pageInfo?.totalElements || 0);
            setTotalPages(response.pageInfo?.totalPages || 0);
            setIsEmpty((response.content || []).length === 0);

        } catch (err) {
            console.error('팔로잉 목록 로드 실패:', err);
            setError(err.message || '팔로잉 목록을 불러오는데 실패했습니다.');
            setFollows([]);
            setTotalElements(0);
            setTotalPages(0);
            setIsEmpty(true);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    // 언팔로우
    const unfollowUser = useCallback(async (userId) => {
        try {
            await unfollowUserApi(userId);

            // 성공시 로컬 상태에서 해당 사용자 제거
            setFollows(prevFollows =>
                prevFollows.filter(user => user.id !== userId)
            );
            setTotalElements(prev => Math.max(0, prev - 1));

            return true;
        } catch (err) {
            console.error('언팔로우 실패:', err);
            alert(err.message || '언팔로우에 실패했습니다.');
            return false;
        }
    }, []);

    return {
        follows,
        loading,
        error,
        totalElements,
        totalPages,
        isEmpty,
        loadFollowList,
        unfollowUser
    };
};