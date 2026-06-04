import { supabase } from "./supabase";

export async function subirImagen(
  archivo: File,
  carpeta: string
) {
  const nombreArchivo =
`${crypto.randomUUID()}-${archivo.name}`;

  const ruta =
    `${carpeta}/${nombreArchivo}`;

  console.log("ARCHIVO:", archivo);
  console.log("RUTA:", ruta);

  const respuesta = await supabase.storage
    .from("evidencias")
    .upload(ruta, archivo);

  console.log("RESPUESTA STORAGE:");
  console.log(respuesta);

  if (respuesta.error) {
    console.log(
      JSON.stringify(
        respuesta.error,
        null,
        2
      )
    );

    throw respuesta.error;
  }

  const { data } =
    supabase.storage
      .from("evidencias")
      .getPublicUrl(ruta);

  console.log(
    "URL GENERADA:",
    data.publicUrl
  );

  return data.publicUrl;
}