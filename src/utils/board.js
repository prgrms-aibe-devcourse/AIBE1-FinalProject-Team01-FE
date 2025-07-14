// 게시글 상세 페이지 URL 생성 유틸
export function getPostDetailUrl(post) {
  if (!post) return "/";
  if (post.boardType === "PROJECT_HUB") {
    return `/hub/${post.id}`;
  }
  if (post.boardType === "REVIEW" || post.boardType === "NEWS") {
    return `/info/${post.boardType}/${post.id}`;
  }
  if (
    post.boardType === "MARKET" ||
    post.boardType === "GATHERING" ||
    post.boardType === "MATCH"
  ) {
    return `/together/${post.boardType}/${post.id}`;
  }
  return `/community/${post.boardType}/${post.id}`;
}
