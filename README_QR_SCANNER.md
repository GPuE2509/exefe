# QR Scanner Page - Hướng dẫn sử dụng

## Tổng quan

Trang QR Scanner cho phép người dùng quét QR code trên sách để nghe audio tương ứng. Khi quét QR code, hệ thống sẽ:

1. Tìm audio item tương ứng với QR token
2. Lấy thông tin sách của audio item đó
3. Hiển thị tất cả audio items của sách
4. Cho phép phát audio với player tích hợp

## Tính năng

### 🔍 QR Code Scanner
- Quét QR code từ camera thiết bị
- Hiển thị khung quét trực quan
- Tự động dừng khi phát hiện QR code
- Hỗ trợ nhiều định dạng QR code

### 🎵 Audio Player
- Phát audio với điều khiển play/pause
- Thanh tiến trình audio
- Chuyển audio trước/sau
- Hiển thị thời gian phát
- Tự động chuyển audio tiếp theo khi kết thúc

### 📚 Thông tin sách
- Hiển thị tên sách, tác giả, mô tả
- Số lượng audio có sẵn
- Audio được quét và số lần phát

### 📱 Responsive Design
- Giao diện thân thiện trên mobile
- Tối ưu cho cả desktop và mobile
- Animation mượt mà

## Cách sử dụng

### 1. Truy cập trang
- Nhấp vào menu "Quét QR" trong header
- Hoặc truy cập trực tiếp: `http://localhost:3000/qr-scanner`

### 2. Quét QR Code
1. Nhấn nút "Bắt đầu quét"
2. Cho phép truy cập camera khi được yêu cầu
3. Hướng camera vào QR code trên sách
4. Hệ thống sẽ tự động phát hiện và tải dữ liệu

### 3. Nghe Audio
1. Sau khi quét thành công, thông tin sách sẽ hiển thị
2. Sử dụng nút ▶️ để phát audio
3. Dùng nút ⏮️/⏭️ để chuyển audio
4. Click vào audio item trong danh sách để chuyển nhanh

## API Integration

Trang sử dụng API endpoint:
```
GET http://localhost:3001/api/books/qr/:qrToken
```

### Request
- `qrToken`: Token từ QR code được quét

### Response
```json
{
  "success": true,
  "data": {
    "book": {
      "_id": "book_id",
      "title": "Tên sách",
      "authors": ["Tác giả"],
      "description": "Mô tả sách"
    },
    "audioItems": [
      {
        "_id": "audio_id",
        "book": "book_id",
        "term": "Từ vựng",
        "audioUrl": "URL audio",
        "qrToken": "QR_TOKEN",
        "playCount": 5
      }
    ],
    "totalAudioCount": 10,
    "scannedAudio": {
      "term": "Từ vựng được quét",
      "audioUrl": "URL audio được quét",
      "playCount": 6
    }
  }
}
```

## Cấu trúc File

```
src/pages/
├── QRScannerPage.js      # Component chính
└── QRScannerPage.css     # Styles
```

## Dependencies

- `qr-scanner`: Thư viện quét QR code
- `react`: Framework React
- `react-router-dom`: Routing

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Lưu ý**: Cần HTTPS hoặc localhost để truy cập camera.

## Troubleshooting

### Lỗi camera không hoạt động
- Kiểm tra quyền truy cập camera
- Đảm bảo đang chạy trên HTTPS hoặc localhost
- Thử refresh trang

### Lỗi API connection
- Kiểm tra backend có đang chạy không (port 3001)
- Kiểm tra CORS configuration
- Kiểm tra QR token có hợp lệ không

### QR code không được nhận diện
- Đảm bảo QR code rõ nét
- Ánh sáng đủ sáng
- Giữ camera ổn định
- Thử điều chỉnh khoảng cách

## Future Enhancements

- [ ] Lưu lịch sử nghe audio
- [ ] Tải xuống audio offline
- [ ] Chia sẻ audio qua social media
- [ ] Bookmark audio yêu thích
- [ ] Tìm kiếm trong danh sách audio
- [ ] Phát tự động playlist
