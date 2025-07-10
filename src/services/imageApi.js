import apiClient from "./api";

const IMAGE_BASE_URL = "/api/v1/upload";

export const uploadPostImage = async (file, directory = "post-images") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("directory", directory);

    const response = await apiClient.post(
      `${IMAGE_BASE_URL}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const dto = response.data;
    if (!dto.success) {
      throw new Error(dto.message || "이미지 업로드 실패");
    }
    return dto.url;
  } catch (error) {
    console.error("❌ 이미지 업로드 실패:", error);
    throw error;
  }
};

export const uploadProfileImage = async (file, directory = "profile-images") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("directory", directory);

    const response = await apiClient.post(
      `${IMAGE_BASE_URL}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const dto = response.data;
    if (!dto.success) {
      throw new Error(dto.message || "이미지 업로드 실패");
    }
    return dto.url;
  } catch (error) {
    console.error("❌ 이미지 업로드 실패:", error);
    throw error;
  }
};
