import { useState } from "react";
import { useNavigate } from "react-router";

import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

import type { FormEvent } from "react";


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await authApi.login(username, password);
      login(user);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const resp = err as { response?: { data?: { error?: string } } };
        setError(resp.response?.data?.error ?? "Error de autenticación");
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-50" />

      <div className="w-full max-w-120 overflow-hidden rounded-xl bg-card shadow-xl ring-1 ring-border">
        {/* Hero banner */}
        <div className="relative h-32 w-full overflow-hidden bg-linear-to-r from-primary to-primary/80">
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 flex items-center gap-3 text-white">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <svg className="size-6 text-white" fill="none" viewBox="0 0 48 48">
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
          </div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Colegio Juan de Jesús Narváez
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Por favor, inicia sesión para acceder a tu panel.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Usuario</span>
              <input
                className="flex h-12 w-full rounded-lg border bg-muted/30 px-4 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ingresa tu usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Contraseña</span>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="flex h-12 w-full rounded-lg border bg-muted/30 px-4 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 flex h-full w-12 items-center justify-center text-muted-foreground hover:text-primary cursor-pointer"
                  type="button"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <button
              className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              ¿Tienes problemas para iniciar sesión?
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        © 2025 Colegio Juan de Jesús Narváez. Todos los derechos reservados.
      </p>
    </div>
  );
}
