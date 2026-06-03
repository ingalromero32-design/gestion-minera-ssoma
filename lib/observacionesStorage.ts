import { EstadoObservacion, Observacion } from "@/types/observacion";

const STORAGE_KEY = "observaciones_ssoma";

export function obtenerObservaciones(): Observacion[] {
  if (typeof window === "undefined") {
    return [];
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data) as Observacion[];
}

export function guardarObservaciones(observaciones: Observacion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(observaciones));
}

export function agregarObservacion(observacion: Observacion) {
  const observaciones = obtenerObservaciones();
  const nuevasObservaciones = [observacion, ...observaciones];

  guardarObservaciones(nuevasObservaciones);
}

export function actualizarObservacion(observacionActualizada: Observacion) {
  const observaciones = obtenerObservaciones();

  const nuevasObservaciones = observaciones.map((item) =>
    item.id === observacionActualizada.id ? observacionActualizada : item
  );

  guardarObservaciones(nuevasObservaciones);
}

export function eliminarObservacion(id: number) {
  const observaciones = obtenerObservaciones();

  const nuevasObservaciones = observaciones.filter((item) => item.id !== id);

  guardarObservaciones(nuevasObservaciones);
}

export function actualizarEstadoObservacion(
  id: number,
  nuevoEstado: EstadoObservacion
): Observacion[] {
  const observaciones = obtenerObservaciones();

  const nuevasObservaciones = observaciones.map((observacion) => {
    if (observacion.id !== id) return observacion;

    return {
      ...observacion,
      estado: nuevoEstado,
    };
  });

  guardarObservaciones(nuevasObservaciones);

  return nuevasObservaciones;
}