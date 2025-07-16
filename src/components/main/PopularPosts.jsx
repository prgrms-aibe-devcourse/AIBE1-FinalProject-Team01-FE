import React, { useEffect, useState, useContext } from "react";
import "../../styles/components/main/PopularPosts.css";
import iconUser from "../../assets/icon-user.png";
import iconHeart from "../../assets/icon-heart.png";
import iconComment from "../../assets/icon-comment.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/api";

const safeProcessPostData = (posts) => {
  return posts.map(post => ({
    ...post,
    id: post.id || 0,
    title: post.title || "제목 없음",
    authorNickname: post.authorNickname || "익명",
    authorDevcourseName: post.authorDevcourseName || null,
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
    viewCount: post.viewCount || 0,
    boardType: post.boardType || "FREE",
    boardId: post.boardId || post.id || 0,
    createdAt: post.createdAt || new Date().toISOString()
  }));
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "방금 전";
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;

  return date.toLocaleDateString("ko-KR");
};

/**
 * 인기 게시글 섹션 컴포넌트
 * @param {PopularPostsProps} props
 */
export const PopularPosts = () => {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("popular");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  // API 호출 함수
  const fetchRecommendedPosts = async (limit = 9) => {
    try {
      const response = await apiClient.get(
        `/api/v1/ai/posts/recommendations?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("추천 게시글 조회 실패:", error);
      // 백엔드 에러가 발생해도 빈 배열을 반환하여 UI가 깨지지 않도록 함
      return [];
    }
  };

  const fetchPopularPosts = async (limit = 9) => {
    try {
      const response = await apiClient.get(
        `/api/v1/ai/posts/popular?limit=${limit}`
      );
      return safeProcessPostData(response.data || []);
    } catch (error) {
      console.error("인기 게시글 조회 실패:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const popularPosts = await fetchPopularPosts(9);
        setPosts(popularPosts);
        setType("popular");

        if (isLoggedIn) {
          try {
            const recommended = await fetchRecommendedPosts(9);
            if (recommended && recommended.length > 0) {
              setPosts(recommended);
              setType("recommend");
            }
          } catch (error) {
            console.log(
              "추천 게시글 로드 실패, 인기 게시글 유지:",
              error.message
            );
            // 추천 게시글 실패해도 이미 인기 게시글이 로드되어 있으므로 그대로 유지
          }
        }
      } catch (error) {
        console.error("게시글 로드 실패:", error);
        setPosts([]); 
      }
    };

    loadPosts();
  }, [isLoggedIn]);

  // 게시글이 없을 때의 처리
  if (posts.length === 0) {
    return (
      <section className="popular-posts-section">
        <h2 className="popular-title">
          {type === "recommend" ? "AI 맞춤 추천 게시글" : "인기 게시글"}
        </h2>
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <i className="bi bi-inbox" style={{ fontSize: "3rem" }}></i>
          </div>
          <p className="text-muted">
            {type === "recommend" 
              ? "아직 추천할 게시글이 없습니다." 
              : "아직 인기 게시글이 없습니다."}
          </p>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/community/FREE")}
          >
            게시글 보러가기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-posts-section">
      <h2 className="popular-title">
        {type === "recommend" ? "AI 맞춤 추천 게시글" : "인기 게시글"}
      </h2>
      <div className="popular-posts-row">
        {posts.map((post, idx) => (
          <div
            className="popular-post-card"
            key={post.id || idx}
            onClick={() => {
              // boardType에 따라 Router.jsx의 실제 경로에 맞게 이동
              const boardType = post.boardType?.toLowerCase();
              const boardId = post.boardId || post.id; // boardId 우선, 없으면 id fallback
              let path = "";

              switch (boardType) {
                case "free":
                case "qna":
                case "retrospect":
                  path = `/community/${boardType}/${boardId}`;
                  break;
                case "gather":
                case "market":
                case "match":
                  path = `/together/${boardType}/${boardId}`;
                  break;
                case "review":
                case "news":
                  path = `/info/${boardType}/${boardId}`;
                  break;
                case "project_hub":
                case "hub":
                  path = `/hub/${boardId}`;
                  break;
                default:
                  // 기본값으로 community/free로 이동
                  path = `/community/free/${boardId}`;
                  break;
              }
              navigate(path);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="post-content">
              <div className="post-title">{post.title}</div>
              <div className="user-info">
                <div className="user-details">
                  <img src={iconUser} alt="user" className="icon-user" />
                  <span>{post.authorNickname || "익명"}</span>
                  {post.authorDevcourseName && (
                    <>
                      <span className="dot" />
                      <span className="devcourse-name">{post.authorDevcourseName}</span>
                    </>
                  )}
                  <span className="dot" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-actions">
                  <span className="likes">
                    <img src={iconHeart} alt="heart" className="icon-action" />
                    {post.likeCount || 0}
                  </span>
                  <span className="comments">
                    <img
                      src={iconComment}
                      alt="comment"
                      className="icon-action"
                    />
                    {post.commentCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="view-more-btn"
        onClick={() => navigate("/community/FREE")}
      >
        더 많은 게시글 보기
        <img src={iconComment} alt="arrow" className="icon-action" />
      </button>
    </section>
  );
};
