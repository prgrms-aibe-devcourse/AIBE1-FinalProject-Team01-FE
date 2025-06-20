import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight, all } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./Toolbar";

import "highlight.js/styles/atom-one-dark.css";
import "../../styles/components/editor/editor.css";

const lowlight = createLowlight(all);

export const CustomTiptapEditor = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
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
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleImageUpload = useCallback(
    (event) => {
      const files = event.target.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              editor.chain().focus().setImage({ src: e.target.result }).run();
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [editor]
  );

  return (
    <div className="border rounded">
      <Toolbar editor={editor} handleImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
};
