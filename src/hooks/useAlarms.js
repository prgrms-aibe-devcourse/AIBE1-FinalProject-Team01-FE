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

  const unreadCount = alarms.filter((n) => !n.isRead).length;

  const addNewAlarm = useCallback((newAlarm) => {
    setAlarms((prev) => {
      const exists = prev.find((alarm) => alarm.id === newAlarm.id);
      if (exists) {
        return prev;
      }

      return [newAlarm, ...prev];
    });
  }, []);

  useEffect(() => {
    registerAlarmCallback(addNewAlarm);
  }, [registerAlarmCallback, addNewAlarm]);

  const fetchAlarms = async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      const response = await getAlarms({ size: 20, sortDirection: "DESC" });

      setAlarms(response.content || []);
    } catch (error) {
      console.error("알림 조회 실패:", error);
      setAlarms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await markAllAlarmsAsRead();

      setAlarms((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("전체 읽음 처리 실패:", error);
      throw error;
    }
  };

  const handleMarkAsRead = async (alarmId) => {
    try {
      const response = await markAlarmAsRead(alarmId);

      setAlarms((prev) =>
        prev.map((n) => (n.id === alarmId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("단건 읽음 처리 실패:", error);
      throw error;
    }
  };

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
