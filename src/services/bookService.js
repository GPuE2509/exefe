import apiClient from './api';

const bookService = {
    getBooks: async (params) => {
        try {
            // Remove leading slash to ensure it appends to baseURL correctly
            const response = await apiClient.get('books', { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getGenres: async () => {
        try {
            const response = await apiClient.get('homepage/categories');
            // Map properties to match what BooksPage expects if needed, or update BooksPage
            return response;
        } catch (error) {
            throw error;
        }
    },

    getBookDetail: async (id) => {
        try {
            const response = await apiClient.get(`books/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getRelatedBooks: async (id, params = {}) => {
        try {
            const response = await apiClient.get(`books/${id}/related`, { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getBookReviews: async (id, params) => {
        try {
            const response = await apiClient.get(`books/${id}/reviews`, { params });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default bookService;
