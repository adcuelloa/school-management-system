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
import { gradosApi, gruposApi } from "@/lib/api";

import type { CreateGrupo } from "@academic/common";

export default function GruposPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: grupos = [], isLoading } = useQuery({
    queryKey: ["grupos"],
    queryFn: gruposApi.list,
  });

  const { data: grados = [] } = useQuery({
    queryKey: ["grados"],
    queryFn: gradosApi.list,
  });

  const createMutation = useMutation({
    mutationFn: gruposApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateGrupo = {
      idGrado: Number(fd.get("idGrado")),
      codigo: fd.get("codigo") as string,
      anioLectivo: fd.get("anioLectivo") as string,
    };
    createMutation.mutate(data);
  };

  const getGradoNombre = (idGrado: number) => {
    const grado = grados.find((g) => g.id === idGrado);
    return grado ? `${grado.nombre} (${grado.nivel})` : "—";
  };

  const filtered = grupos.filter((g) =>
    g.codigo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Grupos</h1>
          <p className="text-muted-foreground">Administrar los grupos por grado y año lectivo.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Crear Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Grupo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Grado *</Label>
                <select
                  name="idGrado"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar grado...</option>
                  {grados.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre} ({g.nivel})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código *</Label>
                  <Input name="codigo" required placeholder="Ej: A, B" />
                </div>
                <div className="space-y-2">
                  <Label>Año Lectivo *</Label>
                  <Input name="anioLectivo" required placeholder="Ej: 2025" />
                </div>
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Grupo"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Buscar por código"
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
                <th className="px-4 py-4">Código</th>
                <th className="px-4 py-4">Grado</th>
                <th className="px-4 py-4">Año Lectivo</th>
                <th className="px-4 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No hay grupos registrados.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{g.id}</td>
                    <td className="px-4 py-3 font-medium">{g.codigo}</td>
                    <td className="px-4 py-3">{getGradoNombre(g.idGrado)}</td>
                    <td className="px-4 py-3">{g.anioLectivo}</td>
                    <td className="px-4 py-3">
                      <Badge variant={g.estado ? "default" : "secondary"}>
                        {g.estado ? "Activo" : "Inactivo"}
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
