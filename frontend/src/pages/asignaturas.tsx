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
import { areasApi, asignaturasApi } from "@/lib/api";

import type { CreateAsignatura } from "@academic/common";

export default function AsignaturasPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: asignaturas = [], isLoading } = useQuery({
    queryKey: ["asignaturas"],
    queryFn: asignaturasApi.list,
  });
  const { data: areas = [] } = useQuery({
    queryKey: ["areas"],
    queryFn: areasApi.list,
  });

  const createMutation = useMutation({
    mutationFn: asignaturasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asignaturas"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateAsignatura = {
      idArea: Number(fd.get("idArea")),
      nombre: fd.get("nombre") as string,
      codigo: fd.get("codigo") as string,
    };
    createMutation.mutate(data);
  };

  const filtered = asignaturas.filter(
    (a) =>
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Asignaturas</h1>
          <p className="text-muted-foreground">Ver y gestionar las asignaturas del colegio.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Crear Asignatura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Asignatura</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input name="nombre" required placeholder="Matemáticas" />
              </div>
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input name="codigo" required placeholder="MAT101" />
              </div>
              <div className="space-y-2">
                <Label>Área *</Label>
                <select
                  name="idArea"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar...</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
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
                {createMutation.isPending ? "Guardando..." : "Guardar Asignatura"}
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
            placeholder="Buscar por nombre o código"
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
                <th className="px-4 py-4">Nombre</th>
                <th className="px-4 py-4">Código</th>
                <th className="px-4 py-4">ID Área</th>
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
                    No hay asignaturas registradas.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium">{a.id}</td>
                    <td className="px-4 py-4">{a.nombre}</td>
                    <td className="px-4 py-4 font-mono text-xs">{a.codigo}</td>
                    <td className="px-4 py-4">{a.idArea}</td>
                    <td className="px-4 py-4">
                      <Badge variant={a.estado ? "default" : "secondary"}>
                        {a.estado ? "Activa" : "Inactiva"}
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
