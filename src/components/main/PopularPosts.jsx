import React, { useEffect, useState, useContext } from "react";
import "../../styles/components/main/PopularPosts.css";
import iconUser from "../../assets/icon-user.png";
import iconHeart from "../../assets/icon-heart.png";
import iconComment from "../../assets/icon-comment.png";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

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

  // AuthContext 사용 시
  // const { token } = useContext(AuthContext);
  // localStorage 사용 시
  const token = localStorage.getItem("token");

  // API 호출 함수
  const fetchRecommendedPosts = async (limit = 10) => {
    const res = await fetch(
      `${BASE_URL}/api/v1/ai/posts/recommendations?limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("추천 게시글 조회 실패");
    return res.json();
  };

  const fetchPopularPosts = async (limit = 10) => {
    const res = await fetch(
      `${BASE_URL}/api/v1/ai/posts/popular?limit=${limit}`
    );
    if (!res.ok) throw new Error("인기 게시글 조회 실패");
    return res.json();
  };

  useEffect(() => {
    // 1. 기본: 인기 게시글 먼저 세팅
    fetchPopularPosts(10).then(setPosts);

    // 2. 로그인 상태면 맞춤 게시글 요청
    if (token) {
      fetchRecommendedPosts(4)
        .then((recommended) => {
          if (recommended && recommended.length > 0) {
            setPosts(recommended);
            setType("recommend");
          } else {
            setType("popular");
          }
        })
        .catch(() => setType("popular"));
    } else {
      setType("popular");
    }
  }, [token]);

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
              const boardType = post.boardType?.toUpperCase();
              let path = "";

              switch (boardType) {
                case "FREE":
                case "QNA":
                case "SHARE":
                case "NOTICE":
                  path = `/community/${boardType}/${post.id}`;
                  break;
                case "GATHERING":
                case "MARKET":
                  path = `/together/${boardType}/${post.id}`;
                  break;
                case "REVIEW":
                case "NEWS":
                  path = `/info/${boardType}/${post.id}`;
                  break;
                case "HUB":
                  path = `/HUB/${post.id}`;
                  break;
                default:
                  // 기본값으로 community/FREE로 이동
                  path = `/community/FREE/${post.id}`;
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
