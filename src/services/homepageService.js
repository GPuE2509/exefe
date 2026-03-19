import apiClient from './api';

const homepageService = {
    getHomepageData: async () => {
        try {
            const response = await apiClient.get('/homepage');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getFeaturedBooks: async () => {
        try {
            const response = await apiClient.get('/homepage/featured-books');
            return response;
        } catch (error) {
            throw error;
        }
    },

    getBanners: async () => {
        try {
            const response = await apiClient.get('/homepage/banners');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default homepageService;
