"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { generarPDFObservacion } from "@/lib/utils/pdfObservacion";
import { Observacion } from "@/types/observacion";
import {
  obtenerObservacionPorIdSupabase as obtenerObservacionPorId,
  actualizarObservacionSupabase,
} from "@/lib/observacionesSupabase";

export default function DetalleObservacionPage() {
  const params = useParams();
  const router = useRouter();

  const [observacion, setObservacion] = useState<Observacion | null>(null);
  const [accionCierre, setAccionCierre] = useState("");
  const [fotoCierre, setFotoCierre] = useState("");

  useEffect(() => {
    const idParametro = Number(params.id);

    async function cargar() {
      const data = await obtenerObservacionPorId(idParametro) as Observacion | null;

      if (data) {
        setObservacion(data);
        setAccionCierre(data.accionCierre || "");
        setFotoCierre(data.fotoCierre || "");
      }
    }

    cargar();
  }, [params.id]);

  async function actualizarObservacionActualizada(
    observacionActualizada: Observacion
  ) {
    try {
      await actualizarObservacionSupabase(observacionActualizada);
    } catch {
      alert("No se pudo actualizar la observación. Intenta nuevamente.");
      return;
    }

    setObservacion(observacionActualizada);
    setAccionCierre(observacionActualizada.accionCierre || "");
    setFotoCierre(observacionActualizada.fotoCierre || "");
  }

  async function cambiarAEnProceso() {
    if (!observacion) return;

    const confirmar = confirm(
      "¿Deseas cambiar esta observación de Pendiente a En proceso?"
    );

    if (!confirmar) return;

    const observacionActualizada: Observacion = {
      ...observacion,
      estado: "En proceso",
    };

    await actualizarObservacionActualizada(observacionActualizada);
  }

  function convertirImagenABase64(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onloadend = () => {
      setFotoCierre(lector.result as string);
    };

    lector.readAsDataURL(archivo);
  }

  function cerrarObservacion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!observacion) return;

    if (!accionCierre.trim()) {
      alert("Debes ingresar la acción ejecutada para cerrar la observación.");
      return;
    }

    const confirmar = confirm(
      "¿Confirmas el cierre de esta observación SSOMA?"
    );

    if (!confirmar) return;

    const observacionActualizada: Observacion = {
      ...observacion,
      estado: "Cerrado",
      accionCierre: accionCierre.trim(),
      fechaCierre: new Date().toISOString(),
      fotoCierre,
    };

    actualizarObservacionActualizada(observacionActualizada);
  }

  function generarPDF() {
    if (!observacion) return;

    generarPDFObservacion(observacion);
  }

  function obtenerEnlaceMaps() {
  if (!observacion?.latitud || !observacion?.longitud) return "";

  return `https://www.google.com/maps/search/?api=1&query=${observacion.latitud},${observacion.longitud}`;
}

  function obtenerMensajeWhatsApp() {
    if (!observacion) return "";

    const enlaceMaps = obtenerEnlaceMaps();

    const mensaje = `OBSERVACIÓN SSOMA
Área: ${observacion.area}
Ubicación: ${observacion.ubicacion}
Riesgo: ${observacion.riesgo}
Estado: ${observacion.estado}
Responsable: ${observacion.responsable}
Fecha compromiso: ${observacion.fechaCompromiso}

Descripción:
${observacion.descripcion}

${enlaceMaps ? `Ubicación GPS: ${enlaceMaps}` : ""}`;

    return encodeURIComponent(mensaje);
  }

  function obtenerLinkWhatsApp() {
    if (!observacion?.celularResponsable) return "";

    const celularLimpio = observacion.celularResponsable.replace(/\D/g, "");
    const mensaje = obtenerMensajeWhatsApp();

    return `https://wa.me/51${celularLimpio}?text=${mensaje}`;
  }

  function mostrarFecha(fecha?: string) {
    if (!fecha) return "No registrado";

    try {
      return new Date(fecha).toLocaleDateString();
    } catch {
      return fecha;
    }
  }

  function obtenerColorEstado(estado: string) {
    if (estado === "Cerrado") return "bg-green-500 text-white";
    if (estado === "En proceso") return "bg-blue-500 text-white";
    if (estado === "Vencido") return "bg-red-500 text-white";

    return "bg-yellow-400 text-slate-950";
  }

  function obtenerColorRiesgo(riesgo: string) {
    if (riesgo === "Crítico") return "bg-red-600 text-white";
    if (riesgo === "Alto") return "bg-orange-500 text-white";
    if (riesgo === "Medio") return "bg-yellow-400 text-slate-950";

    return "bg-green-500 text-white";
  }

  if (!observacion) {
    return (
      <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h1 className="text-2xl font-bold">Observación no encontrada</h1>

            <p className="mt-2 text-slate-400">
              No se encontró la observación solicitada.
            </p>

            <Link
              href="/observaciones"
              className="mt-5 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300"
            >
              Volver a observaciones
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const enlaceMaps = obtenerEnlaceMaps();
  const linkWhatsApp = obtenerLinkWhatsApp();

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
              Detalle SSOMA
            </p>

            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              Observación registrada
            </h1>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
              Revisa la información registrada, cambia el estado o cierra la
              observación con evidencia.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/observaciones"
              className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Volver
            </Link>

            <button
              type="button"
              onClick={generarPDF}
              className="rounded-xl border border-yellow-400 px-5 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-slate-950"
            >
              PDF / Imprimir
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-lg px-3 py-1 text-xs font-bold ${obtenerColorEstado(
                  observacion.estado
                )}`}
              >
                {observacion.estado}
              </span>

              <span
                className={`rounded-lg px-3 py-1 text-xs font-bold ${obtenerColorRiesgo(
                  observacion.riesgo
                )}`}
              >
                Riesgo: {observacion.riesgo}
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <CampoDetalle titulo="Área" valor={observacion.area} />
              <CampoDetalle titulo="Ubicación" valor={observacion.ubicacion} />
              <CampoDetalle titulo="Tipo" valor={observacion.tipo} />
              <CampoDetalle
                titulo="Fecha registro"
                valor={mostrarFecha(observacion.fecha)}
              />
              <CampoDetalle
                titulo="Fecha compromiso"
                valor={observacion.fechaCompromiso}
              />
              <CampoDetalle
                titulo="Responsable"
                valor={observacion.responsable}
              />

              <CampoDetalle
                titulo="Cargo"
                valor={observacion.cargoResponsable || "No registrado"}
              />

              <CampoDetalle
                titulo="Celular responsable"
                valor={observacion.celularResponsable || "No registrado"}
              />

              <CampoDetalle
                titulo="Latitud"
                valor={observacion.latitud || "No registrada"}
              />

              <CampoDetalle
                titulo="Longitud"
                valor={observacion.longitud || "No registrada"}
              />

              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-slate-400">
                  Descripción
                </p>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="whitespace-pre-line text-sm text-slate-300">
                    {observacion.descripcion}
                  </p>
                </div>
              </div>

              {observacion.accionCierre && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-semibold text-slate-400">
                    Acción ejecutada para cierre
                  </p>

                  <div className="rounded-xl border border-green-800 bg-slate-950 p-4">
                    <p className="whitespace-pre-line text-sm text-slate-300">
                      {observacion.accionCierre}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Fecha de cierre: {mostrarFecha(observacion.fechaCierre)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {observacion.estado === "Pendiente" && (
                <button
                  type="button"
                  onClick={cambiarAEnProceso}
                  className="rounded-xl border border-blue-400 px-5 py-3 font-semibold text-blue-400 transition hover:bg-blue-400 hover:text-slate-950"
                >
                  Cambiar a En proceso
                </button>
              )}

              {linkWhatsApp && (
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-green-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-400"
                >
                  Enviar WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
              <h2 className="text-lg font-bold">Evidencia inicial</h2>
                            {enlaceMaps && (
                <a
                  href={enlaceMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block rounded-xl bg-yellow-400 px-5 py-3 text-center font-semibold text-slate-950 hover:bg-yellow-300"
                >
                  Ver ubicación en Google Maps
                </a>
              )}

              <div className="mt-4">
                {observacion.fotoInicial ? (
                  <img
                    src={observacion.fotoInicial}
                    alt="Foto de evidencia inicial"
                    className="max-h-80 w-full rounded-xl border border-slate-800 object-contain"
                  />
                ) : (
                  <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                    No se registró foto de evidencia inicial.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
              <h2 className="text-lg font-bold">Evidencia de cierre</h2>

              <div className="mt-4">
                {observacion.fotoCierre ? (
                  <img
                    src={observacion.fotoCierre}
                    alt="Foto de cierre"
                    className="max-h-80 w-full rounded-xl border border-slate-800 object-contain"
                  />
                ) : (
                  <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                    No se ha cerrado la observación aún.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {observacion.estado !== "Cerrado" ? (
          <form
            onSubmit={cerrarObservacion}
            className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6"
          >
            <h2 className="text-lg font-bold md:text-xl">
              Cierre de observación
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Registra la acción ejecutada y adjunta una foto de cierre. Esta
              información se guarda recién al cerrar la observación.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Acción ejecutada para cierre
                </label>

                <textarea
                  value={accionCierre}
                  onChange={(evento) => setAccionCierre(evento.target.value)}
                  placeholder="Ejemplo: Se retiró material suelto, se señalizó la zona y se comunicó al personal responsable."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Foto de cierre
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={convertirImagenABase64}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
                />

                {fotoCierre && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <img
                      src={fotoCierre}
                      alt="Foto de cierre"
                      className="max-h-80 w-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:bg-green-400 md:w-auto"
              >
                Cerrar observación
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 rounded-2xl border border-green-800 bg-slate-900 p-4 md:p-6">
            <h2 className="text-lg font-bold text-green-400">
              Observación cerrada
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Esta observación ya fue cerrada y cuenta con acción ejecutada de
              cierre.
            </p>

            {observacion.fotoCierre && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-slate-400">
                  Evidencia de cierre
                </p>

                <img
                  src={observacion.fotoCierre}
                  alt="Foto de cierre"
                  className="max-h-96 w-full rounded-xl border border-slate-800 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function CampoDetalle({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-400">{titulo}</p>

      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm text-slate-300">{valor}</p>
      </div>
    </div>
  );
}