import Link from "next/link";

export default function InicioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-6 md:py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400 md:text-sm md:tracking-[0.3em]">
                Sistema de Gestión Minera
              </p>

              <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                Control SSOMA para operaciones mineras
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Registra observaciones de campo, adjunta evidencias, realiza
                seguimiento, controla vencimientos, cierra hallazgos y genera
                reportes PDF con respaldo fotográfico y ubicación GPS.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/observaciones/nueva"
                  className="rounded-xl bg-yellow-400 px-5 py-4 text-center font-bold text-slate-950 transition hover:bg-yellow-300"
                >
                  Nueva observación
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-700 px-5 py-4 text-center font-bold text-white transition hover:bg-slate-800"
                >
                  Ver dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 md:p-6">
              <p className="text-sm font-semibold text-slate-300">
                Módulo actual
              </p>

              <h2 className="mt-2 text-2xl font-bold text-yellow-400">
                Observaciones SSOMA
              </h2>

              <div className="mt-5 grid gap-3">
                <EstadoItem texto="Registro de observaciones con evidencia inicial" />
                <EstadoItem texto="Cierre de observaciones con foto final" />
                <EstadoItem texto="Dashboard con conteo automático" />
                <EstadoItem texto="Detección automática de vencidas" />
                <EstadoItem texto="Filtros por estado y nivel de riesgo" />
                <EstadoItem texto="Reporte PDF profesional" />
                <EstadoItem texto="Ubicación GPS para inspección en campo" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CardInicio
            titulo="Registrar"
            descripcion="Crea observaciones SSOMA con área, ubicación, riesgo, responsable, fecha compromiso, foto inicial y GPS."
            href="/observaciones/nueva"
            boton="Crear registro"
          />

          <CardInicio
            titulo="Controlar"
            descripcion="Consulta el dashboard con observaciones pendientes, en proceso, cerradas, vencidas y de alto riesgo."
            href="/dashboard"
            boton="Ir al dashboard"
          />

          <CardInicio
            titulo="Gestionar"
            descripcion="Filtra observaciones, revisa detalles, envía WhatsApp, genera PDF y cierra hallazgos con evidencia."
            href="/observaciones"
            boton="Ver observaciones"
          />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Flujo de trabajo</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400 md:text-base">
                Este sistema está pensado para trabajo de campo: registrar,
                evidenciar, hacer seguimiento, cerrar y reportar.
              </p>
            </div>

            <div className="grid gap-3">
              <Flujo numero="1" texto="Registrar observación" />
              <Flujo numero="2" texto="Adjuntar foto inicial y GPS" />
              <Flujo numero="3" texto="Asignar responsable y fecha compromiso" />
              <Flujo numero="4" texto="Hacer seguimiento por dashboard" />
              <Flujo numero="5" texto="Cerrar con acción ejecutada y foto final" />
              <Flujo numero="6" texto="Generar reporte PDF" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function EstadoItem({ texto }: { texto: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-green-400" />
      <p className="text-sm text-slate-300">{texto}</p>
    </div>
  );
}

function CardInicio({
  titulo,
  descripcion,
  href,
  boton,
}: {
  titulo: string;
  descripcion: string;
  href: string;
  boton: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-6">
      <h2 className="text-xl font-bold text-white">{titulo}</h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">{descripcion}</p>

      <Link
        href={href}
        className="mt-5 block rounded-xl bg-slate-800 px-5 py-3 text-center text-sm font-bold text-yellow-400 transition hover:bg-slate-700"
      >
        {boton}
      </Link>
    </div>
  );
}

function Flujo({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-slate-950">
        {numero}
      </span>

      <p className="text-sm font-semibold text-slate-300">{texto}</p>
    </div>
  );
}