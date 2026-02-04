import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { students, type StudentRecord } from './model.js';
import type { Student } from '@academic/common';

const connectionString = process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/academic_db';
const client = postgres(connectionString);
export const db = drizzle(client);

export class StudentService {
  async list(): Promise<Student[]> {
    // For now, return mock data since DB might not be ready
    // In production, this would be: await db.select().from(students);
    const mockStudents: Student[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@academic.local',
        dateOfBirth: '2005-05-15T00:00:00.000Z',
        enrollmentDate: '2020-09-01T00:00:00.000Z',
        grade: 11,
        status: 'active',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@academic.local',
        dateOfBirth: '2006-03-22T00:00:00.000Z',
        enrollmentDate: '2021-09-01T00:00:00.000Z',
        grade: 10,
        status: 'active',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@academic.local',
        dateOfBirth: '2004-11-08T00:00:00.000Z',
        enrollmentDate: '2019-09-01T00:00:00.000Z',
        grade: 12,
        status: 'active',
      },
    ];
    return mockStudents;
  }
}

export const studentService = new StudentService();
