import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { reviewPosts } from "./infoData";
import { TagInput } from "../../components/common/TagInput";
import "../../styles/components/board/Board.css";
import "../../styles/components/community/community.css";

export default function InfoWritePage() {
  const { category = "review" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { postToEdit } = location.state || {};

  const isEditMode = !!postToEdit;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content.replace(/<[^>]+>/g, ""));
      setTags(postToEdit.tags || []);
    }
  }, [isEditMode, postToEdit]);

  if (category === "news") {
    return (
      <div className="container py-5 text-center">
        <h2>IT 뉴스는 관리자만 작성할 수 있습니다.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      const idx = reviewPosts.findIndex((p) => p.id === postToEdit.id);
      if (idx !== -1) {
        reviewPosts[idx] = {
          ...reviewPosts[idx],
          title,
          content: `<p>${content}</p>`,
          tags,
        };
      }
      alert("후기가 수정되었습니다.");
      navigate(`/info/review/${postToEdit.id}`);
    } else {
      reviewPosts.unshift({
        id: Date.now(),
        category: "review",
        title,
        content: `<p>${content}</p>`,
        user: {
          id: 1,
          nickname: "김루이지",
          image_url: "https://via.placeholder.com/40",
          devcourse_name: "프론트엔드",
        },
        created_at: new Date().toISOString(),
        tags,
        like_count: 0,
        view_count: 0,
        comments: [],
      });
      alert("후기가 등록되었습니다.");
      navigate(`/info/review`);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">데브코스 후기 {isEditMode ? "수정" : "작성"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">태그 (최대 10개)</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>
        <div className="mb-3">
          <label className="form-label">내용</label>
          <textarea
            className="form-control"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="d-flex gap-2 justify-content-end mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            type="button"
          >
            취소
          </button>
          <button className="btn btn-primary" type="submit">
            {isEditMode ? "수정 완료" : "작성 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}
