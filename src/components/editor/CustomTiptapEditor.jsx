import React, { useCallback, useEffect, useState } from "react";
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

/**
 * Tiptap 기반 커스텀 에디터 컴포넌트
 * 
 * 지원 기능:
 * - 마크다운 문법 지원
 * - 코드 블록 (구문 하이라이팅 포함)
 * - 이미지 업로드 (드래그앤드롭, 파일 선택, 클립보드 붙여넣기)
 * - 링크 자동 감지
 * - Ctrl+Enter/Esc로 코드블록 탈출
 * - Ctrl+V로 클립보드 이미지 붙여넣기
 * 
 * @param {Object} props
 * @param {string} props.content - 에디터 초기 콘텐츠 (HTML)
 * @param {Function} props.onChange - 콘텐츠 변경 시 콜백 함수
 * @param {string} props.placeholder - 플레이스홀더 텍스트
 * @param {Function} props.onImageUpload - 이미지 업로드 핸들러 함수
 * @param {number} props.maxHeight - 에디터 최대 높이 (px)
 * @param {number} props.minHeight - 에디터 최소 높이 (px)
 */
export const CustomTiptapEditor = ({
  content,
  onChange,
  placeholder,
  onImageUpload, // 이미지 업로드 핸들러를 prop으로 받음
  maxHeight = 800, // 전체 에디터 최대 높이
  minHeight = 300, // 에디터 최소 높이
}) => {
  const [isUploading, setIsUploading] = useState(false);
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
      attributes: {
        style: `min-height: ${minHeight}px;`,
      },
      handleDrop: function (view, event, slice, moved) {
        event.preventDefault();

        if (onImageUpload && event.dataTransfer?.files?.length > 0) {
          setIsUploading(true);
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
            })
            .finally(() => {
              setIsUploading(false);
            });
          return true;
        }
        return false;
      },
      handlePaste: function (view, event, slice) {
        // 클립보드에서 이미지 데이터 확인
        const items = Array.from(event.clipboardData?.items || []);
        const imageItems = items.filter(item => item.type.startsWith('image/'));

        if (imageItems.length > 0 && onImageUpload) {
          event.preventDefault();
          
          // 클립보드의 이미지 데이터를 파일로 변환
          const files = imageItems.map(item => item.getAsFile()).filter(Boolean);
          
          if (files.length > 0) {
            // FileList로 변환 (useImageUpload과 호환)
            const fileList = new DataTransfer();
            files.forEach(file => fileList.items.add(file));
            
            setIsUploading(true);
            onImageUpload(fileList.files)
              .then((urls) => {
                if (urls && urls.length > 0 && editor) {
                  urls.forEach((url) => {
                    editor.chain().focus().setImage({ src: url }).run();
                  });
                }
              })
              .catch((error) => {
                console.error("Image upload on paste failed:", error);
                alert("이미지 업로드에 실패했습니다.");
              })
              .finally(() => {
                setIsUploading(false);
              });
          }
          
          return true; // 기본 paste 동작 방지
        }
        
        return false; // 일반 텍스트 paste는 기본 동작 수행
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // 키보드 단축키를 통한 클립보드 이미지 붙여넣기
  useEffect(() => {
    const handleKeyDown = async (event) => {
      // Ctrl+V (또는 Cmd+V) 감지
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        try {
          // 클립보드 API 사용 (더 현대적인 방법)
          if (navigator.clipboard && navigator.clipboard.read) {
            const clipboardItems = await navigator.clipboard.read();
            
            for (const clipboardItem of clipboardItems) {
              for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                  const blob = await clipboardItem.getType(type);
                  const file = new File([blob], `clipboard-image-${Date.now()}.${type.split('/')[1]}`, { type });
                  
                  if (onImageUpload && editor) {
                    const fileList = new DataTransfer();
                    fileList.items.add(file);
                    
                    try {
                      setIsUploading(true);
                      const urls = await onImageUpload(fileList.files);
                      if (urls && urls.length > 0) {
                        // 기본 붙여넣기 동작 방지
                        event.preventDefault();
                        urls.forEach((url) => {
                          editor.chain().focus().setImage({ src: url }).run();
                        });
                      }
                    } catch (error) {
                      console.error("Clipboard image upload failed:", error);
                      alert("클립보드 이미지 업로드에 실패했습니다.");
                    } finally {
                      setIsUploading(false);
                    }
                  }
                  return;
                }
              }
            }
          }
        } catch (error) {
          // 클립보드 API가 지원되지 않거나 권한이 없는 경우
          // handlePaste에서 처리됨
          console.debug("Clipboard API not available, falling back to paste event handler");
        }
      }
    };

    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener('keydown', handleKeyDown);
      
      return () => {
        editorElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editor, onImageUpload]);

  // 툴바의 이미지 버튼을 통해 업로드하는 경우
  const handleToolbarImageUpload = useCallback(
    async (event) => {
      if (event.target.files && onImageUpload && editor) {
        try {
          setIsUploading(true);
          const urls = await onImageUpload(event.target.files);
          if (urls && urls.length > 0) {
            urls.forEach((url) => {
              editor.chain().focus().setImage({ src: url }).run();
            });
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("이미지 업로드에 실패했습니다.");
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onImageUpload, editor]
  );

  const triggerFileUpload = () => {
    // ... existing code ...
  };

  return (
    <div 
      className={`custom-editor border rounded ${isUploading ? 'uploading' : ''}`}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      <div className="toolbar-container">
        <Toolbar editor={editor} handleImageUpload={handleToolbarImageUpload} />
      </div>
      <div 
        className="editor-content"
        style={{ 
          maxHeight: `${maxHeight - 50}px`, // 툴바 높이 제외
          minHeight: `${minHeight}px`
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
