import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '../../infra/.env.example' });

export default defineConfig({
  schema: './src/entities/*/model.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/academic_db',
  },
  verbose: true,
  strict: true,
});
