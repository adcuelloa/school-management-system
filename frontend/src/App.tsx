import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Student } from '@academic/common';

// API client
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Academic Management System</h1>
        <StudentDashboard />
      </div>
    </QueryClientProvider>
  );
}

function StudentDashboard() {
  // Using axios to fetch students
  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api.get<Student[]>('/students');
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div>Error loading students: {error.message}</div>;
  }

  if (!students || students.length === 0) {
    return <div>No students found</div>;
  }

  // Prepare chart data - count students by grade
  const gradeData = students.reduce(
    (acc, student) => {
      const existing = acc.find((item) => item.grade === student.grade);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ grade: student.grade, count: 1 });
      }
      return acc;
    },
    [] as { grade: number; count: number }[]
  );

  gradeData.sort((a, b) => a.grade - b.grade);

  return (
    <div>
      <h2>Student Overview</h2>

      <div style={{ marginBottom: '40px' }}>
        <h3>Student List ({students.length} students)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                Email
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                Grade
              </th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: Student) => (
              <tr key={student.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {student.firstName} {student.lastName}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{student.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{student.grade}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: student.status === 'active' ? '#e8f5e9' : '#fff3e0',
                      color: student.status === 'active' ? '#2e7d32' : '#e65100',
                    }}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3>Students by Grade Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="grade"
              label={{ value: 'Grade', position: 'insideBottom', offset: -5 }}
            />
            <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Students" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
