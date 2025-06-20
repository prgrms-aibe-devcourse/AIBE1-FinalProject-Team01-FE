/**
 * 클립보드 복사 기능을 제공하는 커스텀 훅
 * @returns {{ copy: (text: string) => boolean }}
 */
export function useClipboard() {
  const copy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      return true;
    } else {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    }
  };
  return { copy };
}
