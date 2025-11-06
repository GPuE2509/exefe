# Admin System - Hệ thống quản trị

## Tổng quan

Hệ thống admin được xây dựng với Ant Design, cung cấp giao diện quản trị hiện đại và dễ sử dụng cho việc quản lý sách, audio, ảnh và thể loại.

## Tính năng chính

### 🏠 Dashboard
- Thống kê tổng quan về hệ thống
- Biểu đồ tăng trưởng người dùng
- Danh sách sách mới nhất
- Thể loại phổ biến
- Thao tác nhanh

### 📚 Quản lý sách
- Xem danh sách tất cả sách
- Thêm/sửa/xóa sách
- Upload ảnh bìa sách
- Quản lý thông tin chi tiết sách (tác giả, giá, thể loại, v.v.)

### 🎵 Quản lý Audio sách
- Quản lý audio theo từng sách
- Upload file audio
- Tạo QR token cho audio
- Phát audio trực tiếp
- Theo dõi số lần phát

### 🖼️ Quản lý ảnh sách
- Upload nhiều ảnh cho một sách
- Đặt ảnh chính
- Xem trước ảnh
- Quản lý thư viện ảnh

### 🏷️ Quản lý thể loại
- Thêm/sửa/xóa thể loại
- Sắp xếp thứ tự thể loại
- Theo dõi số sách theo thể loại

## Cấu trúc thư mục

```
src/
├── configs/
│   └── api.js                 # Cấu hình API
├── services/
│   ├── api.js                 # Axios instance
│   └── adminService.js        # Services cho admin
├── layouts/
│   ├── AdminLayout.js         # Layout chính cho admin
│   └── AdminLayout.css        # Styles cho layout
└── pages/
    └── admin/
        ├── AdminPage.js       # Trang admin chính
        ├── DashboardPage.js   # Dashboard
        ├── BooksManagementPage.js     # Quản lý sách
        ├── AudioManagementPage.js     # Quản lý audio
        ├── ImageManagementPage.js     # Quản lý ảnh
        └── GenreManagementPage.js     # Quản lý thể loại
```

## Cấu hình API

### Base URL
```
http://localhost:3001/api
```

### Endpoints chính

#### Admin Books
- `GET /admin/books` - Lấy danh sách sách
- `POST /admin/books` - Tạo sách mới
- `PUT /admin/books/:id` - Cập nhật sách
- `DELETE /admin/books/:id` - Xóa sách
- `POST /admin/books/:id/cover` - Upload ảnh bìa

#### Admin Book Audios
- `GET /admin/books/:bookId/audios` - Lấy audio của sách
- `POST /admin/books/:bookId/audios` - Tạo audio mới
- `PUT /admin/books/:bookId/audios/:audioId` - Cập nhật audio
- `DELETE /admin/books/:bookId/audios/:audioId` - Xóa audio
- `POST /admin/books/:bookId/audios/upload` - Upload file audio

#### Admin Book Images
- `GET /admin/books/:bookId/images` - Lấy ảnh của sách
- `POST /admin/books/:bookId/images` - Upload ảnh
- `DELETE /admin/books/:bookId/images/:imageId` - Xóa ảnh
- `PUT /admin/books/:bookId/images/:imageId/set-main` - Đặt ảnh chính

#### Admin Genres
- `GET /admin/genres` - Lấy danh sách thể loại
- `POST /admin/genres` - Tạo thể loại mới
- `PUT /admin/genres/:id` - Cập nhật thể loại
- `DELETE /admin/genres/:id` - Xóa thể loại

#### Admin Statistics
- `GET /admin/statistics/dashboard` - Thống kê dashboard
- `GET /admin/statistics/books` - Thống kê sách
- `GET /admin/statistics/users` - Thống kê người dùng
- `GET /admin/statistics/orders` - Thống kê đơn hàng

## Cách sử dụng

### 1. Truy cập Admin Panel
- Truy cập: `http://localhost:3000/admin`
- Đăng nhập với tài khoản admin

### 2. Quản lý sách
1. Vào "Quản lý sách"
2. Nhấn "Thêm sách mới"
3. Điền thông tin sách
4. Upload ảnh bìa
5. Lưu sách

### 3. Quản lý Audio
1. Vào "Quản lý Audio"
2. Chọn sách từ dropdown
3. Nhấn "Thêm audio mới"
4. Upload file audio
5. Tạo QR token
6. Lưu audio

### 4. Quản lý ảnh
1. Vào "Quản lý ảnh"
2. Chọn sách từ dropdown
3. Upload nhiều ảnh
4. Đặt ảnh chính
5. Quản lý ảnh

### 5. Quản lý thể loại
1. Vào "Quản lý thể loại"
2. Nhấn "Thêm thể loại mới"
3. Điền thông tin thể loại
4. Lưu thể loại

## Tính năng nổi bật

### 🎨 Giao diện hiện đại
- Sử dụng Ant Design components
- Responsive design
- Dark theme sidebar
- Animation mượt mà

### 🔧 Chức năng mạnh mẽ
- Upload file với progress
- Preview ảnh/audio
- QR code generation
- Real-time statistics

### 🚀 Performance
- Lazy loading
- Pagination
- Optimized API calls
- Error handling

### 📱 Responsive
- Tương thích mobile
- Touch-friendly
- Adaptive layout

## Dependencies

```json
{
  "antd": "^5.x.x",
  "@ant-design/icons": "^5.x.x",
  "axios": "^1.x.x",
  "react": "^18.x.x",
  "react-router-dom": "^6.x.x"
}
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security

- JWT token authentication
- Role-based access control
- Input validation
- File upload security

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Bulk operations
- [ ] Export/Import data
- [ ] Audit logs
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Advanced analytics
