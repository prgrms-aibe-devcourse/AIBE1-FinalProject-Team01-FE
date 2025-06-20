import { useState } from "react";

/**
 * 입력값 상태 및 onChange, reset을 제공하는 커스텀 훅
 * @param {string} initial - 초기 입력값
 * @returns {{ value: string, onChange: function, reset: function, setValue: function }}
 */
export function useInput(initial = "") {
  const [value, setValue] = useState(initial);
  const onChange = (e) => setValue(e.target.value);
  const reset = () => setValue("");
  return { value, onChange, reset, setValue };
}
