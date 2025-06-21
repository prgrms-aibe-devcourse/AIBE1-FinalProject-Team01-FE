import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CATEGORY_MAP, CATEGORY_KEYS } from "./communityData";
import { Button, Form } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/community/TagInput";
import { useImageUpload } from "../../hooks/useImageUpload";

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postToEdit } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState("free");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const isEditMode = !!postToEdit;

  const { imageUrls, handleUpload, setImageUrls } = useImageUpload(
    postToEdit?.images || []
  );

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setSelectedCategory(postToEdit.category);
      setTitle(postToEdit.title);
      setTags(postToEdit.tags || []);
      setContent(postToEdit.content);
      setImageUrls(postToEdit.images || []);
    }
  }, [isEditMode, postToEdit, setImageUrls]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const thumbnail = imageUrls.length > 0 ? imageUrls[0] : null;

    const postData = {
      category: selectedCategory,
      title,
      tags,
      content,
      images: imageUrls,
      thumbnail,
    };

    if (isEditMode) {
      console.log("수정된 게시글 데이터:", { ...postData, id: postToEdit.id });
      alert("게시글이 수정되었습니다.");
      navigate(`/community/${postToEdit.category}/${postToEdit.id}`);
    } else {
      console.log("작성된 게시글 데이터:", postData);
      alert("게시글이 등록되었습니다.");
      navigate(`/community/${selectedCategory}`);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">{isEditMode ? "글 수정하기" : "글쓰기"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>카테고리</Form.Label>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isEditMode}
          >
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_MAP[key]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>태그 (최대 10개)</Form.Label>
          <TagInput tags={tags} setTags={setTags} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <CustomTiptapEditor
            content={content}
            onChange={setContent}
            onImageUpload={handleUpload}
            placeholder="내용을 입력하세요..."
          />
        </Form.Group>
        <div className="d-flex gap-2 justify-content-end mt-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button variant="primary" type="submit">
            {isEditMode ? "수정 완료" : "작성 완료"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
