import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight, all } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Dropcursor from "@tiptap/extension-dropcursor";
import Toolbar from "./Toolbar";

import "highlight.js/styles/atom-one-dark.css";
import "../../styles/components/editor/editor.css";

const lowlight = createLowlight(all);

// 코드블럭에서 Ctrl+Enter, Esc로 벗어나는 단축키 지원
const CustomCodeBlockLowlight = CodeBlockLowlight.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Escape: () => this.editor.commands.exitCode(),
    };
  },
});

export const CustomTiptapEditor = ({
  content,
  onChange,
  placeholder,
  onImageUpload, // 이미지 업로드 핸들러를 prop으로 받음
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomCodeBlockLowlight.configure({
        lowlight,
      }),
      Markdown,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        event.preventDefault();

        if (onImageUpload && event.dataTransfer?.files?.length > 0) {
          onImageUpload(event.dataTransfer.files)
            .then((urls) => {
              if (urls && urls.length > 0 && editor) {
                urls.forEach((url) => {
                  editor.chain().focus().setImage({ src: url }).run();
                });
              }
            })
            .catch((error) => {
              console.error("Image upload on drop failed:", error);
              alert("이미지 업로드에 실패했습니다.");
            });
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // 툴바의 이미지 버튼을 통해 업로드하는 경우
  const handleToolbarImageUpload = useCallback(
    async (event) => {
      if (event.target.files && onImageUpload && editor) {
        try {
          const urls = await onImageUpload(event.target.files);
          if (urls && urls.length > 0) {
            urls.forEach((url) => {
              editor.chain().focus().setImage({ src: url }).run();
            });
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("이미지 업로드에 실패했습니다.");
        }
      }
    },
    [onImageUpload, editor]
  );

  const triggerFileUpload = () => {
    // ... existing code ...
  };

  return (
    <div className="custom-editor border rounded">
      <Toolbar editor={editor} handleImageUpload={handleToolbarImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
};
