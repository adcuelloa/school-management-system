import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router";

import { cn } from "@/lib/utils";

const mainLinks = [
  { to: "/dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { to: "/estudiantes", label: "Estudiantes", icon: Users },
  { to: "/docentes", label: "Docentes", icon: GraduationCap },
  { to: "/acudientes", label: "Acudientes", icon: UserCheck },
  { to: "/asignaturas", label: "Asignaturas", icon: BookOpen },
  { to: "/matriculas", label: "Matrículas", icon: FileText },
  { to: "/calificaciones", label: "Calificaciones", icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside className="w-64 border-r bg-card flex-none hidden md:flex flex-col justify-between py-6">
      <div className="flex flex-col gap-1 px-4">
        <div className="mb-6 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menú Principal
          </p>
        </div>
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                active
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:translate-x-1 hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {link.label}
            </Link>
          );
        })}

        <div className="my-4 border-t" />
        <div className="px-2 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sistema
          </p>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent transition-all hover:translate-x-1 text-left text-sm font-medium">
          <Settings className="size-5" />
          Configuración
        </button>
      </div>

      <div className="px-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 rounded-lg bg-accent border hover:border-destructive hover:text-destructive transition-colors group"
        >
          <LogOut className="size-5 text-muted-foreground group-hover:text-destructive" />
          <span className="text-sm font-medium group-hover:text-destructive">Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}
