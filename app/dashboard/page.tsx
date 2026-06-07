"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  obtenerObservacionesSupabase
} from "@/lib/observacionesSupabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

  const criticas = observaciones.filter((item) => item.riesgo === "Crítico").length;

  const altas = observaciones.filter((item) => item.riesgo === "Alto").length;

  const medias = observaciones.filter((item) => item.riesgo === "Medio").length;

  const bajas = observaciones.filter((item) => item.riesgo === "Bajo").length;

  const cumplimiento =  total > 0    ? Math.round((cerradas / total) * 100)    : 0;

  const estadosData = [
    {
      name: "Pendientes",
      value: pendientes,
    },
    {
      name: "En proceso",
      value: enProceso,
    },
    {
      name: "Cerradas",
      value: cerradas,
    },
    {
      name: "Vencidas",
      value: vencidas,
    },
  ];

  const COLORS = [
  "#facc15",
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  ];

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

    const riesgosData = [
    {
      name: "Crítico",
      value: criticas,
    },
    {
      name: "Alto",
      value: altas,
    },
    {
      name: "Medio",
      value: medias,
    },
    {
      name: "Bajo",
      value: bajas,
    },
  ];

  const areasOrdenadas = Object.values(resumenPorArea).sort(
    (a, b) => b.cantidad - a.cantidad
  );
  const resumenResponsables = observaciones.reduce(
  (
      acumulador: Record<
        string,
        {
          nombre: string;
          pendientes: number;
          cerradas: number;
        }
      >,
      item
    ) => {
  const responsable =
        item.responsable?.trim() ||
        "Sin responsable";

      if (!acumulador[responsable]) {
        acumulador[responsable] = {
          nombre: responsable,
          pendientes: 0,
          cerradas: 0,
        };
      }

      if (item.estado === "Cerrado") {
        acumulador[responsable].cerradas += 1;
      } else {
        acumulador[responsable].pendientes += 1;
      }

      return acumulador;
    },
    {}
  );

  const rankingResponsables = Object.values(
    resumenResponsables
  ).sort(
    (a, b) =>
      b.pendientes - a.pendientes
  );

  const rankingCumplimiento = Object.values(
    resumenResponsables
  ).sort(
    (a, b) =>
      b.cerradas - a.cerradas
  );

  const proximasAVencer =
  observaciones
    .filter((item) => {
      if (
        item.estado === "Cerrado"
      )
        return false;

      const fecha =
        new Date(
          item.fechaCompromiso
        );

      const hoyFecha =
        new Date();

      const diferencia =
        Math.ceil(
          (
            fecha.getTime() -
            hoyFecha.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        );

      return (
        diferencia >= 0 &&
        diferencia <= 7
      );
    })
    .sort(
      (a, b) =>
        new Date(
          a.fechaCompromiso
        ).getTime() -
        new Date(
          b.fechaCompromiso
        ).getTime()
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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
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

          <CardDashboard
          titulo="Riesgo medio"
          valor={medias}
          color="text-yellow-300"
        />

        <CardDashboard
          titulo="Riesgo bajo"
          valor={bajas}
          color="text-green-300"
        />

        <CardDashboard
          titulo="% Cumplimiento"
          valor={cumplimiento}
          color="text-cyan-400"
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

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold md:text-xl">
                Cumplimiento SSOMA
              </h2>

              <button
                onClick={() => generarPDFEjecutivo(observaciones)}
                className="rounded-xl border border-green-500 px-4 py-2 text-sm font-semibold text-green-400 transition hover:bg-green-500 hover:text-white"
              >
                PDF Ejecutivo
              </button>
            </div>

            <div className="mt-6">

              <div className="mb-2 flex justify-between">
                <span className="text-slate-300">
                  Cumplimiento General
                </span>

                <span className="font-bold text-cyan-400">
                  {cumplimiento}%
                </span>
              </div>

              <div className="h-5 overflow-hidden rounded-full bg-slate-800">

                <div
                  className={`h-full transition-all duration-500 ${
                    cumplimiento >= 80
                      ? "bg-green-500"
                      : cumplimiento >= 60
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${cumplimiento}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">

              <p className="font-semibold text-yellow-400">
                Recomendación SSOMA
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Priorizar observaciones vencidas,
                críticas y de riesgo alto.
                Mantener el cumplimiento por
                encima del 80%.
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6 lg:col-span-2">
            <div>
              <h2 className="text-lg font-bold md:text-xl">Resumen por área</h2>
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-lg font-bold">
                  Distribución por estado
                </h2>

                <div className="mt-5 h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height={350}
                  >

                    <PieChart>

                      <Pie
                        data={estadosData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >

                        {estadosData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                COLORS[index]
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="text-lg font-bold">
                  Distribución de riesgos
                </h2>

                <div className="mt-5 h-[320px]">

                  <ResponsiveContainer
                    width="100%"
                    height={350}
                  >

                    <PieChart>

                      <Pie
                        data={riesgosData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                      >

                        <Cell fill="#dc2626" />
                        <Cell fill="#f97316" />
                        <Cell fill="#facc15" />
                        <Cell fill="#22c55e" />

                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>
              
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
              <h2 className="text-lg font-bold">
                Ranking de responsables
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Responsables con mayor cantidad de observaciones pendientes.
              </p>

              <div className="mt-5 space-y-3">
                {rankingResponsables
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={item.nombre}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          #{index + 1} {item.nombre}
                        </p>
                      </div>

                      <span className="rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white">
                        {item.pendientes}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
              <h2 className="text-lg font-bold">
                Mejor cumplimiento
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Responsables con más observaciones cerradas.
              </p>

              <div className="mt-5 space-y-3">
                {rankingCumplimiento
                  .slice(0, 5)
                  .map((item, index) => (
                    <div
                      key={item.nombre}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          #{index + 1} {item.nombre}
                        </p>
                      </div>

                      <span className="rounded-lg bg-green-500 px-3 py-1 text-sm font-bold text-white">
                        {item.cerradas}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-lg font-bold">
                Próximas a vencer
              </h2>

              <div className="mt-4 space-y-3">

                {proximasAVencer
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <p className="font-semibold">
                        {item.area}
                      </p>

                      <p className="text-sm text-slate-400">
                        {item.responsable}
                      </p>

                      <p className="mt-2 text-yellow-400">
                        {item.fechaCompromiso}
                      </p>
                    </div>
                  ))}

              </div>

            </div>

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