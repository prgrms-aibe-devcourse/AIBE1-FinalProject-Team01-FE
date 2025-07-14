import apiClient from "./api";


const FOLLOW_API_BASE_URL = "/api/v1";

export const followUser = async (userId) => {
    try {
        const response = await apiClient.post(`${FOLLOW_API_BASE_URL}/users/${userId}/follow`);
        return response.data;
    } catch (error) {
        console.error("❌ 팔로우 실패:", error);
        throw error;
    }
}

export const unfollowUser = async (userId) => {
    try {
        await apiClient.delete(`${FOLLOW_API_BASE_URL}/users/${userId}/follow`);
    } catch (error) {
        console.error("❌ 언팔로우 실패:", error);
        throw error;
    }
}

export const getModalInfo = async (nickname) => {
    try {
        const response = await apiClient.get(`${FOLLOW_API_BASE_URL}/users/${nickname}/info`);
        return response.data;
    } catch (error) {
        console.error("❌ 유저 정보 조회 실패:", error);
        throw error;
    }
};

export const getFollowingList = async () => {
    try {
        const response = await apiClient.get(`${FOLLOW_API_BASE_URL}/users/following`);
        return response.data;
    } catch (error) {
        console.error("❌ 팔로잉 목록 조회 실패:", error);
        throw error;
    }
}

export const getFollowerList = async () => {
    try {
        const response = await apiClient.get(`${FOLLOW_API_BASE_URL}/users/follower`);
        return response.data;
    } catch (error) {
        console.error("❌ 팔로워 목록 조회 실패:", error);
        throw error;
    }
}

export const getFollowingPost = async () => {
    try {
        const response = await apiClient.get(`${FOLLOW_API_BASE_URL}/users/followPost`);
        return response.data;
    } catch (error) {
        console.error("❌ 팔로잉 게시글 조회 실패:", error);
        throw error;
    }
}
