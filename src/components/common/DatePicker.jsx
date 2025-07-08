import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/**
 * @typedef {Object} DatePickerProps
 * @property {Date|null} startDate - 시작일
 * @property {Date|null} endDate - 종료일
 * @property {(date: Date) => void} onStartDateChange - 시작일 변경 핸들러
 * @property {(date: Date) => void} onEndDateChange - 종료일 변경 핸들러
 * @property {boolean} [validated] - 유효성 검사 상태
 * @property {string} [startLabel] - 시작일 라벨
 * @property {string} [endLabel] - 종료일 라벨
 * @property {string} [startPlaceholder] - 시작일 플레이스홀더
 * @property {string} [endPlaceholder] - 종료일 플레이스홀더
 */

/**
 * 날짜 범위 선택 컴포넌트
 * @param {DatePickerProps} props
 */
export const DatePicker = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  validated = false,
  startLabel = "시작일",
  endLabel = "종료일", 
  startPlaceholder = "시작일을 선택하세요",
  endPlaceholder = "종료일을 선택하세요"
}) => {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('ko-KR');
  };

  const handleStartDateChange = (date) => {
    onStartDateChange(date);
    setShowStartCalendar(false);
    // 시작일이 종료일보다 늦으면 종료일을 시작일로 설정
    if (endDate && date > endDate) {
      onEndDateChange(date);
    }
  };

  const handleEndDateChange = (date) => {
    onEndDateChange(date);
    setShowEndCalendar(false);
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <Form.Label className="small text-muted">{startLabel}</Form.Label>
          <div className="position-relative">
            <Form.Control
              type="text"
              value={formatDate(startDate)}
              onClick={() => {
                setShowStartCalendar(!showStartCalendar);
                setShowEndCalendar(false);
              }}
              placeholder={startPlaceholder}
              readOnly
              required
              style={{ cursor: 'pointer' }}
              isInvalid={validated && !startDate}
            />
            <Form.Control.Feedback type="invalid">
              {startLabel}을 선택해주세요.
            </Form.Control.Feedback>
            {showStartCalendar && (
              <div className="calendar-dropdown">
                <Calendar
                  onChange={handleStartDateChange}
                  value={startDate}
                  locale="ko-KR"
                  formatMonthYear={(locale, date) => 
                    `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                  }
                  formatShortWeekday={(locale, date) => 
                    ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
                  }
                />
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <Form.Label className="small text-muted">{endLabel}</Form.Label>
          <div className="position-relative">
            <Form.Control
              type="text"
              value={formatDate(endDate)}
              onClick={() => {
                setShowEndCalendar(!showEndCalendar);
                setShowStartCalendar(false);
              }}
              placeholder={endPlaceholder}
              readOnly
              required
              style={{ cursor: 'pointer' }}
              isInvalid={validated && !endDate}
            />
            <Form.Control.Feedback type="invalid">
              {endLabel}을 선택해주세요.
            </Form.Control.Feedback>
            {showEndCalendar && (
              <div className="calendar-dropdown">
                <Calendar
                  onChange={handleEndDateChange}
                  value={endDate}
                  minDate={startDate}
                  locale="ko-KR"
                  formatMonthYear={(locale, date) => 
                    `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                  }
                  formatShortWeekday={(locale, date) => 
                    ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
                  }
                />
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* 캘린더 클릭 시 닫기용 오버레이 */}
      {(showStartCalendar || showEndCalendar) && (
        <div 
          className="calendar-overlay"
          onClick={() => {
            setShowStartCalendar(false);
            setShowEndCalendar(false);
          }}
        />
      )}
    </>
  );
};
