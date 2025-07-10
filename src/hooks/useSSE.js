import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export const useSSE = () => {
  const { isLoggedIn } = useAuth();
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const onAlarmReceivedRef = useRef(() => {});

  const connect = useCallback(() => {
    if (
      !isLoggedIn ||
      isConnectingRef.current ||
      (eventSourceRef.current &&
        eventSourceRef.current.readyState === EventSource.OPEN)
    ) {
      return;
    }

    isConnectingRef.current = true;

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      eventSourceRef.current = new EventSource(`${API_BASE_URL}/api/v1/sse`, {
        withCredentials: true,
      });

      eventSourceRef.current.onopen = () => {
        setReconnectAttempts(0);
        isConnectingRef.current = false;
      };

      eventSourceRef.current.addEventListener("heartbeat", () => {
        // 하트비트 수신 처리
      });

      eventSourceRef.current.addEventListener("connect", () => {
        // 초기 연결 완료
      });

      eventSourceRef.current.addEventListener("alarm", (event) => {
        try {
          const alarmData = JSON.parse(event.data);
          if (onAlarmReceivedRef.current) {
            onAlarmReceivedRef.current(alarmData);
          }
        } catch (error) {
          console.error("알람 데이터 파싱 실패:", error);
        }
      });

      eventSourceRef.current.onerror = () => {
        isConnectingRef.current = false;

        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && isLoggedIn) {
            disconnect();

            reconnectTimeoutRef.current = setTimeout(() => {
              setReconnectAttempts((prev) => prev + 1);
              connect();
            }, RECONNECT_DELAY);
          }
        }
      };
    } catch (error) {
      isConnectingRef.current = false;
    }
  }, [isLoggedIn, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    isConnectingRef.current = false;
    setReconnectAttempts(0);
  }, []);

  const disconnectFromServer = useCallback(async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      await fetch(`${API_BASE_URL}/api/v1/sse`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      // 연결이 이미 끊어진 경우 무시
    }
  }, []);

  const registerAlarmCallback = useCallback((callback) => {
    onAlarmReceivedRef.current = callback;
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (isLoggedIn && eventSourceRef.current) {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        navigator.sendBeacon(`${API_BASE_URL}/api/v1/sse`, new FormData());
      }
      disconnect();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (
          isLoggedIn &&
          (!eventSourceRef.current ||
            eventSourceRef.current.readyState !== EventSource.OPEN)
        ) {
          setTimeout(() => connect(), 1000);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoggedIn]);

  return {
    registerAlarmCallback,
  };
};
