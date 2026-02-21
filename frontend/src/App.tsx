import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { MainLayout } from "@/components/main-layout";
import { AuthProvider, RequireAuth } from "@/lib/auth-context";
import AcudientesPage from "@/pages/acudientes";
import AreasPage from "@/pages/areas";
import AsignaturasPage from "@/pages/asignaturas";
import CalificacionesPage from "@/pages/calificaciones";
import DashboardPage from "@/pages/dashboard";
import DocentesPage from "@/pages/docentes";
import EstudiantesPage from "@/pages/estudiantes";
import EvaluacionesPage from "@/pages/evaluaciones";
import GradoAsignaturasPage from "@/pages/grado-asignaturas";
import GradosPage from "@/pages/grados";
import GruposPage from "@/pages/grupos";
import LoginPage from "@/pages/login";
import MatriculasPage from "@/pages/matriculas";
import RolesPage from "@/pages/roles";
import UsuariosPage from "@/pages/usuarios";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <MainLayout />
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/estudiantes" element={<EstudiantesPage />} />
              <Route path="/docentes" element={<DocentesPage />} />
              <Route path="/acudientes" element={<AcudientesPage />} />
              <Route path="/asignaturas" element={<AsignaturasPage />} />
              <Route path="/matriculas" element={<MatriculasPage />} />
              <Route path="/calificaciones" element={<CalificacionesPage />} />
              <Route path="/evaluaciones" element={<EvaluacionesPage />} />
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/grados" element={<GradosPage />} />
              <Route path="/grado-asignaturas" element={<GradoAsignaturasPage />} />
              <Route path="/grupos" element={<GruposPage />} />
              <Route path="/areas" element={<AreasPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
