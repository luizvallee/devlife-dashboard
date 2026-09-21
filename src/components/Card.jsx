export default function Card({
  titulo,
  artista,
  categoria,
  descricao,
  cor,
  favorito,
  onFavoritar,
  onExcluir,
}) {
  return (
    <article
      className="rounded-2xl p-6 border shadow-md"
      style={{
        backgroundColor: "#18181b",
        color: "white",
        borderTop: `5px solid ${cor}`,
      }}
    >
      <div>
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: cor }}
        >
          {categoria}
        </span>

        <h2 className="mt-4 text-2xl font-bold">
          {titulo}
        </h2>

        <p className="mt-1 font-semibold text-purple-300">
          {artista}
        </p>

        <p className="mt-3 leading-relaxed text-zinc-300">
          {descricao}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onFavoritar}
          aria-pressed={favorito}
          aria-label={
            favorito
              ? `Desfavoritar música: ${titulo}`
              : `Favoritar música: ${titulo}`
          }
          className="flex-1 rounded-lg px-3 py-2 font-bold transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          style={{
            backgroundColor: favorito ? "#facc15" : "#3f3f46",
            color: favorito ? "#18181b" : "white",
          }}
        >
          {favorito ? "★ Favoritado" : "☆ Favoritar"}
        </button>

        <button
          type="button"
          onClick={onExcluir}
          aria-label={`Excluir música: ${titulo}`}
          className="rounded-lg bg-red-700 px-4 py-2 font-bold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}