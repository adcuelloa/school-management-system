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
import { asignaturasApi, evaluacionesApi, gradoAsignaturasApi, gradosApi } from "@/lib/api";

import type { CreateEvaluacion } from "@academic/common";

export default function EvaluacionesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: evaluaciones = [], isLoading } = useQuery({
    queryKey: ["evaluaciones"],
    queryFn: evaluacionesApi.list,
  });

  const { data: gradoAsignaturas = [] } = useQuery({
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

  const createMutation = useMutation({
    mutationFn: evaluacionesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluaciones"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateEvaluacion = {
      idGradoAsignatura: Number(fd.get("idGradoAsignatura")),
      tipo: fd.get("tipo") as string,
      fecha: fd.get("fecha") as string,
      descripcion: (fd.get("descripcion") as string) || null,
      porcentaje: fd.get("porcentaje") as string,
    };
    createMutation.mutate(data);
  };

  const getGradoAsignaturaLabel = (id: number) => {
    const ga = gradoAsignaturas.find((g) => g.id === id);
    if (!ga) return `#${id}`;
    const grado = grados.find((g) => g.id === ga.idGrado);
    const asig = asignaturas.find((a) => a.id === ga.idAsignatura);
    return `${grado?.nombre ?? "?"} - ${asig?.nombre ?? "?"}`;
  };

  const filtered = evaluaciones.filter(
    (ev) =>
      ev.tipo.toLowerCase().includes(search.toLowerCase()) ||
      getGradoAsignaturaLabel(ev.idGradoAsignatura).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Evaluaciones</h1>
          <p className="text-muted-foreground">
            Crear y administrar evaluaciones por grado y asignatura.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Nueva Evaluación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nueva Evaluación</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Grado – Asignatura *</Label>
                <select
                  name="idGradoAsignatura"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar...</option>
                  {gradoAsignaturas.map((ga) => {
                    const grado = grados.find((g) => g.id === ga.idGrado);
                    const asig = asignaturas.find((a) => a.id === ga.idAsignatura);
                    return (
                      <option key={ga.id} value={ga.id}>
                        {grado?.nombre ?? "?"} – {asig?.nombre ?? "?"}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <select
                    name="tipo"
                    required
                    className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Examen">Examen</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Taller">Taller</option>
                    <option value="Exposición">Exposición</option>
                    <option value="Proyecto">Proyecto</option>
                    <option value="Tarea">Tarea</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Fecha *</Label>
                  <Input name="fecha" type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Porcentaje (%) *</Label>
                  <Input
                    name="porcentaje"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input name="descripcion" placeholder="Parcial primer corte" />
                </div>
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Evaluación"}
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
            placeholder="Buscar por tipo o asignatura"
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
                <th className="px-4 py-4">Grado – Asignatura</th>
                <th className="px-4 py-4">Tipo</th>
                <th className="px-4 py-4">Fecha</th>
                <th className="px-4 py-4">Porcentaje</th>
                <th className="px-4 py-4">Descripción</th>
                <th className="px-4 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No hay evaluaciones registradas.
                  </td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{ev.id}</td>
                    <td className="px-4 py-3">{getGradoAsignaturaLabel(ev.idGradoAsignatura)}</td>
                    <td className="px-4 py-3 font-medium">{ev.tipo}</td>
                    <td className="px-4 py-3">{ev.fecha}</td>
                    <td className="px-4 py-3">{ev.porcentaje}%</td>
                    <td className="px-4 py-3 text-muted-foreground">{ev.descripcion ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={ev.estado ? "default" : "secondary"}>
                        {ev.estado ? "Activo" : "Inactivo"}
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
