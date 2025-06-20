/**
 * 작성자 권한 체크 유틸 함수
 * @param {object} user - 현재 로그인 유저 객체
 * @param {object|string} author - 작성자 정보(이름 또는 객체)
 * @returns {boolean}
 */
export function isAuthor(user, author) {
  if (!user || !author) return false;
  // 예시: user.name === author
  if (typeof author === "string") return user.name === author;
  // 예시: user.id === author.id
  if (author.id) return user.id === author.id;
  return false;
}
