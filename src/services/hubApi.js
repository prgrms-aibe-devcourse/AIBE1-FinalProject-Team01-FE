import { apiClient } from "./api";

export const getPosts = async (params) => {
    try {
        const response = await apiClient.get(`/api/v1/projects`, { params });
        console.log(`프로젝트 허브 목록 조회 성공: `, response.data);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 목록 조회 요청 실패: `, error);
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    throw new Error(data.message || '잘못된 요청입니다.');
                case 401:
                    throw new Error('로그인이 필요합니다.');
                case 403:
                    throw new Error('접근 권한이 없습니다.');
                case 404:
                    throw new Error('요청한 페이지를 찾을 수 없습니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다.');
                default:
                    throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
            }
        } else {
            throw new Error('요청 처리 중 오류가 발생했습니다.');
        }
    }
};

export const getPostById = async (projectId) => {
    try {
        const response = await apiClient.get(`/api/v1/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 게시글 상세 조회 요청 실패: `, error);
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    throw new Error('잘못된 프로젝트 ID입니다.');
                case 401:
                    throw new Error('로그인이 필요합니다.');
                case 403:
                    throw new Error('프로젝트 조회 권한이 없습니다.');
                case 404:
                    throw new Error('존재하지 않는 프로젝트입니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다.');
                default:
                    throw new Error(data.message || '프로젝트 조회에 실패했습니다.');
            }
        } else if (error.request) {
            throw new Error('네트워크 연결을 확인해주세요.');
        } else {
            throw new Error('프로젝트 조회 중 오류가 발생했습니다.');
        }
    }
};

export const createPost = async (postData) => {
    try {
        const response = await apiClient.post(`/api/v1/projects`, postData);
        console.log('프로젝트 생성 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 게시글 생성 요청 실패: `, error);
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    throw new Error(data.message || '입력 정보를 확인해주세요.');
                case 401:
                    throw new Error('로그인이 필요합니다.');
                case 403:
                    throw new Error('프로젝트 등록 권한이 없습니다.');
                case 409:
                    throw new Error('이미 존재하는 프로젝트입니다.');
                case 413:
                    throw new Error('업로드한 파일 크기가 너무 큽니다.');
                case 422:
                    throw new Error(data.message || '입력 데이터 형식이 올바르지 않습니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                default:
                    throw new Error(data.message || '프로젝트 등록에 실패했습니다.');
            }
        } else if (error.request) {
            throw new Error('네트워크 연결을 확인해주세요.');
        } else {
            throw new Error('프로젝트 등록 중 오류가 발생했습니다.');
        }
    }
};

export const updatePost = async (projectId, postData) => {
    try {
        const response = await apiClient.put(`/api/v1/projects/${projectId}`, postData);
        console.log('프로젝트 수정 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 게시글 수정 요청 실패: `, error);
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    throw new Error(data.message || '입력 정보를 확인해주세요.');
                case 401:
                    throw new Error('로그인이 필요합니다.');
                case 403:
                    throw new Error('프로젝트 수정 권한이 없습니다.');
                case 404:
                    throw new Error('존재하지 않는 프로젝트입니다.');
                case 409:
                    throw new Error('수정 중 충돌이 발생했습니다.');
                case 413:
                    throw new Error('업로드한 파일 크기가 너무 큽니다.');
                case 422:
                    throw new Error(data.message || '입력 데이터 형식이 올바르지 않습니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                default:
                    throw new Error(data.message || '프로젝트 수정에 실패했습니다.');
            }
        } else if (error.request) {
            throw new Error('네트워크 연결을 확인해주세요.');
        } else {
            throw new Error('프로젝트 수정 중 오류가 발생했습니다.');
        }
    }
};

export const deletePost = async (projectId) => {
    try {
        const response = await apiClient.delete(`/api/v1/projects/${projectId}`);
        console.log('프로젝트 삭제 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error(`프로젝트 허브 게시글 삭제 요청 실패`, error);
        
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    throw new Error('잘못된 프로젝트 ID입니다.');
                case 401:
                    throw new Error('로그인이 필요합니다.');
                case 403:
                    throw new Error('프로젝트 삭제 권한이 없습니다.');
                case 404:
                    throw new Error('존재하지 않는 프로젝트입니다.');
                case 409:
                    throw new Error('삭제할 수 없는 프로젝트입니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                default:
                    throw new Error(data.message || '프로젝트 삭제에 실패했습니다.');
            }
        } else if (error.request) {
            throw new Error('네트워크 연결을 확인해주세요.');
        } else {
            throw new Error('프로젝트 삭제 중 오류가 발생했습니다.');
        }
    }
};
