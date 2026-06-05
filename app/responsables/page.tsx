"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Area } from "@/types/area";
import { Responsable } from "@/types/responsable";
import { obtenerAreas } from "@/lib/areasSupabase";
import {
  guardarResponsable,
  cambiarEstadoResponsable,
  eliminarResponsable,
  obtenerResponsables,
} from "@/lib/responsablesSupabase";

export default function ResponsablesPage() {
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [area, setArea] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const responsablesData = await obtenerResponsables();
      setResponsables(responsablesData);

      const areasData = await obtenerAreas();
      const areasActivas = areasData.filter((item) => item.estado === "Activa");

      setAreas(areasActivas);
    }

    cargarDatos();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setCargo("");
    setArea("");
    setCelular("");
    setCorreo("");
  }

  async function manejarRegistro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nombre.trim()) {
      alert("Debes ingresar el nombre del responsable.");
      return;
    }

    if (!cargo.trim()) {
      alert("Debes ingresar el cargo del responsable.");
      return;
    }

    if (!area.trim()) {
      alert("Debes seleccionar el área asignada.");
      return;
    }

    if (!celular.trim()) {
      alert("Debes ingresar el celular del responsable.");
      return;
    }

    const nuevoResponsable: Responsable = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      cargo: cargo.trim(),
      area: area.trim(),
      celular: celular.trim(),
      correo: correo.trim(),
      estado: "Activo",
      fechaRegistro: new Date().toISOString(),
    };

      try {
      await guardarResponsable(
        nuevoResponsable
      );

      const responsablesActualizados =
        await obtenerResponsables();

      setResponsables(
        responsablesActualizados
      );

      limpiarFormulario();

      alert(
        "Responsable guardado correctamente"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error al guardar responsable"
      );
    }
  }

    async function manejarCambioEstado(
    id: string,
    estado: "Activo" | "Inactivo"
  ) {
    try {
      await cambiarEstadoResponsable(
        id,
        estado
      );

      const responsablesActualizados =
        await obtenerResponsables();

      setResponsables(
        responsablesActualizados
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error al cambiar estado"
      );
    }
  }

    async function manejarEliminar(
    id: string
  ) {
    const confirmar = confirm(
      "¿Seguro que deseas eliminar este responsable?"
    );

    if (!confirmar) return;

    try {
      await eliminarResponsable(id);

      const responsablesActualizados =
        await obtenerResponsables();

      setResponsables(
        responsablesActualizados
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error al eliminar responsable"
      );
    }
  }

  const responsablesActivos = responsables.filter(
    (item) => item.estado === "Activo"
  ).length;

  const responsablesInactivos = responsables.filter(
    (item) => item.estado === "Inactivo"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
              Gestión SSOMA
            </p>

            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              Responsables
            </h1>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
              Registra responsables para asignarlos posteriormente a las
              observaciones SSOMA.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
          >
            Volver al dashboard
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total responsables</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-400">
              {responsables.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Activos</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">
              {responsablesActivos}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Inactivos</p>
            <h2 className="mt-2 text-3xl font-bold text-red-400">
              {responsablesInactivos}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={manejarRegistro}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <h2 className="text-xl font-bold">Registrar responsable</h2>

            <p className="mt-2 text-sm text-slate-400">
              Completa los datos del personal responsable del levantamiento de
              observaciones.
            </p>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Nombre completo
                </label>

                <input
                  value={nombre}
                  onChange={(evento) => setNombre(evento.target.value)}
                  placeholder="Ejemplo: Juan Pérez"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Cargo
                </label>

                <input
                  value={cargo}
                  onChange={(evento) => setCargo(evento.target.value)}
                  placeholder="Ejemplo: Supervisor SSOMA"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Área asignada
                </label>

                <select
                  value={area}
                  onChange={(evento) => setArea(evento.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
                >
                  <option value="">Seleccionar área</option>

                  {areas.map((item) => (
                    <option key={item.id} value={item.nombre}>
                      {item.nombre}
                    </option>
                  ))}
                </select>

                {areas.length === 0 && (
                  <p className="mt-2 text-xs text-yellow-400">
                    No hay áreas activas. Primero registra un área en el módulo
                    de áreas.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Celular
                </label>

                <input
                  value={celular}
                  onChange={(evento) => setCelular(evento.target.value)}
                  placeholder="Ejemplo: 987654321"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Correo
                </label>

                <input
                  type="email"
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  placeholder="Ejemplo: responsable@empresa.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="submit"
                  className="rounded-xl bg-yellow-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-yellow-300 md:flex-1"
                >
                  Guardar responsable
                </button>

                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-xl border border-slate-700 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 md:flex-1"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold">Lista de responsables</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Personal disponible para asignación en observaciones.
                </p>
              </div>
            </div>

            {responsables.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                <p className="font-semibold text-slate-300">
                  Todavía no hay responsables registrados.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Registra el primer responsable desde el formulario.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {responsables.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{item.nombre}</h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.estado === "Activo"
                                ? "bg-green-500 text-slate-950"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {item.estado}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-300">
                          {item.cargo}
                        </p>

                        <div className="mt-3 grid gap-2 text-sm text-slate-400 md:grid-cols-2">
                          <p>
                            <span className="text-slate-500">Área: </span>
                            {item.area}
                          </p>

                          <p>
                            <span className="text-slate-500">Celular: </span>
                            {item.celular}
                          </p>

                          <p className="md:col-span-2">
                            <span className="text-slate-500">Correo: </span>
                            {item.correo || "Sin correo registrado"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:min-w-36">
                        <button
                          type="button"
                          onClick={() => manejarCambioEstado(item.id, item.estado)}
                          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-800"
                        >
                          {item.estado === "Activo"
                            ? "Inactivar"
                            : "Activar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => manejarEliminar(item.id)}
                          className="rounded-xl border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}