/**
 * DM 관련 API 서비스 (새로운 API 스펙 적용)
 */

const BASE_URL = "http://localhost:8080/api/v1";

/**
 * 채팅방 목록 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} DM 방 목록
 */
export const getDMRooms = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/dm/rooms/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ DM 방 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 채팅 기록 조회
 * @param {string} roomId - 방 ID
 * @param {number} userId - 사용자 ID
 * @param {number} page - 페이지 번호 (기본값 0)
 * @param {number} size - 페이지당 크기 (기본값 10)
 * @param {string} sortDirection - 정렬 방법 (ASC/DESC)
 * @returns {Promise<Object>} 메시지 목록과 페이지 정보
 */
export const getDMMessages = async (
  roomId,
  userId,
  page = 0,
  size = 50,
  sortDirection = "ASC"
) => {
  try {
    const params = new URLSearchParams({
      roomId,
      userId: userId.toString(),
      page: page.toString(),
      size: size.toString(),
      sortDirection,
    });

    const response = await fetch(`${BASE_URL}/dm/messages?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`💬 DM 메시지 목록 조회 성공 (방 ${roomId}):`, data);
    return data;
  } catch (error) {
    console.error(`❌ DM 메시지 목록 조회 실패 (방 ${roomId}):`, error);
    throw error;
  }
};

/**
 * 채팅방 생성
 * @param {Object} participantMap - 참가자 맵 (ID: 닉네임)
 * @returns {Promise<Object>} 생성된 방 정보
 */
export const createDMRoom = async (participantMap) => {
  try {
    console.log(`🏗️ DM 방 생성 시도:`, participantMap);

    const response = await fetch(`${BASE_URL}/dm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantMap,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ DM 방 생성 성공:`, data);
    return data;
  } catch (error) {
    console.error("❌ DM 방 생성 실패:", error);
    throw error;
  }
};

/**
 * 방 나가기
 * @param {string} roomId - 방 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<void>}
 */
export const leaveDMRoom = async (roomId, userId) => {
  try {
    console.log(`🚪 DM 방 ${roomId} 나가기 (사용자 ${userId})`);

    const response = await fetch(`${BASE_URL}/dm`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`✅ DM 방 ${roomId} 나가기 성공`);
  } catch (error) {
    console.error(`❌ DM 방 ${roomId} 나가기 실패:`, error);
    throw error;
  }
};
