import React, { useState } from "react";
import "../../styles/components/community/tag-input.css";

/**
 * @typedef {Object} TagInputProps
 * @property {string[]} tags
 * @property {(tags: string[]) => void} onTagsChange
 */

/**
 * 해시태그 입력 컴포넌트
 * @param {TagInputProps} props
 */
export const TagInput = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState("");
  const recommendedTags = [
    "Frontend",
    "Backend",
    "AI",
    "DevOps",
    "Algorithm",
    "Android",
    "IOS",
    "자율주행",
  ];

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    // 중복 및 최대 갯수(10개) 확인
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      onTagsChange([...tags, trimmedTag]);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    // Enter, Comma, Space를 눌렀을 때 태그 추가
    if (
      (e.key === "Enter" || e.key === "," || e.key === " ") &&
      inputValue.trim()
    ) {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      tags.length > 0 &&
      e.nativeEvent.isComposing === false
    ) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleRecommendedTagClick = (tag) => {
    addTag(tag);
  };

  return (
    <div className="tag-input-container">
      <div className="tags-and-input">
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
          placeholder="쉼표 혹은 스페이스를 입력하여 태그를 등록할 수 있습니다"
        />
      </div>
      <div className="recommended-tags">
        <span className="recommended-tags-label">추천 태그</span>
        {recommendedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="recommended-tag-item"
            onClick={() => handleRecommendedTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
