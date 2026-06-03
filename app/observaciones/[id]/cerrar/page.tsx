"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  actualizarObservacion,
  obtenerObservaciones,
} from "@/lib/observacionesStorage";
import { Observacion } from "@/types/observacion";

export default function CerrarObservacionPage() {
  const params = useParams();
  const router = useRouter();

  const [observacion, setObservacion] = useState<Observacion | null>(null);
  const [accionCierre, setAccionCierre] = useState("");
  const [fechaCierre, setFechaCierre] = useState("");
  const [fotoCierre, setFotoCierre] = useState("");

  useEffect(() => {
    const id = Number(params.id);
    const observaciones = obtenerObservaciones();
    const encontrada = observaciones.find((item) => item.id === id);

    if (encontrada) {
      setObservacion(encontrada);
      setAccionCierre(encontrada.accionCierre || "");
      setFechaCierre(
        encontrada.fechaCierre || new Date().toISOString().split("T")[0]
      );
      setFotoCierre(encontrada.fotoCierre || "");
    }
  }, [params.id]);

  function convertirImagenABase64(event: ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    const lector = new FileReader();

    lector.onloadend = () => {
      setFotoCierre(lector.result as string);
    };

    lector.readAsDataURL(archivo);
  }

  function guardarCierre(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!observacion) {
      return;
    }

    if (!accionCierre.trim()) {
      alert("Debes registrar la acción ejecutada para el cierre.");
      return;
    }

    const observacionActualizada: Observacion = {
      ...observacion,
      accionCierre,
      fechaCierre,
      fotoCierre,
      estado: "Cerrado",
    };

    actualizarObservacion(observacionActualizada);

    alert("Observación cerrada correctamente.");

    router.push(`/observaciones/${observacion.id}`);
  }

  if (!observacion) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <section className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h1 className="text-2xl font-bold">Observación no encontrada</h1>

            <p className="mt-2 text-slate-400">
              El registro no existe o fue eliminado.
            </p>

            <Link
              href="/observaciones"
              className="mt-6 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300"
            >
              Volver a observaciones
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
            Cierre de observación
          </p>

          <h1 className="mt-3 text-2xl font-bold md:text-3xl">
            Cerrar observación SSOMA #{observacion.id}
          </h1>

          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Registra la acción ejecutada y adjunta evidencia de cierre.
          </p>
        </div>

        <form
          onSubmit={guardarCierre}
          className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Acción ejecutada para el cierre
            </label>

            <textarea
              value={accionCierre}
              onChange={(event) => setAccionCierre(event.target.value)}
              className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-yellow-400"
              placeholder="Describe qué se realizó para cerrar la observación."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Fecha de cierre
            </label>

            <input
              type="date"
              value={fechaCierre}
              onChange={(event) => setFechaCierre(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Foto de cierre
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={convertirImagenABase64}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            />

            {fotoCierre && (
              <img
                src={fotoCierre}
                alt="Foto de cierre"
                className="mt-4 max-h-[400px] rounded-xl border border-slate-800 object-contain"
              />
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-400"
            >
              Guardar cierre
            </button>

            <Link
              href={`/observaciones/${observacion.id}`}
              className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}