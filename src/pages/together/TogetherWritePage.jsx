import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/community/TagInput";
import { useImageUpload } from "../../hooks/useImageUpload";
import { gatheringData, matchData, marketData } from "./togetherData"; // For finding postToEdit

const allData = [...gatheringData, ...matchData, ...marketData];

// 카테고리별 옵션 정의
const TOGETHER_OPTIONS = {
  gathering: {
    labels: ["스터디", "프로젝트", "해커톤"],
    statuses: ["모집중", "모집완료"],
  },
  match: {
    labels: ["커피챗", "멘토링"],
    statuses: ["매칭가능", "매칭완료"],
  },
  market: {
    labels: ["중고거래"],
    statuses: [], // 장터는 상태 없음
  },
};

/**
 * 함께해요 글쓰기/수정 페이지
 */
export default function TogetherWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, postId } = useParams(); // 'gathering', 'match', 'market'
  const { state } = location;

  const [postToEdit, setPostToEdit] = useState(state?.postToEdit);

  // If page is accessed directly via URL for editing, find the post data
  useEffect(() => {
    if (!postToEdit && postId) {
      const foundPost = allData.find((p) => p.id === parseInt(postId));
      setPostToEdit(foundPost);
    }
  }, [postId, postToEdit]);

  const isEditMode = !!postToEdit;
  const options = TOGETHER_OPTIONS[category] || TOGETHER_OPTIONS.gathering;

  // Form State
  const [title, setTitle] = useState("");
  const [categoryLabel, setCategoryLabel] = useState(options.labels[0]);
  const [status, setStatus] = useState(options.statuses[0] || null);
  const [tags, setTags] = useState([]);
  const [recruitCount, setRecruitCount] = useState(1);
  const [locationText, setLocationText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [period, setPeriod] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");

  const { imageUrls, handleUpload, setImageUrls } = useImageUpload(
    postToEdit?.images || []
  );

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title);
      setCategoryLabel(postToEdit.categoryLabel);
      setStatus(postToEdit.status);
      setTags(postToEdit.tags || []);
      setRecruitCount(postToEdit.recruitCount || 1);
      setLocationText(postToEdit.location || "");
      setTimeText(postToEdit.timeText || "");
      setPeriod(postToEdit.period || "");
      setContent(postToEdit.content);
      setImageUrls(postToEdit.images || []);
      setPrice(postToEdit.price || "");
    }
  }, [isEditMode, postToEdit, setImageUrls]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const thumbnail = imageUrls.length > 0 ? imageUrls[0] : null;

    const postData = {
      id: postToEdit ? postToEdit.id : Date.now(),
      category,
      title,
      categoryLabel,
      status: category === "market" ? null : status,
      tags,
      images: imageUrls,
      thumbnail,
      recruitCount: category === "market" ? null : recruitCount,
      location: category === "market" ? locationText : locationText,
      timeText: category === "market" ? null : timeText,
      period: category === "market" ? null : period,
      price: category === "market" ? price : null,
      content,
    };

    if (postToEdit) {
      console.log("수정된 함께해요 게시글:", {
        ...postData,
        id: postToEdit.id,
      });
      alert("게시글이 수정되었습니다.");
    } else {
      console.log("작성된 함께해요 게시글:", postData);
      alert("게시글이 등록되었습니다.");
    }
    navigate(`/together/${category}`);
  };

  const isMarket = category === "market";

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="mb-4">
        {isEditMode ? "함께해요 글 수정" : "함께해요 글쓰기"}
      </h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>구분</Form.Label>
            <Form.Select
              value={categoryLabel}
              onChange={(e) => setCategoryLabel(e.target.value)}
            >
              {options.labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {!isMarket && options.statuses.length > 0 && (
            <Form.Group as={Col}>
              <Form.Label>상태</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {options.statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Row>

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

        <Row className="mb-3">
          {isMarket ? (
            <Form.Group as={Col}>
              <Form.Label>가격 (원)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="가격을 입력하세요 (숫자만)"
                required
              />
            </Form.Group>
          ) : (
            <Form.Group as={Col}>
              <Form.Label>모집인원</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={recruitCount}
                onChange={(e) => setRecruitCount(Number(e.target.value))}
              />
            </Form.Group>
          )}
          <Form.Group as={Col}>
            <Form.Label>장소</Form.Label>
            <Form.Control
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="온라인, 오프라인 장소 등"
            />
          </Form.Group>
        </Row>

        {!isMarket && (
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>시간</Form.Label>
              <Form.Control
                type="text"
                value={timeText}
                onChange={(e) => setTimeText(e.target.value)}
                placeholder="예: 매주 화, 목 오후 7시"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>기간</Form.Label>
              <Form.Control
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="예: 2025.01.01 ~ 2025.03.01"
              />
            </Form.Group>
          </Row>
        )}

        <Form.Group className="mb-3">
          <Form.Label>태그</Form.Label>
          <TagInput tags={tags} setTags={setTags} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <CustomTiptapEditor
            content={content}
            onChange={setContent}
            onImageUpload={handleUpload}
            placeholder="프로젝트에 대해 자세하게 설명해주세요..."
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
