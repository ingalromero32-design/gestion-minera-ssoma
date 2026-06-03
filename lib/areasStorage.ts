import { Area } from "@/types/area";

const CLAVE_AREAS = "gestion-minera-areas";

export function obtenerAreas(): Area[] {
  if (typeof window === "undefined") return [];

  const datos = localStorage.getItem(CLAVE_AREAS);

  if (!datos) return [];

  try {
    return JSON.parse(datos) as Area[];
  } catch {
    return [];
  }
}

export function guardarAreas(areas: Area[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CLAVE_AREAS, JSON.stringify(areas));
}

export function registrarArea(area: Area): Area[] {
  const areas = obtenerAreas();
  const nuevasAreas: Area[] = [area, ...areas];

  guardarAreas(nuevasAreas);

  return nuevasAreas;
}

export function eliminarArea(id: string): Area[] {
  const areas = obtenerAreas();
  const nuevasAreas: Area[] = areas.filter((area) => area.id !== id);

  guardarAreas(nuevasAreas);

  return nuevasAreas;
}

export function cambiarEstadoArea(id: string): Area[] {
  const areas = obtenerAreas();

  const nuevasAreas: Area[] = areas.map((area): Area => {
    if (area.id !== id) return area;

    return {
      ...area,
      estado: area.estado === "Activa" ? "Inactiva" : "Activa",
    };
  });

  guardarAreas(nuevasAreas);

  return nuevasAreas;
}