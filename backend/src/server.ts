import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { studentRouter } from './entities/student/router.js';

// Load environment variables
config();
const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/students', studentRouter);

export function startServer() {
  app.listen(PORT, () => {
    console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
  });
}
