import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/common/TagInput";
import { useImageUpload } from "../../hooks/useImageUpload";
import { BOARD_TYPE, BOARD_TYPE_LABEL } from "./constants";

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postToEdit } = location.state || {};

  const [selectedBoardType, setSelectedBoardType] = useState(BOARD_TYPE.FREE);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const isEditMode = !!postToEdit;

  const { imageUrls, handleUpload, setImageUrls } = useImageUpload(
    postToEdit?.images || []
  );

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setSelectedBoardType(postToEdit.boardType);
      setTitle(postToEdit.title);
      setTags(postToEdit.tags || []);
      setContent(postToEdit.content);
      setImageUrls(postToEdit.images || []);
    }
  }, [isEditMode, postToEdit, setImageUrls]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      boardType: selectedBoardType,
      title,
      tags,
      content,
      images: imageUrls,
    };

    if (isEditMode) {
      console.log("수정된 게시글 데이터:", { ...postData, id: postToEdit.id });
      alert("게시글이 수정되었습니다.");
      navigate(`/community/${postToEdit.boardType}/${postToEdit.id}`);
    } else {
      console.log("작성된 게시글 데이터:", postData);
      alert("게시글이 등록되었습니다.");
      navigate(`/community/${selectedBoardType}`);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">{isEditMode ? "글 수정하기" : "글쓰기"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>게시판</Form.Label>
          <Form.Select
            value={selectedBoardType}
            onChange={(e) => setSelectedBoardType(e.target.value)}
            disabled={isEditMode}
          >
            {Object.keys(BOARD_TYPE).map((key) => (
              <option key={key} value={BOARD_TYPE[key]}>
                {BOARD_TYPE_LABEL[BOARD_TYPE[key]]}
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
