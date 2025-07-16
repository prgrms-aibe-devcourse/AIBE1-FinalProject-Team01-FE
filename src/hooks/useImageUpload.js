import { useState, useCallback } from "react";
import { uploadPostImage } from "../services/imageApi";


// 실제 프로덕션에서는 이 함수가 서버 API를 호출하여 이미지를 저장하고
// 저장된 이미지의 URL을 반환해야 합니다.
const uploadFileToServer = async (file) => {
  // 로컬 테스트를 위한 API 호출 시뮬레이션
  console.log(`Uploading ${file.name} to server...`);
  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 흉내

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        console.log(`"${file.name}" upload complete. (Using local data URL)`);
        resolve(e.target.result);
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 업로드 및 URL 상태 관리를 위한 커스텀 훅
 * @param {string[]} initialImageUrls - (수정 시) 초기에 표시할 이미지 URL 배열
 * @returns {{imageUrls: string[], handleUpload: (files: FileList) => Promise<string[]>, setImageUrls: Function}}
 */
export const useImageUpload = (initialImageUrls = []) => {
  const [imageUrls, setImageUrls] = useState(initialImageUrls);

  /**
   * 파일들을 받아 업로드를 처리하고, 새로 생성된 URL들을 상태에 추가하는 함수
   * @param {FileList} files - 업로드할 파일 목록
   * @returns {Promise<string[]>} 업로드 성공한 이미지들의 URL 배열
   */
  const handleUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return [];

    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      console.warn("업로드할 이미지 파일이 없습니다.");
      return [];
    }

    try {
      const urls = await Promise.all(
        imageFiles.map((file) => {
          if (!file.name) {
            const timestamp = new Date().getTime();
            const extension = file.type.split('/')[1] || 'png';
            Object.defineProperty(file, 'name', {
              writable: true,
              value: `clipboard-image-${timestamp}.${extension}`
            });
          }
          return uploadPostImage(file);
        })
      );
      setImageUrls((prev) => [...prev, ...urls]);
      return urls;
    } catch (error) {
      console.error("An error occurred during image upload:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
      return [];
    }
  }, []);

  return { imageUrls, handleUpload, setImageUrls };
};
