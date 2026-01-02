# Self-Healing Query System

Agent có khả năng tự động phát hiện và sửa lỗi SQL khi schema thay đổi.

## Cách hoạt động

### 1. Query thông thường (Success)

```
User: "Liệt kê các chuyến xe có giá vé cơ bản cao hơn 200.000"

Agent tạo SQL: SELECT * FROM routes WHERE base_price > 200000
✅ Query thành công
💬 Có 2 tuyến đường có giá vé trên 200,000 VNĐ...
```

### 2. Self-Healing khi schema thay đổi

**Scenario:** Admin đổi tên cột `base_price` → `ticket_cost`

```
User: "Liệt kê các chuyến xe có giá vé cơ bản cao hơn 200.000"

🔴 SQL Error: no such column: base_price

🔧 Đang tự động sửa lỗi...
📋 Fetching actual database schema...
🤖 Agent phát hiện cột mới: ticket_cost
🔄 Fixed SQL: SELECT * FROM routes WHERE ticket_cost > 200000

✅ Đã tự động sửa lỗi thành công!
💬 Có 2 tuyến đường có giá vé trên 200,000 VNĐ...
```

## Flow tự động sửa lỗi

```
┌─────────────────┐
│  User Question  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate SQL    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Execute SQL    │
└────────┬────────┘
         │
    ❌ ERROR?
         │
         ├─ NO ──────────► Success ✅
         │
         └─ YES
              │
              ▼
       ┌─────────────────┐
       │  Get Schema     │
       │  from Database  │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  AI Fix SQL     │
       │  Based on       │
       │  Actual Schema  │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │  Retry Query    │
       └────────┬────────┘
                │
                ▼
           Success ✅
```

## Các lỗi được xử lý

### ✅ Column name changed

```
Error: no such column: base_price
Fix: Tìm column tương tự trong schema → ticket_cost
```

### ✅ Table name changed

```
Error: no such table: trips
Fix: Tìm table tương tự → journeys
```

### ✅ Column renamed

```
Error: column "departure_time" does not exist
Fix: Tìm column thời gian → start_time
```

## Debug Mode

### Production (Clean Output)

```
> Liệt kê các chuyến xe có giá vé cơ bản cao hơn 200.000

🔧 Đang tự động sửa lỗi...
✅ Đã tự động sửa lỗi thành công!

💬 Có 2 tuyến đường có giá vé trên 200,000 VNĐ: Hồ Chí Minh - Đà Lạt và Hồ Chí Minh - Nha Trang.
```

### Debug Mode (Detailed)

```
> Liệt kê các chuyến xe có giá vé cơ bản cao hơn 200.000

🧠 SQL: SELECT * FROM routes WHERE base_price > 200000

⚠️ SQL Error: no such column: base_price

🔧 Đang tự động sửa lỗi...

📋 Schema:
Table: routes
  - route_id (INTEGER)
  - origin (TEXT)
  - destination (TEXT)
  - ticket_cost (REAL)

Table: trips
  - trip_id (INTEGER)
  - route_id (INTEGER)
  - departure_time (TEXT)
  - available_seats (INTEGER)
  - status (TEXT)

🔄 Fixed SQL: SELECT * FROM routes WHERE ticket_cost > 200000

✅ Đã tự động sửa lỗi thành công!
```

## Implementation

### 1. Schema Inspector

[agent/schemaInspector.js](../agent/schemaInspector.js) - Fetch schema từ database

### 2. SQL Regenerator

[agent/sqlGenerator.js](../agent/sqlGenerator.js) - AI sửa SQL based on schema

### 3. Retry Logic

[index.js](../index.js) - Try-catch với automatic recovery

## Lợi ích

✅ **Zero Downtime** - Không cần update code khi schema thay đổi
✅ **User-Friendly** - User không biết có lỗi, vẫn nhận được kết quả
✅ **Developer-Friendly** - Tự động adapt với schema mới
✅ **Production Ready** - Handle gracefully, không crash

## Limitations

⚠️ Chỉ fix được lỗi về schema (column/table names)
⚠️ Không fix được logic errors
⚠️ Cần OpenAI API call thêm (cost)
⚠️ Retry 1 lần duy nhất

## Test Cases

### Test 1: Column renamed

```sql
-- Change schema
ALTER TABLE routes RENAME COLUMN base_price TO ticket_cost;

-- Ask agent
"Liệt kê các chuyến xe có giá vé cơ bản cao hơn 200.000"

-- Expected: ✅ Auto-fix và trả về kết quả đúng
```

### Test 2: Table renamed

```sql
ALTER TABLE trips RENAME TO journeys;

"Có bao nhiêu chuyến xe đang hoạt động?"

-- Expected: ✅ Auto-fix
```

### Test 3: Multiple changes

```sql
ALTER TABLE routes RENAME COLUMN base_price TO price;
ALTER TABLE trips RENAME COLUMN departure_time TO start_time;

"Tìm chuyến xe giá rẻ khởi hành sáng mai"

-- Expected: ✅ Auto-fix tất cả
```
