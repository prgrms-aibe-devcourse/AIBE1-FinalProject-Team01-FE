import React, { useEffect } from "react";
import { PostCard } from "../board/PostCard";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";
import { useMyPage } from "../../hooks/useMyPage";

/**
 * @typedef {Object} PostListProps
 * @property {"posts"|"likes"|"bookmarks"} type - 리스트 타입
 * @property {(post: object) => void} [onPostClick] - 게시글 클릭 핸들러
 * @property {boolean} [usePagination=true] - 페이지네이션 사용 여부
 * @property {number} [pageSize=10] - 페이지당 항목 수
 * @property {number} [currentPage=0] - 현재 페이지 (부모에서 URL로 관리)
 * @property {(page: number) => void} [onPageChange] - 페이지 변경 핸들러
 */

/**
 * 작성글/좋아요/북마크 리스트 (URL 기반 페이지네이션)
 * @param {PostListProps} props
 */
export const PostList = ({
                             type,
                             onPostClick,
                             usePagination = true,
                             pageSize = 10,
                             currentPage = 0,
                             onPageChange
                         }) => {
    const {
        posts,
        loading,
        error,
        totalElements,
        totalPages,
        pageInfo,
        loadData,
        refresh,
        isEmpty
    } = useMyPage(type, {
        pageSize,
        autoLoad: false // 수동으로 로드
    });

    // 중요: currentPage가 변경될 때마다 해당 페이지의 데이터를 로드
    useEffect(() => {
        loadData(type, currentPage, false);
    }, [type, currentPage, loadData]);

    // 페이지 변경 핸들러
    const handlePageChange = (page) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    // 이전 페이지
    const handlePrevPage = () => {
        if (currentPage > 0) {
            handlePageChange(currentPage - 1);
        }
    };

    // 다음 페이지
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
        }
    };

    // 새로고침 핸들러
    const handleRefresh = () => {
        if (onPageChange) {
            onPageChange(0);
        } else {
            loadData(type, 0, false);
        }
    };

    // 페이지네이션 번호 생성
    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        const pages = [];

        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        // 끝에서 시작 조정
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    // 타입별 라벨 매핑
    const getTypeLabel = (type) => {
        const labels = {
            posts: '작성한 글',
            likes: '좋아요한 글',
            bookmarks: '북마크한 글'
        };
        return labels[type] || type;
    };

    // 로딩 상태 (첫 로드)
    if (loading && isEmpty) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">로딩 중...</span>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="text-center py-5">
                <div className="text-danger mb-3">
                    <i className="bi bi-exclamation-triangle fs-1"></i>
                </div>
                <p className="text-muted mb-3">{error}</p>
                <button
                    className="btn btn-outline-primary"
                    onClick={handleRefresh}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 빈 상태
    if (isEmpty && !loading) {
        return (
            <div className="text-center py-5">
                <div className="text-muted mb-3">
                    <i className="bi bi-inbox fs-1"></i>
                </div>
                <p className="text-muted mb-3">
                    {getTypeLabel(type)}이 없습니다.
                </p>
                <button
                    className="btn btn-outline-primary"
                    onClick={handleRefresh}
                >
                    새로고침
                </button>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column">
            {/* 헤더 정보 */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <h5 className="mb-0">{getTypeLabel(type)}</h5>
                    <span className="badge bg-light text-dark">
            총 {totalElements}개
          </span>
                </div>
                <div className="d-flex gap-2">
                    {/* 현재 페이지 표시 (디버깅용) */}
                    <small className="text-muted align-self-center">
                        현재: {currentPage + 1}페이지
                    </small>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        새로고침
                    </button>
                </div>
            </div>

            {/* 현재 페이지 정보 */}
            {usePagination && totalPages > 0 && (
                <div className="text-muted small mb-3">
                    {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements}개
                    (페이지 {currentPage + 1} / {totalPages})
                </div>
            )}

            {/* 게시글 리스트 */}
            {loading ? (
                <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">로딩 중...</span>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                    {posts.map((post, index) => (
                        <PostCard
                            key={`${post.postId || post.id}-${currentPage}-${index}`}
                            post={post}
                            onClick={onPostClick ? () => onPostClick(post) : undefined}
                            categoryLabel={
                                BOARD_TYPE_LABEL[post.boardType] || post.boardType || type
                            }
                            categoryKey={post.boardType || type}
                        />
                    ))}
                </div>
            )}

            {/* 페이지네이션 */}
            {usePagination && totalPages > 1 && (
                <nav aria-label="페이지네이션">
                    <ul className="pagination justify-content-center">
                        {/* 첫 페이지 */}
                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(0)}
                                disabled={currentPage === 0}
                                aria-label="첫 페이지"
                            >
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                        </li>

                        {/* 이전 페이지 */}
                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={handlePrevPage}
                                disabled={currentPage === 0}
                                aria-label="이전 페이지"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                        </li>

                        {/* 페이지 번호들 */}
                        {getPageNumbers().map((pageNum) => (
                            <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum + 1}
                                </button>
                            </li>
                        ))}

                        {/* 다음 페이지 */}
                        <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages - 1}
                                aria-label="다음 페이지"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </li>

                        {/* 마지막 페이지 */}
                        <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(totalPages - 1)}
                                disabled={currentPage >= totalPages - 1}
                                aria-label="마지막 페이지"
                            >
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};