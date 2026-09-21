export default function Header({ hora }) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-5 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">
          Vibe<span className="text-purple-400">List</span>
        </h1>

        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap gap-5">
            <li>
              <a
                href="#inicio"
                className="text-zinc-200 underline-offset-4 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Início
              </a>
            </li>

            <li>
              <a
                href="#adicionar"
                className="text-zinc-200 underline-offset-4 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Adicionar
              </a>
            </li>

            <li>
              <a
                href="#musicas"
                className="text-zinc-200 underline-offset-4 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Músicas
              </a>
            </li>
          </ul>
        </nav>

        <div
          className="rounded-lg bg-zinc-800 px-4 py-2 font-bold text-yellow-300"
          aria-label={`Horário atual: ${hora}`}
        >
          <span aria-hidden="true">🕒 {hora}</span>
        </div>
      </div>
    </header>
  );
}