import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
import { estudiantesApi, gruposApi, matriculasApi } from "@/lib/api";

import type { CreateMatricula } from "@academic/common";

export default function MatriculasPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: matriculas = [], isLoading } = useQuery({
    queryKey: ["matriculas"],
    queryFn: matriculasApi.list,
  });
  const { data: estudiantes = [] } = useQuery({
    queryKey: ["estudiantes"],
    queryFn: estudiantesApi.list,
  });
  const { data: grupos = [] } = useQuery({
    queryKey: ["grupos"],
    queryFn: gruposApi.list,
  });

  const createMutation = useMutation({
    mutationFn: matriculasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matriculas"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateMatricula = {
      idEstudiante: Number(fd.get("idEstudiante")),
      idGrupo: Number(fd.get("idGrupo")),
      periodo: fd.get("periodo") as string,
    };
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Matrículas</h1>
          <p className="text-muted-foreground">
            Gestione las matrículas de los estudiantes para el año académico actual.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Nueva Matrícula
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Matrícula</DialogTitle>
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
                <Label>Grupo *</Label>
                <select
                  name="idGrupo"
                  required
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                  <option value="">Seleccionar...</option>
                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.codigo} ({g.anioLectivo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Periodo *</Label>
                <Input name="periodo" required placeholder="2025-1" />
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Matrícula"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">ID Estudiante</th>
                <th className="px-4 py-4">ID Grupo</th>
                <th className="px-4 py-4">Periodo</th>
                <th className="px-4 py-4">Fecha Registro</th>
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
              ) : matriculas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No hay matrículas registradas.
                  </td>
                </tr>
              ) : (
                matriculas.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium">{m.id}</td>
                    <td className="px-4 py-4">{m.idEstudiante}</td>
                    <td className="px-4 py-4">{m.idGrupo}</td>
                    <td className="px-4 py-4">{m.periodo}</td>
                    <td className="px-4 py-4">{m.fechaRegistro}</td>
                    <td className="px-4 py-4">
                      <Badge variant={m.estado ? "default" : "secondary"}>
                        {m.estado ? "Activa" : "Inactiva"}
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
