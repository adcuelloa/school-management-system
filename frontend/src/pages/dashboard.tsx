import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  ClipboardList,
  FileText,
  GraduationCap,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { docentesApi, estudiantesApi, matriculasApi } from "@/lib/api";

export default function DashboardPage() {
  const { data: estudiantes = [] } = useQuery({
    queryKey: ["estudiantes"],
    queryFn: estudiantesApi.list,
  });
  const { data: docentes = [] } = useQuery({
    queryKey: ["docentes"],
    queryFn: docentesApi.list,
  });
  const { data: matriculas = [] } = useQuery({
    queryKey: ["matriculas"],
    queryFn: matriculasApi.list,
  });

  const stats = [
    {
      title: "Total Estudiantes",
      value: estudiantes.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Docentes",
      value: docentes.length,
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Matrículas Activas",
      value: matriculas.length,
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="tracking-tight text-3xl font-bold">Visión General</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido de nuevo, esto es lo que está pasando hoy.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
                <p className="tracking-tight text-3xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="size-4 text-green-600" />
                  <p className="text-green-600 text-xs font-medium">Datos en tiempo real</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="tracking-tight text-xl font-bold mb-5">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/estudiantes/crear"
            className="group flex flex-col items-start gap-4 p-6 rounded-xl bg-card border hover:border-primary transition-all shadow-sm hover:shadow-md text-left"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <UserPlus className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Registrar Estudiante</h3>
              <p className="text-muted-foreground text-sm">
                Agregar un nuevo perfil de estudiante a la base de datos.
              </p>
            </div>
          </Link>
          <Link
            to="/calificaciones"
            className="group flex flex-col items-start gap-4 p-6 rounded-xl bg-card border hover:border-primary transition-all shadow-sm hover:shadow-md text-left"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <ClipboardList className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Calificaciones</h3>
              <p className="text-muted-foreground text-sm">
                Configurar un nuevo examen o periodo de calificación.
              </p>
            </div>
          </Link>
          <Link
            to="/matriculas"
            className="group flex flex-col items-start gap-4 p-6 rounded-xl bg-card border hover:border-primary transition-all shadow-sm hover:shadow-md text-left"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <BarChart3 className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Gestionar Matrículas</h3>
              <p className="text-muted-foreground text-sm">
                Administrar matrículas del año lectivo actual.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent enrollments */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="tracking-tight text-xl font-bold">Matrículas Recientes</h2>
          <Link to="/matriculas" className="text-primary text-sm font-semibold hover:underline">
            Ver Todo
          </Link>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Estudiante</th>
                  <th className="px-6 py-4 font-semibold">Grupo</th>
                  <th className="px-6 py-4 font-semibold">Periodo</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {matriculas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No hay matrículas registradas aún.
                    </td>
                  </tr>
                ) : (
                  matriculas.slice(0, 5).map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{m.idEstudiante}</td>
                      <td className="px-6 py-4">{m.idGrupo}</td>
                      <td className="px-6 py-4">{m.periodo}</td>
                      <td className="px-6 py-4">
                        <Badge variant={m.estado ? "default" : "secondary"}>
                          {m.estado ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
