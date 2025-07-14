import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/common/TagInput";
import { TOGETHER_CATEGORIES } from "./constants";
import { createGatheringPost, updateGatheringPost } from "../../services/together/gatheringApi";
import { createMatchingPost, updateMatchingPost } from "../../services/together/matchingApi";
import { createMarketPost, updateMarketPost } from "../../services/together/marketApi";
import {useImageUpload} from "../../hooks/useImageUpload.js";

function TogetherWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { boardType, postId } = useParams(); 
  const isEditMode = Boolean(postId);
  const { postToEdit } = location.state || {};

  const [error, setError] = useState(null);
  // 공통 필드
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  // 카테고리 선택
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [initialImages, setInitialImages] = useState([]);

  // boardType에 따른 동적 필드
  
  const [headCount, setHeadCount] = useState("");
  const [period, setPeriod] = useState("");
  const [place, setPlace] = useState("");
  const [schedule, setSchedule] = useState(""); // Gathering
  const [expertiseArea, setExpertiseArea] = useState(""); // Match
  const [price, setPrice] = useState(""); // Market

  useEffect(() => {
    if (isEditMode && postToEdit){
      try {
        setMainCategory(boardType);
        setSubCategory(postToEdit.gatheringType || postToEdit.matchingType || "");
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setTags((postToEdit.tags || ""));
        setHeadCount(postToEdit.headCount?.toString() || "");
        setPeriod(postToEdit.period || "");
        setPlace(postToEdit.place || "");
        setSchedule(postToEdit.schedule || "");
        setExpertiseArea(postToEdit.expertiseArea || "");
        setPrice(postToEdit.price?.toString() || "");
      } catch (e) {
        console.error(e);
        setError("`게시글을 불러`오는 데 실패했습니다.");
      }
    }else if(isEditMode && !postToEdit){
      alert("잘못된 접근입니다.")
      navigate("/together/gathering")
    }
  }, [isEditMode, boardType, postId]);

  const { handleUpload } = useImageUpload(initialImages);

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setMainCategory(value);
    setSubCategory(""); // 메인 카테고리 변경 시 서브 카테고리 초기화
  };

  

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!mainCategory) {
      setError("메인 카테고리를 선택해주세요.");
      return;
    }
    const selectedMain = TOGETHER_CATEGORIES.find(
      (c) => c.value === mainCategory
    );
    if (selectedMain && selectedMain.subCategories.length > 0 && !subCategory) {
      setError("세부 유형을 선택해주세요.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    let postData = {
      boardType: mainCategory,
      title: title.trim(),
      content,
      tags: tags, 
    };

    switch (mainCategory) {
      case "gathering":
        postData.gatheringType = subCategory;
        postData.headCount = parseInt(headCount, 10) || 0;
        postData.period = period;
        postData.place = place;
        postData.schedule = schedule;
        postData.status = "RECRUITING";
        break;
      case "match":
        postData.matchingType = subCategory;
        postData.expertiseArea = expertiseArea;
        postData.status = "OPEN";
        break;
      case "market":
        postData.price = parseInt(price, 10) || 0;
        postData.place = place;
        postData.status = "SELLING"
        break;
      default:
        setError("알 수 없는 카테고리입니다.");
        return;
    }

    try {
      if (isEditMode) {
        // 수정
        if (mainCategory === "gathering") {
          await updateGatheringPost(postId, postData);
        } else if (mainCategory === "match") {
          await updateMatchingPost(postId, postData);
        } else {
          await updateMarketPost(postId, postData);
        }
        setError(null);
        alert("게시글이 성공적으로 수정되었습니다.");
      } else {
        // 생성
        let created;
        if (mainCategory === "gathering") {
          created = await createGatheringPost(postData);
        } else if (mainCategory === "match") {
          created = await createMatchingPost(postData);
        } else {
          created = await createMarketPost(postData);
        }
        setError(null);
        alert("게시글이 성공적으로 등록되었습니다.");
      }
    } catch (err) {
     console.error(err);
     if(isEditMode) {
       setError("게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
     } else {
     setError("게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
     }
   }
   navigate(`/together/${mainCategory}`);
  };

  const renderDynamicFields = () => {
    const selectedMainCategory = TOGETHER_CATEGORIES.find(
      (c) => c.value === mainCategory
    );

    return (
      <>
        {/* 서브 카테고리 */}
        {selectedMainCategory?.subCategories.length > 0 && (
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              세부 유형
            </Form.Label>
            <Col sm={10}>
              <Form.Select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
              >
                <option value="">세부 유형을 선택하세요</option>
                {selectedMainCategory.subCategories.map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        )}

        {/* Gathering 필드 */}
        {mainCategory === "gathering" && (
          <>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                모집 인원
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="number"
                  placeholder="모집 인원 수를 입력하세요"
                  value={headCount}
                  onChange={(e) => setHeadCount(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                진행 기간
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="예: 3개월"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                진행 장소
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="온라인 또는 오프라인 장소"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                일정
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="예: 매주 월, 목 저녁 8시"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                />
              </Col>
            </Form.Group>
          </>
        )}

        {/* Match 필드 */}
        {mainCategory === "match" && (
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              전문 분야
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="어떤 분야의 전문가이신가요?"
                value={expertiseArea}
                onChange={(e) => setExpertiseArea(e.target.value)}
              />
            </Col>
          </Form.Group>
        )}

        {/* Market 필드 */}
        {mainCategory === "market" && (
          <>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                가격
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="number"
                  placeholder="판매 가격(원)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                거래 희망 장소
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="거래를 원하는 장소를 입력하세요"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </Col>
            </Form.Group>
          </>
        )}
      </>
    );
  };

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <h2>함께해요 글쓰기</h2>
      <hr />
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            카테고리
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              value={mainCategory}
              onChange={handleMainCategoryChange}
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {TOGETHER_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {renderDynamicFields()}

        <hr />

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

        <div className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button variant="primary" type="submit">
            등록
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default TogetherWritePage;
