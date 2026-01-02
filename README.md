# Environment Configuration

This project uses environment variables for sensitive configuration.

## Setup

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   ```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: PostgreSQL connection string (required)

## Security

⚠️ **IMPORTANT**: Never commit `.env` file to version control!

The `.env` file is already added to `.gitignore` to prevent accidental commits.
