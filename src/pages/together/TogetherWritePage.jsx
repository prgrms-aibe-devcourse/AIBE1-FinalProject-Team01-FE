import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { CustomTiptapEditor } from "../../components/editor/CustomTiptapEditor";
import { TagInput } from "../../components/common/TagInput";
import { TOGETHER_CATEGORIES } from "./constants";

function TogetherWritePage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // 공통 필드
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  // 카테고리 선택
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // boardType에 따른 동적 필드
  const [headCount, setHeadCount] = useState("");
  const [period, setPeriod] = useState("");
  const [place, setPlace] = useState("");
  const [schedule, setSchedule] = useState(""); // Gathering
  const [expertiseArea, setExpertiseArea] = useState(""); // Match
  const [price, setPrice] = useState(""); // Market

  const handleMainCategoryChange = (e) => {
    const value = e.target.value;
    setMainCategory(value);
    setSubCategory(""); // 메인 카테고리 변경 시 서브 카테고리 초기화
  };

  const handleSubmit = (e) => {
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

    // TODO: API 연동

    let postData = {
      boardType: mainCategory,
      title,
      content,
      tags: tags.join(","), 
    };

    switch (mainCategory) {
      case "GATHERING":
        postData = {
          ...postData,
          gatheringType: subCategory,
          headCount: parseInt(headCount, 10) || 0,
          period,
          place,
          schedule
        };
        // BE의 GatheringPostRequestDTO 참고
        break;
      case "MATCH":
        postData = {
          ...postData,
          matchingType: subCategory,
          expertiseArea,
        };
        // BE의 MatchPostRequestDTO 참고
        break;
      case "MARKET":
        postData = {
          ...postData,
          price: parseInt(price, 10) || 0,
          place,
        };
        // BE의 MarketPostRequestDTO 참고
        break;
      default:
        setError("알 수 없는 카테고리입니다.");
        return;
    }

    console.log("Submitting Post Data: ", postData);
    setError(null);
    alert("게시글이 성공적으로 등록되었습니다.");
    navigate("/together");
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
        {mainCategory === "GATHERING" && (
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
        {mainCategory === "MATCH" && (
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
        {mainCategory === "MARKET" && (
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
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            size="lg"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <CustomTiptapEditor
            content={content}
            onUpdate={({ editor }) => setContent(editor.getHTML())}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <TagInput tags={tags} onTagsChange={setTags} />
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
