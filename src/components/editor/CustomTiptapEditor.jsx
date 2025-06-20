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

export const CustomTiptapEditor = ({ content, onChange, placeholder }) => {
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
        if (event.dataTransfer?.files?.length > 0) {
          uploadImages(event.dataTransfer.files);
          return true;
        }
        return false;
      },
    },
  });

  const uploadImages = useCallback(
    (files) => {
      if (!files || !editor) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          continue;
        }

        // TODO: AWS S3 이미지 업로드 로직 연결
        // 1. 여기서 서버로 파일(file)을 전송하는 API를 호출합니다.
        // 2. 서버는 이미지를 S3에 업로드하고, 업로드된 이미지의 URL을 반환합니다.
        // 3. 반환받은 URL을 아래 `setImage` 함수의 src 값으로 사용합니다.

        // 임시: FileReader를 사용하여 클라이언트에서 즉시 미리보기 제공
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            editor.chain().focus().setImage({ src: e.target.result }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [editor]
  );

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(
    (event) => {
      if (event.target.files) {
        uploadImages(event.target.files);
      }
    },
    [uploadImages]
  );

  return (
    <div className="border rounded">
      <Toolbar editor={editor} handleImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
};
