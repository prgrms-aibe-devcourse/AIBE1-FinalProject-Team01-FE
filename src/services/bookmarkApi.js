import apiClient from "./api";

const BOOKMARK_BASE_URL = "/api/v1/users";

export const getBookmarkList = async (userId, params = {}) => {
    try{
        const { page = 0, size = 10, sortDirection, field} = params;

        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());
        if (sortDirection) {
            queryParams.append("sortDirection", sortDirection);
        }
        if (field) {
            queryParams.append("field", field);
        }

        const response = await apiClient.get(`${BOOKMARK_BASE_URL}/${userId}/bookmarks?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error("❌ 북마크 게시글 목록 조회 실패:", error);
        throw error;
    }
}

export const addBookmark = async (userId, postId) => {
    try {
        const response = await apiClient.post(`${BOOKMARK_BASE_URL}/${userId}/bookmarks/${postId}`);
        return response.data;
    } catch (error) {
        console.error("❌ 북마크 추가 실패:", error);
        throw error;
    }
}

export const removeBookmark = async (userId, postId) => {
    try {
        await apiClient.delete(`${BOOKMARK_BASE_URL}/${userId}/bookmarks/${postId}`);
    } catch (error) {
        console.error("❌ 북마크 삭제 실패:", error);
        throw error;
    }
}
