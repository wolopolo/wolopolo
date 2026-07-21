# Bí quyết tối ưu hóa tốc độ tải trang Web tĩnh

Tốc độ tải trang đóng vai trò sống còn đối với một ứng dụng web. Theo các nghiên cứu của Google, nếu trang web mất quá 3 giây để tải, hơn 53% người dùng di động sẽ rời bỏ trang đó. Đối với các website tĩnh chạy trên GitHub Pages, việc tối ưu hiệu năng lại càng đơn giản nhưng mang lại hiệu quả cực kỳ bất ngờ.

Dưới đây là 5 phương pháp tối ưu hóa hiệu quả nhất mà tôi đã áp dụng trực tiếp cho chính website này.

---

## 1. Tối ưu hóa dung lượng hình ảnh

Hình ảnh thường chiếm đến 70-80% tổng dung lượng tải xuống của trang web.
* **Sử dụng định dạng hiện đại**: Thay thế PNG/JPG bằng `WebP` hoặc `AVIF`. Chúng giúp giảm 30-50% dung lượng mà không làm giảm chất lượng hiển thị.
* **Lazy Loading**: Luôn thêm thuộc tính `loading="lazy"` cho các thẻ `<img>` không nằm trong màn hình đầu tiên (below the fold) để hoãn tải ảnh cho đến khi người dùng cuộn tới.

```html
<img src="assets/project-large.webp" alt="Dự án" loading="lazy">
```

## 2. Nén và gộp các tệp CSS/JS

Mỗi tệp CSS và JS riêng lẻ được tải sẽ tạo ra một yêu cầu HTTP. 
* Sử dụng các công cụ nén (minify) để loại bỏ khoảng trắng, xuống dòng và các chú thích không cần thiết.
* Tránh cài đặt các thư viện quá lớn nếu chỉ dùng một vài tính năng nhỏ. Ví dụ: Thay vì nhúng cả thư viện jQuery, hãy viết bằng Vanilla JS.

## 3. Sử dụng Font chữ web tối ưu

Font chữ từ bên thứ ba (như Google Fonts) có thể gây ra hiện tượng giật font (FOUT - Flash of Unstyled Text).
* Sử dụng thuộc tính `font-display: swap` trong directive `@font-face` để hiển thị font hệ thống trước khi font tùy chỉnh được tải về hoàn tất.
* Chỉ tải các weight font thực sự sử dụng (ví dụ: 400, 500, 700) thay vì tải toàn bộ.

## 4. Tận dụng mạng phân phối nội dung (CDN)

Đối với các thư viện JS bên ngoài (như marked.js, chart.js, v.v.), việc tải từ CDN uy tín (như cdnjs, jsDelivr) sẽ nhanh hơn tự lưu trữ vì:
1. Máy chủ CDN được tối ưu hóa phân phối địa lý tốt hơn.
2. Trình duyệt của người dùng có thể đã cache sẵn các thư viện này từ trước đó khi họ truy cập các website khác.

## 5. Thiết lập Cache-Control thích hợp

Mặc dù GitHub Pages tự động xử lý cache khá tốt, nhưng việc hiểu rõ cơ chế cache của trình duyệt sẽ giúp bạn thiết kế web tĩnh thông minh hơn. Đối với các tài nguyên ít thay đổi (như logo, icon, ảnh nền), hãy đặt thời gian lưu cache dài hạn.

---

## Kết luận

Chỉ với vài bước tối ưu hóa đơn giản trên, trang web cá nhân của bạn hoàn toàn có thể đạt điểm số **95 - 100** trên công cụ đo lường hiệu năng Google Lighthouse. Một trang web mượt mà sẽ là điểm cộng rất lớn trong mắt nhà tuyển dụng!
