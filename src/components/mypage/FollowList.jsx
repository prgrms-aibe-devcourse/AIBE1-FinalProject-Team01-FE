import React, { useEffect, useState } from "react";
import { FollowCard } from "./FollowCard";
import { useFollowList } from "../../hooks/useFollowList.js";

export const FollowList = ({
                               usePagination = true,
                               pageSize = 10,
                               currentPage = 0,
                               onPageChange
                           }) => {
    const {
        follows,
        loading,
        error,
        totalElements,
        totalPages,
        isEmpty,
        loadFollowList,
        unfollowUser
    } = useFollowList({
        pageSize,
        autoLoad: false
    });

    // currentPage가 변경될 때마다 데이터 로드
    useEffect(() => {
        loadFollowList(currentPage);
    }, [currentPage, loadFollowList]);

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
            loadFollowList(0);
        }
    };

    // 언팔로우 핸들러
    const handleUnfollow = async (userId) => {
        const success = await unfollowUser(userId);
        if (success) {
            // 현재 페이지가 비어있게 되면 이전 페이지로
            if (follows.length === 1 && currentPage > 0) {
                handlePageChange(currentPage - 1);
            } else {
                // 현재 페이지 새로고침
                loadFollowList(currentPage);
            }
        }
    };

    // 페이지네이션 번호 생성
    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        const pages = [];

        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
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
                    <i className="bi bi-people fs-1"></i>
                </div>
                <p className="text-muted mb-3">
                    팔로잉한 사용자가 없습니다.
                </p>
                <p className="text-muted small">
                    관심 있는 사용자를 팔로우해보세요!
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
                    <h5 className="mb-0">팔로잉 목록</h5>
                    <span className="badge bg-light text-dark">
                        총 {totalElements}명
                    </span>
                </div>
                <div className="d-flex gap-2">
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
                    {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements}명
                    (페이지 {currentPage + 1} / {totalPages})
                </div>
            )}

            {/* 팔로잉 리스트 */}
            {loading ? (
                <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">로딩 중...</span>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3 mb-4">
                    {follows.map((user, index) => (
                        <FollowCard
                            key={`${user.userId}-${currentPage}-${index}`}
                            user={user}
                            onUnfollow={handleUnfollow}
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