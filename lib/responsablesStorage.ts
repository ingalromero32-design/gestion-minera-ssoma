import { Responsable } from "@/types/responsable";

const CLAVE_RESPONSABLES = "gestion-minera-responsables";

export function obtenerResponsables(): Responsable[] {
  if (typeof window === "undefined") return [];

  const datos = localStorage.getItem(CLAVE_RESPONSABLES);

  if (!datos) return [];

  return JSON.parse(datos) as Responsable[];
}

export function guardarResponsables(responsables: Responsable[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CLAVE_RESPONSABLES, JSON.stringify(responsables));
}

export function agregarResponsable(responsable: Responsable) {
  const responsables = obtenerResponsables();

  const nuevosResponsables: Responsable[] = [responsable, ...responsables];

  guardarResponsables(nuevosResponsables);

  return nuevosResponsables;
}

export function eliminarResponsable(id: string) {
  const responsables = obtenerResponsables();

  const nuevosResponsables: Responsable[] = responsables.filter(
    (responsable) => responsable.id !== id
  );

  guardarResponsables(nuevosResponsables);

  return nuevosResponsables;
}

export function cambiarEstadoResponsable(id: string) {
  const responsables = obtenerResponsables();

  const nuevosResponsables: Responsable[] = responsables.map((responsable) => {
    if (responsable.id !== id) return responsable;

    return {
      ...responsable,
      estado: responsable.estado === "Activo" ? "Inactivo" : "Activo",
    } as Responsable;
  });

  guardarResponsables(nuevosResponsables);

  return nuevosResponsables;
}