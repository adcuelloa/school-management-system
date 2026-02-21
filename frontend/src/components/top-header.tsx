import { Bell } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

export function TopHeader() {
  const { user } = useAuth();

  const initials = user
    ? `${user.nombres.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase()
    : "??";

  return (
    <header className="flex-none z-50 w-full bg-card border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                fill="currentColor"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight hidden sm:block">
            Colegio Juan de Jesús Narváez
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-muted-foreground hover:text-primary transition-colors relative">
            <Bell className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 size-2 bg-destructive rounded-full" />
          </button>
          <div className="flex items-center gap-3 pl-6 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user ? `${user.nombres} ${user.apellidos}` : "—"}</p>
              <p className="text-xs text-muted-foreground">{user?.rol?.nombre ?? "Sin rol"}</p>
            </div>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border-2 border-background shadow-sm">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
