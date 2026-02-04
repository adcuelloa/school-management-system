import express from 'express';
import { studentRouter } from './entities/student/router.js';

const router = express.Router();

// Mount student routes
router.use('/students', studentRouter);

export { router as appRouter };
