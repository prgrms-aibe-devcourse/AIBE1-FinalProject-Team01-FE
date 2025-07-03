import React, { useState } from "react";

const AlarmDropdown = ({
  isOpen,
  onClose,
  alarms,
  onMarkAllRead,
  onMarkAsRead,
}) => {
  const [markingAll, setMarkingAll] = useState(false);
  const [markingIds, setMarkingIds] = useState(new Set());

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await onMarkAllRead();
    } catch (error) {
      console.error("전체 읽기 처리 실패:", error);
      alert("전체 읽음 처리에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleAlarmClick = async (alarm) => {
    if (!alarm.isRead) {
      try {
        setMarkingIds((prev) => new Set(prev).add(alarm.id));
        await onMarkAsRead(alarm.id);
      } catch (error) {
        console.error("읽음 처리 실패:", error);
        alert("읽음 처리에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setMarkingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(alarm.id);
          return newSet;
        });
      }
    }
  };

  return (
    <div className="alarm-dropdown">
      <div className="alarm-header">
        <h6>알림</h6>
        <button
          className="mark-all-read"
          onClick={handleMarkAllRead}
          disabled={markingAll}
        >
          {markingAll ? "처리중..." : "모두 읽음"}
        </button>
      </div>
      <div className="alarm-list">
        {alarms.length === 0 ? (
          <div className="no-alarms">새로운 알림이 없습니다</div>
        ) : (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`alarm-item ${!alarm.isRead ? "unread" : ""} ${
                markingIds.has(alarm.id) ? "marking" : ""
              }`}
              onClick={() => handleAlarmClick(alarm)}
              style={{
                opacity: markingIds.has(alarm.id) ? 0.6 : 1,
                cursor: markingIds.has(alarm.id) ? "wait" : "pointer",
              }}
            >
              <div className="alarm-content">
                <div className="alarm-title">
                  {alarm.title}
                  {markingIds.has(alarm.id) && (
                    <small style={{ marginLeft: "8px", color: "#6c757d" }}>
                      읽는중...
                    </small>
                  )}
                </div>
                <div className="alarm-message">{alarm.content}</div>
                <div className="alarm-time">
                  {new Date(alarm.sentAt).toLocaleString("ko-KR")}
                </div>
              </div>
              {!alarm.isRead && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmDropdown;
