import { initTRPC } from '@trpc/server';
import { studentRouter } from './entities/student/router.js';

const t = initTRPC.create();

export const appRouter = t.router({
  students: studentRouter,
});

export type AppRouter = typeof appRouter;
