import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { MainLayout } from "@/components/main-layout";
import AcudientesPage from "@/pages/acudientes";
import AsignaturasPage from "@/pages/asignaturas";
import CalificacionesPage from "@/pages/calificaciones";
import DashboardPage from "@/pages/dashboard";
import DocentesPage from "@/pages/docentes";
import EstudiantesPage from "@/pages/estudiantes";
import LoginPage from "@/pages/login";
import MatriculasPage from "@/pages/matriculas";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/estudiantes" element={<EstudiantesPage />} />
            <Route path="/docentes" element={<DocentesPage />} />
            <Route path="/acudientes" element={<AcudientesPage />} />
            <Route path="/asignaturas" element={<AsignaturasPage />} />
            <Route path="/matriculas" element={<MatriculasPage />} />
            <Route path="/calificaciones" element={<CalificacionesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
