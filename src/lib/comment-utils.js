/**
 * 로그인 유저 정보를 바탕으로 새로운 댓글/답글 객체를 생성하는 함수
 * @param {string} content - 댓글 내용
 * @param {object} user - 로그인 유저 정보 객체 (from useAuth)
 * @param {number | string} postId - 상위 게시글 ID
 * @param {number | string | null} parentId - 상위 댓글 ID (대댓글일 경우)
 * @returns {object}
 */
export function createCommentObject(content, user, postId, parentId = null) {
  const authorInfo = user
    ? {
        id: user.id,
        nickname: user.nickname,
        image_url: user.image_url || "https://via.placeholder.com/40",
        devcourse_name: user.devcourse_name,
      }
    : {
        id: -1, // 비로그인 유저 ID
        nickname: "익명",
        image_url: "https://via.placeholder.com/40",
        devcourse_name: null,
      };

  return {
    id: Date.now() + Math.random(), // 임시 ID
    user_id: authorInfo.id,
    post_id: postId,
    parent_comment_id: parentId,
    content,
    like_count: 0,
    is_deleted: false,
    is_liked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: authorInfo,
    replies: [],
  };
}
