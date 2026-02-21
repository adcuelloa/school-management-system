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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { estudiantesApi, gradosApi, gruposApi, matriculasApi } from "@/lib/api";

import type { CreateMatricula } from "@academic/common";

export default function MatriculasPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

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
  const { data: grados = [] } = useQuery({
    queryKey: ["grados"],
    queryFn: gradosApi.list,
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

  // Helper to get Estudiante Name
  const getEstudianteInfo = (id: number) => {
    const est = estudiantes.find((e) => e.id === id);
    return est ? `${est.nombres} ${est.apellidos}` : `ID: ${id}`;
  };

  // Helper to get Grupo Name with Grado
  const getGrupoInfo = (idGrupo: number) => {
    const grupo = grupos.find((g) => g.id === idGrupo);
    if (!grupo) return `Grupo ID: ${idGrupo}`;

    const grado = grados.find((g) => g.id === grupo.idGrado);
    const gradoNombre = grado ? grado.nombre : "Grado ?";

    return `${gradoNombre} - Grupo ${grupo.codigo} (${grupo.anioLectivo})`;
  };

  // Filter logic
  const filtered = matriculas.filter((m) => {
    const term = search.toLowerCase();
    const estName = getEstudianteInfo(m.idEstudiante).toLowerCase();
    const grpName = getGrupoInfo(m.idGrupo).toLowerCase();
    return (
      estName.includes(term) ||
      grpName.includes(term) ||
      m.periodo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Matrículas</h1>
          <p className="text-muted-foreground">
            Inscriba estudiantes en grupos y gestione el periodo académico.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Nueva Matrícula
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Matrícula</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="idEstudiante">Estudiante *</Label>
                <Select name="idEstudiante" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estudiante..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-50">
                    {estudiantes.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.nombres} {e.apellidos} ({e.numeroDocumento})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idGrupo">Grupo *</Label>
                <Select name="idGrupo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar grupo..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-50">
                    {grupos.map((g) => {
                       const grado = grados.find(gr => gr.id === g.idGrado);
                       return (
                        <SelectItem key={g.id} value={String(g.id)}>
                          {grado?.nombre ?? "?"} - Grupo {g.codigo} ({g.anioLectivo})
                        </SelectItem>
                       );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo">Periodo *</Label>
                <Input id="periodo" name="periodo" required placeholder="Ej: 2025-1" />
              </div>

              {createMutation.isError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  Error: {(createMutation.error as Error).message}
                </div>
              )}

              <Button type="submit" disabled={createMutation.isPending} className="w-full mt-2">
                {createMutation.isPending ? "Guardando..." : "Guardar Matrícula"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-10 bg-background"
            placeholder="Buscar por estudiante, grupo o periodo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-9 px-4 text-sm font-normal">
            Total: {filtered.length}
          </Badge>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Grupo Asignado</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Cargando datos...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron matrículas.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground text-xs">{m.id}</TableCell>
                    <TableCell className="font-medium">
                      {getEstudianteInfo(m.idEstudiante)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-xs sm:text-sm">
                        {getGrupoInfo(m.idGrupo)}
                      </Badge>
                    </TableCell>
                    <TableCell>{m.periodo}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(m.fechaRegistro).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.estado ? "default" : "secondary"} className="text-xs">
                        {m.estado ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
