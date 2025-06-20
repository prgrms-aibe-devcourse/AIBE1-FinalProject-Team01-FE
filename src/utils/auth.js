/**
 * 작성자 권한 체크 유틸 함수
 * @param {object} user - 현재 로그인 유저 객체
 * @param {object|string|number} author - 작성자 정보(아이디 또는 객체)
 * @returns {boolean}
 */
export function isAuthor(user, author) {
  if (!user || !author) return false;
  if (typeof author === "object" && author.id) return user.id === author.id;
  return user.id === author;
}
