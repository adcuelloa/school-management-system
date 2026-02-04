import { z } from 'zod';

// Student schema
export const studentSchema = z.object({
  id: z.number().int(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  dateOfBirth: z.coerce.date(),
  enrollmentDate: z.coerce.date(),
  grade: z.number().int().min(1).max(12),
  status: z.enum(['active', 'inactive', 'graduated']),
});

export type Student = z.infer<typeof studentSchema>;

// Export all schemas
export const schemas = {
  student: studentSchema,
};
