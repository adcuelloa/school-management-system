import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus, Search, User } from "lucide-react";
import { type FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { acudientesApi, estudiantesApi, tiposDocumentoApi } from "@/lib/api";
import { cn } from "@/lib/utils";

import type { CreateEstudiante } from "@academic/common";

export default function EstudiantesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [openAcudiente, setOpenAcudiente] = useState(false);
  const [selectedAcudienteId, setSelectedAcudienteId] = useState<number | null>(null);

  // Queries
  const { data: estudiantes = [], isLoading } = useQuery({
    queryKey: ["estudiantes"],
    queryFn: estudiantesApi.list,
  });

  const { data: tiposDoc = [] } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: tiposDocumentoApi.list,
  });

  const { data: acudientes = [] } = useQuery({
    queryKey: ["acudientes"],
    queryFn: acudientesApi.list,
  });

  // Mutation
  const createMutation = useMutation({
    mutationFn: estudiantesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      setOpen(false);
      setSelectedAcudienteId(null);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: CreateEstudiante = {
      idTipoDocumento: Number(fd.get("idTipoDocumento")),
      idAcudiente: selectedAcudienteId || null,
      numeroDocumento: fd.get("numeroDocumento") as string,
      genero: fd.get("genero") as string,
      nombres: fd.get("nombres") as string,
      apellidos: fd.get("apellidos") as string,
      fechaNacimiento: fd.get("fechaNacimiento") as string,
    };
    createMutation.mutate(data);
  };

  // Filter logic
  const filtered = estudiantes.filter((e) => {
    const term = search.toLowerCase();
    const fullName = `${e.nombres} ${e.apellidos}`.toLowerCase();
    const doc = e.numeroDocumento.toLowerCase();

    // Check if acudiente matches
    const ac = acudientes.find(a => a.id === e.idAcudiente);
    const acName = ac ? `${ac.nombres} ${ac.apellidos}`.toLowerCase() : "";

    return fullName.includes(term) || doc.includes(term) || acName.includes(term);
  });

  // Helper to get Acudiente Name
  const getAcudienteName = (id: number | null) => {
    if (!id) return null;
    const ac = acudientes.find((a) => a.id === id);
    return ac ? `${ac.nombres} ${ac.apellidos}` : "Desconocido";
  };

  // Helper to get TipoDoc Name
  const getTipoDocInfo = (id: number) => {
    const td = tiposDoc.find((t) => t.id === id);
    return td ? td.abreviatura : "?";
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground">Administre la información de los estudiantes y sus acudientes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Nuevo Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Estudiante</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
              {/* Información Personal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input id="nombres" name="nombres" required placeholder="Ej: Juan Sebastián" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input id="apellidos" name="apellidos" required placeholder="Ej: Pérez Rodríguez" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idTipoDocumento">Tipo Documento *</Label>
                  <Select name="idTipoDocumento" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDoc.map((td) => (
                        <SelectItem key={td.id} value={String(td.id)}>
                          {td.abreviatura} - {td.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento">No. Documento *</Label>
                  <Input id="numeroDocumento" name="numeroDocumento" required placeholder="Ej: 1001234567" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <Select name="genero" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha Nacimiento *</Label>
                  <Input id="fechaNacimiento" name="fechaNacimiento" type="date" required />
                </div>
              </div>

              {/* Acudiente Selection with Combobox */}
              <div className="space-y-2 flex flex-col">
                <Label>Acudiente (Opcional)</Label>
                <Popover open={openAcudiente} onOpenChange={setOpenAcudiente}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openAcudiente}
                      className="w-full justify-between font-normal"
                    >
                      {selectedAcudienteId
                        ? (() => {
                            const ac = acudientes.find((a) => a.id === selectedAcudienteId);
                            return ac ? `${ac.nombres} ${ac.apellidos}` : "Seleccionar acudiente...";
                          })()
                        : <span className="text-muted-foreground">Buscar acudiente por nombre o documento...</span>}
                      <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-100 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar acudiente..." />
                      <CommandList>
                        <CommandEmpty>No se encontró ningún acudiente.</CommandEmpty>
                        <CommandGroup>
                          {acudientes.map((ac) => (
                            <CommandItem
                              key={ac.id}
                              value={`${ac.nombres} ${ac.apellidos} ${ac.numeroDocumento}`}
                              onSelect={() => {
                                setSelectedAcudienteId(
                                  ac.id === selectedAcudienteId ? null : ac.id
                                );
                                setOpenAcudiente(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4",
                                  selectedAcudienteId === ac.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{ac.nombres} {ac.apellidos}</span>
                                <span className="text-xs text-muted-foreground">CC: {ac.numeroDocumento}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-[0.8rem] text-muted-foreground">
                  Busque y seleccione el acudiente responsable. Si no existe, créelo en el módulo de Acudientes.
                </p>
              </div>

              {createMutation.isError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  Error: {(createMutation.error as Error).message}
                </div>
              )}

              <Button type="submit" disabled={createMutation.isPending} className="w-full mt-2">
                {createMutation.isPending ? "Guardando..." : "Guardar Estudiante"}
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
            placeholder="Buscar por nombre, documento o acudiente..."
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
                <TableHead>Documento</TableHead>
                <TableHead>Género</TableHead>
                <TableHead>Acudiente</TableHead>
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
                    No se encontraron estudiantes.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((est) => {
                  const acudienteName = getAcudienteName(est.idAcudiente);
                  return (
                    <TableRow key={est.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-muted-foreground text-xs">{est.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{est.nombres} {est.apellidos}</span>
                          <span className="text-xs text-muted-foreground">
                            Nac: {est.fechaNacimiento}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs font-normal">
                          {getTipoDocInfo(est.idTipoDocumento)} {est.numeroDocumento}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{est.genero}</TableCell>
                      <TableCell>
                        {acudienteName ? (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="size-3 text-muted-foreground" />
                            <span>{acudienteName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={est.estado ? "default" : "destructive"} className="text-xs">
                          {est.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
