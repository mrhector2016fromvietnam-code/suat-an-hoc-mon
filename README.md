# Suất Ăn Hóc Môn Pro - Hệ Thống Tạo Báo Cáo Suất Ăn Chuyên Nghiệp

Hệ thống điều phối, quản lý thực đơn tuần và tự động tạo báo cáo suất ăn hàng ngày cho các nhà cung cấp suất ăn công nghiệp & trường học tại dự án Vinhomes Hóc Môn.

## 🌟 Tính Năng Nổi Bật

1. **Tạo Báo Cáo Suất Ăn Siêu Nhanh:**
   - Hỗ trợ chọn **1 hoặc nhiều nhà cung cấp** cùng lúc.
   - Bảng nhập số lượng suất ăn ca linh hoạt theo các tổ đội: **TĐ 8**, **TĐ 11.1**, **TĐ 11.3** và tự động tính tổng.
   - Định dạng văn bản báo cáo chuẩn hóa, sao chép 1 chạm gửi qua Zalo, Telegram, Tin nhắn.
   - Nút sao chép riêng từng nhà cung cấp hoặc sao chép gộp toàn bộ.

2. **Quản Lý Thực Đơn Tuần (7 Nhà Cung Cấp):**
   - Đọc chính xác thực đơn của 7 nhà cung cấp: **Tám Phương, Lim Dương, Minh Long Food, Nguyên Sài Gòn, Hương Ngọc Phát, Thiên Hồng Phúc, Vina Story**.
   - Bảng ma trận 7 ngày x 3 ca ăn (Sáng, Trưa, Tối), phân tách chi tiết món mặn, món chay, tráng miệng.
   - Chế độ so sánh thực đơn các NCC trong ngày.
   - Chỉnh sửa món trực tiếp và lưu tự động vào bộ nhớ trình duyệt (`localStorage`).

3. **Gọn nhẹ & Hoạt động tức thì:**
   - Không cần cài đặt database phức tạp.
   - Chạy mượt mà, lưu trữ dữ liệu an toàn trên trình duyệt.

## 🚀 Hướng Dẫn Cài Đặt & Chạy Trên Máy Cục Bộ

### 1. Yêu cầu hệ thống
- Node.js version 18 trở lên.
- Quản lý gói: `npm` hoặc `bun` hoặc `yarn`.

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Khởi động môi trường phát triển (Dev Server)
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 4. Build sản phẩm (Production)
```bash
npm run build
```

## 🛠 Công Nghệ Sử Dụng
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React Icons.
- **Bundler:** Vite 8.
- **Fullstack Engine:** Express & TSX.
