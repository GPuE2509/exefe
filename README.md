# BookStore - Web Bán Sách ReactJS

Đây là dự án web bán sách được chuyển đổi từ template web bán bánh HTML/CSS/JS sang ReactJS.

## Tính năng chính

- **Trang chủ**: Hiển thị slider và sách nổi bật
- **Danh sách sách**: Tìm kiếm và lọc sách theo thể loại
- **Chi tiết sách**: Thông tin đầy đủ về từng cuốn sách
- **Đăng nhập/Đăng ký**: Quản lý tài khoản người dùng
- **Giới thiệu**: Thông tin về cửa hàng
- **Responsive**: Tương thích với mọi thiết bị

## Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── Header.js       # Header và navigation
│   ├── Footer.js       # Footer
│   ├── HeroSlider.js   # Slider trang chủ
│   └── BookCard.js     # Card hiển thị sách
├── pages/              # Các trang chính
│   ├── HomePage.js     # Trang chủ
│   ├── BooksPage.js    # Danh sách sách
│   ├── BookDetailPage.js # Chi tiết sách
│   ├── AboutPage.js    # Giới thiệu
│   ├── LoginPage.js    # Đăng nhập
│   └── RegisterPage.js # Đăng ký
├── data/               # Dữ liệu mẫu
│   └── booksData.js    # Dữ liệu sách và danh mục
└── App.js              # Component chính và routing
```

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm start
```

3. Mở trình duyệt tại: http://localhost:3000

## Dữ liệu mẫu

Dự án bao gồm dữ liệu mẫu cho 6 cuốn sách thuộc các thể loại:
- Văn học
- Khoa học viễn tưởng  
- Lịch sử
- Self-help
- Tài chính
- Kinh doanh

## Hình ảnh

Để web hoạt động đầy đủ, bạn cần thêm các hình ảnh vào thư mục `public/images/`:

- `public/images/books/` - Hình ảnh sách
- `public/images/slider/` - Hình ảnh slider
- `public/images/social/` - Icon mạng xã hội
- `public/images/logo-bookstore.png` - Logo cửa hàng

## Tính năng đã chuyển đổi

### Từ template bán bánh sang bán sách:

1. **Nội dung**: 
   - Bánh → Sách
   - Thể loại bánh → Thể loại sách
   - Giá bánh → Giá sách

2. **Thông tin sản phẩm**:
   - Tên bánh → Tên sách
   - Mô tả bánh → Mô tả sách
   - Thêm: Tác giả, nhà xuất bản, số trang

3. **Giao diện**:
   - Màu sắc phù hợp với chủ đề sách
   - Icon và hình ảnh liên quan đến sách
   - Text và nội dung được Việt hóa

## Phát triển tiếp

Để phát triển thêm, bạn có thể:

1. **Thêm tính năng giỏ hàng**
2. **Tích hợp thanh toán**
3. **Thêm đánh giá sách**
4. **Quản lý đơn hàng**
5. **Tích hợp API backend**

## Công nghệ sử dụng

- React 19.2.0
- React Router DOM
- CSS3 với Flexbox/Grid
- Responsive Design
- Modern JavaScript (ES6+)

## Lưu ý

- Dự án sử dụng dữ liệu mẫu, cần tích hợp với API thực tế
- Hình ảnh cần được thêm vào thư mục public/images/
- Các tính năng như giỏ hàng, thanh toán cần được phát triển thêm