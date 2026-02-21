import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { type FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rolesApi, usuariosApi } from "@/lib/api";

import type { CreateUsuario } from "@academic/common";

export default function UsuariosPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ["usuarios"],
    queryFn: usuariosApi.list,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: rolesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: usuariosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateUsuario = {
      username: fd.get("username") as string,
      password: fd.get("password") as string,
      nombres: fd.get("nombres") as string,
      apellidos: fd.get("apellidos") as string,
      idRol: Number(fd.get("idRol")),
    };
    createMutation.mutate(data);
  };

  const filtered = usuarios.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.nombres.toLowerCase().includes(search.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(search.toLowerCase()),
  );

  const getRolNombre = (idRol: number) => {
    const rol = roles.find((r) => r.id === idRol);
    return rol?.nombre ?? "—";
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Crear y administrar usuarios del sistema con sus roles.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres *</Label>
                  <Input name="nombres" required />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos *</Label>
                  <Input name="apellidos" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Usuario *</Label>
                  <Input name="username" required />
                </div>
                <div className="space-y-2">
                  <Label>Contraseña *</Label>
                  <Input name="password" type="password" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rol *</Label>
                <select
                  name="idRol"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Usuario"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="relative flex-1 min-w-75">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Buscar por nombre o usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Usuario</th>
                <th className="px-4 py-4">Nombres</th>
                <th className="px-4 py-4">Apellidos</th>
                <th className="px-4 py-4">Rol</th>
                <th className="px-4 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{u.id}</td>
                    <td className="px-4 py-3 font-medium">{u.username}</td>
                    <td className="px-4 py-3">{u.nombres}</td>
                    <td className="px-4 py-3">{u.apellidos}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{getRolNombre(u.idRol)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.estado ? "default" : "secondary"}>
                        {u.estado ? "Activo" : "Inactivo"}
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
  );
}
