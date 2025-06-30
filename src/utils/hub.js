/**
 * hubData의 raw post를 프론트엔드에서 바로 쓸 수 있는 구조로 변환
 * @param {object} raw
 * @returns {object}
 */
export function mapHubPost(raw) {
  return {
    ...raw,
    courseName: raw.devcourseName ?? raw.project?.devcourseTrack,
    batchNumber: raw.devcourseBatch ?? raw.project?.devcourseBatch,
    simpleContent: raw.project?.simpleContent,
    projectMembers: raw.project?.projectMembers,
    startedAt: raw.project?.startedAt,
    endedAt: raw.project?.endedAt,
    githubUrl: raw.project?.githubUrl,
    demoUrl: raw.project?.demoUrl,
    user: {
      nickname: raw.nickname,
      imageUrl: raw.profileImageUrl,
    },
    isLiked: raw.isLiked,
    isBookmarked: raw.isBookmarked,
    bookmarkCount: raw.bookmarkCount,
    commentCount: raw.commentCount,
  };
}
