// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://nonexternally-jaggy-rufus.ngrok-free.dev/api',
  TIMEOUT: 15000,
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile'
    },
    
    // Admin
    ADMIN: {
      BOOKS: '/admin/books',
      BOOK_AUDIOS: '/admin/books/:bookId/audios',
      AUDIOS: '/admin/audios',
      BOOK_IMAGES: '/admin/books/:bookId/images',
      GENRES: '/admin/genres',
      USERS: '/admin/users',
      ORDERS: '/admin/orders',
      STATISTICS: '/admin/statistics'
    },
    
    // Books
    BOOKS: {
      LIST: '/books',
      DETAIL: '/books/:id',
      SEARCH: '/books/search',
      QR_AUDIO: '/books/qr/:qrToken'
    },
    
    // Cart
    CART: {
      LIST: '/cart',
      ADD: '/cart/add',
      UPDATE: '/cart/update/:itemId',
      REMOVE: '/cart/remove/:itemId',
      CLEAR: '/cart/clear'
    },
    
    // Homepage
    HOMEPAGE: {
      BANNERS: '/homepage/banners',
      FEATURED_BOOKS: '/homepage/featured-books',
      NEW_BOOKS: '/homepage/new-books'
    }
  }
};

export default API_CONFIG;
