import apiClient from './api';
import API_CONFIG from '../configs/api';

// Admin Books Service
export const adminBooksService = {
  // Get all books
  getBooks: (params = {}) => {
    return apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.BOOKS, { params });
  },

  // Get book by ID
  getBookById: (id) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.BOOKS}/${id}`);
  },

  // Create new book
  createBook: (bookData) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.BOOKS, bookData);
  },

  // Update book
  updateBook: (id, bookData) => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.BOOKS}/${id}`, bookData);
  },

  // Delete book
  deleteBook: (id) => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.BOOKS}/${id}`);
  },

  // Upload book cover
  uploadBookCover: (bookId, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    return apiClient.post(`${API_CONFIG.ENDPOINTS.ADMIN.BOOKS}/${bookId}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Admin Book Audios Service
export const adminBookAudiosService = {
  // Get book audios
  getBookAudios: (bookId, params = {}) => {
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_AUDIOS.replace(':bookId', bookId);
    return apiClient.get(endpoint, { params });
  },

  // Create book audio
  createBookAudio: (bookId, audioData) => {
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_AUDIOS.replace(':bookId', bookId);
    return apiClient.post(endpoint, audioData);
  },

  // Update book audio
  updateBookAudio: (bookId, audioId, audioData) => {
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_AUDIOS.replace(':bookId', bookId);
    return apiClient.put(`${endpoint}/${audioId}`, audioData);
  },

  // Delete book audio
  deleteBookAudio: (bookId, audioId) => {
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_AUDIOS.replace(':bookId', bookId);
    return apiClient.delete(`${endpoint}/${audioId}`);
  },

  // Upload audio file
  // Upload audio file
  uploadAudioFile: (bookId, file, term) => {
    const formData = new FormData();
    formData.append('audio', file);
    if (term) {
      formData.append('term', term);
    }
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_AUDIOS.replace(':bookId', bookId);
    return apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Admin Audios Service (Direct audio management)
export const adminAudiosService = {
  // Delete audio directly by ID
  deleteAudio: (audioId) => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.AUDIOS}/${audioId}`);
  },

  // Update audio directly by ID
  updateAudio: (audioId, audioData) => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.AUDIOS}/${audioId}`, audioData);
  }
};

// Admin Book Images Service
export const adminBookImagesService = {
  // Get book images
  getBookImages: (bookId) => {
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_IMAGES.replace(':bookId', bookId);
    return apiClient.get(endpoint);
  },

  // Upload book images
  uploadBookImages: (bookId, files) => {
    const formData = new FormData();
    const normalizedFiles = Array.isArray(files) ? files : [files];
    normalizedFiles.forEach(file => {
      if (file) {
        formData.append('image', file);
      }
    });
    const endpoint = API_CONFIG.ENDPOINTS.ADMIN.BOOK_IMAGES.replace(':bookId', bookId);
    return apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete book image
  deleteBookImage: (bookId, imageId) => {
    return apiClient.delete(`/admin/images/${imageId}`);
  },

  // Set main image
  setMainImage: (bookId, imageId) => {
    return apiClient.put(`/admin/images/${imageId}`, { isCover: true });
  }
};

// Admin Genres Service
export const adminGenresService = {
  // Get all genres
  getGenres: (params = {}) => {
    return apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.GENRES, { params });
  },

  // Get genre by ID
  getGenreById: (id) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.GENRES}/${id}`);
  },

  // Create new genre
  createGenre: (genreData) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.GENRES, genreData);
  },

  // Update genre
  updateGenre: (id, genreData) => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.GENRES}/${id}`, genreData);
  },

  // Delete genre
  deleteGenre: (id) => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.GENRES}/${id}`);
  }
};

// Admin Users Service
export const adminUsersService = {
  // Get all users
  getUsers: (params = {}) => {
    return apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS, { params });
  },

  // Get user by ID
  getUserById: (id) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  // Update user
  updateUser: (id, userData) => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}`, userData);
  },

  // Delete user
  deleteUser: (id) => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  // Change user role
  changeUserRole: (id, role) => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}/role`, { role });
  }
};

// Admin Statistics Service
export const adminStatisticsService = {
  // Get dashboard statistics
  getDashboardStats: () => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.STATISTICS}/dashboard`);
  },

  // Get book statistics
  getBookStats: () => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.STATISTICS}/books`);
  },

  // Get user statistics
  getUserStats: () => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.STATISTICS}/users`);
  },

  // Get order statistics
  getOrderStats: () => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.STATISTICS}/orders`);
  }
};

// Admin Banners Service
export const adminBannerService = {
  // Get all banners
  getBanners: (params = {}) => {
    return apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.BANNERS, { params });
  },

  // Get banner by ID
  getBannerById: (id) => {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ADMIN.BANNERS}/${id}`);
  },

  // Create new banner
  createBanner: (bannerData) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.BANNERS, bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update banner
  updateBanner: (id, bannerData) => {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ADMIN.BANNERS}/${id}`, bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete banner
  deleteBanner: (id) => {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ADMIN.BANNERS}/${id}`);
  }
};
