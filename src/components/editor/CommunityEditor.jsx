import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";

/**
 * @typedef {Object} CommunityEditorProps
 * @property {string} [placeholder] - 에디터에 표시할 placeholder 텍스트
 * @property {(content: string) => void} [onChange] - 에디터 내용이 변경될 때 호출되는 콜백
 */

/**
 * 커뮤니티 글쓰기용 Tiptap 에디터 컴포넌트
 * @param {CommunityEditorProps} props
 */
export const CommunityEditor = ({
  placeholder = "내용을 입력하세요...",
  onChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  return (
    <div className="card p-3 shadow-sm">
      <EditorContent editor={editor} />
    </div>
  );
};
