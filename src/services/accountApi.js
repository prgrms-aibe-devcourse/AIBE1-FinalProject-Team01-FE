// src/services/accountApi.js
import apiClient from "./api.js";
import { uploadProfileImage as uploadImage } from "./imageApi.js";


/**
 * 계정 관리 관련 API 서비스
 */

/**
 * 내 정보 조회
 * @returns {Promise<Object>} UserProfileResponseDTO
 */
export const getMyProfile = async () => {
    try {
        const response = await apiClient.get('/api/v1/users/me');
        return response.data;
    } catch (error) {
        console.error('내 정보 조회 실패:', error);
        throw error;
    }
};

/**
 * 내 정보 수정 (기본 프로필)
 * @param {Object} data - UserBasicProfileEditRequestDTO
 * @param {string} data.name - 이름
 * @param {string} data.nickname - 닉네임
 * @param {string} data.imageUrl - 프로필 이미지 URL
 * @returns {Promise<Object>} 수정된 프로필 정보
 */
export const updateMyProfile = async (data) => {
    try {
        const response = await apiClient.put('/api/v1/users/me', data);
        return response.data;
    } catch (error) {
        console.error('프로필 수정 실패:', error);
        throw error;
    }
};

/**
 * 비밀번호 변경
 * @param {Object} data - UserPasswordEditRequestDTO
 * @param {string} data.currentPassword - 현재 비밀번호
 * @param {string} data.newPassword - 새 비밀번호
 * @returns {Promise<Object>} 응답 결과
 */
export const changePassword = async (data) => {
    try {
        const response = await apiClient.put('/api/v1/users/me/password', data);

        return response.data;
    } catch (error) {
        console.error('비밀번호 변경 실패:', error);
        throw error;
    }
};

/**
 * 관심 토픽 변경
 * @param {Object} data - UserTopicsEditDTO
 * @param {string[]} data.topics - 관심 주제 목록
 * @returns {Promise<Object>} 수정된 토픽 정보
 */
export const updateMyTopics = async (data) => {
    try {
        const response = await apiClient.put('/api/v1/users/me/topics', data);
        return response.data;
    } catch (error) {
        console.error('관심 토픽 수정 실패:', error);
        throw error;
    }
};

/**
 * 프로필 이미지 업로드 (imageApi 활용)
 * @param {File} file - 업로드할 파일
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export const uploadProfileImage = async (file) => {
    try {
        // imageApi의 uploadProfileImage 함수 재사용
        const imageUrl = await uploadImage(file, "profile-images");
        return { success: true, url: imageUrl };
    } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error);
        throw error;
    }
};


/**
 * 회원 탈퇴
 * @param {Object} data - UserDeleteRequestDTO
 * @param {string} data.currentPassword - 현재 비밀번호
 * @returns {Promise<Object>} 탈퇴 처리 결과
 */
export const deleteAccount = async (data) => {
    try {
        const response = await apiClient.delete('/api/v1/users/me', { data });
        return response.data;
    } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        throw error;
    }
};

export const checkNicknameDuplicate = async (data) => {
    try{
        const response = await apiClient.get(`/api/v1/auth/check/nickname?nickname=${data}`, );
        return response.data;
    } catch (error) {
    console.error('닉네임 검증 실패:', error);
    throw error;
}

}

export const accountApi = {
    getMyProfile,
    updateMyProfile,
    changePassword,
    updateMyTopics,
    deleteAccount,
    checkNicknameDuplicate,
    uploadProfileImage
};