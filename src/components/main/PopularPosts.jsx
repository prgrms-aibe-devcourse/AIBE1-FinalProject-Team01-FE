import React from "react";
import "../../styles/components/main/PopularPosts.css";
import iconUser from "../../assets/icon-user.png";
import iconHeart from "../../assets/icon-heart.png";
import iconComment from "../../assets/icon-comment.png";

/**
 * @typedef {Object} PopularPostsProps
 * 현재는 props 없음(더미데이터만 사용)
 */

/**
 * 인기 게시글 섹션 컴포넌트
 * @param {PopularPostsProps} props
 */
export const PopularPosts = () => {
  // 더미데이터 1개씩만 사용
  const dummyPosts = [
    {
      board: "자유게시판",
      title: "생성형 백엔드 데브코스 ㄹㅇ후기 알려줌",
      user: "김유저",
      time: "3시간 전",
      likes: 2,
      comments: 18,
    },
    {
      board: "자유게시판",
      title: "생성형 백엔드 데브코스 ㄹㅇ후기 알려줌",
      user: "김유저",
      time: "3시간 전",
      likes: 2,
      comments: 18,
    },
    {
      board: "자유게시판",
      title: "생성형 백엔드 데브코스 ㄹㅇ후기 알려줌",
      user: "김유저",
      time: "3시간 전",
      likes: 2,
      comments: 18,
    },
  ];

  return (
    <section className="popular-posts-section">
      <h2 className="popular-title">인기 게시글</h2>
      <div className="popular-posts-row">
        {dummyPosts.map((post, idx) => (
          <div className="popular-post-card" key={idx}>
            <div className="board-title">{post.board}</div>
            <div className="post-title">{post.title}</div>
            <div className="user-info">
              <img src={iconUser} alt="user" className="icon-user" />
              <span>{post.user}</span>
              <span className="dot" />
              <span>{post.time}</span>
              <div className="post-actions">
                <span className="likes">
                  <img src={iconHeart} alt="heart" className="icon-action" />
                  {post.likes}
                </span>
                <span className="comments">
                  <img
                    src={iconComment}
                    alt="comment"
                    className="icon-action"
                  />
                  {post.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="view-more-btn">
        더 많은 게시글 보기
        <img src={iconComment} alt="arrow" className="icon-action" />
      </button>
    </section>
  );
};
