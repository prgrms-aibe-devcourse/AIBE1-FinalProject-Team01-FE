import { apiClient } from "./api.js";

/**
 * 이미지 파일을 S3에 업로드
 * @param {FileList|File[]} files - 업로드할 이미지 파일들
 * @param {string} directory - 업로드할 디렉토리 (기본값: dm-images)
 * @returns {Promise<Array>} 업로드된 이미지 URL 배열
 */
export const uploadImages = async (files, directory = "dm-images") => {
  try {
    const formData = new FormData();

    // 파일들을 FormData에 추가
    if (files instanceof FileList) {
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });
    } else if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("file", file);
      });
    } else {
      formData.append("file", files);
    }

    const response = await apiClient.post("/api/v1/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        directory,
      },
    });

    // 응답이 배열이 아닌 경우 배열로 변환
    const result = response.data;
    if (Array.isArray(result)) {
      return result.map((item) => item.url || item);
    } else {
      return [result.url || result];
    }
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    if (error.response?.status === 413) {
      throw new Error("파일 크기가 너무 큽니다.");
    } else if (error.response?.status === 415) {
      throw new Error("지원하지 않는 이미지 형식입니다.");
    } else {
      throw new Error("이미지 업로드 중 오류가 발생했습니다.");
    }
  }
};

/**
 * 일반 파일을 S3에 업로드
 * @param {FileList|File[]} files - 업로드할 파일들
 * @returns {Promise<Array>} 업로드된 파일 URL 배열
 */
export const uploadFiles = async (files) => {
  try {
    const formData = new FormData();

    // 파일들을 FormData에 추가
    if (files instanceof FileList) {
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });
    } else if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("file", file);
      });
    } else {
      formData.append("file", files);
    }

    const response = await apiClient.post("/api/v1/upload/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // 응답이 배열이 아닌 경우 배열로 변환
    const result = response.data;
    if (Array.isArray(result)) {
      return result.map((item) => item.url || item);
    } else {
      return [result.url || result];
    }
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    if (error.response?.status === 413) {
      throw new Error("파일 크기가 너무 큽니다.");
    } else {
      throw new Error("파일 업로드 중 오류가 발생했습니다.");
    }
  }
};

/**
 * 파일이 이미지인지 확인
 * @param {File} file - 확인할 파일
 * @returns {boolean} 이미지 여부
 */
export const isImageFile = (file) => {
  return file.type.startsWith("image/");
};

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 * @param {number} bytes - 바이트 크기
 * @returns {string} 포맷된 파일 크기
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
