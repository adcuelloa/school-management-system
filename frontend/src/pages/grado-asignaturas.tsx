import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link2, Plus, Search } from "lucide-react";
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
import {
  asignaturasApi,
  docentesApi,
  gradoAsignaturasApi,
  gradosApi,
} from "@/lib/api";

import type { CreateGradoAsignatura } from "@academic/common";

export default function GradoAsignaturasPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: gradoAsignaturas = [], isLoading } = useQuery({
    queryKey: ["grado-asignaturas"],
    queryFn: gradoAsignaturasApi.list,
  });

  const { data: grados = [] } = useQuery({
    queryKey: ["grados"],
    queryFn: gradosApi.list,
  });

  const { data: asignaturas = [] } = useQuery({
    queryKey: ["asignaturas"],
    queryFn: asignaturasApi.list,
  });

  const { data: docentes = [] } = useQuery({
    queryKey: ["docentes"],
    queryFn: docentesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: gradoAsignaturasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grado-asignaturas"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const idDocenteVal = fd.get("idDocente") as string;
    const data: CreateGradoAsignatura = {
      idGrado: Number(fd.get("idGrado")),
      idAsignatura: Number(fd.get("idAsignatura")),
      idDocente: idDocenteVal ? Number(idDocenteVal) : null,
    };
    createMutation.mutate(data);
  };

  const getGradoNombre = (id: number) => {
    const g = grados.find((g) => g.id === id);
    return g ? `${g.nombre} (${g.nivel})` : `#${id}`;
  };

  const getAsignaturaNombre = (id: number) => {
    const a = asignaturas.find((a) => a.id === id);
    return a?.nombre ?? `#${id}`;
  };

  const getDocenteNombre = (id: number | null) => {
    if (!id) return "Sin asignar";
    const d = docentes.find((d) => d.id === id);
    return d ? `${d.nombres} ${d.apellidos}` : `#${id}`;
  };

  const filtered = gradoAsignaturas.filter((ga) => {
    const term = search.toLowerCase();
    return (
      getGradoNombre(ga.idGrado).toLowerCase().includes(term) ||
      getAsignaturaNombre(ga.idAsignatura).toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grado – Asignatura</h1>
          <p className="text-muted-foreground">
            Asignar asignaturas a los grados y opcionalmente un docente responsable.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Asignar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Asignar Asignatura a Grado</DialogTitle>
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
              <div className="space-y-2">
                <Label>Asignatura *</Label>
                <select
                  name="idAsignatura"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar asignatura...</option>
                  {asignaturas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.codigo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Docente (opcional)</Label>
                <select
                  name="idDocente"
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Sin asignar</option>
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nombres} {d.apellidos}
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
                {createMutation.isPending ? "Guardando..." : "Asignar"}
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
            placeholder="Buscar por grado o asignatura"
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
                <th className="px-4 py-4">Grado</th>
                <th className="px-4 py-4">Asignatura</th>
                <th className="px-4 py-4">Docente</th>
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
                    No hay asignaciones registradas.
                  </td>
                </tr>
              ) : (
                filtered.map((ga) => (
                  <tr key={ga.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{ga.id}</td>
                    <td className="px-4 py-3 font-medium">{getGradoNombre(ga.idGrado)}</td>
                    <td className="px-4 py-3">{getAsignaturaNombre(ga.idAsignatura)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getDocenteNombre(ga.idDocente)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ga.estado ? "default" : "secondary"}>
                        {ga.estado ? "Activo" : "Inactivo"}
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
