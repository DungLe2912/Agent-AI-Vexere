# AI Database Query Agent

An intelligent conversational agent that understands natural language questions and translates them into SQL queries. Built with OpenAI GPT-4o-mini and supports multiple database types.

## ✨ Features

- 🤖 **Natural Language Understanding** - Ask questions in Vietnamese or English
- 🗄️ **Multi-Database Support** - PostgreSQL, MySQL, SQLite, MongoDB
- 🎯 **Intent Detection** - Automatically classifies questions (greetings, queries, help)
- 📊 **Smart Query Planning** - Converts intents to structured query plans
- 🔄 **SQL Generation** - Generates optimized SQL from query plans
- 💬 **Natural Responses** - Formats results in conversational Vietnamese

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

| Variable         | Description                | Required |
| ---------------- | -------------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key        | ✅       |
| `DATABASE_URL`   | Database connection string | ✅       |

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

```
> Chào bạn
💬 Xin chào! Tôi có thể giúp bạn tra cứu thông tin về chuyến xe. Hãy hỏi tôi nhé!

> Tôi muốn đi Nha Trang từ HCM vào ngày 25/12
🧠 Intent: { intent: 'AVAILABILITY', origin: 'HCM', destination: 'Nha Trang', date: '2023-12-25' }
🗺️ Plan: { from: 'trips', join: {...}, select: [...] }
🧠 SQL: SELECT trips.trip_id, routes.origin, ... WHERE ...
💬 Có 3 chuyến xe khả dụng từ HCM đến Nha Trang vào ngày 25/12...

> Tổng số ghế trống đi Đà Lạt
💬 Hiện có tổng cộng 45 ghế trống trên các chuyến đi Đà Lạt.

> Giá vé từ Hà Nội đi Sapa
💬 Giá vé từ Hà Nội đi Sapa là 250,000 VNĐ.
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
│   ├── sqlGenerator.js     # SQL generation
│   └── responseFormatter.js # Natural language response
├── utils/
│   └── cli.js              # CLI utilities
└── docs/
    └── DATABASE.md         # Database configuration guide
```

## 🔄 How It Works

1. **Question Classification** - Determines if input is a greeting, help request, or query
2. **Intent Detection** - Extracts structured intent (PRICING, AVAILABILITY, ANALYTICS)
3. **Query Planning** - Converts intent to abstract query plan
4. **SQL Generation** - Renders query plan to SQL
5. **Execution** - Runs query against database
6. **Response Formatting** - Converts results to natural language

## 🎯 Supported Query Types

### AVAILABILITY

Find available trips with filters:

- Origin/destination
- Date or date range
- Status (active/cancelled)

### PRICING

Get route pricing information:

- Origin/destination
- Price filters (>, <, etc.)

### ANALYTICS

Aggregate statistics:

- Total seats (SUM)
- Trip counts (COUNT)
- Filtered by routes, dates, status

## 🛡️ Security

⚠️ **IMPORTANT**:

- Never commit `.env` file to version control
- Keep your OpenAI API key secure
- Use read-only database credentials when possible
- Validate all database connection strings

## 📚 Documentation

- [Database Configuration Guide](docs/DATABASE.md)
- [Multi-Database Support Details](docs/DATABASE.md)

## 🤝 Contributing

This is a demo/educational project showcasing:

- LLM-powered intent detection
- Multi-database abstraction patterns
- Natural language to SQL translation
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
