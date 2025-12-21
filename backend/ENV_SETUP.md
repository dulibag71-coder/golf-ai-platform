# Backend Environment Configuration Template

## Required Configuration

Create a `.env` file in the `backend` directory with the following content:

```env
# Server
PORT=4000
NODE_ENV=development

# Database - PostgreSQL (Neon DB)
# Replace with your actual Neon DB connection string
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

# Authentication
JWT_SECRET=golfing_ai_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

# AWS S3 (Video Storage) - Optional, can be added later
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
AWS_BUCKET_NAME=golfing-videos

# OpenAI - Optional, can be added later
OPENAI_API_KEY=sk-your-openai-api-key
```

## Steps to Fix the Error

1. Copy the content above
2. Create a new file at `backend/.env`
3. Replace the `DATABASE_URL` with your actual Neon DB connection string
4. Save the file
5. Restart `npm run dev`

## Finding Your Neon DB Connection String

Log into your Neon console and copy the PostgreSQL connection string. It should look like:
```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```
