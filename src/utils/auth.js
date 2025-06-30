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

// 비밀번호 유효성 검사: 6자 이상, 알파벳+숫자 포함
export function isValidPassword(pw) {
  return pw.length >= 6 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);
}

// 비밀번호 일치 검사
export function arePasswordsEqual(pw, pwCheck) {
  return pw === pwCheck;
}
