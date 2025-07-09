/**
 * DM 채팅방 목록용 시간 포맷팅 함수
 * @param {Date|string} date - 포맷팅할 날짜
 * @returns {string} 포맷된 시간 문자열
 */
export const formatChatTime = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // 1분 미만
  if (diffInMinutes < 1) {
    return "방금 전";
  }

  // 1시간 미만 - 분 단위 표시
  if (diffInHours < 1) {
    return `${diffInMinutes}분 전`;
  }

  // 24시간 미만 - 시간 단위 표시
  if (diffInDays < 1) {
    return `${diffInHours}시간 전`;
  }

  // 7일 미만 - 일 단위 표시
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  // 7일 이상 - 월/일 형식으로 표시
  return messageDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
};

/**
 * 기존 날짜 포맷팅 함수들
 */
export const formatDate = (dateString) => {
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

export const formatDetailDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
