import React from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaUndo,
  FaCode,
  FaImage,
} from "react-icons/fa";

const Toolbar = ({ editor, handleImageUpload }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-top p-2 d-flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn btn-sm ${
          editor.isActive("bold") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`btn btn-sm ${
          editor.isActive("italic") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`btn btn-sm ${
          editor.isActive("strike") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`btn btn-sm ${
          editor.isActive("heading", { level: 2 }) ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaHeading />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`btn btn-sm ${
          editor.isActive("bulletList") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`btn btn-sm ${
          editor.isActive("orderedList") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`btn btn-sm ${
          editor.isActive("blockquote") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaQuoteLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`btn btn-sm ${
          editor.isActive("codeBlock") ? "btn-dark" : "btn-light"
        }`}
        type="button"
      >
        <FaCode />
      </button>
      <input
        type="file"
        id="image-upload"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <label
        htmlFor="image-upload"
        className="btn btn-sm btn-light"
        role="button"
      >
        <FaImage />
      </label>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="btn btn-sm btn-light"
        type="button"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="btn btn-sm btn-light"
        type="button"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default Toolbar;
