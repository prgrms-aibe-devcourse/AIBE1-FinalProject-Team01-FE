import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";

export const FollowCard = ({ user, onUnfollow }) => {
    const [isUnfollowing, setIsUnfollowing] = useState(false);

    const handleUnfollowClick = async () => {
        if (window.confirm(`${user.nickname}님을 언팔로우하시겠습니까?`)) {
            setIsUnfollowing(true);
            try {
                await onUnfollow(user.userId);
            } finally {
                setIsUnfollowing(false);
            }
        }
    };

    const getDevCourseInfo = () => {
        if (user.devcourseTrack && user.devcourseBatch) {
            return `${user.devcourseTrack} ${user.devcourseBatch}기`;
        }
        return null;
    };

    return (
        <Card className="follow-card h-100">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs="auto">
                        <div className="follow-card-avatar">
                            <img
                                src={user.profileImg || 'src/assets/icon-user.png'}
                                alt={`${user.nickname}의 프로필`}
                                className="rounded-circle"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                        </div>
                    </Col>

                    <Col>
                        <div className="follow-card-info">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="mb-0 fw-bold">
                                    {user.nickname}
                                </h6>
                                {getDevCourseInfo() && (
                                    <span className="badge bg-info text-dark">
                                        {getDevCourseInfo()}
                                    </span>
                                )}
                            </div>

                            <div className="d-flex gap-3 mb-2">
                                <small className="text-muted">
                                    <i className="bi bi-file-text me-1"></i>
                                    게시글 {user.postCount || 0}개
                                </small>
                                <small className="text-muted">
                                    <i className="bi bi-people me-1"></i>
                                    팔로워 {user.follwerCount || 0}명
                                </small>
                                <small className="text-muted">
                                    <i className="bi bi-person-plus me-1"></i>
                                    팔로잉 {user.followingCount || 0}명
                                </small>
                            </div>
                        </div>
                    </Col>

                    <Col xs="auto">
                        <div className="d-flex flex-column gap-2">
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={handleUnfollowClick}
                                disabled={isUnfollowing}
                                className="text-nowrap"
                            >
                                {isUnfollowing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        처리중...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-person-dash me-1"></i>
                                        언팔로우
                                    </>
                                )}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};