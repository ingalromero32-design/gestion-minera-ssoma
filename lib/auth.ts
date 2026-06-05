import { supabase } from "./supabase";

export async function iniciarSesion(
  correo: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: correo,
      password,
    });

  if (error) throw error;

  return data.user;
}
export async function cerrarSesion() {
  await supabase.auth.signOut();
}
export async function obtenerUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
