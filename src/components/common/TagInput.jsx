import React, { useState } from "react";
import "../../styles/components/community/tag-input.css";

/**
 * @typedef {Object} TagInputProps
 * @property {string[]} tags
 * @property {(tags: string[]) => void} setTags
 */

/**
 * 해시태그 입력 컴포넌트
 * @param {TagInputProps} props
 */
export const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      // 중복 태그 방지
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      tags.length > 0 &&
      e.nativeEvent.isComposing === false // 한글 입력 시 마지막 글자 삭제 방지
    ) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="tag-input-container">
      {tags.map((tag, index) => (
        <div key={index} className="tag-item">
          {tag}
          <button
            type="button"
            className="tag-remove-button"
            onClick={() => handleTagRemove(tag)}
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        className="tag-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="태그를 입력하세요"
      />
    </div>
  );
};
