"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Observacion } from "@/types/observacion";
import {
  obtenerObservacionesSupabase,
} from "@/lib/observacionesSupabase";

import {
  eliminarObservacionSupabase,
} from "@/lib/observacionesSupabase";

export default function ObservacionesPage() {
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
  async function cargarDatos() {
    const datos =
      await obtenerObservacionesSupabase();

    setObservaciones(datos);
  }

  cargarDatos();
}, []);

  const hoy = new Date().toISOString().split("T")[0];

  function estaCerrada(item: Observacion) {
    return item.estado === "Cerrado";
  }

  function estaVencida(item: Observacion) {
    return item.fechaCompromiso < hoy && !estaCerrada(item);
  }

  function mostrarEstado(item: Observacion) {
    if (estaVencida(item)) return "Vencido";
    return item.estado;
  }

  function claseEstado(item: Observacion) {
    if (estaVencida(item)) return "bg-red-500 text-white";

    if (item.estado === "Cerrado") return "bg-green-500 text-white";

    if (item.estado === "En proceso") return "bg-blue-500 text-white";

    return "bg-yellow-400 text-slate-950";
  }

  function claseRiesgo(riesgo: string) {
    if (riesgo === "Crítico") return "text-red-400 border-red-500";
    if (riesgo === "Alto") return "text-orange-400 border-orange-500";
    if (riesgo === "Medio") return "text-yellow-400 border-yellow-500";
    return "text-green-400 border-green-500";
  }
  
  async function manejarEliminar(id: number) {
  const confirmar = confirm(
    "¿Seguro que deseas eliminar esta observación? Esta acción no se puede deshacer."
  );

  if (!confirmar) return;

 await eliminarObservacionSupabase(id);

  const datos =
    await obtenerObservacionesSupabase();

  setObservaciones(datos);
}

  const total = observaciones.length;

  const pendientes = observaciones.filter(
    (item) => item.estado === "Pendiente" && !estaVencida(item)
  ).length;

  const enProceso = observaciones.filter(
    (item) => item.estado === "En proceso" && !estaVencida(item)
  ).length;

  const cerradas = observaciones.filter((item) => item.estado === "Cerrado")
    .length;

  const vencidas = observaciones.filter((item) => estaVencida(item)).length;
  const observacionesFiltradas = observaciones.filter((item) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      item.area.toLowerCase().includes(texto) ||
      item.descripcion.toLowerCase().includes(texto) ||
      item.responsable.toLowerCase().includes(texto);

    const estadoReal = mostrarEstado(item);

    const coincideEstado = filtroEstado === "Todos" || estadoReal === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const porVencer = observaciones.filter((item) => {
    if (item.estado === "Cerrado") return false;

    const fecha = new Date(item.fechaCompromiso);
    const hoyFecha = new Date();

    const dias = Math.ceil((fecha.getTime() - hoyFecha.getTime()) / (1000 * 60 * 60 * 24));

    return dias >= 0 && dias <= 3;
  }).length;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
              Gestión SSOMA
            </p>

            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              Observaciones
            </h1>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
              Control y seguimiento de observaciones registradas en campo.
            </p>
          </div>

          <Link
            href="/observaciones/nueva"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-yellow-300"
          >
            Registrar observación
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
          <CardResumen titulo="Total" valor={total} />

          <CardResumen
            titulo="Pendientes"
            valor={pendientes}
            color="text-yellow-400"
          />

          <CardResumen
            titulo="En proceso"
            valor={enProceso}
            color="text-blue-400"
          />

          <CardResumen
            titulo="Cerradas"
            valor={cerradas}
            color="text-green-400"
          />

          <CardResumen
            titulo="Por vencer"
            valor={porVencer}
            color="text-orange-400"
          />

          <CardResumen
            titulo="Vencidas"
            valor={vencidas}
            color="text-red-400"
          />
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Buscar por área, responsable o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrado">Cerrado</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>

        {observaciones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-lg font-semibold text-slate-300">
              Aún no hay observaciones registradas.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Registra la primera observación para iniciar el seguimiento SSOMA.
            </p>

            <Link
              href="/observaciones/nueva"
              className="mt-5 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300"
            >
              Crear observación
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {observacionesFiltradas.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-5"
              >
                <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-start">
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    {item.fotoInicial ? (
                      <img
                        src={item.fotoInicial}
                        alt="Foto inicial de observación"
                        className="h-36 w-full object-cover md:h-32"
                      />
                    ) : (
                      <div className="flex h-36 items-center justify-center p-4 text-center text-sm text-slate-500 md:h-32">
                        Sin foto inicial
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${claseEstado(
                          item
                        )}`}
                      >
                        {mostrarEstado(item)}
                      </span>

                      <span
                        className={`rounded-lg border px-3 py-1 text-xs font-bold ${claseRiesgo(
                          item.riesgo
                        )}`}
                      >
                        Riesgo: {item.riesgo}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-white">
                      {item.area}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {item.ubicacion}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm text-slate-300">
                      {item.descripcion}
                    </p>

                    <div className="mt-4 grid gap-2 text-sm text-slate-400 md:grid-cols-2">
                      <p>
                        <span className="text-slate-500">Responsable: </span>
                        {item.responsable || "Sin responsable"}
                      </p>

                      <p>
                        <span className="text-slate-500">
                          Fecha compromiso:{" "}
                        </span>
                        <span
                          className={
                            estaVencida(item)
                              ? "text-red-400 font-bold"
                              : "text-slate-300"
                          }
                        >
                          {item.fechaCompromiso || "Sin fecha"}
                        </span>
                      </p>

                      <p>
                        <span className="text-slate-500">Registro: </span>
                        {item.fecha
                          ? new Date(item.fecha).toLocaleDateString()
                          : "Sin fecha"}
                      </p>

                      <p>
                        <span className="text-slate-500">Celular: </span>
                        {item.celularResponsable || "Sin celular"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-36">
                    <Link
                      href={`/observaciones/${item.id}`}
                      className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-yellow-300"
                    >
                      Ver detalle
                    </Link>

                    <button
                      type="button"
                      onClick={() => manejarEliminar(item.id)}
                      className="rounded-xl border border-red-500 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function CardResumen({
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