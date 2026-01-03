# AI Database Query Agent

An intelligent conversational agent that understands natural language questions and translates them into SQL queries. Built with OpenAI GPT-4o-mini and supports multiple database types.

## ✨ Features

- 🤖 **Natural Language Understanding** - Ask questions in Vietnamese or English
- 🗄️ **Multi-Database Support** - PostgreSQL, MySQL, SQLite, MongoDB
- 🎯 **Intent Detection** - Automatically classifies questions (greetings, queries, help)
- 📊 **Smart Query Planning** - Converts intents to structured query plans
- 🔄 **SQL Generation** - Generates optimized SQL from query plans
- 💬 **Natural Responses** - Formats results in conversational Vietnamese
- 🔧 **Self-Healing** - Automatically fixes SQL when database schema changes
- 🐛 **Debug Mode** - Toggle technical details for development/production

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- One of: PostgreSQL, MySQL, SQLite, or MongoDB
- OpenAI API key

### Installation

1. Clone and install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials:

   ```env
   OPENAI_API_KEY=sk-your-key-here
   DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
   ```

4. Run the agent:
   ```bash
   node index.js
   ```

## ⚙️ Configuration

### Environment Variables

| Variable         | Description                         | Required |
| ---------------- | ----------------------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key                 | ✅       |
| `DATABASE_URL`   | Database connection string          | ✅       |
| `DEBUG`          | Show technical details (true/false) | ❌       |

### Database Connection Strings

**PostgreSQL:**

```
postgresql://username:password@hostname:5432/database_name
```

**MySQL:**

```
mysql://username:password@hostname:3306/database_name
```

**MongoDB:**

```
mongodb://username:password@hostname:27017/database_name
```

**SQLite:**

```
/path/to/database.db
```

## 📖 Usage Examples

**Production Mode (Clean, User-Friendly):**

```
> Chào bạn
💬 Xin chào! Tôi có thể giúp bạn tra cứu thông tin về chuyến xe. Hãy hỏi tôi nhé!

> Tôi muốn đi Nha Trang từ Hồ Chí Minh vào ngày 25/12
💬 Rất tiếc, chuyến đi Nha Trang từ Hồ Chí Minh vào ngày 25/12 đã bị hủy.
   Bạn có thể chọn ngày khác hoặc liên hệ hotline để được hỗ trợ.

> Tổng số ghế trống đi Đà Lạt
💬 Hiện có tổng cộng 17 ghế trống trên các chuyến đi Đà Lạt.

> Liệt kê các chuyến xe có giá vé cao hơn 200.000
🔧 Đang tự động sửa lỗi...
✅ Đã tự động sửa lỗi thành công!
💬 Có 2 tuyến đường: Hồ Chí Minh - Đà Lạt (300,000 VNĐ) và
   Hồ Chí Minh - Nha Trang (250,000 VNĐ).
```

**Debug Mode (Show Technical Details):**

```bash
# Enable debug mode
DEBUG=true node index.js
```

```
> Tôi muốn đi Nha Trang từ Hồ Chí Minh vào ngày 25/12
🧠 Intent: { intent: 'AVAILABILITY', origin: 'Hồ Chí Minh', destination: 'Nha Trang', date: '2023-12-25' }
🗺️ Plan: { from: 'trips', join: {...}, select: [...] }
🧠 SQL: SELECT trips.trip_id, routes.origin, ... WHERE ...
┌─────────┬─────────┬──────────────┬───────────────┬─────────────────┐
│ (index) │ trip_id │    origin    │  destination  │     status      │
├─────────┼─────────┼──────────────┼───────────────┼─────────────────┤
│    0    │   104   │ 'Hồ Chí Minh'│ 'Nha Trang'   │   'cancelled'   │
└─────────┴─────────┴──────────────┴───────────────┴─────────────────┘
💬 Rất tiếc, chuyến đi Nha Trang từ Hồ Chí Minh vào ngày 25/12 đã bị hủy...
```

## 🏗️ Project Structure

```
├── index.js                 # Main entry point
├── config/
│   └── env.js              # Environment configuration
├── db/
│   ├── base.js             # Database adapter interface
│   ├── factory.js          # Database factory with auto-detection
│   ├── pg.js               # PostgreSQL adapter
│   ├── mysql.js            # MySQL adapter
│   ├── mongodb.js          # MongoDB adapter
│   └── sqlite.js           # SQLite adapter
├── agent/
│   ├── intentParser.js     # Intent detection & classification
│   ├── planner.js          # Query planning logic
│   ├── sqlGenerator.js     # SQL generation & auto-fix
│   ├── responseFormatter.js # Natural language response
│   └── schemaInspector.js  # Database schema introspection
├── utils/
│   └── cli.js              # CLI utilities
└── docs/
    ├── DATABASE.md         # Database configuration guide
    ├── DEBUG.md            # Debug mode documentation
    └── SELF_HEALING.md     # Self-healing system guide
```

## 🔄 How It Works

1. **Question Classification** - Determines if input is a greeting, help request, or query
2. **Intent Detection** - Extracts structured intent (PRICING, AVAILABILITY, ANALYTICS)
3. **Query Planning** - Converts intent to abstract query plan
4. **SQL Generation** - Renders query plan to SQL
5. **Execution** - Runs query against database
6. **Self-Healing** - If error occurs, fetch schema and auto-fix SQL
7. **Response Formatting** - Converts results to natural language

### Self-Healing System

When database schema changes (e.g., column renamed), agent automatically:

1. Detects SQL error
2. Fetches current database schema
3. Uses AI to fix SQL based on actual schema
4. Retries with corrected query
5. Returns result seamlessly

**Example:**

```
Admin changes: base_price → ticket_cost

User: "Liệt kê các chuyến xe có giá vé cao hơn 200.000"

Agent:
  - Try: SELECT * FROM routes WHERE base_price > 200000
  - Error: ❌ no such column: base_price
  - Fetch schema → finds ticket_cost
  - Retry: SELECT * FROM routes WHERE ticket_cost > 200000
  - Success: ✅ Returns correct results

User sees:
  🔧 Đang tự động sửa lỗi...
  ✅ Đã tự động sửa lỗi thành công!
  💬 Có 2 tuyến đường...
```

## 🎯 Supported Query Types

### AVAILABILITY

Find available trips with filters:

- Origin/destination
- Date or date range
- Status (active/cancelled)

### PRICING

Get route pricing information:

- LLM-powered intent detection
- Multi-database abstraction patterns
- Natural language to SQL translation
- Conversational AI architectures
- Self-healing query systems
- Production-ready error handlingtion
- Conversational AI architectures

## 📝 License

MIT

## 🔗 Related Technologies

- **OpenAI GPT-4o-mini** - Intent detection & response formatting
- **PostgreSQL / MySQL / SQLite** - SQL databases
- **MongoDB** - NoSQL database (limited support)
- **Node.js** - Runtime environment

## DEMO:

https://jam.dev/c/185ad093-130f-4c8a-947b-7b4cdbeb7fb3
