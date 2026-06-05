"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Area } from "@/types/area";
import {
  obtenerAreas,
  guardarArea,
  eliminarArea,
  cambiarEstadoArea,
} from "@/lib/areasSupabase";

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
  async function cargarAreas() {
    const data = await obtenerAreas();
    setAreas(data || []);
  }

  cargarAreas();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setDescripcion("");
  }
   
    async function manejarRegistro(
    evento: FormEvent<HTMLFormElement>
  ) {
    console.log("BOTON REGISTRAR PRESIONADO");
    evento.preventDefault();

    const nombreLimpio = nombre.trim();
    const descripcionLimpia = descripcion.trim();

    if (!nombreLimpio) {
      alert("Debes ingresar el nombre del área.");
      return;
    }

    const existeArea = areas.some(
      (area) =>
        area.nombre.trim().toLowerCase() ===
        nombreLimpio.toLowerCase()
    );

    if (existeArea) {
      alert("Esta área ya existe.");
      return;
    }

    const nuevaArea = {
    nombre: nombreLimpio,
    descripcion: descripcionLimpia,
    estado: "Activa",
    fechaRegistro: new Date().toISOString(),
    };

    try {
      await guardarArea(nuevaArea);

      const areasActualizadas =
        await obtenerAreas();

      setAreas(areasActualizadas);

      limpiarFormulario();

      alert(
        "Área registrada correctamente"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Error al guardar área"
      );
    }
  }

    async function manejarCambioEstado(
    id: string,
    estado: "Activa" | "Inactiva"
  ) {
    const confirmar = confirm(
      "¿Deseas cambiar el estado de esta área?"
    );

    if (!confirmar) return;

    try {
      await cambiarEstadoArea(
        id,
        estado
      );

      const areasActualizadas =
        await obtenerAreas();

      setAreas(areasActualizadas);
    } catch (error) {
      console.error(error);

      alert(
        "Error al actualizar área"
      );
    }
  }

    async function manejarEliminar(
    id: string
  ) {
    const confirmar = confirm(
      "¿Seguro que deseas eliminar esta área?"
    );

    if (!confirmar) return;

    try {
      await eliminarArea(id);

      const areasActualizadas =
        await obtenerAreas();

      setAreas(areasActualizadas);
    } catch (error) {
      console.error(error);

      alert(
        "Error al eliminar área"
      );
    }
  }

  const areasActivas = areas.filter((area) => area.estado === "Activa").length;
  const areasInactivas = areas.filter(
    (area) => area.estado === "Inactiva"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
              Catálogo SSOMA
            </p>

            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              Registro de áreas
            </h1>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
              Administra las áreas que luego serán seleccionadas al registrar
              observaciones.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
          >
            Volver al dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          <CardResumen titulo="Total áreas" valor={areas.length} />
          <CardResumen
            titulo="Activas"
            valor={areasActivas}
            color="text-green-400"
          />
          <CardResumen
            titulo="Inactivas"
            valor={areasInactivas}
            color="text-red-400"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <form
            onSubmit={manejarRegistro}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6"
          >
            <h2 className="text-lg font-bold md:text-xl">Nueva área</h2>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Nombre del área
                </label>

                <input
                  value={nombre}
                  onChange={(evento) => setNombre(evento.target.value)}
                  placeholder="Ejemplo: Mina 4"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Descripción
                </label>

                <textarea
                  value={descripcion}
                  onChange={(evento) => setDescripcion(evento.target.value)}
                  placeholder="Ejemplo: Zona de operaciones mina lado norte"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-yellow-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-yellow-300"
              >
                Registrar área
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-bold md:text-xl">
                  Áreas registradas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Estas áreas se usarán luego en el formulario de observaciones.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {areas.length > 0 ? (
                areas.map((area) => (
                  <div
                    key={area.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white">
                            {area.nombre}
                          </h3>

                          <span
                            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                              area.estado === "Activa"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {area.estado}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {area.descripcion}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          Registrado:{" "}
                          {new Date(area.fechaRegistro).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                        <button
                          type="button"
                          onClick={() =>
                          manejarCambioEstado(
                            area.id,
                            area.estado
                          )
                        }
                          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          {area.estado === "Activa"
                            ? "Desactivar"
                            : "Activar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => manejarEliminar(area.id)}
                          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
                  Aún no hay áreas registradas. Registra la primera área para
                  iniciar el catálogo.
                </p>
              )}
            </div>
          </div>
        </div>
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