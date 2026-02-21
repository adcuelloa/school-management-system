import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import {type FormEvent, useState } from "react";

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
import { acudientesApi, tiposDocumentoApi } from "@/lib/api";

import type { CreateAcudiente } from "@academic/common";

export default function AcudientesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data: acudientes = [], isLoading } = useQuery({
    queryKey: ["acudientes"],
    queryFn: acudientesApi.list,
  });
  const { data: tiposDoc = [] } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: tiposDocumentoApi.list,
  });

  const createMutation = useMutation({
    mutationFn: acudientesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acudientes"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateAcudiente = {
      idTipoDocumento: Number(fd.get("idTipoDocumento")),
      numeroDocumento: fd.get("numeroDocumento") as string,
      genero: fd.get("genero") as string,
      nombres: fd.get("nombres") as string,
      apellidos: fd.get("apellidos") as string,
      telefono: (fd.get("telefono") as string) || null,
      correo: (fd.get("correo") as string) || null,
    };
    createMutation.mutate(data);
  };

  const filtered = acudientes.filter(
    (a) =>
      a.nombres.toLowerCase().includes(search.toLowerCase()) ||
      a.apellidos.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Acudientes</h1>
          <p className="text-muted-foreground">Ver y gestionar los acudientes registrados.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Crear Acudiente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Acudiente</DialogTitle>
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
                  <Label>Tipo Documento *</Label>
                  <select
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
                  <Label>Nro. Documento *</Label>
                  <Input name="numeroDocumento" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Género *</Label>
                  <select
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
                  <Label>Teléfono</Label>
                  <Input name="telefono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Correo</Label>
                <Input name="correo" type="email" />
              </div>
              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {(createMutation.error as Error).message}
                </p>
              )}
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? "Guardando..." : "Guardar Acudiente"}
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
            placeholder="Buscar por nombre"
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
                <th className="px-4 py-4">Nombres</th>
                <th className="px-4 py-4">Apellidos</th>
                <th className="px-4 py-4">Documento</th>
                <th className="px-4 py-4">Teléfono</th>
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
                    No hay acudientes registrados.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium">{a.id}</td>
                    <td className="px-4 py-4">{a.nombres}</td>
                    <td className="px-4 py-4">{a.apellidos}</td>
                    <td className="px-4 py-4 font-mono text-xs">{a.numeroDocumento}</td>
                    <td className="px-4 py-4">{a.telefono ?? "—"}</td>
                    <td className="px-4 py-4">
                      <Badge variant={a.estado ? "default" : "secondary"}>
                        {a.estado ? "Activo" : "Inactivo"}
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
