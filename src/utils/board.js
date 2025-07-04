// 게시글 상세 페이지 URL 생성 유틸
export function getPostDetailUrl(post) {
  if (!post) return "/";
  if (post.boardType === "HUB") {
    return `/hub/${post.postId}`;
  }
  if (post.boardType === "REVIEW" || post.boardType === "NEWS") {
    return `/info/${post.boardType}/${post.postId}`;
  }
  if (
    post.boardType === "MARKET" ||
    post.boardType === "GATHERING" ||
    post.boardType == "MATCH"
  ) {
    return `/together/${post.boardType}/${post.postId}`;
  }
  return `/community/${post.boardType}/${post.postId}`;
}
