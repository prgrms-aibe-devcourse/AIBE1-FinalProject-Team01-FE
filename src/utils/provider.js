/**
 * 프로바이더 타입을 한글명으로 변환
 * @param {string} provider - 프로바이더 타입 (LOCAL, GITHUB, KAKAO)
 * @returns {string} 한글 프로바이더명
 */
export const getProviderName = (provider) => {
  const providerNames = {
    'LOCAL': '일반',
    'GITHUB': '소셜(github)',
    'KAKAO': '소셜(kakao)',
  };
  return providerNames[provider] || provider;
};