"use client";

import { subirImagen } from "@/lib/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Area } from "@/types/area";
import { Observacion } from "@/types/observacion";
import { obtenerAreas } from "@/lib/areasSupabase";
import { agregarObservacion } from "@/lib/observacionesStorage";
import { Responsable } from "@/types/responsable";
import { obtenerResponsables } from "@/lib/responsablesSupabase";
import {
      guardarObservacionSupabase,
     } from "@/lib/observacionesSupabase";

type Riesgo = "Bajo" | "Medio" | "Alto" | "Crítico";

export default function NuevaObservacionPage() {
  const router = useRouter();

  const [areas, setAreas] = useState<Area[]>([]);
  const [responsables, setResponsables] = useState<Responsable[]>([]);

  const [area, setArea] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [riesgo, setRiesgo] = useState<Riesgo>("Medio");
  const [responsable, setResponsable] = useState("");
  const [cargoResponsable, setCargoResponsable] = useState("");
  const [celularResponsable, setCelularResponsable] = useState("");
  const [fechaCompromiso, setFechaCompromiso] = useState("");
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [fotoInicial, setFotoInicial] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [capturandoGps, setCapturandoGps] = useState(false);

    useEffect(() => {
    async function cargarDatos() {

      const areasData = await obtenerAreas();

    console.log("AREAS:", areasData);

    setAreas(areasData);

    const responsablesData =
      await obtenerResponsables();

    console.log(
      "RESPONSABLES:",
      responsablesData
    );

    setResponsables(
      responsablesData
    );

    }

    cargarDatos();
  }, []);

  function limpiarFormulario() {
    setArea("");
    setUbicacion("");
    setDescripcion("");
    setRiesgo("Medio");
    setResponsable("");
    setCargoResponsable("");
    setCelularResponsable("");
    setFechaCompromiso("");
    setFotoInicial("");
    setLatitud("");
    setLongitud("");
  }
  function manejarSeleccionResponsable(idResponsable: string) {
    const responsableSeleccionado = responsables.find(
      (item) => item.id === idResponsable
    );

    if (!responsableSeleccionado) {
      setResponsable("");
      setCargoResponsable("");
      setCelularResponsable("");
      return;
    }

    setResponsable(responsableSeleccionado.nombre);
    setCargoResponsable(responsableSeleccionado.cargo);
    setCelularResponsable(responsableSeleccionado.celular);
  }
   

  function capturarUbicacion() {
    if (!navigator.geolocation) {
      alert("Tu navegador no permite capturar ubicación GPS.");
      return;
    }

    setCapturandoGps(true);

      navigator.geolocation.getCurrentPosition(
    (posicion) => {

      console.log(
        "LAT:",
        posicion.coords.latitude
      );

      console.log(
        "LON:",
        posicion.coords.longitude
      );

      console.log(
        "PRECISION:",
        posicion.coords.accuracy
      );

            alert(
        `Precisión GPS: ${posicion.coords.accuracy} metros`
      );

      setLatitud(
        posicion.coords.latitude.toString()
      );

      setLongitud(
        posicion.coords.longitude.toString()
      );

      setCapturandoGps(false);
    },
      () => {
        alert(
          "No se pudo capturar la ubicación. Revisa los permisos de ubicación del navegador."
        );
        setCapturandoGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

    function manejarFotoInicial(
    evento: React.ChangeEvent<HTMLInputElement>
  ) {
    const archivo =
      evento.target.files?.[0];

    if (!archivo) return;

    setArchivoFoto(archivo);

    const lector = new FileReader();

    if (!archivo.type.startsWith("image/")) {
    alert("Solo se permiten imágenes.");
    return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
    alert("La imagen supera los 5 MB.");
     return;
    }
    
    lector.onloadend = () => {
      setFotoInicial(
        lector.result as string
      );
    };

    lector.readAsDataURL(archivo);
  }

  async function manejarRegistro(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    console.log("INICIO REGISTRO");
    console.log("archivoFoto:", archivoFoto);

    if (!area.trim()) {
      alert("Debes seleccionar un área.");
      return;
    }

    if (!ubicacion.trim()) {
      alert("Debes ingresar la ubicación específica.");
      return;
    }

    if (!descripcion.trim()) {
      alert("Debes ingresar la descripción de la observación.");
      return;
    }

    if (!responsable.trim()) {
      alert("Debes seleccionar un responsable.");
      return;
    }

    if (!celularResponsable.trim()) {
      alert("El responsable seleccionado no tiene celular registrado.");
      return;
    }

    if (!fechaCompromiso) {
      alert("Debes seleccionar una fecha compromiso.");
      return;
    }

    let urlFotoInicial = "";

    if (archivoFoto) {
      try {
        urlFotoInicial = await subirImagen(
          archivoFoto,
          "iniciales"
        );
            console.log(
          "URL STORAGE:",
          urlFotoInicial
        );
      } catch (error) {
        console.error(error);

        alert(
          "Error al subir imagen"
        );

        return;
      }
    }

          console.log(
        "ARCHIVO FOTO:",
        archivoFoto
      );

    const nuevaObservacion: Observacion = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      area: area.trim(),
      ubicacion: ubicacion.trim(),
      tipo: "Observación SSOMA",
      descripcion: descripcion.trim(),
      riesgo,
      estado: "Pendiente",
      responsable: responsable.trim(),
      cargoResponsable,
      celularResponsable: celularResponsable.trim(),
      fechaCompromiso,
      fotoInicial: urlFotoInicial,
      fotoCierre: "",
      accionCierre: "",
      fechaCierre: "",
      latitud,
      longitud,

      enlaceGoogleMaps:
  latitud && longitud
    ? `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`
    : "",
    };

    try {
  console.log("ANTES DE GUARDAR");

    await guardarObservacionSupabase(nuevaObservacion);

    console.log("GUARDADO CORRECTAMENTE");

    alert("Guardado correctamente");

  } catch (error) {
    console.error("ERROR:", error);

    alert(
      JSON.stringify(error, null, 2)
    );

    return;
  }

    limpiarFormulario();

    router.push("/observaciones");
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
              Registro SSOMA
            </p>

            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              Nueva observación
            </h1>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
              Registra condiciones, actos inseguros, hallazgos o desviaciones
              detectadas en campo.
            </p>
          </div>

          <Link
            href="/observaciones"
            className="rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-slate-800"
          >
            Volver a observaciones
          </Link>
        </div>

        <form
          onSubmit={manejarRegistro}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Área
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
                  No hay áreas activas registradas. Primero registra un área en
                  el módulo de áreas.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Ubicación específica
              </label>

              <input
                value={ubicacion}
                onChange={(evento) => setUbicacion(evento.target.value)}
                placeholder="Ejemplo: Rampa principal, nivel 2, zona norte"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Descripción de la observación
              </label>

              <textarea
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)}
                placeholder="Describe claramente la condición, acto inseguro o desviación encontrada."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Nivel de riesgo
              </label>

              <select
                value={riesgo}
                onChange={(evento) => setRiesgo(evento.target.value as Riesgo)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              >
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Fecha compromiso
              </label>

              <input
                type="date"
                value={fechaCompromiso}
                onChange={(evento) => setFechaCompromiso(evento.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Responsable
              </label>

              <select
                value={
                  responsables.find((item) => item.nombre === responsable)?.id || ""
                }
                onChange={(evento) => manejarSeleccionResponsable(evento.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
              >
                <option value="">Seleccionar responsable</option>

                {responsables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} - {item.cargo}
                  </option>
                ))}
              </select>

              {responsables.length === 0 && (
                <p className="mt-2 text-xs text-yellow-400">
                  No hay responsables activos. Primero registra un responsable en el módulo
                  Responsables.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Celular del responsable
              </label>

              <input
                value={celularResponsable}
                readOnly
                placeholder="Se completará automáticamente"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-300 outline-none placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Foto de evidencia inicial
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={manejarFotoInicial}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
              />

              {fotoInicial && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-700">
                <img
                  src={fotoInicial}
                  alt="Vista previa de evidencia inicial"
                  className="h-56 w-full object-cover"
                />
              </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Ubicación GPS
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Captura las coordenadas del punto donde se detectó la
                      observación.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={capturarUbicacion}
                    className="rounded-xl border border-yellow-400 px-5 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-slate-950"
                  >
                    {capturandoGps ? "Capturando..." : "Capturar GPS"}
                  </button>
                </div>

                {(latitud || longitud) && (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                      <p className="text-xs text-slate-500">Latitud</p>
                      <p className="text-sm font-semibold text-white">
                        {latitud || "No registrada"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                      <p className="text-xs text-slate-500">Longitud</p>
                      <p className="text-sm font-semibold text-white">
                        {longitud || "No registrada"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-yellow-400 px-5 py-4 font-semibold text-slate-950 transition hover:bg-yellow-300 md:flex-1"
            >
              Guardar observación
            </button>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-xl border border-slate-700 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 md:flex-1"
            >
              Limpiar formulario
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}