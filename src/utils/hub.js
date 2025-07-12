import { convertTrackFromApi } from "../constants/devcourse.js";
import defaultImage from "../assets/logo-pic.png";

/**
 * JSON 문자열을 배열로 안전하게 파싱
 * @param {string|Array} jsonString - JSON 문자열 또는 배열
 * @returns {Array} 파싱된 배열
 */
export const parseJsonArray = (jsonString) => {
  if (!jsonString) return [];
  try {
    if (Array.isArray(jsonString)) {
      return jsonString;
    }

    if (typeof jsonString === "string") {
      return JSON.parse(jsonString);
    }

    return [];
  } catch (error) {
    console.error("JSON 파싱 실패:", error);
    return [];
  }
};

/**
 * 프로젝트 멤버 문자열을 객체 배열로 변환
 * @param {string|Array} membersData - 멤버 데이터 (JSON 문자열 또는 배열)
 * @returns {Array} {name, role} 형태의 객체 배열
 */
export const parseProjectMembers = (membersData) => {
  const membersArray = parseJsonArray(membersData);
  return membersArray.map((member) => ({
    name: member.includes("-") ? member.split("-")[0]?.trim() : member,
    role: member.includes("-") ? member.split("-")[1]?.trim() || "" : "",
  }));
};

/**
 * 백엔드 API 응답을 프론트엔드에서 사용할 수 있는 형태로 변환
 * @param {object} apiResponse - 백엔드 API 응답 데이터
 * @returns {object} 변환된 프로젝트 데이터
 */

export function mapApiResponseToHubPost(apiResponse) {
  return {
    ...apiResponse,
    courseName: convertTrackFromApi(apiResponse.devcourseTrack),
    batchNumber: parseInt(apiResponse.devcourseBatch) || 0,
    projectMembers: parseJsonArray(apiResponse.projectMembers),
    user: {
      nickname: apiResponse.nickname || "",
      imageUrl: apiResponse.profileImageUrl || null,
    },
    tags: apiResponse.tags.split(","),
    isLiked: apiResponse.hasLiked || false,
    isBookmarked: apiResponse.hasBookmarked || false,
    viewCount: apiResponse.viewCount || 0,
    thumbnailImageUrl: apiResponse.thumbnailImageUrl || defaultImage,
  };
}
