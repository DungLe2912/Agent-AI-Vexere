# Production vs Debug Mode

## Production Mode (Default)

Agent chỉ hiển thị thông tin hữu ích cho người dùng:

```
> Tôi muốn đi Nha Trang từ HCM vào ngày 25/12

💬 Rất tiếc, chuyến đi Nha Trang từ HCM vào ngày 25/12 đã bị hủy.
Bạn có thể chọn ngày khác hoặc liên hệ hotline để được hỗ trợ.
```

**Ưu điểm:**

- ✅ Chuyên nghiệp, không lộ thông tin kỹ thuật
- ✅ Tập trung vào trải nghiệm người dùng
- ✅ Bảo mật thông tin hệ thống
- ✅ Giao diện sạch sẽ, dễ đọc

## Debug Mode

Hiển thị đầy đủ thông tin kỹ thuật cho developer:

```
> Tôi muốn đi Nha Trang từ HCM vào ngày 25/12

🧠 Intent: { intent: 'AVAILABILITY', origin: 'HCM', destination: 'Nha Trang', date: '2023-12-25' }
🗺️ Plan: { from: 'trips', join: {...}, select: [...], where: {...} }
🧠 SQL: SELECT trips.trip_id, routes.origin, routes.destination, trips.departure_time, trips.status, trips.available_seats FROM trips JOIN routes ON trips.route_id = routes.route_id WHERE (routes.origin ILIKE 'HCM' AND routes.destination ILIKE 'Nha Trang' AND DATE(trips.departure_time) = '2023-12-25');
┌─────────┬─────────┬──────────────┬───────────────┬──────────────────────┬───────────┬──────────────────┐
│ (index) │ trip_id │    origin    │  destination  │   departure_time     │  status   │ available_seats  │
├─────────┼─────────┼──────────────┼───────────────┼──────────────────────┼───────────┼──────────────────┤
│    0    │   104   │ 'Hồ Chí Minh'│ 'Nha Trang'  │ '2023-12-25 09:00'   │'cancelled'│        20        │
└─────────┴─────────┴──────────────┴───────────────┴──────────────────────┴───────────┴──────────────────┘

💬 Rất tiếc, chuyến đi Nha Trang từ HCM vào ngày 25/12 đã bị hủy...
```

**Sử dụng khi:**

- 🔧 Development và testing
- 🐛 Debug query logic
- 📊 Kiểm tra SQL generation
- 🎯 Verify intent detection

## Cách bật Debug Mode

Trong file `.env`:

```env
# Production (mặc định)
DEBUG=false

# hoặc không cần khai báo gì

# Development
DEBUG=true
```

Hoặc chạy trực tiếp:

```bash
DEBUG=true node index.js
```

## Best Practices

### ✅ Production

- Luôn set `DEBUG=false` hoặc bỏ qua biến này
- Không log sensitive data
- Tập trung vào UX
- Ẩn technical details

### 🔧 Development

- Bật `DEBUG=true` khi cần debug
- Kiểm tra Intent detection accuracy
- Verify SQL generation
- Analyze query plans

### 🚫 Never Do

- Deploy production với `DEBUG=true`
- Log database credentials
- Expose internal errors cho user
- Show raw SQL trong production
