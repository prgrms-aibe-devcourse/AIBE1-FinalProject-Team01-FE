import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CATEGORY_MAP, CATEGORY_KEYS } from "./communityData";
import { Button, Form } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/community/TagInput";

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postToEdit } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState("free");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const isEditMode = !!postToEdit;

  useEffect(() => {
    if (isEditMode) {
      setSelectedCategory(postToEdit.category);
      setTitle(postToEdit.title);
      setTags(postToEdit.tags || []);
      setContent(postToEdit.content);
    }
  }, [isEditMode, postToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      category: selectedCategory,
      title,
      tags,
      content,
    };

    if (isEditMode) {
      // TODO: 실제 글 수정 API 연동 (PUT 또는 PATCH)
      // await api.put(`/community/posts/${postToEdit.id}`, postData);
      console.log("수정된 게시글 데이터:", { ...postData, id: postToEdit.id });
      alert("게시글이 수정되었습니다.");
      navigate(`/community/${postToEdit.category}/${postToEdit.id}`); // 수정된 글로 이동
    } else {
      // TODO: 실제 글 등록 API 연동 (POST)
      // const newPost = await api.post('/community/posts', postData);
      console.log("작성된 게시글 데이터:", postData);
      alert("게시글이 등록되었습니다.");
      navigate(-1); // 이전 페이지로 이동
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
            onChange={(newContent) => setContent(newContent)}
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
