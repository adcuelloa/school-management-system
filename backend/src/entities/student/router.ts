import { initTRPC } from '@trpc/server';
import { studentService } from './service.js';

const t = initTRPC.create();

export const studentRouter = t.router({
  list: t.procedure.query(async () => {
    const students = await studentService.list();
    return students;
  }),
});

export type StudentRouter = typeof studentRouter;
