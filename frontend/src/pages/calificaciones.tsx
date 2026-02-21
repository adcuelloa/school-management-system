import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { type FormEvent, useState } from "react";

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
  calificacionesApi,
  estudiantesApi,
  evaluacionesApi,
  gradoAsignaturasApi,
  gradosApi,
} from "@/lib/api";

import type { CreateCalificacion } from "@academic/common";

export default function CalificacionesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: calificaciones = [], isLoading } = useQuery({
    queryKey: ["calificaciones"],
    queryFn: calificacionesApi.list,
  });
  const { data: estudiantes = [] } = useQuery({
    queryKey: ["estudiantes"],
    queryFn: estudiantesApi.list,
  });
  const { data: evaluaciones = [] } = useQuery({
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
    mutationFn: calificacionesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calificaciones"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateCalificacion = {
      idEstudiante: Number(fd.get("idEstudiante")),
      idEvaluacion: Number(fd.get("idEvaluacion")),
      valor: fd.get("valor") as string,
      observaciones: (fd.get("observaciones") as string) || null,
    };
    createMutation.mutate(data);
  };

  const getEstudianteNombre = (id: number) => {
    const est = estudiantes.find((e) => e.id === id);
    return est ? `${est.nombres} ${est.apellidos}` : `#${id}`;
  };

  const getEvaluacionLabel = (id: number) => {
    const ev = evaluaciones.find((e) => e.id === id);
    if (!ev) return `#${id}`;
    const ga = gradoAsignaturas.find((g) => g.id === ev.idGradoAsignatura);
    const grado = ga ? grados.find((g) => g.id === ga.idGrado) : null;
    const asig = ga ? asignaturas.find((a) => a.id === ga.idAsignatura) : null;
    return `${ev.tipo} – ${grado?.nombre ?? "?"} / ${asig?.nombre ?? "?"}`;
  };

  const filtered = calificaciones.filter((c) => {
    const term = search.toLowerCase();
    return (
      getEstudianteNombre(c.idEstudiante).toLowerCase().includes(term) ||
      getEvaluacionLabel(c.idEvaluacion).toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Calificaciones</h1>
          <p className="text-muted-foreground">Registrar y consultar calificaciones de estudiantes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Nueva Calificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Calificación</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Estudiante *</Label>
                <select
                  name="idEstudiante"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar...</option>
                  {estudiantes.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombres} {e.apellidos}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Evaluación *</Label>
                <select
                  name="idEvaluacion"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar...</option>
                  {evaluaciones.map((ev) => {
                    const ga = gradoAsignaturas.find((g) => g.id === ev.idGradoAsignatura);
                    const grado = ga ? grados.find((g) => g.id === ga.idGrado) : null;
                    const asig = ga ? asignaturas.find((a) => a.id === ga.idAsignatura) : null;
                    return (
                      <option key={ev.id} value={ev.id}>
                        {ev.tipo} – {grado?.nombre ?? "?"} / {asig?.nombre ?? "?"} ({ev.fecha})
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Valor (0-5) *</Label>
                <Input name="valor" type="number" step="0.01" min="0" max="5" required placeholder="4.5" />
              </div>
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Input name="observaciones" placeholder="Excelente trabajo" />
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Calificación"}
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
            placeholder="Buscar por estudiante o evaluación"
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
                <th className="px-4 py-4">Estudiante</th>
                <th className="px-4 py-4">Evaluación</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Observaciones</th>
                <th className="px-4 py-4">Fecha Registro</th>
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
                    No hay calificaciones registradas.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-4 font-medium">{getEstudianteNombre(c.idEstudiante)}</td>
                    <td className="px-4 py-4">{getEvaluacionLabel(c.idEvaluacion)}</td>
                    <td className="px-4 py-4 font-bold">{c.valor}</td>
                    <td className="px-4 py-4 text-muted-foreground">{c.observaciones ?? "—"}</td>
                    <td className="px-4 py-4">{c.fechaRegistro}</td>
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
