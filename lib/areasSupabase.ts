import { supabase } from "./supabase";
import { Area } from "@/types/area";

export async function obtenerAreas() {
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .order("nombre");

  if (error) {
    console.error(error);
    return [];
  }

  return data as Area[];
}

export async function guardarArea(area: any) {
  console.log("AREA A GUARDAR:", area);

  const { data, error } = await supabase
    .from("areas")
    .insert([area])
    .select();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return { data, error };
}

export async function eliminarArea(
  id: string
) {
  const { error } = await supabase
    .from("areas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function cambiarEstadoArea(
  id: string,
  estado: "Activa" | "Inactiva"
) {
  const nuevoEstado =
    estado === "Activa"
      ? "Inactiva"
      : "Activa";

  const { error } = await supabase
    .from("areas")
    .update({
      estado: nuevoEstado,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}