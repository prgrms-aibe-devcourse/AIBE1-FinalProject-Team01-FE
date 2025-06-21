import { useState, useCallback } from "react";

// 실제 프로덕션에서는 이 함수가 서버 API를 호출하여 이미지를 저장하고
// 저장된 이미지의 URL을 반환해야 합니다.
const uploadFileToServer = async (file) => {
  // 로컬 테스트를 위한 API 호출 시뮬레이션
  console.log(`Uploading ${file.name} to server...`);
  await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 흉내

  // fetch를 사용한 실제 API 호출 예시:
  // const formData = new FormData();
  // formData.append('image', file);
  // const response = await fetch('/api/images/upload', { method: 'POST', body: formData });
  // if (!response.ok) throw new Error('Image upload failed');
  // const data = await response.json();
  // return data.imageUrl;

  // 현재는 FileReader를 사용하여 임시 데이터 URL을 생성하여 반환합니다.
  // 백엔드 연동 시 이 부분을 실제 API 호출 결과(URL)로 교체해야 합니다.
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

    const newUrls = [];
    // 여러 파일 동시 업로드를 위해 Promise.all 사용
    const uploadPromises = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => uploadFileToServer(file));

    try {
      const urls = await Promise.all(uploadPromises);
      newUrls.push(...urls);
    } catch (error) {
      console.error("An error occurred during image upload:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }

    if (newUrls.length > 0) {
      setImageUrls((prevUrls) => [...prevUrls, ...newUrls]);
    }

    return newUrls; // 에디터 등에서 즉시 사용 가능하도록 URL 배열 반환
  }, []);

  return { imageUrls, handleUpload, setImageUrls };
};
