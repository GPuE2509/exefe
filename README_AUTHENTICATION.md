# Authentication System - Hệ thống xác thực

## Tổng quan

Hệ thống xác thực được xây dựng với JWT token, cung cấp đăng nhập/đăng xuất, protected routes và quản lý quyền admin.

## Tính năng chính

### 🔐 Authentication
- Đăng nhập với username/email và password
- Lưu JWT token vào localStorage
- Đăng xuất và xóa token
- Kiểm tra trạng thái đăng nhập

### 🛡️ Protected Routes
- ProtectedRoute component để bảo vệ routes
- Kiểm tra quyền admin
- Redirect tự động khi chưa đăng nhập
- Lưu return URL khi redirect

### 👤 User Management
- Hiển thị thông tin user trong header
- Quản lý quyền admin
- Logout functionality

## Cấu trúc Files

```
src/
├── services/
│   ├── authService.js          # Service xác thực
│   └── api.js                  # Axios instance với interceptors
├── components/
│   └── ProtectedRoute.js       # Component bảo vệ routes
├── layouts/
│   ├── MainLayout.js           # Layout chính
│   └── AdminLayout.js          # Layout admin
├── routes/
│   └── AppRoutes.js            # Định nghĩa routes
└── pages/
    └── LoginPage.js            # Trang đăng nhập
```

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/profile
```

### Request/Response Format

#### Login Request
```json
{
  "username": "admin@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Đăng nhập thành công"
}
```

## Cách sử dụng

### 1. Đăng nhập
```javascript
import { authService } from '../services/authService';

const result = await authService.login({
  username: 'admin@example.com',
  password: 'password123'
});

if (result.success) {
  // Đăng nhập thành công
  console.log('User:', result.data.user);
} else {
  // Đăng nhập thất bại
  console.error('Error:', result.message);
}
```

### 2. Kiểm tra trạng thái đăng nhập
```javascript
// Kiểm tra đã đăng nhập chưa
const isAuthenticated = authService.isAuthenticated();

// Kiểm tra quyền admin
const isAdmin = authService.isAdmin();

// Lấy thông tin user hiện tại
const currentUser = authService.getCurrentUser();
```

### 3. Protected Routes
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

// Route bảo vệ thường
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />

// Route yêu cầu quyền admin
<Route path="/admin/*" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminPage />
  </ProtectedRoute>
} />
```

### 4. Đăng xuất
```javascript
// Đăng xuất và redirect về login
authService.logout();
```

## LocalStorage Structure

```javascript
// Token
localStorage.getItem('token') // JWT token

// User info
localStorage.getItem('user') // JSON string của user object

// Email
localStorage.getItem('email') // Email của user
```

## Protected Routes Logic

### 1. Kiểm tra Authentication
- Kiểm tra token trong localStorage
- Nếu không có token → redirect to /login
- Lưu return URL để redirect sau khi đăng nhập

### 2. Kiểm tra Admin Permission
- Kiểm tra role của user
- Nếu không phải admin → redirect to /
- Chỉ cho phép admin truy cập admin routes

### 3. Redirect Logic
```javascript
// Sau khi đăng nhập thành công
if (authService.isAdmin()) {
  navigate('/admin'); // Admin → Admin dashboard
} else {
  navigate(from); // User → Return URL hoặc home
}
```

## Error Handling

### Login Errors
- Invalid credentials
- Server connection error
- Network timeout
- Validation errors

### Route Protection Errors
- Unauthorized access
- Token expired
- Invalid token
- Permission denied

## Security Features

### 🔒 Token Management
- JWT token với expiration
- Automatic token refresh
- Secure token storage
- Token validation

### 🛡️ Route Protection
- Protected routes với authentication check
- Role-based access control
- Automatic redirects
- Return URL handling

### 🔐 Data Protection
- Secure API calls với token
- Input validation
- Error handling
- CSRF protection

## Component Usage

### ProtectedRoute Component
```javascript
<ProtectedRoute requireAdmin={false}>
  <YourComponent />
</ProtectedRoute>
```

### Props
- `requireAdmin` (boolean): Yêu cầu quyền admin
- `children`: Component cần bảo vệ

### Behavior
- Kiểm tra authentication
- Kiểm tra admin permission nếu cần
- Redirect nếu không đủ quyền
- Render children nếu có quyền

## Integration với Admin System

### Admin Layout
- Hiển thị username trong header
- Logout functionality
- Admin navigation menu

### Header Component
- Hiển thị thông tin user khi đã đăng nhập
- Show/hide admin link dựa trên role
- Logout button

## Testing

### Test Cases
1. Login với credentials hợp lệ
2. Login với credentials không hợp lệ
3. Access protected route khi chưa đăng nhập
4. Access admin route khi không phải admin
5. Logout functionality
6. Token expiration handling

### Mock Data
```javascript
const mockUser = {
  _id: 'user_id',
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin'
};

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Future Enhancements

- [ ] Remember me functionality
- [ ] Password reset
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Role-based permissions
- [ ] Audit logs
- [ ] Social login integration
