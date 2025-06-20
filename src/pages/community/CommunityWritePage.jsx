import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORY_MAP, CATEGORY_KEYS } from "./communityData";
import { Button, Form } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/community/TagInput";

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const { category = "free" } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 실제 글 등록 API 연동
    // const postData = {
    //   category: selectedCategory,
    //   title,
    //   tags,
    //   content,
    // };
    // const response = await api.post('/community/posts', postData);
    // if (response.ok) navigate(`/community/${selectedCategory}/${response.data.id}`);
    alert(
      `카테고리: ${selectedCategory}\n제목: ${title}\n태그: ${tags.join(
        ", "
      )}\n내용: ${content}`
    );
    navigate(-1);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">글쓰기</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>카테고리</Form.Label>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            작성 완료
          </Button>
        </div>
      </Form>
    </div>
  );
}
