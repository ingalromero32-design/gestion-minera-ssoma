import { supabase } from "./supabase";
import { Responsable } from "@/types/responsable";

export async function obtenerResponsables() {
  const { data, error } = await supabase
    .from("responsables")
    .select("*")
    .order("nombre");

  if (error) {
    console.error(error);
    return [];
  }

  return data as Responsable[];
}

export async function guardarResponsable(
  responsable: Responsable
) {
  const { error } = await supabase
    .from("responsables")
    .insert([responsable]);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function eliminarResponsable(
  id: string
) {
  const { error } = await supabase
    .from("responsables")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function cambiarEstadoResponsable(
  id: string,
  estado: "Activo" | "Inactivo"
) {
  const nuevoEstado =
    estado === "Activo"
      ? "Inactivo"
      : "Activo";

  const { error } = await supabase
    .from("responsables")
    .update({
      estado: nuevoEstado,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}