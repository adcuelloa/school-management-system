import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Link2,
  LogOut,
  Map,
  Shapes,
  Shield,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

/** Links visibles para TODOS los roles autenticados */
const commonLinks = [
  { to: "/dashboard", label: "Panel Principal", icon: LayoutDashboard },
];

/** Links que solo ve el Admin */
const adminLinks = [
  { to: "/estudiantes", label: "Estudiantes", icon: Users },
  { to: "/docentes", label: "Docentes", icon: GraduationCap },
  { to: "/acudientes", label: "Acudientes", icon: UserCheck },
  { to: "/asignaturas", label: "Asignaturas", icon: BookOpen },
  { to: "/matriculas", label: "Matrículas", icon: FileText },
  { to: "/grados", label: "Grados", icon: Layers },
  { to: "/grupos", label: "Grupos", icon: Shapes },
  { to: "/areas", label: "Áreas", icon: Map },
  { to: "/grado-asignaturas", label: "Grado–Asignatura", icon: Link2 },
  { to: "/evaluaciones", label: "Evaluaciones", icon: ClipboardList },
  { to: "/calificaciones", label: "Calificaciones", icon: BarChart3 },
];

/** Links de administración del sistema (solo Admin) */
const systemLinks = [
  { to: "/usuarios", label: "Usuarios", icon: UserCog },
  { to: "/roles", label: "Roles", icon: Shield },
];

/** Links que ve el Docente */
const docenteLinks = [
  { to: "/asignaturas", label: "Mis Asignaturas", icon: BookOpen },
  { to: "/evaluaciones", label: "Evaluaciones", icon: ClipboardList },
  { to: "/calificaciones", label: "Calificaciones", icon: BarChart3 },
  { to: "/estudiantes", label: "Estudiantes", icon: Users },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const rolName = user?.rol?.nombre?.toLowerCase() ?? "";
  const isAdmin = rolName === "admin";
  const isDocente = rolName === "docente";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderLinks = (links: typeof commonLinks) =>
    links.map((link) => {
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
              : "text-muted-foreground hover:bg-accent hover:translate-x-1 hover:text-foreground",
          )}
        >
          <Icon className="size-5" />
          {link.label}
        </Link>
      );
    });

  return (
    <aside className="w-64 border-r bg-card flex-none hidden md:flex flex-col justify-between py-6">
      <div className="flex flex-col gap-1 px-4 overflow-y-auto">
        {/* Común */}
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menú Principal
          </p>
        </div>
        {renderLinks(commonLinks)}

        {/* Admin: gestión académica */}
        {isAdmin && (
          <>
            <div className="my-4 border-t" />
            <div className="px-2 mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Gestión Académica
              </p>
            </div>
            {renderLinks(adminLinks)}

            <div className="my-4 border-t" />
            <div className="px-2 mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administración
              </p>
            </div>
            {renderLinks(systemLinks)}
          </>
        )}

        {/* Docente: solo sus secciones */}
        {isDocente && (
          <>
            <div className="my-4 border-t" />
            <div className="px-2 mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Académico
              </p>
            </div>
            {renderLinks(docenteLinks)}
          </>
        )}
      </div>

      <div className="px-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-accent border hover:border-destructive hover:text-destructive transition-colors group cursor-pointer"
        >
          <LogOut className="size-5 text-muted-foreground group-hover:text-destructive" />
          <span className="text-sm font-medium group-hover:text-destructive">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
