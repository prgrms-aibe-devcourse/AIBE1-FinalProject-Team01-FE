import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/common/TagInput";
import { useImageUpload } from "../../hooks/useImageUpload";
import { INFO_CATEGORY_LABELS } from "./constants";
import { createInfoPost, updateInfoPost } from "../../services/infoApi.js";

export default function InfoWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const isEditMode = params.itId !== undefined;
  const { postToEdit } = location.state || {};

  const [boardType] = useState("REVIEW"); // INFO는 REVIEW만 작성 가능
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const { handleUpload } = useImageUpload(
    postToEdit?.images || []
  );

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title || "");

      let tagsArray = [];
      if (postToEdit.tags) {
        if (typeof postToEdit.tags === 'string') {
          tagsArray = postToEdit.tags.split(',').filter(tag => tag.trim() !== '');
        } else if (Array.isArray(postToEdit.tags)) {
          tagsArray = postToEdit.tags;
        }
      }
      setTags(tagsArray);

      setContent(postToEdit.content || "");
    } else if (isEditMode && !postToEdit) {
      alert("잘못된 접근입니다.");
      navigate("/info/REVIEW");
    }
  }, [isEditMode, postToEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      boardType,
      title,
      tags: tags,
      content
    };

    try {
      if (isEditMode) {
        await updateInfoPost(postToEdit.boardType, postToEdit.itId, postData);
        alert("게시글이 수정되었습니다.");
        navigate(`/info/${postToEdit.boardType}/${postToEdit.itId}`);
      } else {
        const response = await createInfoPost(postData);
        alert("게시글이 등록되었습니다.");
        navigate(`/info/${boardType}/${response.itId}`);
      }
    } catch (error) {
      alert(error.message || "게시글 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">{isEditMode ? "글 수정하기" : "글쓰기"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>게시판</Form.Label>
          <Form.Select value={boardType} disabled>
            <option value="REVIEW">
              {INFO_CATEGORY_LABELS.REVIEW}
            </option>
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
          <TagInput tags={tags} onTagsChange={setTags} />
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
