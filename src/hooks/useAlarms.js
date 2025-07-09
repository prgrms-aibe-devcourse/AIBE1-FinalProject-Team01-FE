import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAlarms,
  markAllAlarmsAsRead,
  markAlarmAsRead,
} from "../services/alarmApi";
import { useSSE } from "./useSSE";

export const useAlarms = () => {
  const { isLoggedIn } = useAuth();
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const { registerAlarmCallback } = useSSE();

  // 읽지 않은 알림 개수
  const unreadCount = alarms.filter((n) => !n.isRead).length;

  // 새 알람 추가 함수
  const addNewAlarm = useCallback((newAlarm) => {
    setAlarms((prev) => {
      // 중복 체크 (ID로)
      const exists = prev.find((alarm) => alarm.id === newAlarm.id);
      if (exists) {
        return prev;
      }

      // 새 알람을 맨 앞에 추가
      return [newAlarm, ...prev];
    });
  }, []);

  // SSE 알람 콜백 등록
  useEffect(() => {
    registerAlarmCallback(addNewAlarm);
  }, [registerAlarmCallback, addNewAlarm]);

  // 알림 목록 가져오기
  const fetchAlarms = async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      const response = await getAlarms({ size: 20, sortDirection: "DESC" });

      setAlarms(response.content || []);
    } catch (error) {
      console.error("❌ 알림 조회 실패:", error);
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  };

  // 전체 읽음 처리
  const handleMarkAllRead = async () => {
    try {
      const response = await markAllAlarmsAsRead();

      // 상태 업데이트
      setAlarms((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("❌ 전체 읽음 처리 실패:", error);
      throw error; // 에러를 다시 던져서 UI에서 처리할 수 있도록
    }
  };

  // 단건 읽음 처리
  const handleMarkAsRead = async (alarmId) => {
    try {
      const response = await markAlarmAsRead(alarmId);

      // 상태 업데이트
      setAlarms((prev) =>
        prev.map((n) => (n.id === alarmId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("❌ 단건 읽음 처리 실패:", error);
      throw error; // 에러를 다시 던져서 UI에서 처리할 수 있도록
    }
  };

  // 로그인 시 알림 목록 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchAlarms();
    } else {
      setAlarms([]);
    }
  }, [isLoggedIn]);

  return {
    alarms,
    loading,
    unreadCount,
    fetchAlarms,
    handleMarkAllRead,
    handleMarkAsRead,
  };
};
