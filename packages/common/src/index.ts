import { z } from 'zod';

// Student schema
export const studentSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  dateOfBirth: z.string().datetime(),
  enrollmentDate: z.string().datetime(),
  grade: z.number().int().min(1).max(12),
  status: z.enum(['active', 'inactive', 'graduated']),
});

export type Student = z.infer<typeof studentSchema>;

// Export all schemas
export const schemas = {
  student: studentSchema,
};
