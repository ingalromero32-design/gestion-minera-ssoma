"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  obtenerObservacionesSupabase
} from "@/lib/observacionesSupabase";
import { Observacion } from "@/types/observacion";
import { generarPDFEjecutivo } from "@/lib/utils/pdfEjecutivo";

export default function DashboardPage() {
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);

    useEffect(() => {
    async function cargar() {
      const data =
        await obtenerObservacionesSupabase();

      setObservaciones(data);
    }

    cargar();
  }, []);
  
  const hoy = new Date().toISOString().split("T")[0];

  function estaCerrada(item: Observacion) {
    return item.estado === "Cerrado"
  }

  function estaVencida(item: Observacion) {
    return item.fechaCompromiso < hoy && !estaCerrada(item);
  }

  function mostrarEstado(item: Observacion) {
    if (estaVencida(item)) return "Vencido";
    return item.estado;
  }

  const total = observaciones.length;

  const pendientes = observaciones.filter(
    (item) => item.estado === "Pendiente" && !estaVencida(item)
  ).length;

  const enProceso = observaciones.filter(
    (item) => item.estado === "En proceso" && !estaVencida(item)
  ).length;

  const cerradas = observaciones.filter((item) => estaCerrada(item)).length;

  const vencidas = observaciones.filter((item) => estaVencida(item)).length;

  const criticas = observaciones.filter(
    (item) => item.riesgo === "Crítico"
  ).length;

  const altas = observaciones.filter((item) => item.riesgo === "Alto").length;

  const ultimasObservaciones = observaciones.slice(0, 5);

  const resumenPorArea = observaciones.reduce(
    (
      acumulador: Record<string, { nombre: string; cantidad: number }>,
      item
    ) => {
      const areaOriginal = item.area?.trim() || "Sin área";
      const areaClave = areaOriginal.toLowerCase();

      if (!acumulador[areaClave]) {
        acumulador[areaClave] = {
          nombre: areaOriginal,
          cantidad: 0,
        };
      }

      acumulador[areaClave].cantidad += 1;

      return acumulador;
    },
    {}
  );

  const areasOrdenadas = Object.values(resumenPorArea).sort(
    (a, b) => b.cantidad - a.cantidad
  );

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
            Panel principal
          </p>

          <h1 className="mt-3 text-2xl font-bold md:text-3xl">
            Dashboard SSOMA
          </h1>

          <p className="mt-2 text-sm text-slate-400 md:text-base">
            Resumen general de observaciones, inspecciones y riesgos registrados.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          <CardDashboard titulo="Total" valor={total} />

          <CardDashboard
            titulo="Pendientes"
            valor={pendientes}
            color="text-yellow-400"
          />

          <CardDashboard
            titulo="En proceso"
            valor={enProceso}
            color="text-blue-400"
          />

          <CardDashboard
            titulo="Cerradas"
            valor={cerradas}
            color="text-green-400"
          />

          <CardDashboard
            titulo="Vencidas"
            valor={vencidas}
            color="text-red-400"
          />

          <CardDashboard
            titulo="Críticas"
            valor={criticas}
            color="text-red-400"
          />

          <CardDashboard
            titulo="Riesgo alto"
            valor={altas}
            color="text-orange-400"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold md:text-xl">
                Últimas observaciones
              </h2>

              <Link
                href="/observaciones"
                className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
              >
                Ver todas →
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {ultimasObservaciones.length > 0 ? (
                ultimasObservaciones.map((item) => (
                  <Link
                    key={item.id}
                    href={`/observaciones/${item.id}`}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-yellow-400"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500">Área</p>
                          <p className="font-semibold">{item.area}</p>
                        </div>

                        <span
                          className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
                            estaVencida(item)
                              ? "bg-red-500 text-white"
                              : estaCerrada(item)
                              ? "bg-green-500 text-white"
                              : item.estado === "En proceso"
                              ? "bg-blue-500 text-white"
                              : "bg-yellow-400 text-slate-950"
                          }`}
                        >
                          {mostrarEstado(item)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Ubicación</p>
                        <p className="text-sm text-slate-300">
                          {item.ubicacion}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-yellow-400">
                          Riesgo: {item.riesgo}
                        </span>

                        <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          Compromiso: {item.fechaCompromiso}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
                  Aún no hay observaciones registradas.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
            <h2 className="text-lg font-bold md:text-xl">Acciones rápidas</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/observaciones/nueva"
                className="rounded-xl bg-yellow-400 px-5 py-4 text-center font-semibold text-slate-950 transition hover:bg-yellow-300"
              >
                Registrar observación
              </Link>

              <Link
                  href="/observaciones"
                  className="rounded-xl border border-slate-700 px-5 py-4 text-center font-semibold text-white transition hover:bg-slate-800"
                >
                  Revisar observaciones
                </Link>

                <button
                  onClick={() =>
                    generarPDFEjecutivo(observaciones)
                  }
                  className="rounded-xl border border-green-500 px-5 py-4 text-center font-semibold text-green-400 transition hover:bg-green-500 hover:text-white"
                >
                  Reporte Ejecutivo PDF
                </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm font-semibold text-slate-300">
                Recomendación SSOMA
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Prioriza el seguimiento de observaciones vencidas, críticas y de
                riesgo alto. En campo, una observación sin cierre debe tratarse
                como una condición pendiente de control.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6 lg:col-span-2">
            <div>
              <h2 className="text-lg font-bold md:text-xl">Resumen por área</h2>

              <p className="mt-1 text-sm text-slate-400">
                Identifica en qué zonas se concentran más observaciones SSOMA.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {areasOrdenadas.length > 0 ? (
                areasOrdenadas.map((item) => (
                  <div
                    key={item.nombre}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">Área</p>
                        <p className="font-semibold text-white">
                          {item.nombre}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-400">
                          {item.cantidad}
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.cantidad === 1
                            ? "observación"
                            : "observaciones"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400 md:col-span-2">
                  Aún no hay datos por área.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CardDashboard({
  titulo,
  valor,
  color = "text-white",
}: {
  titulo: string;
  valor: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-5">
      <p className="text-xs text-slate-400 md:text-sm">{titulo}</p>

      <h2 className={`mt-2 text-2xl font-bold md:text-3xl ${color}`}>
        {valor}
      </h2>
    </div>
  );
}