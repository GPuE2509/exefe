import apiClient from './api';
import API_CONFIG from '../configs/api';

export const forumService = {
    // Get all posts
    getPosts: async (params = {}) => {
        try {
            const response = await apiClient.get(API_CONFIG.ENDPOINTS.FORUM.POSTS, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get post detail
    getPostById: async (id) => {
        try {
            const url = API_CONFIG.ENDPOINTS.FORUM.POST_DETAIL.replace(':id', id);
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            // If 404, return null or throw
            if (error.response && error.response.status === 404) {
                throw new Error("Tài liệu không tồn tại");
            }
            throw error;
        }
    },

    // Create post
    createPost: async (postData) => {
        try {
            const response = await apiClient.post(API_CONFIG.ENDPOINTS.FORUM.POSTS, postData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add comment
    addComment: async (postId, content) => {
        try {
            const url = API_CONFIG.ENDPOINTS.FORUM.COMMENTS.replace(':postId', postId);
            const response = await apiClient.post(url, { content });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Like post
    toggleLikePost: async (id) => {
        try {
            const url = API_CONFIG.ENDPOINTS.FORUM.LIKE.replace(':id', id);
            const response = await apiClient.post(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
