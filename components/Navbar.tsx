import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
            SSOMA
          </p>
          <h1 className="text-lg font-bold">Gestión Minera</h1>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Inicio
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/observaciones"
            className="rounded-lg px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Observaciones
          </Link>

          <Link
            href="/areas"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Áreas
          </Link>
          <Link
            href="/responsables"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Responsables
          </Link>

          <Link
            href="/observaciones/nueva"
            className="rounded-lg bg-yellow-400 px-3 py-2 font-semibold text-slate-950 transition hover:bg-yellow-300"
          >
            Nueva observación
          </Link>
        </div>
      </nav>
    </header>
  );
}