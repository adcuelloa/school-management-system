import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

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
import { estudiantesApi, tiposDocumentoApi } from "@/lib/api";

import type { CreateEstudiante } from "@academic/common";

export default function EstudiantesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ["estudiantes"],
    queryFn: estudiantesApi.list,
  });

  const { data: tiposDoc = [] } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: tiposDocumentoApi.list,
  });

  const createMutation = useMutation({
    mutationFn: estudiantesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateEstudiante = {
      idTipoDocumento: Number(fd.get("idTipoDocumento")),
      idAcudiente: fd.get("idAcudiente") ? Number(fd.get("idAcudiente")) : null,
      numeroDocumento: fd.get("numeroDocumento") as string,
      genero: fd.get("genero") as string,
      nombres: fd.get("nombres") as string,
      apellidos: fd.get("apellidos") as string,
      fechaNacimiento: fd.get("fechaNacimiento") as string,
    };
    createMutation.mutate(data);
  };

  const filtered = estudiantes.filter(
    (e) =>
      e.nombres.toLowerCase().includes(search.toLowerCase()) ||
      e.apellidos.toLowerCase().includes(search.toLowerCase()) ||
      e.numeroDocumento.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground">Ver y gestionar todos los estudiantes inscritos.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Crear Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Estudiante</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input id="nombres" name="nombres" required placeholder="Juan Sebastian" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input id="apellidos" name="apellidos" required placeholder="Narváez Perez" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idTipoDocumento">Tipo Documento *</Label>
                  <select
                    id="idTipoDocumento"
                    name="idTipoDocumento"
                    required
                    className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    <option value="">Seleccionar...</option>
                    {tiposDoc.map((td) => (
                      <option key={td.id} value={td.id}>
                        {td.abreviatura} - {td.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento">Nro. Documento *</Label>
                  <Input id="numeroDocumento" name="numeroDocumento" required placeholder="123456" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <select
                    id="genero"
                    name="genero"
                    required
                    className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha Nacimiento *</Label>
                  <Input id="fechaNacimiento" name="fechaNacimiento" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idAcudiente">ID Acudiente (opcional)</Label>
                <Input id="idAcudiente" name="idAcudiente" type="number" placeholder="" />
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Estudiante"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Buscar por nombre o documento"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Nombres</th>
                <th className="px-4 py-4">Apellidos</th>
                <th className="px-4 py-4">Documento</th>
                <th className="px-4 py-4">Género</th>
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
                    No hay estudiantes registrados.
                  </td>
                </tr>
              ) : (
                filtered.map((est) => (
                  <tr key={est.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium">{est.id}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {est.nombres[0]}
                          {est.apellidos[0]}
                        </div>
                        {est.nombres}
                      </div>
                    </td>
                    <td className="px-4 py-4">{est.apellidos}</td>
                    <td className="px-4 py-4 font-mono text-xs">{est.numeroDocumento}</td>
                    <td className="px-4 py-4">{est.genero}</td>
                    <td className="px-4 py-4">
                      <Badge variant={est.estado ? "default" : "secondary"}>
                        {est.estado ? "Activo" : "Inactivo"}
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
