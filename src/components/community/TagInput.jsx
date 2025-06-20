import React, { useState } from "react";
import "../../styles/components/community/tag-input.css";

const RECOMMENDED_TAGS = [
  "Frontend",
  "Backend",
  "AI",
  "DevOps",
  "Algorithm",
  "Android",
  "IOS",
  "자율주행",
];

/**
 * @typedef {Object} TagInputProps
 * @property {string[]} tags
 * @property {(tags: string[]) => void} setTags
 */

/**
 * @param {TagInputProps} props
 */
export const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ") || value.endsWith(",")) {
      addTag(value.slice(0, -1));
      setInputValue("");
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleRecommendedTagClick = (tag) => {
    addTag(tag);
  };

  return (
    <div className="tag-input-container">
      <div className="tags-display">
        {tags.map((tag) => (
          <span key={tag} className="tag-badge">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="remove-tag-btn"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            tags.length > 0
              ? ""
              : "쉼표 혹은 스페이스를 입력하여 태그를 등록할 수 있습니다"
          }
          className="tag-input"
        />
      </div>
      <div className="recommended-tags mt-2">
        <span className="recommended-tags-label">추천 태그</span>
        {RECOMMENDED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="tag-badge recommended"
            onClick={() => handleRecommendedTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
