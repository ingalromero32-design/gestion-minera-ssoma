import { supabase } from "./supabase";
import { Observacion } from "@/types/observacion";

export async function obtenerObservacionesSupabase() {
  const { data, error } = await supabase
    .from("observaciones")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    fecha: item.fecha,
    area: item.area,
    ubicacion: item.ubicacion,
    tipo: item.tipo,
    descripcion: item.descripcion,
    riesgo: item.riesgo,
    responsable: item.responsable,
    cargoResponsable: item.cargo_responsable,
    celularResponsable: item.celular_responsable,
    fechaCompromiso: item.fecha_compromiso,
    estado: item.estado,
    accionCorrectiva: item.accion_correctiva,
    fotoInicial: item.foto_inicial,
    fotoCierre: item.foto_cierre,
    accionCierre: item.accion_cierre,
    fechaCierre: item.fecha_cierre,
    latitud: item.latitud,
    longitud: item.longitud,
    enlaceGoogleMaps: item.enlace_google_maps,
  })) as Observacion[];
}

export async function guardarObservacionSupabase(
  observacion: Observacion
) {
  const { data, error } = await supabase
  .from("observaciones")
  .insert({
      id: observacion.id,
      fecha: observacion.fecha,
      area: observacion.area,
      ubicacion: observacion.ubicacion,
      tipo: observacion.tipo,
      descripcion: observacion.descripcion,
      riesgo: observacion.riesgo,
      responsable: observacion.responsable,
      cargo_responsable:
        observacion.cargoResponsable,
      celular_responsable:
        observacion.celularResponsable,
      fecha_compromiso:
        observacion.fechaCompromiso,
      estado: observacion.estado,
      accion_correctiva:
        observacion.accionCorrectiva,
      foto_inicial:
        observacion.fotoInicial,
      foto_cierre:
        observacion.fotoCierre,
      accion_cierre:
        observacion.accionCierre,
      fecha_cierre:
        observacion.fechaCierre,
      latitud: observacion.latitud,
      longitud: observacion.longitud,
      enlace_google_maps:
        observacion.enlaceGoogleMaps,
    })
     .select();

    console.log("INSERT DATA:");
    console.log(data);

    console.log("ERROR:");
    console.log(error);

  if (error) {
  console.log("ERROR COMPLETO:", error);

  alert(
    `CODE: ${error.code}
MESSAGE: ${error.message}
DETAILS: ${error.details}
HINT: ${error.hint}`
  );

  throw error;
}
}

export async function obtenerObservacionPorIdSupabase(
  id: number
) {
  const { data, error } = await supabase
    .from("observaciones")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return {
    id: data.id,
    fecha: data.fecha,
    area: data.area,
    ubicacion: data.ubicacion,
    tipo: data.tipo,
    descripcion: data.descripcion,
    riesgo: data.riesgo,
    responsable: data.responsable,
    cargoResponsable: data.cargo_responsable,
    celularResponsable: data.celular_responsable,
    fechaCompromiso: data.fecha_compromiso,
    estado: data.estado,
    accionCorrectiva: data.accion_correctiva,
    fotoInicial: data.foto_inicial,
    fotoCierre: data.foto_cierre,
    accionCierre: data.accion_cierre,
    fechaCierre: data.fecha_cierre,
    latitud: data.latitud,
    longitud: data.longitud,
    enlaceGoogleMaps: data.enlace_google_maps,
  } as Observacion;
}

export async function eliminarObservacionSupabase(
  id: number
) {
  const { error } = await supabase
    .from("observaciones")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function actualizarObservacionSupabase(
  observacion: Observacion
) {
  const { error } = await supabase
    .from("observaciones")
    .update({
      fecha: observacion.fecha,
      area: observacion.area,
      ubicacion: observacion.ubicacion,
      tipo: observacion.tipo,
      descripcion: observacion.descripcion,
      riesgo: observacion.riesgo,
      responsable: observacion.responsable,
      cargo_responsable:
        observacion.cargoResponsable,
      celular_responsable:
        observacion.celularResponsable,
      fecha_compromiso:
        observacion.fechaCompromiso,
      estado: observacion.estado,
      accion_correctiva:
        observacion.accionCorrectiva,
      foto_inicial:
        observacion.fotoInicial,
      foto_cierre:
        observacion.fotoCierre,
      accion_cierre:
        observacion.accionCierre,
      fecha_cierre:
        observacion.fechaCierre,
      latitud: observacion.latitud,
      longitud: observacion.longitud,
      enlace_google_maps:
        observacion.enlaceGoogleMaps,
    })
    .eq("id", observacion.id);

  if (error) {
    console.error(error);
    throw error;
  }
}