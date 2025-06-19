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
  // 더미 포스트 데이터
  const dummyPost = {
    title: "생성형 백엔드 데브코스 ㄹㅇ후기 알려줌",
    user: "김유저",
    time: "3시간 전",
    likes: 2,
    comments: 18,
  };

  // 3개 게시판의 데이터
  const boardsData = [
    {
      title: "자유게시판",
      posts: Array(4).fill(dummyPost), // 각 게시판마다 5개씩
    },
    {
      title: "질문토론",
      posts: Array(4).fill(dummyPost),
    },
    {
      title: "IT 뉴스",
      posts: Array(4).fill(dummyPost),
    },
  ];

  return (
    <section className="popular-posts-section">
      <h2 className="popular-title">인기 게시글</h2>
      <div className="popular-posts-row">
        {boardsData.map((board, boardIdx) => (
          <div className="board-section" key={boardIdx}>
            <h3 className="board-section-title">{board.title}</h3>
            <div className="board-posts">
              {board.posts.map((post, postIdx) => (
                <div className="popular-post-card" key={postIdx}>
                  <div className="post-content">
                    <div className="post-title">{post.title}</div>
                    <div className="user-info">
                      <div className="user-details">
                        <img src={iconUser} alt="user" className="icon-user" />
                        <span>{post.user}</span>
                        <span className="dot" />
                        <span>{post.time}</span>
                      </div>
                      <div className="post-actions">
                        <span className="likes">
                          <img
                            src={iconHeart}
                            alt="heart"
                            className="icon-action"
                          />
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
                </div>
              ))}
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
