import React, { useEffect, useState, useContext } from "react";
import "../../styles/components/main/PopularPosts.css";
import iconUser from "../../assets/icon-user.png";
import iconHeart from "../../assets/icon-heart.png";
import iconComment from "../../assets/icon-comment.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../services/api";

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
  const fetchRecommendedPosts = async (limit = 10) => {
    try {
      const response = await apiClient.get(
        `/api/v1/ai/posts/recommendations?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("추천 게시글 조회 실패:", error);
      throw new Error("추천 게시글 조회 실패");
    }
  };

  const fetchPopularPosts = async (limit = 10) => {
    try {
      const response = await apiClient.get(
        `/api/v1/ai/posts/popular?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("인기 게시글 조회 실패:", error);
      throw new Error("인기 게시글 조회 실패");
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const popularPosts = await fetchPopularPosts(10);
        setPosts(popularPosts);
        setType("popular");

        if (isLoggedIn) {
          try {
            const recommended = await fetchRecommendedPosts(4);
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

  // posts 데이터에 맞게 렌더링 (아래는 예시, 실제 API 응답에 맞게 수정 필요)
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
                case "share":
                case "notice":
                  path = `/community/${boardType}/${boardId}`;
                  break;
                case "gathering":
                case "market":
                  path = `/together/${boardType}/${boardId}`;
                  break;
                case "review":
                case "news":
                  path = `/info/${boardType}/${boardId}`;
                  break;
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
