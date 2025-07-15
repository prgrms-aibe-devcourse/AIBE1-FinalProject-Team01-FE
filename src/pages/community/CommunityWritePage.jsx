import React, { useState, useEffect } from "react";
import {useNavigate, useLocation, useParams} from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/common/TagInput";
import { useImageUpload } from "../../hooks/useImageUpload";
import { BOARD_TYPE, BOARD_TYPE_LABEL } from "./constants";
import { createCommunityPost, updateCommunityPost } from "../../services/communityApi.js";

const CommunityWritePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const isEditMode = params.communityId !== undefined;
  const { postToEdit } = location.state || {};

  const [selectedBoardType, setSelectedBoardType] = useState(BOARD_TYPE.FREE);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const { handleUpload} = useImageUpload(
    postToEdit?.images || []
  );

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setSelectedBoardType(postToEdit.boardType || BOARD_TYPE.FREE);
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
    }else if (isEditMode && !postToEdit) {
      alert("잘못된 접근입니다.")
      navigate("/community/free")
    }
  }, [isEditMode, postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      boardType: selectedBoardType,
      title,
      tags: tags,
      content
    };

    if (isEditMode) {
      await updateCommunityPost(postToEdit.boardType, postToEdit.communityId, postData);
      alert("게시글이 수정되었습니다.");
      navigate(`/community/${postToEdit.boardType}/${postToEdit.communityId}`);
    } else {
      const response = await createCommunityPost(postData);
      alert("게시글이 등록되었습니다.");
      navigate(`/community/${selectedBoardType}/${response.communityId}`);
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
                {BOARD_TYPE_LABEL[key]}
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
};
export default CommunityWritePage;
